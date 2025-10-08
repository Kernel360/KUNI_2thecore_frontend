# WebSocket 모듈 구조

## 개요

WebSocket 관련 코드를 역할별로 모듈화하여 관리합니다.

## 디렉토리 구조

```
src/
├── types/
│   └── websocket.ts           # WebSocket 타입 정의
├── lib/
│   └── token-bucket.ts        # Token Bucket 클래스
├── hooks/
│   ├── useTokenBucketRateLimiter.ts  # Rate Limiter Hook
│   ├── useThrottledCallback.ts       # Throttle Hook
│   └── useCarWebSocket.ts            # 차량 WebSocket Hooks
└── services/
    └── websocket-service.ts   # Re-exports (하위 호환성)
```

## 모듈 설명

### 1. types/websocket.ts

```typescript
// 타입 정의만 포함
export type CarStatus = '운행' | '대기' | '수리';
export interface CarLocationData { ... }
export interface CarLocationMessage { ... }
export interface SingleCarLocationMessage { ... }
```

### 2. lib/token-bucket.ts

```typescript
// Token Bucket 알고리즘 클래스
export class TokenBucket {
  tryConsume(tokens: number): boolean;
  getWaitTime(tokens: number): number;
  getAvailableTokens(): number;
}
```

### 3. hooks/useTokenBucketRateLimiter.ts

```typescript
// Token Bucket을 React Hook으로 래핑
export function useTokenBucketRateLimiter(
  capacity: number,
  refillRate: number
) {
  return { tryExecute, getStatus };
}
```

### 4. hooks/useThrottledCallback.ts

```typescript
// 쓰로틀링 Hook
export function useThrottledCallback<T>(callback: T, delay: number): T;
```

### 5. hooks/useCarWebSocket.ts

```typescript
// 차량 WebSocket 관련 모든 Hooks
export function useSingleCarWebSocket(...)
export function useMultipleCarWebSocket(...)
export function useCarLocationWebSocket(...)
export function createCarLocationWebSocketOptions(...)
```

### 6. services/websocket-service.ts

```typescript
// 기존 import 경로 호환성을 위한 re-export
export * from '@/types/websocket';
export * from '@/hooks/useCarWebSocket';
```

## 사용 예시

### 기존 방식 (여전히 동작)

```typescript
import {
  useSingleCarWebSocket,
  SingleCarLocationMessage,
} from '@/services/websocket-service';
```

### 권장 방식 (직접 import)

```typescript
import { useSingleCarWebSocket } from '@/hooks/useCarWebSocket';
import { SingleCarLocationMessage } from '@/types/websocket';
```

## 장점

- ✅ **관심사 분리**: 타입/로직/Hook 각각 분리
- ✅ **재사용성**: 각 모듈을 독립적으로 재사용 가능
- ✅ **테스트 용이성**: 작은 단위로 테스트 가능
- ✅ **유지보수성**: 변경 영향 범위 최소화
- ✅ **하위 호환성**: 기존 import 경로 유지

---

**작성일**: 2025년 10월 8일
