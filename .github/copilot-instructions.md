# GitHub Copilot Instructions - KUNI 2theCore Frontend

## Project Context

Korean vehicle fleet management system built with React 19 + Vite + TypeScript. Always use Korean UI text and "차량" (car) terminology—never "vehicle".

## Architecture Patterns

### Service Layer First

- Always use existing services: `CarService`, `EmulatorService`, `StatisticsService`
- API responses follow `ApiResponse<T>` with `result: boolean` and automatic JWT token refresh
- Dual API setup: port 8080 (main), 8081 (emulator), Flask (analysis)

### State Management (Zustand)

```typescript
// Store pattern example from detail-store.ts
const useDetailStore = create<DetailStore>(set => ({
  carNumber: '',
  brand: '',
  model: '',
  status: '',
  setDetail: detail =>
    set({ ...detail, brandModel: `${detail.brand} ${detail.model}` }),
}));
```

### Component Structure

- Pages in `src/app/` use React Router with `<Outlet/>`
- Reusable components in `src/components/` with feature folders
- Universal `<TopBar>` component across all pages with dynamic titles
- Kakao Maps integration via `KakaoMapScript` → `CarClustererMap` (multi-car) / `CarLocationMap` (single)

## Critical Development Patterns

### API Integration

```typescript
// Always use service layer, never direct API calls
const cars = await CarService.searchCars({ status: '운행', brand: 'BMW' });
// JWT auto-handled by mainApi/emulatorApi instances
```

### Korean Car Status Types

```typescript
type CarStatus = '운행' | '대기' | '수리'; // Never use English equivalents
const statusFilter: 'total' | 'driving' | 'maintenance' | 'idle' = 'total';
```

### Kakao Maps Pattern

- Load via `KakaoMapScript` HOC first
- Use clustering for multiple cars: `CarClustererMap` with status filtering
- Single car: `CarLocationMap` with GPS coordinates
- Handle window.kakao availability and async loading

## File Naming Conventions

- Components: `PascalCase.tsx`
- Files: `kebab-case.tsx` / `kebab-case.module.css`
- Hooks: `useCamelCase.ts`
- Stores: `kebab-case-store.ts`

## Build & Deployment

- **Dev**: `pnpm dev` (port 3000)
- **Build**: `pnpm build` (TypeScript + Vite)
- **CI/CD**: Jenkins pipeline → AWS S3 (see JenkinsFile)
- **Env vars**: Vite format (`VITE_*`) for API endpoints and Kakao Maps key

## UI Component Hierarchy

1. **shadcn/ui + Radix** base components in `src/components/ui/`
2. **Feature components** with CSS modules (map, search-box, status-box)
3. **Layout**: `App.tsx` with fixed header (`TopBar` + `MenuBox`) and `<Outlet/>`

## Common Pitfalls to Avoid

- Don't use "vehicle" terminology - always "차량" (car)
- Don't bypass service layer for direct axios calls
- Don't forget `KakaoMapScript` wrapper for map components
- Don't mix English/Korean in UI text
- Always handle JWT token refresh automatically via API interceptors

## Next Steps for AI Agents

1. Check existing service methods before creating new API calls
2. Use Korean error messages via `getKoreanErrorMessage()`
3. Follow the established Zustand store patterns for state
4. Implement proper loading states and error handling
5. Test Kakao Maps integration with proper script loading
