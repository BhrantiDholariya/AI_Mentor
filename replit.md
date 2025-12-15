# AI Mentor

## Overview

AI Mentor is a single-page web application that provides an intelligent learning companion through a conversational chat interface. Users can ask questions and receive AI-generated responses that appear as if coming directly from the AI Mentor. The application features a minimalist, modern design inspired by ChatGPT, Linear, and Notion, with smooth animations and micro-interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for Replit environment
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and API caching
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Typography**: Inter (primary), JetBrains Mono (code), loaded via Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: REST API with JSON request/response
- **Build Process**: Custom esbuild script that bundles server dependencies for faster cold starts
- **Development**: Vite dev server with HMR proxied through Express

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas with drizzle-zod integration
- **Current Storage**: In-memory storage implementation (MemStorage class) with interface ready for database migration

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route components (home, chat, not-found)
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and query client
├── server/           # Backend Express application
│   ├── routes.ts     # API endpoint definitions
│   ├── storage.ts    # Data access layer
│   └── vite.ts       # Vite dev server integration
├── shared/           # Shared types and schemas
└── script/           # Build scripts
```

### Key Design Decisions
1. **Monorepo structure**: Client and server share types through `shared/` directory, ensuring type safety across the stack
2. **Path aliases**: `@/` maps to client/src, `@shared/` maps to shared directory for clean imports
3. **Component architecture**: shadcn/ui provides unstyled, accessible components that are customized via Tailwind
4. **Dark theme by default**: The chat interface uses a dark color scheme (#0a0a0f background) for the modern aesthetic

## External Dependencies

### AI/Chat API
- **Lyzr AI Agent API**: External inference endpoint for generating AI responses
  - Endpoint: `https://agent-prod.studio.lyzr.ai/v3/inference/chat/`
  - Authentication: API key via `x-api-key` header
  - Environment variables required:
    - `LYZR_API_KEY`: API authentication key
    - `LYZR_USER_ID`: User identifier for the agent
    - `LYZR_AGENT_ID`: Agent identifier
    - `LYZR_SESSION_ID`: Session identifier for conversation context

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- Database migrations stored in `/migrations` directory
- Push schema changes with `npm run db:push`

### Third-Party Services
- **Google Fonts CDN**: Inter, DM Sans, Fira Code, Geist Mono font families
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for development environment