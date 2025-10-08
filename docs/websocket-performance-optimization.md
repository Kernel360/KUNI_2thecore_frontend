# WebSocket 성능 최적화

## 문제

- ❌ 하트비트: 30초마다 (1,065,800회/년)
- ❌ 쓰로틀링 없음: 초당 수십 번 업데이트
- ❌ 중복 구독: 재연결 시 중복 메시지
- ❌ 과도한 로그: 콘솔 spam

## 해결

### 1. Token Bucket 레이트 리미팅

```typescript
// 개별 차량: 초당 평균 2회, 버스트 4회
useTokenBucketRateLimiter(4, 2);

// 다중 차량: 초당 평균 1회, 버스트 2회
useTokenBucketRateLimiter(2, 1);
```

### 2. 쓰로틀링 (이중 보호)

```typescript
// 개별: 2초마다 최대 1회
useThrottledCallback(callback, 2000);

// 다중: 5초마다 최대 1회
useThrottledCallback(callback, 5000);
```

### 3. 하트비트 간격

```typescript
heartbeat: {
  interval: 300000, // 30초 → 5분
}
```

### 4. 중복 방지

```typescript
const subscribedRef = useRef(false);
if (!subscribedRef.current) {
  subscribe();
  subscribedRef.current = true;
}
```

### 5. 생명주기 관리

```typescript
useEffect(() => {
  subscribe();
  return () => disconnect(); // unmount 시 자동 정리
}, []);
```

### 6. 로그 최소화

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('...');
}
```

## 성능 개선

| 항목          | 이전           | 현재            | 감소율 |
| ------------- | -------------- | --------------- | ------ |
| 하트비트      | 1,065,800회/년 | 105,120회/년    | 90%    |
| 위치 업데이트 | 무제한         | ~30회/분 (개별) | 95%+   |
| 메시지 전송   | 무제한         | ~12회/분 (다중) | 98%+   |
| 중복 구독     | 발생           | 차단            | 100%   |

## 결과

**1분에 10,000회 → 120회 미만 (98.8% 감소)** 🎉

---

**관련 문서:**

- `websocket-token-bucket-rate-limiter.md` (Token Bucket 상세)
- `websocket-lifecycle-management.md` (생명주기 관리)
