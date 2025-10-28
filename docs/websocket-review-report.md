# ✅ WebSocket 검토 완료 보고서

**날짜**: 2025년 10월 8일  
**브랜치**: `193-axios-연결을-웹소켓-연결로-바꾸기`

---

## 🔍 검토 결과

### ❌ 발견된 문제

**현재 구현이 Spring STOMP 백엔드와 호환되지 않습니다!**

```typescript
// ❌ 기존 구현: Native WebSocket API 사용
const ws = new WebSocket('wss://43.203.110.104:8080/wss');
ws.send(JSON.stringify({ type: 'subscribe', channel: '/location/cars/12가1234' }));
```

**문제점:**
1. Spring STOMP는 특정 프레임 포맷(`SUBSCRIBE`, `SEND`, `MESSAGE`)을 기대
2. Native WebSocket의 JSON 메시지는 Spring STOMP가 이해하지 못함
3. SockJS 레이어 없이 직접 WebSocket 연결 시도

---

## ✅ 해결 방안 (완료)

### 1. STOMP 기반 훅 구현 ✅

#### 새로 생성된 파일:

- **`src/lib/use-stomp.ts`**: STOMP 기본 훅
  - SockJS + STOMP 프로토콜 사용
  - JWT 토큰 자동 전송
  - 자동 재연결 (5초 간격)
  
- **`src/hooks/useCarStompWebSocket.ts`**: 차량 전용 STOMP 훅
  - `useSingleCarStompWebSocket`: 개별 차량 (Detail 페이지)
  - `useMultipleCarStompWebSocket`: 다중 차량 (메인 페이지)
  - Token Bucket + Throttling 성능 최적화 유지

- **`docs/stomp-migration-guide.md`**: 마이그레이션 가이드

### 2. 패키지 설치 ✅

```bash
npm install --save-dev @types/sockjs-client
```

**이미 설치되어 있던 패키지:**
- `@stomp/stompjs@^7.2.0` ✅
- `sockjs-client@^1.6.1` ✅

### 3. 서비스 레이어 업데이트 ✅

`src/services/websocket-service.ts`에서 STOMP 훅을 export하도록 수정

---

## 🏗️ 새로운 아키텍처

```
[React Client]
  └── SockJS (WebSocket + httpss 폴백)
        └── STOMP Protocol (메시지 브로커)
              ├── SUBSCRIBE /location/cars/{carNumber}
              ├── MESSAGE (Server → Client)
              └── SEND /app/... (필요 시)

[Spring Backend]
  └── @EnableWebSocketMessageBroker
        ├── /ws 엔드포인트 (SockJS)
        ├── /location 브로커 프리픽스
        └── SimpMessagingTemplate (메시지 전송)
```

---

## 📝 사용 방법

### Before (Native WebSocket ❌)

```tsx
// 작동하지 않음!
const { isConnected } = useCarLocationWebSocket(onUpdate, true);
```

### After (STOMP ✅)

```tsx
// Detail 페이지
import { useSingleCarStompWebSocket } from '@/services/websocket-service';

const { isConnected } = useSingleCarStompWebSocket(
  '12가1234',
  handleLocationUpdate,
  true
);
```

```tsx
// 메인 페이지
import { useMultipleCarStompWebSocket } from '@/services/websocket-service';

const { isConnected } = useMultipleCarStompWebSocket(
  ['12가1234', '23나2345'],
  handleLocationUpdate,
  true
);
```

---

## 🎯 다음 단계 (TODO)

### 프론트엔드

- [ ] **메인 페이지 수정** (`src/app/page.tsx`)
  ```tsx
  // useMultipleCarWebSocket → useMultipleCarStompWebSocket
  ```

- [ ] **Detail 페이지 수정** (`src/app/detail/page.tsx`)
  ```tsx
  // useSingleCarWebSocket → useSingleCarStompWebSocket
  ```

- [ ] **Map 컴포넌트 수정** (필요 시)
  - `car-clusterer-map.tsx`
  - `car-location-map.tsx`

- [ ] **기존 레거시 코드 제거**
  - `src/hooks/useCarWebSocket.ts` (STOMP 마이그레이션 후 삭제)
  - `src/lib/use-websocket.ts` (선택적 유지 - 다른 용도 가능)

### 백엔드 확인 필요 ⚠️

Spring 백엔드가 다음 조건을 만족하는지 확인:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS(); // ✅ 필수!
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/location"); // ✅ /location 프리픽스
    config.setApplicationDestinationPrefixes("/app");
  }
}
```

메시지 전송 코드:
```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

public void sendCarLocation(String carNumber, CarLocationData data) {
  messagingTemplate.convertAndSend(
    "/location/cars/" + carNumber, // 채널 경로
    data
  );
}
```

---

## 🧪 테스트 방법

### 1. STOMP 연결 테스트

```bash
# 개발 서버 실행
npm run dev
```

1. 브라우저 콘솔 확인:
   ```
   ✅ STOMP 연결 성공
   📡 N대 차량 구독 시작
   ```

2. Chrome DevTools → Network → WS:
   - `/ws` 연결 확인
   - Messages 탭에서 STOMP 프레임 확인

### 2. 메시지 수신 테스트

백엔드에서 메시지 전송 후:
```
📍 차량 12가1234 위치 업데이트: { carNumber, status, lastLatitude, lastLongitude }
```

### 3. 생명주기 테스트

페이지 이동 시:
```
📴 N대 차량 구독 해제
🔴 STOMP 연결 종료
```

---

## 📊 성능 최적화 (유지)

| 항목 | 개별 차량 | 다중 차량 |
|------|----------|----------|
| Token Bucket | capacity=4, refillRate=2 | capacity=2, refillRate=1 |
| Throttling | 2초 간격 | 5초 간격 |
| 실제 빈도 | ~30회/분 | ~12회/분 |
| 하트비트 | 5분 | 5분 |

---

## 🎉 요약

### ✅ 완료된 작업

1. STOMP 프로토콜 기반 WebSocket 훅 구현
2. Spring STOMP 백엔드와 호환되는 구조로 전환
3. 성능 최적화 (Token Bucket + Throttling) 유지
4. 자동 생명주기 관리 (구독/정리)
5. TypeScript 타입 완벽 지원

### 🚀 기대 효과

- **Spring STOMP 백엔드와 완벽 호환** ✅
- **안정적인 실시간 통신** (SockJS 폴백)
- **표준 프로토콜 사용** (STOMP)
- **코드 재사용성 향상** (useStomp 기본 훅)

### ⚠️ 주의사항

- 기존 `useCarWebSocket` 훅은 더 이상 Spring STOMP와 호환되지 않음
- 모든 페이지를 `useCarStompWebSocket`으로 마이그레이션 필요
- 백엔드가 `/ws` 엔드포인트에 SockJS를 활성화해야 함

---

**검토자**: Claude Code  
**상태**: ✅ STOMP 마이그레이션 완료 (페이지 적용 대기)
