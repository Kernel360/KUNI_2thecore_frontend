# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Linting**: `npm run lint`
- **Code formatting**: `npm run format` (write) or `npm run format:check` (check only)

## Project Summary

KUNI 2thecore Frontend is a comprehensive vehicle fleet management system built with Next.js 15. The application provides real-time monitoring, tracking, and management of a vehicle fleet with Korean language support. It features a dashboard-style interface for fleet operators to monitor vehicle status, locations, and manage vehicle information.

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
- **`src/app/`**: Next.js App Router pages
  - `/` (main): Dashboard with map, status overview, and menu
  - `/detail`: Vehicle detail view with editable information and location map
  - `/emulator`: Device management for vehicle tracking emulators
  - `/history`: History page (placeholder implementation)
  - `/login`: User authentication with Korean UI
  - `/search`: Vehicle search and filtering interface
- **`src/components/`**: Feature-organized reusable components
  - `map/`: Kakao Maps integration (clustering, location tracking, script loading)
  - `search-box/`: Vehicle search, filtering, and list display
  - `status-box/`: Status counters and filtering controls
  - `menu-box/`: Navigation menu component
  - `user-box/`: User information display
  - `icon-button/`: Custom icon button components
  - `ui/`: shadcn/ui base components (forms, cards, buttons, tables)
- **`src/store/`**: Zustand state management for vehicle details and edit modes
- **`src/hooks/`**: Custom React hooks (mobile detection)
- **`src/types/`**: TypeScript type definitions (Kakao Maps API)

### Key Features
- **Main Dashboard**: Grid-based layout with status overview, menu navigation, and clustered map view
- **Vehicle Status Management**: Real-time tracking with three states (운행중/대기중/수리중) and filtering
- **Kakao Maps Integration**: Interactive map with vehicle clustering, custom markers by status
- **Vehicle Search & Management**: Search by car number, brand filtering, vehicle list with dummy data
- **Vehicle Detail Management**: Editable vehicle information with form validation and location mapping
- **Emulator Management**: Device ID management for vehicle tracking emulators with ON/OFF status
- **User Authentication**: Login system with Korean language support
- **Initial Data Loading**: Vehicle status loaded on main page mount/refresh
- **Responsive Design**: Mobile-friendly with custom CSS modules and Tailwind styling

### Code Conventions
- **Files/Folders**: kebab-case (e.g., `user-profile.tsx`)
- **Components/Classes/Types**: PascalCase (e.g., `UserProfile`, `IUserData`)
- **Props/Variables/Functions**: camelCase (e.g., `userSettings`, `fetchData`)
- **Custom Hooks**: use + camelCase (e.g., `useAuthState`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### State Management
The app uses Zustand for state management with stores in `src/store/`:
- `detail-store.ts`: Vehicle detail information (carNumber, brand, model, status)
- `detail-change.ts`: Edit mode state for vehicle detail page
- Vehicle status types: '운행중' | '대기중' | '수리중' (Korean status labels)
- Current vehicle status data is loaded when users first navigate to the main page or refresh
- Dummy data is used throughout for development (dummyCars arrays in components)

### Map Integration
Kakao Maps is used for vehicle location tracking:
- `KakaoMapScript`: Loads Kakao Maps SDK dynamically
- `CarClustererMap`: Main dashboard map with vehicle clustering, status-based filtering
- `CarLocationMap`: Individual vehicle location display for detail page
- `Map`: Base map component with center point (36.5, 127.8) covering South Korea
- Custom markers: Green (운행중), Red (수리중), Yellow (대기중)
- Marker clustering with minimum level 10 for performance

### Styling
- Tailwind CSS with custom CSS variables for theming
- CSS modules for component-specific styles
- shadcn/ui design system integration
- Responsive design with mobile considerations (`use-mobile.ts` hook)

### Data Patterns
- **Dummy Data Usage**: All components use hardcoded dummy data for development
- **Vehicle Object**: `{ carNumber, brand, model, status, gpsLatitude?, gpsLongitude? }`
- **Emulator Object**: `{ deviceId, carNumber, emulatorStatus: 'ON'|'OFF' }`
- **Status Filtering**: Components support 'null' (all) or specific status filtering
- **Korean License Plates**: Format follows Korean standards (12가 1234)

### Current Limitations
- No real API integration (uses dummy data)
- History page not implemented
- No real authentication (placeholder login)
- Limited error handling and validation

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Target: ES2017 with modern module resolution
- Custom type definitions for Kakao Maps API