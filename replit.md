# CodeMirror Editor Application

## Overview

This is a full-stack web application that provides a code editor interface similar to VS Code, built with React, Express, and CodeMirror. The application features a file explorer, tabbed editing interface, syntax highlighting for multiple programming languages, and Emacs-style key bindings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for development and build tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Editor**: CodeMirror 6 with language support and Emacs key bindings

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Development**: Hot module replacement via Vite integration
- **Build**: ESBuild for server bundling

### Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM
- **Connection**: Neon Database serverless adapter
- **Schema**: Files and editor settings tables
- **Fallback**: In-memory storage implementation for development

## Key Components

### Core Application Components
1. **Editor Interface** (`client/src/pages/editor.tsx`)
   - Main editor view with file explorer, tab bar, and status bar
   - Handles file operations and editor state management

2. **CodeMirror Integration** (`client/src/components/code-editor.tsx`)
   - Wraps CodeMirror 6 with React lifecycle management
   - Supports multiple programming languages and themes
   - Emacs-style key bindings enabled by default

3. **File Management**
   - File explorer with hierarchical file display
   - Tab-based file editing with close functionality
   - Support for creating, reading, updating files

4. **UI Components**
   - Consistent design system using shadcn/ui
   - Modal dialogs for settings and error handling
   - Responsive layout with sidebar toggle

### Backend Components
1. **Storage Layer** (`server/storage.ts`)
   - Abstract storage interface with memory-based implementation
   - File CRUD operations with content management
   - Editor settings persistence

2. **API Routes** (`server/routes.ts`)
   - RESTful endpoints for file operations
   - Settings management endpoints
   - Error handling with appropriate HTTP status codes

3. **Development Server** (`server/vite.ts`)
   - Vite integration for hot reloading
   - Static file serving for production builds

## Data Flow

### File Operations
1. User selects file from explorer
2. Frontend fetches file content via API
3. CodeMirror editor displays content with syntax highlighting
4. Changes are tracked locally and saved via API calls
5. Server updates storage and returns confirmation

### Editor Settings
1. Settings modal allows theme, font size, and feature toggles
2. Changes are immediately applied to editor instance
3. Settings are persisted to database/storage
4. Application state is synchronized across components

### Real-time Updates
- File content changes trigger editor updates
- Cursor position and modification status tracked
- Language detection based on file extensions
- Theme changes applied dynamically via CSS custom properties

## External Dependencies

### Frontend Dependencies
- **CodeMirror 6**: Advanced code editor with language support
- **Radix UI**: Unstyled, accessible UI primitives
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Minimalist routing library

### Backend Dependencies
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL
- **Vite**: Build tool and development server
- **Zod**: Runtime type validation

### Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing with Autoprefixer

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- tsx for TypeScript execution in development
- Environment-based configuration via DATABASE_URL

### Production Build
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` script
4. **Startup**: Node.js serves bundled application

### Configuration
- Environment variables for database connection
- Conditional development tooling (Replit plugins)
- Path aliases for clean imports
- TypeScript configuration shared across client/server

### Database Setup
- PostgreSQL schema defined in `shared/schema.ts`
- Drizzle handles migrations and type generation
- Fallback to in-memory storage for development
- Connection pooling via Neon serverless adapter