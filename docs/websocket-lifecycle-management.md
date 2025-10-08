````markdown
# WebSocket 생명주기 관리

## 개요

페이지 이동 시 WebSocket 자동 정리 및 재연결 시스템

## 핵심 패턴

### 페이지별 격리

```typescript
// 메인: 다중 차량
useMultipleCarWebSocket(carNumbers, onUpdate, enabled);

// Detail: 단일 차량
useSingleCarWebSocket(carNumber, onUpdate, enabled);
```

### 자동 Cleanup

```typescript
useEffect(() => {
  if (websocket.isConnected) {
    websocket.subscribe();
  }

  return () => {
    websocket.unsubscribe();
    websocket.disconnect(); // 연결 완전 종료
  };
}, [websocket.isConnected]);
```

## 구현

### websocket-service.ts

```typescript
// enabled가 false면 빈 URL로 연결 안함
const websocket = useWebSocket({
  url: enabled && carNumber ? WEBSOCKET_URL : '',
});
```

### page.tsx (메인)

```typescript
useEffect(() => {
  if (multiCarWebSocket.isConnected) {
    multiCarWebSocket.subscribeToMultipleCars();
  }

  return () => {
    multiCarWebSocket.unsubscribeFromMultipleCars();
    multiCarWebSocket.disconnect(); // 페이지 unmount 시 종료
  };
}, [multiCarWebSocket.isConnected]);
```

### detail/page.tsx

```typescript
useEffect(() => {
  if (singleCarWebSocket.isConnected) {
    singleCarWebSocket.subscribeToCarLocation();
  }

  return () => {
    singleCarWebSocket.unsubscribeFromCarLocation();
    singleCarWebSocket.disconnect(); // 페이지 unmount 시 종료
  };
}, [singleCarWebSocket.isConnected]);
```

## 동작 시나리오

**메인 → Detail → 메인**

1. 메인 접속 → `useMultipleCarWebSocket` 연결
2. Detail 이동 → 메인 cleanup: `disconnect()` 호출
3. Detail 접속 → `useSingleCarWebSocket` 연결
4. 뒤로가기 → Detail cleanup: `disconnect()` 호출
5. 메인 재접속 → `useMultipleCarWebSocket` 재연결 ✅

## 디버깅

### 콘솔 로그 (개발 모드)

```javascript
'메인 페이지 unmount: 다중 차량 WebSocket 연결 종료';
'Detail 페이지 unmount: 차량 12가1234 WebSocket 연결 종료';
```

### DevTools Network 탭

- **빨간색 (Closed)**: 정상 종료 ✅
- **녹색 (Connected)**: 활성 연결

## 주의사항

```typescript
// ❌ Bad
useMultipleCarWebSocket(carNumbers, onUpdate); // enabled 누락
return () => websocket.unsubscribe(); // disconnect 누락

// ✅ Good
useMultipleCarWebSocket(carNumbers, onUpdate, carNumbers.length > 0);
return () => {
  websocket.unsubscribe();
  websocket.disconnect();
};
```

## 효과

- ✅ 메모리 누수 방지
- ✅ 불필요한 연결 제거
- ✅ 자동 재연결
- ✅ React 표준 패턴

---

**관련 파일:** `src/services/websocket-service.ts`, `src/app/page.tsx`, `src/app/detail/page.tsx`
````

### 시나리오 2: Detail 페이지 → Search 페이지

```
1. Detail 페이지에서 "취소" 버튼 클릭
   → navigate('/search') 실행
   → Detail 페이지 cleanup:
     - singleCarWebSocket.disconnect() ✅

2. Search 페이지 접속 (WebSocket 사용 안함)
   → 기존 WebSocket 연결 완전히 종료 상태 ✅
```

### 시나리오 3: 운행 → 대기 상태 변경

```
1. Detail 페이지에서 차량이 "운행" 상태
   → useSingleCarWebSocket(carNumber, onUpdate, true)
   → WebSocket 연결됨

2. 차량 상태가 "대기"로 변경
   → useSingleCarWebSocket(carNumber, onUpdate, false) ✅
   → useWebSocket({ url: '' }) 실행
   → 기존 연결이 cleanup으로 종료됨

3. 차량 상태가 다시 "운행"으로 변경
   → useSingleCarWebSocket(carNumber, onUpdate, true)
   → WebSocket 재연결 ✅
```

## 기술 스택

### React useEffect Cleanup

```typescript
useEffect(() => {
  // Setup
  doSomething();

  return () => {
    // ✅ Cleanup: 컴포넌트가 unmount되거나 dependencies 변경 시 실행
    cleanup();
  };
}, [dependencies]);
```

### useWebSocket 내부 Cleanup

