import { z } from "zod";

export const SendMessaggeValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
