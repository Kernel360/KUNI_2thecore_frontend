# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Technical Specifications

Korean vehicle fleet management system "2 the Core" - React 19 + Vite with Korean-first UI.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with TypeScript
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Tech Stack

React 19 + Vite | React Router DOM | Tailwind CSS + CSS modules | Zustand | shadcn/ui + Radix UI | Kakao Maps | React Hook Form + Zod | Material UI (MUI) | npm

### Project Structure & Architecture

#### React Router Configuration

- **Router**: BrowserRouter with nested routes
- **Main Layout**: App.tsx with Outlet for page rendering
- **Routes**: `/` (main), `/search`, `/detail`, `/emulator`, `/history`, `/login`

### Project Structure & Page-Component Architecture

#### Page-Component Mapping & Data Flow

```typescript
// Complete page-component hierarchy with data flow documentation
interface PageComponentArchitecture {
  // 메인 대시보드 (/) - 차량 관제 시스템 중앙 허브
  mainDashboard: {
    pageFile: 'src/app/page.tsx';
    mainComponents: [
      'TopBar',
      'StatusContainer',
      'MenuBox',
      'CarClustererMap',
      'MapModal',
    ];

    stateManagement: {
      localState: {
        carStatusFilter: "'운행중' | '수리중' | '대기중' - 차량 상태 필터";
        isMapModalOpen: 'boolean - 지도 모달 표시 상태';
      };
      props: 'carStatusFilter를 StatusContainer와 CarClustererMap에 전달';
    };

    dataFlow: {
      TopBar: "title prop으로 '차량 관제 시스템' 표시";
      StatusContainer: {
        receives: 'carStatusFilter, setCarStatusFilter';
        provides: 'StatisticsService를 통한 차량 통계 데이터';
        children: ['StatusBox', 'StatusText'];
      };
      MenuBox: {
        receives: 'onOpenMapModal 콜백';
        provides: '페이지 네비게이션 기능 (React Router)';
      };
      CarClustererMap: {
        receives: 'carStatusFilter, width, height';
        provides: '카카오맵 기반 차량 위치 클러스터링';
        dependencies: ['KakaoMapScript'];
        realtime: 'axios 연결을 통한 last GPS 데이터';
      };
      MapModal: {
        receives: 'isOpen, onClose';
        provides: '확대된 지도 뷰';
      };
    };
  };

  // 차량 검색 페이지 (/search) - 차량 목록 및 필터링
  searchPage: {
    pageFile: 'src/app/search/page.tsx';
    mainComponents: ['TopBar', 'SearchBox'];

    stateManagement: {
      noLocalState: '모든 상태를 SearchBox에서 관리';
    };

    dataFlow: {
      TopBar: "title prop으로 '차량 검색' 표시";
      SearchBox: {
        receives: '없음 - 최상위 검색 컴포넌트';
        provides: 'CarService를 통한 차량 목록 데이터';
        children: [
          'NumberSearchBox',
          'BrandFilterBox',
          'ListBox (다중)',
          'FloatingButton',
        ];
        localState: {
          cars: 'Car[] - 차량 목록 데이터';
          loading: 'boolean - 로딩 상태';
        };
      };
    };
  };

  // 차량 상세 페이지 (/detail) - 개별 차량 정보 관리
  detailPage: {
    pageFile: 'src/app/detail/page.tsx';
    mainComponents: [
      'TopBar',
      'Card (차량정보)',
      'CarLocationMap',
      'Form Controls',
    ];

    stateManagement: {
      zustandStores: {
        useDetailStore: '차량 상세 정보 (carNumber, brand, model, status)';
        setDetailChangeStore: '편집 모드 상태 (detailChange boolean)';
      };
      localState: {
        mockDetail: '하드코딩된 연식, 주행거리 데이터';
      };
    };

    dataFlow: {
      TopBar: "동적 title: '차량 상세 정보 - {carNumber}'";
      'Form Fields': {
        receives: 'useDetailStore의 차량 데이터';
        provides: 'handleChange를 통한 실시간 편집';
        editing: 'detailChange 상태에 따른 readOnly 제어';
      };
      CarLocationMap: {
        receives: 'width, height props';
        provides: '개별 차량 위치 표시';
        dependencies: ['KakaoMapScript'];
      };
      'Save/Cancel Buttons': {
        receives: 'detailChange 상태';
        provides: 'CarService.updateCar API 호출 및 페이지 라우팅';
      };
    };
  };

  // 에뮬레이터 관리 페이지 (/emulator) - GPS 에뮬레이터 제어
  emulatorPage: {
    pageFile: 'src/app/emulator/page.tsx';
    mainComponents: ['TopBar', 'EmulSearchBox', 'Table (에뮬레이터 목록)'];

    stateManagement: {
      localState: {
        emulators: 'Emulator[] - 에뮬레이터 목록';
        loading: 'boolean - 로딩 상태';
      };
    };

    dataFlow: {
      TopBar: "title prop으로 '에뮬레이터' 표시";
      EmulSearchBox: {
        components: ['NumberSearchBox', 'Input (등록)', 'Button'];
        provides: '새 에뮬레이터 등록 기능';
      };
      Table: {
        receives: 'emulators 배열';
        provides: '에뮬레이터 목록 표시 및 삭제 기능';
        children: ['IconButton (delete)', 'TableRow (다중)'];
        apis: 'EmulatorService.getAllEmulators, deleteEmulator';
      };
    };
  };

  // 주행 기록 페이지 (/history) - 차량 이력 관리
  historyPage: {
    pageFile: 'src/app/history/page.tsx';
    mainComponents: ['TopBar', 'HistorySearchBox', 'HistoryListBox'];

    stateManagement: {
      noLocalState: '자식 컴포넌트에서 상태 관리';
    };

    dataFlow: {
      TopBar: "title prop으로 '주행 기록' 표시";
      HistorySearchBox: {
        provides: '날짜 범위 검색 기능 (구현 필요)';
      };
      HistoryListBox: {
        provides: '주행 기록 목록 표시 (구현 필요)';
      };
      status: 'PLACEHOLDER - 백엔드 연결 필요';
    };
  };

  // 로그인 페이지 (/login) - 사용자 인증
  loginPage: {
    pageFile: 'src/app/login/page.tsx';
    mainComponents: ['TopBar', 'Card (로그인 폼)'];

    stateManagement: {
      noState: '정적 폼 - 인증 로직 구현 필요';
    };

    dataFlow: {
      TopBar: "title prop으로 '로그인' 표시";
      Form: {
        provides: '아이디/비밀번호 입력 필드';
        status: 'PLACEHOLDER - JWT 인증 구현 필요';
      };
    };
  };
}
```

