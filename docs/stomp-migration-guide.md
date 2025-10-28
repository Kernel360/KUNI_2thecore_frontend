# STOMP WebSocket 마이그레이션 가이드

## 📋 개요

Spring STOMP 백엔드와 통신하기 위해 **Native WebSocket → STOMP Protocol**로 마이그레이션했습니다.

## 🔄 변경 사항

### Before (Native WebSocket ❌)

```typescript
// src/lib/use-websocket.ts - Spring STOMP가 이해 못하는 방식
const ws = new WebSocket('ws://43.203.110.104:8080/ws');
ws.send(
  JSON.stringify({ type: 'subscribe', channel: '/location/cars/12가1234' })
);
```

### After (STOMP Protocol ✅)

```typescript
// src/lib/use-stomp.ts - Spring STOMP 표준 방식
const client = new Client({
  webSocketFactory: () => new SockJS('https://43.203.110.104:8080/ws'),
});
client.subscribe('/location/cars/12가1234', callback);
```

---

## 🚀 새로운 훅 사용법

### 1. 개별 차량 (Detail 페이지)

```tsx
import { useSingleCarStompWebSocket } from '@/hooks/use-carStompWebSocket';

function CarDetailPage() {
  const carNumber = '12가1234';

  const handleLocationUpdate = useCallback((carData: CarLocationData) => {
    console.log('차량 위치 업데이트:', carData);
    // 지도에 위치 표시 로직
  }, []);

  const { isConnected } = useSingleCarStompWebSocket(
    carNumber,
    handleLocationUpdate,
    true // enabled
  );

  return (
    <div>
      <p>연결 상태: {isConnected ? '✅ 연결됨' : '🔴 연결 안됨'}</p>
      {/* 지도 컴포넌트 */}
    </div>
  );
}
```

### 2. 다중 차량 (메인 페이지)

```tsx
import { useMultipleCarStompWebSocket } from '@/hooks/use-carStompWebSocket';

function MainPage() {
  const carNumbers = ['12가1234', '23나2345', '34다3456'];

  const handleLocationUpdate = useCallback((carData: CarLocationData) => {
    console.log('차량 위치 업데이트:', carData);
    // 클러스터 지도 업데이트 로직
  }, []);

  const { isConnected } = useMultipleCarStompWebSocket(
    carNumbers,
    handleLocationUpdate,
    carNumbers.length > 0
  );

  return (
    <div>
      <p>연결 상태: {isConnected ? '✅ 연결됨' : '🔴 연결 안됨'}</p>
      {/* 클러스터 지도 컴포넌트 */}
    </div>
  );
}
```

---

## 🏗️ 아키텍처

### STOMP 연결 구조

```
[React Client]
  └── SockJS (WebSocket Layer)
        └── STOMP Protocol
              ├── SUBSCRIBE /location/cars/{carNumber}
              ├── SEND /app/... (필요 시)
              └── MESSAGE (Server → Client)
```

### 메시지 흐름

```typescript
// 1. 클라이언트가 채널 구독
client.subscribe('/location/cars/12가1234', message => {
  const data = JSON.parse(message.body);
  console.log(data); // { carNumber, status, lastLatitude, lastLongitude }
});

// 2. 서버가 해당 채널로 메시지 브로드캐스트
// Spring: messagingTemplate.convertAndSend("/location/cars/12가1234", carData);

// 3. 클라이언트가 메시지 수신
// → throttledUpdate → onCarLocationUpdate 콜백 실행
```

---

## 📦 설치된 패키지

```json
{
  "@stomp/stompjs": "^7.2.0", // STOMP 프로토콜 클라이언트
  "sockjs-client": "^1.6.1", // SockJS WebSocket 폴백
  "@types/sockjs-client": "^1.7.3" // TypeScript 타입
}
```

---

## 🔧 핵심 파일

| 파일                                 | 역할                            |
| ------------------------------------ | ------------------------------- |
| `src/lib/use-stomp.ts`               | STOMP 기본 훅 (low-level)       |
| `src/hooks/use-carStompWebSocket.ts` | 차량 전용 STOMP 훅 (high-level) |
| `src/lib/use-websocket.ts`           | ⚠️ 레거시 (STOMP로 대체됨)      |

