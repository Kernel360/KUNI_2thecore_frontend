# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Linting**: `npm run lint`
- **Code formatting**: `npm run format` (write) or `npm run format:check` (check only)

## Project Summary

KUNI 2thecore Frontend is a Korean vehicle fleet management system called "2 the Core" built with Next.js 15. The application provides comprehensive vehicle monitoring, tracking, and management capabilities with a Korean-first UI. It features a dashboard-centric interface for fleet operators to monitor real-time vehicle status, manage vehicle information, and control GPS tracking emulators.

## Architecture Overview

This is a Next.js 15 car fleet management system with the following key characteristics:

### Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS with custom CSS modules
- **State Management**: Zustand for global state and props
- **UI Components**: Combination of shadcn/ui components and custom components
- **Maps**: Kakao Maps integration for vehicle tracking
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm

### Project Structure

- **`src/app/`**: Next.js App Router pages with Korean layout (lang="ko")
  - `/` (main): Central dashboard with vehicle status overview, interactive map with clustering, and navigation menu
  - `/detail`: Comprehensive vehicle detail view with editable information forms and individual location mapping
  - `/emulator`: GPS tracking emulator management with device registration, search, and ON/OFF control
  - `/history`: Vehicle management and maintenance history (placeholder)
  - `/login`: User authentication system with Korean language interface
  - `/search`: Advanced vehicle search with filtering by car number, brand, and status
- **`src/components/`**: Feature-organized reusable components
  - `map/`: Kakao Maps integration with clustering (`car-clusterer-map`), individual location tracking (`car-location-map`), and script loading
  - `search-box/`: Complete vehicle search system with number search, brand filtering, dropdown selection, and paginated list display
  - `status-box/`: Real-time status counters (전체/운행중/대기중/수리중) with clickable filtering
  - `menu-box/`: Main navigation menu with emoji icons (🗺️ 지도, 🚗 차량 검색, 📊 주행 기록, ⚒️ 차량 관리)
  - `user-box/`: User information and authentication display
  - `icon-button/`: Custom icon button components with delete functionality
  - `ui/`: shadcn/ui base components (forms, cards, buttons, tables, alerts, inputs, labels)
- **`src/store/`**: Zustand state management for vehicle details and edit modes
- **`src/hooks/`**: Custom React hooks (mobile detection)
- **`src/types/`**: TypeScript type definitions (Kakao Maps API)

### Key Features

- **Central Dashboard**: Grid-based layout (250px sidebar + flexible content) with TopBar title "차량 관제 시스템"
- **Real-time Status Overview**: Interactive status boxes showing 전체 차량(100), 운행 중(57), 대기 중(13), 수리 중(50) with click-to-filter functionality
- **Kakao Maps Integration**: 
  - Main dashboard: Clustered vehicle locations with status-based markers (Green=운행중, Red=수리중, Yellow=대기중)
  - Detail page: Individual vehicle location mapping
  - Center point covers South Korea (36.5, 127.8) with clustering at minimum level 10
- **Advanced Vehicle Search**: 
  - Car number search with Korean license plate format (12가 1234)
  - Brand filtering (현대, 기아, 삼성, etc.)
  - Status-based filtering with visual status indicators
  - Floating + button for adding new vehicles
- **Vehicle Detail Management**: 
  - Editable forms for car number, brand/model, status, year, and mileage
  - Toggle between view and edit modes with confirmation/cancel buttons
  - Side-by-side layout with vehicle info (800px) and location map (400px)
- **GPS Emulator Control**: 
  - Device ID management with UUID format (68fd0215-6a96-11f0-aaf3-0a8c035f5c3b)
  - Search and register new emulators by car number
  - ON/OFF status control with table-based interface
  - Delete functionality with confirmation alerts
- **Korean-First UI**: All interface text, status labels, and user interactions in Korean

### Code Conventions

- **Files/Folders**: kebab-case (e.g., `user-profile.tsx`)
- **Components/Classes/Types**: PascalCase (e.g., `UserProfile`, `IUserData`)
- **Props/Variables/Functions**: camelCase (e.g., `userSettings`, `fetchData`)
- **Custom Hooks**: use + camelCase (e.g., `useAuthState`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### State Management

The app uses Zustand for state management with stores in `src/store/`:

- `detail-store.ts`: Vehicle detail information with interface `Detail` containing carNumber, brand, model, status
- `detail-change.ts`: Boolean edit mode state (`detailChange`) for vehicle detail page toggle functionality
- Vehicle status types: '운행중' | '대기중' | '수리중' (Korean status labels) with 'null' for all vehicles filter
- Status filter state managed in main dashboard component with type `'null' | '운행중' | '수리중' | '대기중'`
- Dummy data arrays used throughout for development (`dummyCars`, `dummyEmuls`)

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

- **Dummy Data Usage**: All components use hardcoded arrays (`dummyCars`, `dummyEmuls`) for development
- **Vehicle Object**: `{ carNumber: string, brand: string, model: string, status: '운행중'|'대기중'|'수리중', gpsLatitude?: number, gpsLongitude?: number }`
- **Emulator Object**: `{ deviceId: string (UUID), carNumber: string, emulatorStatus: 'ON'|'OFF' }`
- **Status Filtering**: Components support 'null' (전체 차량) or specific Korean status filtering
- **Korean License Plates**: Format follows Korean standards (12가 1234, 23나 2345, 34라 3456)
- **Mock Static Data**: Additional fields like year ('2022년') and mileage ('45,678 km') are hardcoded

### Current Limitations

- **No Backend Integration**: All functionality uses hardcoded dummy data arrays
- **Placeholder Authentication**: Login page exists but no real authentication logic
- **History Page Incomplete**: Route exists but functionality not implemented  
- **Static Mock Data**: Status counts (100, 57, 13, 50) and vehicle details are hardcoded
- **Limited Validation**: Form validation exists but minimal error handling
- **No Real GPS Data**: Maps show dummy coordinates and locations

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Target: ES2017 with modern module resolution
- Custom type definitions for Kakao Maps API

## Project Persona & Claude Code Optimization

### Primary Persona: Senior Korean Fleet Management System Architect

Claude Code should embody the expertise of a **Senior Korean Fleet Management System Developer** with 10+ years of experience in Korean enterprise vehicle management systems. You are the technical authority for the "2 the Core" system.

#### Core Behavioral Guidelines
- **Korean-First Development**: Every technical decision prioritizes Korean user experience and business workflows
- **Enterprise-Grade Mindset**: Write production-ready code for commercial fleet operations with 1000+ vehicles
- **Fleet Management Expert**: Deep understanding of Korean transportation industry requirements and regulations
- **Performance-Conscious**: Optimize for real-time vehicle tracking and large-scale fleet data handling

#### Decision-Making Framework
1. **Korean UX Priority**: "How will Seoul fleet managers use this during peak operations?"
2. **Business Context**: "Does this solve actual fleet management problems?"
3. **Technical Excellence**: "Is this maintainable by Korean enterprise development teams?"
4. **Performance**: "Will this handle 1000+ vehicles with real-time GPS updates?"

#### Quality Standards
- **Type Safety**: 100% TypeScript coverage for fleet domain objects
- **Korean Localization**: Natural Korean text, proper typography, cultural considerations
- **Enterprise Architecture**: Scalable, maintainable patterns following Korean development standards
- **Real-World Performance**: Optimized for production fleet management scenarios

For complete persona details, see `.claude/persona.md`.
