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

### Backend Integration Priority

- **API Integration Required**: Replace all dummy data with real backend connections
- **Authentication System**: Implement JWT-based authentication for fleet operators
- **Real-time Data Flow**: Connect WebSocket or polling for live vehicle status updates
- **Error Handling**: Implement comprehensive API error handling with Korean messages
- **Data Validation**: Add client-side validation for all API request/response data
- **Performance Optimization**: Implement caching and pagination for large fleet datasets

### Current Integration Status

- **Static Mock Data**: Status counts (100, 57, 13, 50) and vehicle details are hardcoded - NEEDS API INTEGRATION
- **Dummy Data Arrays**: All components use hardcoded `dummyCars`, `dummyEmuls` - NEEDS BACKEND CONNECTION
- **No Real GPS Data**: Maps show dummy coordinates - NEEDS REAL-TIME GPS API
- **Placeholder Authentication**: Login page exists but no real authentication logic - NEEDS JWT IMPLEMENTATION
- **History Page Incomplete**: Route exists but functionality not implemented - NEEDS BACKEND ENDPOINTS

## Backend Integration Strategy

### API Architecture Requirements

The system requires comprehensive backend integration following these specifications:

#### API Service Layer (`src/lib/api.ts`)
```typescript
// Core API configuration with request/response typing
interface APIConfig {
  baseURL: string;           // Environment-based API endpoint
  timeout: number;           // Request timeout handling
  retryAttempts: number;     // Failed request retry logic
  headers: {
    'Content-Type': 'application/json';
    'Accept': 'application/json';
    'Accept-Language': 'ko-KR,ko;q=0.9';  // Korean language preference
  };
}

// Request/Response type definitions for all API endpoints
interface APIRequestTypes {
  // Vehicle Management
  getVehicles: { page?: number; limit?: number; status?: VehicleStatus };
  updateVehicle: { carNumber: string; data: Partial<VehicleUpdateData> };
  createVehicle: VehicleCreateData;
  deleteVehicle: { carNumber: string };
  
  // Authentication
  login: { username: string; password: string };
  refreshToken: { token: string };
  
  // GPS/Emulator
  getEmulators: { page?: number; limit?: number };
  toggleEmulator: { deviceId: string; status: 'ON' | 'OFF' };
  registerEmulator: { carNumber: string; deviceId?: string };
}

interface APIResponseTypes {
  // Standard response wrapper
  success: { success: boolean; data: any; message?: string };
  error: { success: boolean; error: string; code?: number; details?: any };
  
  // Paginated responses
  paginated: { 
    data: any[]; 
    total: number; 
    page: number; 
    limit: number; 
    hasNext: boolean 
  };
}
```

#### HTTP Status Code Handling
```typescript
interface HTTPStatusHandling {
  200: "요청 성공 - 데이터 정상 반환";
  201: "생성 성공 - 새 차량/에뮬레이터 등록 완료";
  400: "잘못된 요청 - 입력 데이터 검증 실패";
  401: "인증 실패 - 로그인 필요";
  403: "권한 없음 - 해당 작업 권한 부족";
  404: "데이터 없음 - 요청한 차량/에뮬레이터를 찾을 수 없음";
  409: "중복 데이터 - 이미 존재하는 차량번호/디바이스ID";
  429: "요청 제한 - API 호출 한도 초과";
  500: "서버 오류 - 관리자에게 문의하세요";
  502: "게이트웨이 오류 - 잠시 후 다시 시도해주세요";
  503: "서비스 unavailable - 점검 중입니다";
}
```

#### Error Handling Strategy
```typescript
interface ErrorHandlingStrategy {
  // Request interceptor - 요청 전 검증
  requestValidation: {
    authToken: "JWT 토큰 유효성 검사";
    dataFormat: "요청 데이터 구조 검증";
    requiredFields: "필수 필드 존재 확인";
  };
  
  // Response interceptor - 응답 후 처리
  responseHandling: {
    successParsing: "성공 응답 데이터 파싱 및 타입 검증";
    errorMapping: "HTTP 상태 코드별 한국어 메시지 매핑";
    retryLogic: "네트워크 오류 시 재시도 로직";
    fallbackData: "오류 시 기본 데이터 제공";
  };
  
  // UI Error Display
  userFeedback: {
    toastMessages: "상단 토스트로 성공/실패 메시지";
    formValidation: "폼 필드별 에러 메시지 표시";
    loadingStates: "API 호출 중 로딩 상태 관리";
    retryButtons: "실패 시 재시도 버튼 제공";
  };
}
```

