# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Linting**: `npm run lint`
- **Code formatting**: `npm run format` (write) or `npm run format:check` (check only)

## Architecture Overview

This is a Next.js 15 car fleet management system with the following key characteristics:

### Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS with custom CSS modules
- **State Management**: Zustand for global state
- **UI Components**: Combination of shadcn/ui components and custom components
- **Maps**: Kakao Maps integration for vehicle tracking
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm

### Project Structure

- **`src/app/`**: Next.js App Router pages (main dashboard, detail, emulator, history, login, search)
- **`src/components/`**: Reusable components organized by feature
  - `map/`: Kakao Maps integration components
  - `search-box/`: Search and filtering components
  - `status-box/`: Vehicle status display components
  - `ui/`: shadcn/ui base components
- **`src/store/`**: Zustand state management
- **`src/hooks/`**: Custom React hooks
- **`src/types/`**: TypeScript type definitions

### Key Features

- Vehicle fleet management dashboard with status filtering
- Kakao Maps integration with clustering for vehicle locations
- Real-time vehicle status tracking (운행중/대기중/수리중)
- Initial vehicle status data loading on main page mount/refresh
- Search and filtering capabilities
- User authentication system

### Code Conventions

- **Files/Folders**: kebab-case (e.g., `user-profile.tsx`)
- **Components/Classes/Types**: PascalCase (e.g., `UserProfile`, `IUserData`)
- **Props/Variables/Functions**: camelCase (e.g., `userSettings`, `fetchData`)
- **Custom Hooks**: use + camelCase (e.g., `useAuthState`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### State Management

The app uses Zustand for state management with stores in `src/store/`:

- `detail-store.ts`: Vehicle detail information management
- Vehicle status types: '운행중' | '대기중' | '수리중'
- Current vehicle status data is loaded when users first navigate to the main page or refresh

### Map Integration

Kakao Maps is used for vehicle location tracking:

- `KakaoMapScript`: Loads Kakao Maps SDK
- `CarClustererMap`: Displays vehicle locations with clustering
- `Map`: Base map component

### Styling

- Tailwind CSS with custom CSS variables for theming
- CSS modules for component-specific styles
- shadcn/ui design system integration
- Responsive design with mobile considerations (`use-mobile.ts` hook)

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Target: ES2017 with modern module resolution
