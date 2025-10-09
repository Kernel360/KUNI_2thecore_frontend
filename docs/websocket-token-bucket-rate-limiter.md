````markdown
# WebSocket Token Bucket 레이트 리미터

## 개요

Token Bucket 알고리즘으로 WebSocket 메시지 전송 빈도를 제어합니다.

## Token Bucket 알고리즘

### 핵심 개념

- **Capacity**: 최대 토큰 수 (버스트 허용)
- **RefillRate**: 초당 토큰 충전 비율
- **Tokens**: 현재 사용 가능한 토큰

### 동작 방식

1. 매 초마다 `refillRate`만큼 토큰 충전
2. 메시지 전송 시 토큰 1개 소비
3. 토큰 부족 시 전송 차단

## 구현

```typescript
class TokenBucket {
  private capacity: number;
  private tokens: number;
  private refillRate: number;
  private lastRefill: number;

  private refill(): void {
    const deltaSeconds = (Date.now() - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + deltaSeconds * this.refillRate
    );
    this.lastRefill = Date.now();
  }

  tryConsume(tokens = 1): boolean {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}

// React Hook
function useTokenBucketRateLimiter(capacity: number, refillRate: number) {
  const bucketRef = useRef(new TokenBucket(capacity, refillRate));

  const tryExecute = useCallback((callback: () => void) => {
    if (bucketRef.current.tryConsume(1)) {
      callback();
      return true;
    }
    return false;
  }, []);

  return { tryExecute };
}
```

## 적용 현황

### 개별 차량 (Detail 페이지)

```typescript
// capacity=4, refillRate=2 (초당 평균 2회, 버스트 4회)
const { tryExecute } = useTokenBucketRateLimiter(4, 2);
const throttledUpdate = useThrottledCallback(
  carData => tryExecute(() => onCarLocationUpdate(carData)),
  2000 // 2초 쓰로틀링 (이중 보호)
);
```

### 다중 차량 (메인 페이지)

```typescript
// capacity=2, refillRate=1 (초당 평균 1회, 버스트 2회)
const { tryExecute } = useTokenBucketRateLimiter(2, 1);
const throttledUpdate = useThrottledCallback(
  carData => tryExecute(() => onCarLocationUpdate(carData)),
  5000 // 5초 쓰로틀링 (보수적 설정)
);
```

### 메시지 전송

```typescript
// 구독/해제 메시지도 제한
const { tryExecute: trySendMessage } = useTokenBucketRateLimiter(2, 0.5);
trySendMessage(() => websocket.sendMessage({ type: 'subscribe', ... }));
```

## 성능 결과

| 구분        | 개별 차량 | 다중 차량 |
| ----------- | --------- | --------- |
| 평균 처리량 | 초당 2회  | 초당 1회  |
| 버스트 허용 | 최대 4회  | 최대 2회  |
| 쓰로틀링    | 2초 간격  | 5초 간격  |
| 실제 빈도   | ~30회/분  | ~12회/분  |

**장점:**

- 메모리 효율: 숫자 4개만 저장 (타임스탬프 배열 불필요)
- 버스트 처리: 순간 트래픽 자연스럽게 허용
- 정확한 제어: 시간 기반 토큰 충전

---

**관련 파일:** `src/services/websocket-service.ts`
````
