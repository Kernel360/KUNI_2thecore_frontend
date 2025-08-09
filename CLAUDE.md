# CLAUDE.md - Technical Specifications

Korean car fleet management system "2 the Core" - react with Korean-first UI.

## Development Commands
- `npm run dev` | `npm run build` | `npm start` | `npm run lint` | `npm run format`

## Tech Stack
Next.js 15 + React 19 | Tailwind CSS + CSS modules | Zustand | shadcn/ui | Kakao Maps | React Hook Form + Zod | pnpm

### Project Structure & Page-Component Architecture

#### Page-Component Mapping & Data Flow

```typescript
// Complete page-component hierarchy with data flow documentation
interface PageComponentArchitecture {
  // 메인 대시보드 (/) - 차량 관제 시스템 중앙 허브
  mainDashboard: {
    pageFile: "src/app/page.tsx";
    mainComponents: [
      "TopBar", 
      "StatusContainer", 
      "MenuBox", 
      "CarClustererMap", 
      "MapModal"
    ];
    
    stateManagement: {
      localState: {
        carStatusFilter: "'운행중' | '수리중' | '대기중' - 차량 상태 필터";
        isMapModalOpen: "boolean - 지도 모달 표시 상태";
      };
      props: "carStatusFilter를 StatusContainer와 CarClustererMap에 전달";
    };
    
    dataFlow: {
      "TopBar": "title prop으로 '차량 관제 시스템' 표시";
      "StatusContainer": {
        receives: "carStatusFilter, setCarStatusFilter";
        provides: "StatisticsService를 통한 차량 통계 데이터";
        children: ["StatusBox", "StatusText"];
      };
      "MenuBox": {
        receives: "onOpenMapModal 콜백";
        provides: "페이지 네비게이션 기능";
      };
      "CarClustererMap": {
        receives: "carStatusFilter, width, height";
        provides: "카카오맵 기반 차량 위치 클러스터링";
        dependencies: ["KakaoMapScript"];
      };
      "MapModal": {
        receives: "isOpen, onClose";
        provides: "확대된 지도 뷰";
      };
    };
  };
  
  // 차량 검색 페이지 (/search) - 차량 목록 및 필터링
  searchPage: {
    pageFile: "src/app/search/page.tsx";
    mainComponents: ["TopBar", "SearchBox"];
    
    stateManagement: {
      noLocalState: "모든 상태를 SearchBox에서 관리";
    };
    
    dataFlow: {
      "TopBar": "title prop으로 '차량 검색' 표시";
      "SearchBox": {
        receives: "없음 - 최상위 검색 컴포넌트";
        provides: "CarService를 통한 차량 목록 데이터";
        children: [
          "NumberSearchBox",
          "BrandFilterBox", 
          "ListBox (다중)",
          "FloatingButton"
        ];
        localState: {
          cars: "Car[] - 차량 목록 데이터";
          loading: "boolean - 로딩 상태";
        };
      };
    };
  };
  
  // 차량 상세 페이지 (/detail) - 개별 차량 정보 관리
  detailPage: {
    pageFile: "src/app/detail/page.tsx";
    mainComponents: [
      "TopBar",
      "Card (차량정보)",
      "CarLocationMap",
      "Form Controls"
    ];
    
    stateManagement: {
      zustandStores: {
        "useDetailStore": "차량 상세 정보 (carNumber, brand, model, status)";
        "setDetailChangeStore": "편집 모드 상태 (detailChange boolean)";
      };
      localState: {
        mockDetail: "하드코딩된 연식, 주행거리 데이터";
      };
    };
    
    dataFlow: {
      "TopBar": "동적 title: '차량 상세 정보 - {carNumber}'";
      "Form Fields": {
        receives: "useDetailStore의 차량 데이터";
        provides: "handleChange를 통한 실시간 편집";
        editing: "detailChange 상태에 따른 readOnly 제어";
      };
      "CarLocationMap": {
        receives: "width, height props";
        provides: "개별 차량 위치 표시";
        dependencies: ["KakaoMapScript"];
      };
      "Save/Cancel Buttons": {
        receives: "detailChange 상태";
        provides: "CarService.updateCar API 호출 및 페이지 라우팅";
      };
    };
  };
  
  // 에뮬레이터 관리 페이지 (/emulator) - GPS 에뮬레이터 제어
  emulatorPage: {
    pageFile: "src/app/emulator/page.tsx";
    mainComponents: [
      "TopBar",
      "EmulSearchBox",
      "Table (에뮬레이터 목록)"
    ];
    
    stateManagement: {
      localState: {
        emulators: "Emulator[] - 에뮬레이터 목록";
        loading: "boolean - 로딩 상태";
      };
    };
    
    dataFlow: {
      "TopBar": "title prop으로 '에뮬레이터' 표시";
      "EmulSearchBox": {
        components: ["NumberSearchBox", "Input (등록)", "Button"];
        provides: "새 에뮬레이터 등록 기능";
      };
      "Table": {
        receives: "emulators 배열";
        provides: "에뮬레이터 목록 표시 및 삭제 기능";
        children: ["IconButton (delete)", "TableRow (다중)"];
        apis: "EmulatorService.getAllEmulators, deleteEmulator";
      };
    };
  };
  
  // 주행 기록 페이지 (/history) - 차량 이력 관리
  historyPage: {
    pageFile: "src/app/history/page.tsx";
    mainComponents: [
      "TopBar",
      "HistorySearchBox", 
      "HistoryListBox"
    ];
    
    stateManagement: {
      noLocalState: "자식 컴포넌트에서 상태 관리";
    };
    
    dataFlow: {
      "TopBar": "title prop으로 '주행 기록' 표시";
      "HistorySearchBox": {
        provides: "날짜 범위 검색 기능 (구현 필요)";
      };
      "HistoryListBox": {
        provides: "주행 기록 목록 표시 (구현 필요)";
      };
      status: "PLACEHOLDER - 백엔드 연결 필요";
    };
  };
  
  // 로그인 페이지 (/login) - 사용자 인증
  loginPage: {
    pageFile: "src/app/login/page.tsx";
    mainComponents: [
      "TopBar",
      "Card (로그인 폼)"
    ];
    
    stateManagement: {
      noState: "정적 폼 - 인증 로직 구현 필요";
    };
    
    dataFlow: {
      "TopBar": "title prop으로 '로그인' 표시";
      "Form": {
        provides: "아이디/비밀번호 입력 필드";
        status: "PLACEHOLDER - JWT 인증 구현 필요";
      };
    };
  };
}
```