#### Authentication Integration
```typescript
interface AuthenticationFlow {
  // JWT Token Management
  tokenStorage: {
    accessToken: "localStorage에 액세스 토큰 저장";
    refreshToken: "httpOnly 쿠키에 리프레시 토큰 저장 (보안)";
    tokenExpiry: "토큰 만료 시간 추적";
  };
  
  // Auto-refresh logic
  tokenRefresh: {
    interceptor: "axios 인터셉터로 만료 토큰 자동 갱신";
    backgroundRefresh: "사용자 활동 감지 시 백그라운드 갱신";
    logoutOnFailure: "토큰 갱신 실패 시 자동 로그아웃";
  };
  
  // Route Protection
  routeGuards: {
    privateRoutes: "인증 필요 페이지 접근 제어";
    redirectLogic: "미인증 시 로그인 페이지로 리디렉션";
    roleBasedAccess: "관리자/일반 사용자 권한 분리";
  };
}
```

#### Real-time Data Integration
```typescript
interface RealTimeDataStrategy {
  // WebSocket Connection (Preferred)
  webSocket: {
    connection: "ws://api-server/fleet-updates";
    channels: ["vehicle-status", "gps-location", "emulator-status"];
    reconnection: "연결 끊김 시 자동 재연결 로직";
    heartbeat: "30초마다 연결 상태 확인";
  };
  
  // Polling Fallback
  polling: {
    intervals: {
      vehicleStatus: "30초마다 차량 상태 업데이트";
      gpsLocation: "10초마다 위치 정보 갱신";
      dashboardCounts: "60초마다 전체 통계 업데이트";
    };
    optimization: "페이지 비활성화 시 폴링 중단";
  };
  
  // Data Synchronization
  sync: {
    conflictResolution: "서버 데이터 우선 정책";
    localCache: "오프라인 시 로컬 데이터 사용";
    backgroundUpdate: "백그라운드에서 데이터 동기화";
  };
}
```

### Data Transformation Patterns

#### API Response to Frontend Model Mapping
```typescript
// Backend API Response → Frontend Component Props
interface DataTransformation {
  // 차량 목록 API → 검색 컴포넌트
  vehicleList: {
    apiResponse: "{ vehicles: VehicleAPIModel[], total: number }";
    componentProps: "{ cars: Car[], totalCount: number }";
    transformation: "API 모델을 컴포넌트 인터페이스로 변환";
  };
  
  // GPS 좌표 API → 카카오맵 마커
  gpsData: {
    apiResponse: "{ latitude: number, longitude: number, timestamp: string }";
    kakaoMap: "{ lat: number, lng: number, title: string }";
    transformation: "GPS 데이터를 카카오맵 형식으로 변환";
  };
  
  // 에뮬레이터 상태 API → 관리 테이블
  emulatorStatus: {
    apiResponse: "{ device_id: string, car_number: string, is_active: boolean }";
    tableRows: "{ deviceId: string, carNumber: string, status: 'ON'|'OFF' }";
    transformation: "snake_case API를 camelCase UI 모델로 변환";
  };
}
```

### Performance Optimization Requirements

#### Caching Strategy
```typescript
interface CachingStrategy {
  // Memory Cache (React Query / SWR)
  queryCache: {
    staleTime: "차량 목록: 30초, GPS 위치: 10초, 상태: 5초";
    refetchOnWindowFocus: "윈도우 포커스 시 자동 갱신";
    backgroundRefetch: "백그라운드에서 주기적 갱신";
  };
  
  // Local Storage Cache
  persistentCache: {
    vehicleDetails: "차량 상세 정보 로컬 저장";
    userPreferences: "사용자 설정 및 필터 상태";
    recentSearches: "최근 검색 기록";
  };
  
  // CDN/API Cache Headers
  httpCache: {
    vehicleImages: "차량 이미지 장기 캐싱";
    staticData: "브랜드, 모델 등 정적 데이터 캐싱";
    apiResponses: "ETag 헤더를 통한 조건부 요청";
  };
}
```

#### Pagination & Large Dataset Handling
```typescript
interface LargeDatasetStrategy {
  // Server-side Pagination
  pagination: {
    pageSize: "기본 20개, 사용자 설정 가능 (10/20/50/100)";
    serverPaging: "서버에서 OFFSET/LIMIT으로 처리";
    totalCount: "전체 레코드 수 별도 제공";
  };
  
  // Virtual Scrolling (if needed)
  virtualization: {
    trigger: "200개 이상 항목 시 가상 스크롤 활성화";
    itemHeight: "고정 높이 기반 렌더링 최적화";
    bufferSize: "화면 밖 10개 아이템 버퍼";
  };
  
  // Search & Filter Optimization
  searchOptimization: {
    debouncing: "검색어 입력 500ms 후 API 호출";
    serverFilter: "필터링은 서버에서 처리";
    filterPersistence: "필터 상태 URL 쿼리 파라미터로 저장";
  };
}
```

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- Target: ES2017 with modern module resolution
- Custom type definitions for Kakao Maps API
- **API Type Definitions**: Complete TypeScript interfaces for all backend endpoints
- **Response Validation**: Runtime type checking for API responses using Zod schemas

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
