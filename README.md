# Scribe

[![Scribe Preview](public/dashboard-preview.jpg)](https://your-live-demo-url.com)

**Scribe** is a modern, open-source SaaS platform that allows you to chat with your PDF documents. Upload your files and start asking questions right away. It's built with a full-stack Next.js architecture, leveraging the latest technologies to provide a seamless and interactive experience.

## Features

- **User Authentication**: Secure and easy-to-use authentication powered by Kinde.
- **File Uploads**: Smooth file uploading experience with Uploadthing, including drag-and-drop support.
- **PDF Viewing & Rendering**: High-fidelity PDF rendering directly in the browser.
- **Real-time Chat Interface**: Chat with your documents in real-time.
- **AI-Powered Insights**: Uses LangChain and OpenAI to understand and answer questions about your documents.
- **Vector Storage**: Leverages Pinecone to create and store vector embeddings for efficient document searching.
- **Database**: User and file data is stored in a robust PostgreSQL database managed with Prisma.
- **Modern UI**: Sleek and responsive user interface built with Tailwind CSS and Radix UI.

## Tech Stack

### Frameworks & Libraries
- **[Next.js](https://nextjs.org/)**: React framework for full-stack web applications.
- **[tRPC](https://trpc.io/)**: End-to-end typesafe APIs.
- **[React Query](https://tanstack.com/query/latest)**: Data fetching and state management.
- **[Prisma](https://www.prisma.io/)**: Next-generation ORM for Node.js and TypeScript.
- **[Kinde](https://kinde.com/)**: Authentication and user management.
- **[Uploadthing](https://uploadthing.com/)**: File uploads for the modern web.
- **[LangChain](https://js.langchain.com/)**: Framework for developing applications powered by language models.
- **[Pinecone](https://www.pinecone.io/)**: Vector database for similarity search.
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation.

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework.
- **[Radix UI](https://www.radix-ui.com/)**: Unstyled, accessible UI components.
- **[Lucide React](https://lucide.dev/)**: Beautiful and consistent icons.

## Getting Started

Follow these instructions to get a local copy of Scribe up and running.

### Prerequisites

- Node.js (v20 or higher recommended)
- npm, pnpm, yarn, or bun
- A PostgreSQL database
- A Pinecone account for vector storage
- An OpenAI API key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/scribe.git
    cd scribe
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    pnpm install
    # or
    yarn install
    # or
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of your project and add the following variables. You will need to get credentials from Kinde, Uploadthing, Pinecone, and OpenAI.

    ```env
    # Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Kinde Auth
    KINDE_CLIENT_ID="..."
    KINDE_CLIENT_SECRET="..."
    KINDE_ISSUER_URL="..."
    KINDE_SITE_URL="http://localhost:3000"
    KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
    KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/auth-callback"

    # Uploadthing
    UPLOADTHING_SECRET="..."
    UPLOADTHING_APP_ID="..."

    # OpenAI
    OPENAI_API_KEY="..."

    # Pinecone
    PINECONE_API_KEY="..."
    PINECONE_ENVIRONMENT="..."
    ```

4.  **Push the database schema:**

    This command will sync your Prisma schema with your PostgreSQL database.
    ```sh
    npx prisma db push
    ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

08:22:55