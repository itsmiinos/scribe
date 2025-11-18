# Scribe: Detailed Project Flow

This document provides a detailed breakdown of the Scribe application, including its architecture, user flow, and data processing pipeline.

## 1. Core Concept

Scribe is a Software-as-a-Service (SaaS) application that enables users to upload PDF documents and interact with them through a chat interface. The core functionality is to provide AI-powered answers to questions based on the content of the uploaded documents.

## 2. User Journey Flow

The following steps outline the typical journey a user takes when interacting with Scribe.

1.  **Authentication**:
    - The user visits the landing page and chooses to sign up or log in.
    - Authentication is handled by **Kinde**, which provides secure and simple social login and passwordless authentication.
    - Upon successful authentication, Kinde redirects the user back to the application, specifically to the `/auth-callback` route.

2.  **Auth Callback & Database Sync**:
    - The `/auth-callback` page handles the post-login logic.
    - It makes a request to the backend (a tRPC procedure) to check if the authenticated user exists in the PostgreSQL database.
    - If the user does not exist, a new `User` record is created using their Kinde ID and email.
    - Once the database is synced, the user is redirected to the main application dashboard at `/dashboard`.

3.  **Dashboard**:
    - The dashboard is the central hub where users see a list of their previously uploaded PDF files.
    - This list is fetched from the database using a tRPC query that retrieves all `File` records associated with the current user's ID.

4.  **File Upload**:
    - The user clicks the "Upload" button, which opens a dialog.
    - This is handled by the `UploadButton` component, which uses **Uploadthing** for file handling.
    - The user can drag-and-drop a PDF file or select one from their local machine.
    - Uploadthing's client-side library handles the file upload process, showing a progress bar.

5.  **File Processing & Indexing (The AI Magic)**:
    - Once the upload to Uploadthing's storage is complete, a callback is triggered on the backend (`/api/uploadthing/core.ts`).
    - This is the start of the processing pipeline:
        a.  **Create File Record**: A new `File` record is created in the PostgreSQL database, linking the file's name, URL (from Uploadthing), and the user who uploaded it.
        b.  **Download & Parse PDF**: The backend fetches the newly uploaded PDF from its URL. The `pdf-parse` library reads the PDF and extracts its text content.
        c.  **Split Text**: The extracted text is split into smaller, manageable chunks. This is crucial for providing focused context to the language model.
        d.  **Vectorization**: Each text chunk is converted into a numerical representation (a vector embedding) using **OpenAI's embedding models**.
        e.  **Indexing**: These vector embeddings are then stored in a **Pinecone** index. Pinecone is a specialized vector database that allows for extremely fast similarity searches. The file's ID is stored as metadata alongside the vectors.

6.  **Chatting with a Document**:
    - From the dashboard, the user clicks on a file, navigating them to `/dashboard/[fileid]`.
    - This page has two main components:
        - `PdfRenderer.tsx`: Displays the PDF document for easy reference.
        - `ChatWrapper.tsx`: The chat interface for interacting with the document.
    - The user types a question into the chat input and hits send.

7.  **Generating a Response**:
    - The frontend sends the user's message to the backend via the `/api/message` route.
    - The backend logic, orchestrated by **LangChain**, executes the following steps:
        a.  **Vectorize Query**: The user's question is converted into a vector embedding using the same OpenAI model.
        b.  **Similarity Search**: The backend queries the Pinecone index with this new vector to find the most similar text chunks from the original PDF. These chunks are the most relevant context for answering the question.
        c.  **LLM Prompting**: The retrieved text chunks are formatted into a prompt, along with the user's original question. This prompt is sent to an **OpenAI language model** (e.g., GPT). The prompt essentially asks the model: "Based on the following context, answer this question."
        d.  **Stream Response**: The language model generates an answer. To provide a real-time "typing" effect, the response is streamed back to the client token by token.
    - The `Messages.tsx` component on the frontend receives this stream and renders the AI's response incrementally.
    - The user's message and the AI's response are saved as `Message` records in the database, linked to the file ID.

## 3. Technical Architecture & Data Flow

This section details the flow of data between the different parts of the system.

### Frontend (Client-Side)

-   **Framework**: Next.js (App Router)
-   **UI Components**: Built with React, styled with Tailwind CSS. Interactive elements like dialogs and dropdowns use Radix UI primitives.
-   **State Management**: TanStack Query (React Query) is used for server state management, caching data from the backend, and handling loading/error states.
-   **API Communication**: The frontend communicates with the backend primarily through **tRPC**. This provides end-to-end type safety, meaning the client knows the exact shape of the API's requests and responses.
    - The tRPC client is defined in `src/app/_trpc/client.ts`.
    - For streaming responses (like the chat), a standard `fetch` call is made to a Next.js API Route (`/api/message`).

### Backend (Server-Side)

-   **API Layer**:
    - **tRPC**: Most of the API is built with tRPC (`src/trpc/index.ts`). This includes procedures for fetching user files, getting file details, deleting files, and retrieving message history.
    - **Next.js API Routes**: Used for webhook-style callbacks and streaming.
        - `/api/auth/[kindeAuth]`: Managed by the Kinde SDK.
        - `/api/uploadthing`: Managed by the Uploadthing SDK.
        - `/api/message`: Custom route for handling the chat message stream with LangChain.
-   **Database ORM**: **Prisma** (`src/db/index.ts`, `prisma/schema.prisma`) is used to interact with the PostgreSQL database. It provides a type-safe query builder.
-   **AI & Data Processing**:
    - **LangChain**: The primary framework for building the AI logic. It chains together the different steps of the response generation process (fetching context, prompting, calling the LLM).
    - **OpenAI**: Provides the models for both text generation (chat responses) and creating vector embeddings.
    - **Pinecone**: The vector database used to store and query document embeddings.
    - **`pdf-parse`**: A library used to extract raw text from PDF files during the indexing process.

### Database & External Services

-   **PostgreSQL**: The primary relational database for storing user data, file metadata, and chat message history.
-   **Kinde**: Handles all user authentication and management.
-   **Uploadthing**: Manages raw file storage and provides the upload infrastructure.
-   **Pinecone**: Stores and indexes the vector representations of the document content.
-   **OpenAI**: Provides the core AI models for understanding and generation.