```typescript
// lib/use-websocket.ts
export function useWebSocket(options: UseWebSocketOptions) {
  useEffect(() => {
    connect();

    return () => {
      shouldReconnectRef.current = false; // 재연결 방지

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current); // 타임아웃 정리
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current); // 하트비트 정리
      }

      if (socket) {
        socket.close(); // ✅ WebSocket 연결 종료
      }
    };
  }, []);

  // ...
}
```

## 디버깅 팁

### 개발 모드 로그 확인

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('메인 페이지 unmount: 다중 차량 WebSocket 연결 종료');
}
```

브라우저 콘솔에서 다음 로그를 확인:

- `"메인 페이지 unmount: 다중 차량 WebSocket 연결 종료"`
- `"Detail 페이지 unmount: 차량 XX가XX WebSocket 연결 종료"`

### Chrome DevTools Network 탭

1. **Network 탭** 열기
2. **WS (WebSocket)** 필터 선택
3. 페이지 이동 시 연결 상태 확인:
   - **빨간색 (Closed)**: 정상적으로 종료됨 ✅
   - **회색 (Pending)**: 연결 대기 중
   - **녹색 (Connected)**: 활성 연결

### React DevTools Profiler

1. **Profiler** 탭 열기
2. **Record** 시작
3. 페이지 이동 수행
4. Cleanup이 실행되는지 확인 (useEffect cleanup)

## 주의사항

### 1. enabled 파라미터 필수

```typescript
// ❌ Bad: enabled 없이 항상 연결
useMultipleCarWebSocket(carNumbers, onUpdate);

// ✅ Good: 조건부 연결
useMultipleCarWebSocket(carNumbers, onUpdate, carNumbers.length > 0);
```

### 2. disconnect() 필수 호출

```typescript
// ❌ Bad: unsubscribe만 호출
return () => {
  websocket.unsubscribe();
};

// ✅ Good: disconnect까지 호출
return () => {
  websocket.unsubscribe();
  websocket.disconnect(); // 필수!
};
```

### 3. useEffect Dependencies 정확히 지정

```typescript
// ❌ Bad: 의존성 누락
useEffect(() => {
  if (websocket.isConnected) {
    websocket.subscribe();
  }
}, []); // websocket.isConnected 누락!

// ✅ Good: 모든 의존성 포함
useEffect(() => {
  if (websocket.isConnected) {
    websocket.subscribe();
  }
  return () => websocket.disconnect();
}, [websocket.isConnected]); // 의존성 명시
```

## 성능 최적화

### 1. 불필요한 재연결 방지

```typescript
// enabled가 false일 때는 url을 빈 문자열로 설정
const websocket = useWebSocket({
  url: enabled ? WEBSOCKET_URL : '', // ✅ 빈 문자열 = 연결 안함
});
```

### 2. 구독 중복 방지

```typescript
const subscribedRef = useRef(false);

const subscribe = () => {
  if (!subscribedRef.current) {
    // ✅ 중복 구독 방지
    websocket.sendMessage({ type: 'subscribe' });
    subscribedRef.current = true;
  }
};
```

### 3. Token Bucket + Cleanup 조합

- **Token Bucket**: 연결 중일 때 메시지 빈도 제한
- **Cleanup**: 페이지 이동 시 연결 완전히 종료

```
[페이지 접속] → [Token Bucket으로 rate limiting] → [페이지 이동] → [Cleanup으로 연결 종료] ✅
```

## 테스트 체크리스트

- [ ] 메인 페이지 접속 → WebSocket 연결됨
- [ ] Detail 페이지로 이동 → 메인 WebSocket 종료됨
- [ ] Detail 페이지 접속 → 단일 차량 WebSocket 연결됨
- [ ] 메인 페이지로 복귀 → Detail WebSocket 종료됨
- [ ] 메인 페이지로 복귀 → 다중 차량 WebSocket 재연결됨 ✅
- [ ] Chrome DevTools에서 WebSocket 연결 상태 확인
- [ ] 콘솔에서 "unmount" 로그 확인
- [ ] 중복 구독/연결이 발생하지 않음

## 결론

이 생명주기 관리 시스템으로:

1. ✅ **메모리 누수 방지**: 페이지 이동 시 WebSocket 자동 정리
2. ✅ **성능 최적화**: 불필요한 연결 유지하지 않음
3. ✅ **자동 재연결**: 페이지 재방문 시 자동으로 재연결
4. ✅ **개발자 경험**: 명확한 로그와 디버깅 가능
5. ✅ **유지보수성**: React의 표준 패턴(useEffect cleanup) 사용

---

**작성일**: 2025년 10월 8일  
**마지막 수정**: 2025년 10월 8일  
**관련 파일**:

- `src/services/websocket-service.ts`
- `src/app/page.tsx`
- `src/app/detail/page.tsx`
- `src/lib/use-websocket.ts`
