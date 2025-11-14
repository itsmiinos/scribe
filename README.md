# Scribe

Scribe is a modern, full-stack SaaS (Software as a Service) application built with Next.js. It provides a foundation for building applications that involve file uploads, user authentication, and database interactions.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **API**: tRPC
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Kinde
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React

## Project Structure

The project is organized into the following directories:

- `src/app`: Contains all the application routes, following the Next.js App Router convention.
- `src/components`: Houses reusable React components used throughout the application, such as `Dashboard.tsx` and `UploadButton.tsx`.
- `src/db`: Includes the Prisma schema definition and the database client instance.
- `src/lib`: For utility functions and helper scripts.
- `src/trpc`: Defines the tRPC router, procedures, and context. This is where the API endpoints are created.
- `src/app/_trpc`: Contains the tRPC client setup for client-side data fetching.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the necessary environment variables, such as your `DATABASE_URL` and Kinde authentication credentials.

3.  **Run database migrations:**

    Apply the database schema to your PostgreSQL database using Prisma.

    ```bash
    npx prisma db push
    ```

4.  **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

07:11:46
