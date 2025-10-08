# WebSocket 구현 가이드 - KUNI 2theCore Frontend

## 📋 개요

이 문서는 기존 axios(polling) 방식에서 WebSocket 실시간 통신으로 전환하는 방법을 설명합니다.

## 🔧 구현된 기능

### 1. **WebSocket 커스텀 훅** (`src/lib/use-websocket.ts`)

- ✅ 자동 재연결 (5회 시도, 3초 간격)
- ✅ 하트비트 (30초마다 ping)
- ✅ TypeScript 완전 지원
- ✅ 메모리 누수 방지 (cleanup)
- ✅ JSON 메시지 자동 파싱

### 2. **프로젝트 특화 WebSocket 서비스** (`src/services/websocket-service.ts`)

- ✅ JWT 토큰 자동 처리 (TokenManager 연동)
- ✅ 차량 위치 데이터 타입 정의
- ✅ 한국어 에러 로깅
- ✅ 구독/구독해제 기능

### 3. **Map 컴포넌트 WebSocket 통합** (`src/components/map/map.tsx`)

- ✅ `useWebSocket` prop 추가
- ✅ WebSocket 사용 시 polling 자동 비활성화
- ✅ 실시간 차량 위치 업데이트
- ✅ 기존 REST API와 호환성 유지

## 🚀 사용 방법

### **메인 페이지에서 WebSocket 활성화**

```tsx
// src/app/page.tsx
<CarClustererMap
  width="100%"
  height="100%"
  carStatusFilter={carStatusFilter}
  onOpenModal={() => setIsMapModalOpen(true)}
  // useWebSocket={true} // 이미 CarClustererMap에서 활성화됨
/>
```

### **개별 컴포넌트에서 사용**

```tsx
import { useCarLocationWebSocket } from '@/services/websocket-service';

function MyComponent() {
  const handleCarUpdate = useCallback(cars => {
    console.log('실시간 차량 위치:', cars);
  }, []);

  const ws = useCarLocationWebSocket(handleCarUpdate, true);

  return (
    <div>
      <p>연결 상태: {ws.connectionStatus}</p>
      <p>연결됨: {ws.isConnected ? '✅' : '❌'}</p>
    </div>
  );
}
```

## 🔀 전환 방법

### **1단계: 환경변수 설정**

```env
# .env.local
VITE_WEBSOCKET_URL=ws://43.203.110.104:8080/ws/map/running
```

### **2단계: 기존 컴포넌트 수정**

```tsx
// 기존 (polling)
<Map enableAutoRefresh={true} />

// 새로운 (WebSocket)
<Map enableAutoRefresh={true} useWebSocket={true} />
```

### **3단계: 점진적 전환**

- 기본값: `useWebSocket={false}` (기존 방식 유지)
- 테스트: `useWebSocket={true}` (WebSocket 방식)
- 백엔드 준비 완료 후 전체 전환

## 🏗️ 백엔드 요구사항

### **WebSocket 엔드포인트**

```
ws://43.203.110.104:8080/ws/map/running
```

### **메시지 형식**

```json
// 클라이언트 → 서버 (구독)
{
  "type": "subscribe",
  "topic": "car_locations"
}

// 서버 → 클라이언트 (차량 위치 업데이트)
{
  "type": "car_location_update",
  "data": [
    {
      "carNumber": "12가1234",
      "status": "운행",
      "lastLatitude": "37.5665",
      "lastLongitude": "126.9780",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}

// 하트비트
{
  "type": "ping"
}
```

### **JWT 인증**

- WebSocket 연결 시 `Authorization` 헤더 또는
- 연결 후 첫 번째 메시지로 JWT 토큰 전송

## 🐛 디버깅 가이드

### **연결 상태 확인**

```tsx
const ws = useCarLocationWebSocket(handleUpdate, true);
console.log('WebSocket 상태:', ws.connectionStatus);
console.log('연결 여부:', ws.isConnected);
```

### **네트워크 탭에서 확인**

1. 브라우저 개발자 도구 → Network 탭
2. WS 필터 활성화
3. WebSocket 연결 및 메시지 흐름 확인

### **일반적인 문제들**

**연결 실패:**

```bash
# CORS 정책 확인
# 백엔드에서 WebSocket CORS 허용 필요

# 방화벽 확인
# 8080 포트가 WebSocket을 지원하는지 확인
```

**JWT 인증 실패:**

```typescript
// TokenManager.getAccessToken()이 null인 경우
// 로그인 상태 확인 필요
```

## 📊 성능 비교

| 방식          | 지연시간 | 서버 부하 | 배터리 소모 | 실시간성 |
| ------------- | -------- | --------- | ----------- | -------- |
| Polling (3초) | ~3초     | 높음      | 높음        | 낮음     |
| WebSocket     | ~100ms   | 낮음      | 낮음        | 높음     |

## 🔄 롤백 방법

WebSocket에 문제가 있을 경우 즉시 롤백 가능:

```tsx
// 긴급 롤백
<Map
  enableAutoRefresh={true}
  useWebSocket={false} // false로 변경만 하면 됨
/>
```

## ✅ 체크리스트

### **프론트엔드**

- [x] `use-websocket.ts` 구현
- [x] `websocket-service.ts` 구현
- [x] Map 컴포넌트 WebSocket 지원
- [x] CarClustererMap WebSocket 활성화
- [x] 환경변수 설정

### **백엔드** (구현 필요)

- [ ] WebSocket 서버 구현
- [ ] `/ws/map/running` 엔드포인트
- [ ] JWT 인증 지원
- [ ] 실시간 차량 위치 브로드캐스트
- [ ] 하트비트 응답

### **테스트**

- [ ] WebSocket 연결 테스트
- [ ] 실시간 데이터 수신 테스트
- [ ] 재연결 로직 테스트
- [ ] JWT 토큰 갱신 테스트
- [ ] 성능 비교 테스트

## 🎯 다음 단계

1. **백엔드 WebSocket 서버 구현** 요청
2. **테스트 환경에서 WebSocket 연결** 확인
3. **실시간 데이터 흐름** 검증
4. **프로덕션 환경 배포** 계획
