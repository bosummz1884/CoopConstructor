# Project Homestead

A comprehensive homestead management platform that helps you track and manage your backyard farm, starting with chicken coops and expanding to other livestock.

## Features

- **Coop Blueprint Generator**: Design and save custom chicken coop blueprints
- **Flock Management**: Track your chickens and other livestock
- **Egg Production Tracking**: Log and analyze egg production data
- **Feed & Health Tracking**: Monitor feed consumption and animal health
- **Subscription Tiers**: Free and premium features for all levels of homesteaders

## Tech Stack

- **Frontend**: React with TypeScript, Vite
- **UI Components**: shadcn/ui
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: Stripe Integration
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd CoopConstructor
   ```

2. Install dependencies:
   ```bash
   pnpm install
   cd client && pnpm install
   cd ../server && pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `client` and `server` directories
   - Update the values according to your local setup

4. Set up the database:
   ```bash
   # Run database migrations
   cd server
   pnpm db:migrate
   ```

5. Start the development servers:
   ```bash
   # In one terminal (server)
   cd server
   pnpm dev

   # In another terminal (client)
   cd client
   pnpm dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-based modules
│   │   ├── pages/        # Page components
│   │   └── ...
│
├── server/               # Backend Express application
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── ...
│
└── shared/              # Shared code between frontend and backend
    ├── schema.ts       # Database schema
    └── types.ts        # Shared TypeScript types
```

## Development

### Available Scripts

#### Client
- `dev`: Start development server
- `build`: Build for production
- `lint`: Run ESLint
- `preview`: Preview production build

#### Server
- `dev`: Start development server with hot reload
- `build`: Build for production
- `start`: Start production server
- `db:migrate`: Run database migrations

## Deployment

### Production Build

1. Build the client and server:
   ```bash
   # Build client
   cd client
   pnpm build

   # Build server
   cd ../server
   pnpm build
   ```

2. Start the production server:
   ```bash
   cd server
   pnpm start
   ```

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
