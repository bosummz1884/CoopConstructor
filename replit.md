# Chicken Coop Blueprint Generator

## Overview

A full-stack TypeScript web application that generates custom chicken coop blueprints from natural language descriptions. The system takes user input describing their chicken coop needs and produces detailed blueprints with 3D visualizations, materials lists, step-by-step build instructions, and downloadable PDF documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
- **client/**: React frontend with Vite build system
- **server/**: Express.js backend API
- **shared/**: Common TypeScript types and schemas

### Frontend Architecture
- **Framework**: React 18 with TypeScript in strict mode
- **Build Tool**: Vite with custom configuration for development and production
- **UI Components**: shadcn/ui component system built on Radix UI primitives
- **Styling**: TailwindCSS with custom design tokens and CSS variables
- **3D Visualization**: React Three Fiber (Three.js wrapper) for interactive coop models
- **State Management**: React Context API with custom CoopContext for application state
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Input Processing**: Custom natural language parser that extracts coop specifications from user descriptions
- **Blueprint Generation**: Service-layer architecture with separate modules for materials calculation, instruction generation, and PDF creation
- **PDF Generation**: pdf-lib for creating downloadable blueprint documents
- **Storage**: In-memory storage implementation with interface for easy database migration
- **API Design**: RESTful endpoints with structured error handling and response formatting

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: User management schema with plans for coop storage
- **Migration Strategy**: Drizzle Kit for schema migrations and database management

### Authentication & Authorization
- Currently implements basic user schema structure
- Session management prepared with connect-pg-simple for PostgreSQL sessions
- Ready for authentication implementation

### 3D Rendering System
- **Engine**: Three.js via React Three Fiber
- **Models**: Procedurally generated coop models based on configuration parameters
- **Interactions**: Orbit controls for 3D navigation, hover states, and model animations
- **Responsive**: Adapts to different screen sizes and device capabilities

### PDF Generation Pipeline
- **Library**: pdf-lib for programmatic PDF creation
- **Content**: Materials list, cut lists, step-by-step instructions, and technical specifications
- **Distribution**: Base64 encoding for client-side download

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL with Neon serverless driver (@neondatabase/serverless)
- **Session Store**: PostgreSQL session storage (connect-pg-simple)
- **Environment**: Designed for deployment on cloud platforms

### UI/UX Libraries
- **Component System**: Radix UI primitives for accessibility-compliant components
- **Icons**: Lucide React icon library
- **Styling**: TailwindCSS with PostCSS processing
- **Fonts**: Google Fonts integration (Architects Daughter, DM Sans, Fira Code, Geist Mono)

### 3D Graphics
- **Three.js**: Core 3D rendering engine
- **React Three Fiber**: React wrapper for Three.js
- **React Three Drei**: Additional Three.js utilities and helpers

### Development Tools
- **Build System**: Vite with React plugin and Replit-specific enhancements
- **Code Quality**: ESLint configuration ready for implementation
- **Development**: Runtime error overlay and development banner integration
- **Type Checking**: Strict TypeScript configuration across all packages

### Production Services
- **Deployment**: Configured for Render.com with render.yaml setup
- **Asset Handling**: Static file serving and build optimization
- **Environment Variables**: DATABASE_URL configuration for PostgreSQL connection

### API & Data Processing
- **Validation**: Zod schemas for type-safe data validation
- **HTTP Client**: Fetch-based API client with credential handling
- **Error Handling**: Structured error responses and client-side error boundaries
- **Date Processing**: date-fns library for date manipulation and formatting