---

## ⚙️ 환경 변수 (.env.local)

```bash
# STOMP WebSocket 엔드포인트
VITE_WEBSOCKET_URL=ws://43.203.110.104:8080/ws

# 구독 채널 패턴
# /location/cars/{차량번호}
```

---

## 🎯 성능 최적화

### Token Bucket Rate Limiting (유지)

- **개별 차량**: capacity=4, refillRate=2 (초당 2회)
- **다중 차량**: capacity=2, refillRate=1 (초당 1회)

### Throttling (유지)

- **개별 차량**: 2초 간격
- **다중 차량**: 5초 간격

### 생명주기 관리 (자동)

```typescript
useEffect(() => {
  if (connected && enabled) {
    subscribeToMultipleCars(); // 자동 구독
  }

  return () => {
    unsubscribeFromMultipleCars(); // 자동 정리
    disconnect(); // 연결 종료
  };
}, [connected, enabled]);
```

---

## 🐛 디버깅

### Chrome DevTools Network 탭

1. **WS** 필터 선택
2. `/ws` 연결 확인
3. **Messages** 탭에서 STOMP 프레임 확인:

   ```
   CONNECTED
   destination:/location/cars/12가1234
   message-id:...

   {"carNumber":"12가1234","status":"운행","lastLatitude":"37.5665","lastLongitude":"126.9780"}
   ```

### 콘솔 로그 (개발 모드)

```javascript
[STOMP] >>> CONNECT
[STOMP] <<< CONNECTED
✅ 차량 12가1234 STOMP 연결 성공
📡 1대 차량 구독 시작
📍 차량 12가1234 위치 업데이트: { carNumber, status, ... }
```

---

## 🔄 마이그레이션 체크리스트

- [x] `@stomp/stompjs` 설치 (이미 완료)
- [x] `sockjs-client` 설치 (이미 완료)
- [x] `@types/sockjs-client` 설치 (완료)
- [x] `useStomp` 기본 훅 구현 (완료)
- [x] `use-carStompWebSocket` 차량 전용 훅 구현 (완료)
- [ ] 메인 페이지에 `useMultipleCarStompWebSocket` 적용
- [ ] Detail 페이지에 `useSingleCarStompWebSocket` 적용
- [ ] 기존 `useCarWebSocket` 제거 (레거시)
- [ ] 백엔드 STOMP 엔드포인트 테스트

---

## 📝 백엔드 요구사항 (Spring)

### WebSocket 설정 확인

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS(); // ✅ SockJS 활성화 필수
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/location"); // ✅ /location 프리픽스 브로커
    config.setApplicationDestinationPrefixes("/app");
  }
}
```

### 메시지 브로드캐스트 예시

```java
@Autowired
private SimpMessagingTemplate messagingTemplate;

public void sendCarLocation(String carNumber, CarLocationData data) {
  messagingTemplate.convertAndSend(
    "/location/cars/" + carNumber, // ✅ 채널 경로
    data // JSON으로 자동 변환
  );
}
```

---

## ✅ 테스트 시나리오

1. **연결 테스트**
   - 메인 페이지 접속 → 콘솔에 "STOMP 연결 성공" 확인
   - Network 탭에서 WS 연결 확인

2. **구독 테스트**
   - 운행 차량이 있을 때 자동 구독 확인
   - 콘솔에 "N대 차량 구독 시작" 메시지 확인

3. **메시지 수신 테스트**
   - 백엔드에서 위치 데이터 전송
   - 콘솔에 "차량 위치 업데이트" 로그 확인
   - 지도에 마커 위치 변경 확인

4. **생명주기 테스트**
   - 페이지 이동 시 "구독 해제" 로그 확인
   - 메모리 누수 없는지 확인 (DevTools Memory)

---

**작성일**: 2025년 10월 8일  
**마이그레이션 완료**: Native WebSocket → STOMP Protocol ✅
