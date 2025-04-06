# Kanban Board

A Trello-like Kanban board application with drag and drop functionality built using Next.js and PostgreSQL.

## Features

- User authentication with GitHub
- Create, view, and manage multiple boards
- Drag and drop columns and tasks
- Create, edit, and delete tasks
- Responsive design with light and dark mode
- Docker support for easy deployment

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, DaisyUI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Drag & Drop**: @hello-pangea/dnd
- **State Management**: Zustand
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL or Docker

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kanban?schema=public"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

To get GitHub OAuth credentials:

1. Go to GitHub Developer Settings > OAuth Apps > New OAuth App
2. Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run database migrations:
   ```
   npx prisma migrate dev
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Deployment

1. Make sure Docker and Docker Compose are installed
2. Create a `.env` file with the required environment variables
3. Build and start the containers:
   ```
   docker-compose up -d
   ```
4. The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
kanban-board/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── boards/           # Board pages
│   ├── components/       # React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── types/                # TypeScript type definitions
├── .env                  # Environment variables
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration
└── package.json          # Project dependencies
```

## License

MIT
