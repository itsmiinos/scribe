import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import { createContext, ReactNode, useRef, useState } from "react";
import { toast } from "sonner";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useContext();

  const backupMessage = useRef("");
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.getFileMessage.cancel();
      const previousMessages = utils.getFileMessage.getInfiniteData();

      utils.getFileMessage.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] };
          }
          let newPages = [...old.pages];
          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );
      setIsLoading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast.error("Something went wrong!");
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let done = false;

      let accResponse = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;
        utils.getFileMessage.setInfiniteData(
          {
            fileId,
            limit: INFINITE_QUERY_LIMIT,
          },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            const isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((msg) => msg.id === "ai-response")
            );

            const updatedPages = old.pages.map((page, i) => {
              if (i === 0) {
                // We are on the first page
                if (!isAiResponseCreated) {
                  // Create new AI message
                  return {
                    ...page,
                    messages: [
                      {
                        createdAt: new Date().toISOString(),
                        id: "ai-response",
                        text: accResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ],
                  };
                } else {
                  // Update existing AI message
                  return {
                    ...page,
                    messages: page.messages.map((msg) => {
                      if (msg.id === "ai-response") {
                        return { ...msg, text: accResponse };
                      }
                      return msg;
                    }),
                  };
                }
              }

              return page;
            });
            return { ...old, pages: updatedPages };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      if (context?.previousMessages) {
        utils.getFileMessage.setInfiniteData(
          { fileId },
          context.previousMessages
        );
      }
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessage.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