#### Component Hierarchy & Reusability Matrix

```typescript
// 재사용 가능한 컴포넌트와 페이지별 사용 현황
interface ComponentReusabilityMatrix {
  // 공통 UI 컴포넌트 (모든 페이지에서 사용)
  universal: {
    "TopBar": {
      usedIn: ["main", "search", "detail", "emulator", "history", "login"];
      props: "title: string";
      responsibility: "페이지 제목 및 헤더 표시";
    };
    "KakaoMapScript": {
      usedIn: ["main", "detail"];
      props: "없음";
      responsibility: "카카오맵 SDK 동적 로딩";
    };
  };
  
  // 검색 관련 컴포넌트
  searchComponents: {
    "NumberSearchBox": {
      usedIn: ["search", "emulator"];
      props: "없음 - 자체 상태 관리";
      responsibility: "차량번호 검색 입력 필드";
    };
    "SearchBox": {
      usedIn: ["search"];
      children: ["NumberSearchBox", "BrandFilterBox", "ListBox"];
      apis: "CarService.getAllCars";
    };
    "ListBox": {
      usedIn: ["search"];
      props: "carNumber, brand, model, status";
      responsibility: "개별 차량 정보 카드 표시";
    };
  };
  
  // 지도 관련 컴포넌트
  mapComponents: {
    "CarClustererMap": {
      usedIn: ["main"];
      props: "width, height, carStatusFilter";
      responsibility: "메인 대시보드 차량 위치 클러스터링";
    };
    "CarLocationMap": {
      usedIn: ["detail"];
      props: "width, height";
      responsibility: "개별 차량 위치 표시";
    };
    "MapModal": {
      usedIn: ["main"];
      props: "isOpen, onClose";
      responsibility: "확대된 지도 모달 뷰";
    };
  };
  
  // 상태 관련 컴포넌트
  statusComponents: {
    "StatusContainer": {
      usedIn: ["main"];
      props: "carStatusFilter, setCarStatusFilter";
      children: ["StatusBox", "StatusText"];
      apis: "StatisticsService.getCarStatistics";
    };
    "StatusBox": {
      usedIn: ["StatusContainer"];
      props: "num, text, active";
      responsibility: "클릭 가능한 상태 박스 (운행중/대기중/수리중)";
    };
    "StatusText": {
      usedIn: ["StatusContainer"];
      props: "num, text";
      responsibility: "전체 차량 수 표시";
    };
  };
}
```