#### Component Architecture Summary

**Key Reusable Components:**

- **TopBar**: Universal header component used across all pages
- **CarClustererMap/CarLocationMap**: Kakao Maps integration for fleet visualization
- **SearchBox**: Complete vehicle search system with filtering
- **StatusContainer**: Real-time status counters with clickable filtering
- **NumberSearchBox**: Reused in search and emulator pages

**State Management Patterns:**

- **Zustand Stores**: `useDetailStore` (vehicle details), `setDetailChangeStore` (edit mode)
- **Props Flow**: `carStatusFilter` flows from main page to StatusContainer and CarClustererMap
- **API Integration**: Each page independently calls service layer for data

#### Project Directory Structure

- **`src/app/`**: Page components organized by route (React Router pages)
- **`src/components/`**: Feature-organized reusable components
  - `map/`: Kakao Maps integration with clustering (`car-clusterer-map`), individual location tracking (`car-location-map`), and script loading
  - `search-box/`: Complete vehicle search system with number search, brand filtering, dropdown selection, and paginated list display
  - `status-box/`: Real-time status counters (전체/운행중/대기중/수리중) with clickable filtering
  - `menu-box/`: Main navigation menu with emoji icons (🗺️ 지도, 🚗 차량 검색, 📊 주행 기록, ⚒️ 차량 관리)
  - `user-box/`: User information and authentication display
  - `icon-button/`: Custom icon button components with delete functionality
  - `ui/`: shadcn/ui + Radix UI base components (forms, cards, buttons, tables, alerts, inputs, labels)