#### State Management & Data Flow Patterns

```typescript
// 상태 관리 및 데이터 흐름 패턴
interface StateManagementPatterns {
  // Zustand 글로벌 상태
  zustandStores: {
    "useDetailStore": {
      location: "src/store/detail-store.ts";
      state: "carNumber, brand, model, status";
      usedBy: ["detail 페이지"];
      dataFlow: "SearchBox ListBox → DetailStore → Detail 페이지";
    };
    "setDetailChangeStore": {
      location: "src/store/detail-change.ts";
      state: "detailChange: boolean";
      usedBy: ["detail 페이지"];
      purpose: "편집 모드 토글 상태 관리";
    };
  };
  
  // Props 기반 상태 전달
  propsDrilling: {
    "carStatusFilter": {
      origin: "main 페이지 useState";
      flow: "main → StatusContainer → StatusBox";
      flow2: "main → CarClustererMap";
      purpose: "차량 상태 필터링 (운행중/대기중/수리중)";
    };
    "차량 데이터": {
      origin: "API 서비스 (CarService, EmulatorService)";
      flow: "API → useState → 자식 컴포넌트";
      pattern: "각 페이지에서 독립적으로 API 호출";
    };
  };
  
  // 컴포넌트별 로컬 상태
  localState: {
    "SearchBox": "cars[], loading - CarService API 결과";
    "StatusContainer": "carSummary, loading, error - StatisticsService API 결과";
    "EmulatorPage": "emulators[], loading - EmulatorService API 결과";
    "DetailPage": "mockDetail - 하드코딩된 연식/주행거리";
  };
}
```

#### API Integration Points & Service Layer

```typescript
// 서비스 레이어와 컴포넌트 연결점
interface APIIntegrationPoints {
  // 차량 관리 API
  carService: {
    location: "src/services/car-service.ts";
    endpoints: {
      "getAllCars": {
        usedBy: ["SearchBox"];
        params: "page, limit";
        returns: "{ content: Car[], total: number }";
      };
      "updateCar": {
        usedBy: ["DetailPage"];
        params: "carNumber, updateData";
        returns: "Car";
      };
    };
  };
  
  // 에뮬레이터 관리 API
  emulatorService: {
    location: "src/services/emulator-service.ts";
    endpoints: {
      "getAllEmulators": {
        usedBy: ["EmulatorPage"];
        params: "page, limit";
        returns: "{ content: Emulator[], total: number }";
      };
      "deleteEmulator": {
        usedBy: ["EmulatorPage"];
        params: "deviceId";
        returns: "void";
      };
    };
  };
  
  // 통계 API
  statisticsService: {
    location: "src/services/statistics-service.ts";
    endpoints: {
      "getCarStatistics": {
        usedBy: ["StatusContainer"];
        params: "없음";
        returns: "{ total, operating, waiting, inspecting }";
      };
    };
  };
}
```

- **`src/app/`**: Next.js App Router pages with Korean layout (lang="ko")
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

## Code Conventions
- Files: `kebab-case` | Components: `PascalCase` | Variables: `camelCase` | Hooks: `useCamelCase` | Constants: `UPPER_SNAKE_CASE`

## Core Data Types
```typescript
// Vehicle: { carNumber: string, brand: string, model: string, status: '운행중'|'대기중'|'수리중' }
// Emulator: { deviceId: string, carNumber: string, emulatorStatus: 'ON'|'OFF' }
// Korean License Plates: "12가 1234", "23나 2345" format
```

## State Management (Zustand)
- `detail-store.ts`: Vehicle detail info (carNumber, brand, model, status)
- `detail-change.ts`: Edit mode toggle (detailChange: boolean)
- Status types: `'운행중' | '대기중' | '수리중'` + `'null'` for all vehicles

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

### API Requirements (`src/lib/api.ts`)
```typescript
// Core: axios + TypeScript + Korean error handling
// Auth: JWT (localStorage) + refresh interceptor
// Real-time: WebSocket preferred, polling fallback
// Status codes: 200/201 success, 400/401/403/404/500 Korean messages
```

### Data Transformation
```typescript
// API snake_case → Frontend camelCase
// GPS coordinates → Kakao Map format  
// Pagination: server-side (page/limit/total)
// Cache: React Query (30s vehicles, 10s GPS, 5s status)
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