- **`src/store/`**: Zustand state management for vehicle details and edit modes
- **`src/services/`**: API service layer for backend integration
- **`src/hooks/`**: Custom React hooks (mobile detection, axios)
- **`src/types/`**: TypeScript type definitions (API, vehicles, Kakao Maps)

## Code Conventions

- Files: `kebab-case` | Components: `PascalCase` | Variables: `camelCase` | Hooks: `useCamelCase` | Constants: `UPPER_SNAKE_CASE`

## Core Data Types

```typescript
// Car: { carNumber: string, brand: string, model: string, status: '운행중'|'대기중'|'수리중' }
// Emulator: { deviceId: string, carNumber: string, emulatorStatus: 'ON'|'OFF' }
// Korean License Plates: "12가 1234", "23나 2345" format
```

## State Management (Zustand)

- `detail-store.ts`: Car detail info (carNumber, brand, model, status)
- `detail-change.ts`: Edit mode toggle (detailChange: boolean)
- Status types: `'운행중' | '대기중' | '수리중'` + `'null'` for all cars

### Backend Integration Architecture

#### API Service Layer (`src/services/`)

- **CarService**: Car CRUD operations, statistics, search/filtering
- **EmulatorService**: GPS emulator management
- **StatisticsService**: Dashboard statistics and metrics

#### API Configuration (`src/lib/api.ts`)

```typescript
// Dual server setup
// Port 8080: Main API server (vehicles, auth, logs, maps)
// Port 8081: Emulator-specific server
// Auth: JWT with automatic refresh token handling
// Error handling: Korean localized error messages
```

#### Real-time Data Flow

- **Polling Fallback**: For environments without axios support
- **Data Transformation**: API snake_case → Frontend camelCase

### Integration Status & Priority

#### Current Status

- **✅ Completed**: Core API client setup, JWT token management, Korean error handling
- **✅ Completed**: Car CRUD operations, statistics API integration
- **🔄 In Progress**: Real-time axios integration for live GPS tracking
- **❌ Pending**: Authentication flow, history page implementation

#### Backend Integration Priority

1. **Authentication System**: Complete JWT login/logout flow
2. **Real-time GPS Data**: axios connection for live car tracking
3. **History Module**: Implement car driving history features
4. **Error Handling**: Comprehensive API error management

### Kakao Maps Integration

- **Script Loading**: Dynamic Kakao Maps SDK loading via `KakaoMapScript`
- **Clustering**: `CarClustererMap` for multiple car display with performance optimization
- **Individual Tracking**: `CarLocationMap` for single car detailed view
- **Real-time Updates**: axios data integration for live position updates

## Development Workflow

- **Vite Dev Server**: Fast development with HMR on port 3000
- **TypeScript**: Strict mode with path aliases (`@/*` → `./src/*`)
- **Linting**: ESLint + TypeScript rules
- **Formatting**: Prettier with Korean-friendly configuration

## Development Focus

- **Backend Integration**: Primary focus on axios-based API connections and real data implementation
- **API Service Layer**: Use existing CarService, EmulatorService, StatisticsService for all backend calls
- **Error Handling**: Implement proper loading states, error messages in Korean
- **Real Implementation**: Replace all mock data with actual API calls
- **Terminology**: Always use "car" (차량) - never use "vehicle" in any context
- **Korean UI**: Maintain Korean language for user interface

## Backend Integration Guidelines

- **API Base URLs**:
  - Main API: `http://52.78.122.150:8080/api` (cars, auth, logs, maps)
- **Authentication**: JWT tokens with automatic refresh via TokenManager
- **Error Handling**: Korean localized messages via getKoreanErrorMessage()
- **Data Flow**: API snake_case → Frontend camelCase transformation
