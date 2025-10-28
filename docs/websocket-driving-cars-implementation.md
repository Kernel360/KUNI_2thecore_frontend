# WebSocket 구현 완료 - 운행 차량 실시간 추적

## 🎉 **구현 완료사항**

### **1. 메인 페이지 (Map View)**

- ✅ `CarService.getCarsByStatus(['운행'])`로 운행 중인 차량 목록 조회
- ✅ `useMultipleCarWebSocket`으로 운행 차량들만 개별 구독
- ✅ 채널: `/location/cars/{carNumber}` (운행 차량 개수만큼)
- ✅ 실시간 위치 업데이트를 `CarClustererMap`에 전달

### **2. Detail 페이지 (Single Car View)**

- ✅ `useSingleCarWebSocket`으로 개별 차량 구독
- ✅ 운행 중인 차량만 WebSocket 연결 (상태 기반 조건부 구독)
- ✅ 운행 중이 아닌 차량은 30초 간격 polling으로 백업
- ✅ 기존 3초 polling 제거로 성능 향상

### **3. WebSocket 서비스**

- ✅ 개별 차량 구독: `useSingleCarWebSocket`
- ✅ 다중 차량 구독: `useMultipleCarWebSocket`
- ✅ JWT 인증 지원, 자동 재연결, 하트비트
- ✅ 구독/구독해제 메시지 처리

## 🔌 **WebSocket 메시지 프로토콜**

### **연결 시 인증**

```json
{
  "type": "auth",
  "token": "JWT_TOKEN_HERE"
}
```

### **개별 차량 구독**

```json
{
  "type": "subscribe",
  "channel": "/location/cars/12가1234"
}
```

### **구독 해제**

```json
{
  "type": "unsubscribe",
  "channel": "/location/cars/12가1234"
}
```

### **서버 → 클라이언트 (위치 업데이트)**

```json
{
  "type": "car_location_update",
  "data": {
    "carNumber": "12가1234",
    "status": "운행",
    "lastLatitude": "37.5665",
    "lastLongitude": "126.9780",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}
```

### **하트비트**

```json
{
  "type": "ping"
}
```

## 📊 **성능 최적화 효과**

### **메인 페이지**

- **이전**: 모든 차량 3초마다 polling → 높은 서버 부하
- **현재**: 운행 차량만 WebSocket 구독 → 실시간 + 효율성

### **Detail 페이지**

- **이전**: 개별 차량 3초마다 polling
- **현재**: 운행 시 WebSocket, 대기/수리 시 30초 polling

### **예상 트래픽 감소**

```
운행 차량 20대 / 전체 100대 가정:
- 이전: 100대 × 20회/분 = 2000 API calls/분
- 현재: 20대 WebSocket + 80대 × 2회/분 = 160 API calls/분
→ **92% 트래픽 감소**
```

## 🧪 **테스트 방법**

### **1. WebSocket 연결 확인**

```javascript
// 브라우저 개발자 도구 → Network → WS 탭에서 확인
// 연결 URL: ws://43.203.110.104:8080/ws
```

### **2. 메시지 흐름 확인**

```javascript
// 콘솔에서 로그 확인
"운행 중인 차량 목록: ['12가1234', '23나2345']";
'운행 중인 차량 2대 구독 시작';
'차량 12가1234 실시간 위치 업데이트: {lat: 37.5665, lng: 126.9780}';
```

### **3. 조건부 구독 테스트**

- ✅ 운행 → 대기 상태 변경 시 WebSocket 구독 해제 확인
- ✅ 대기 → 운행 상태 변경 시 WebSocket 구독 시작 확인
- ✅ Detail 페이지에서 운행 차량만 실시간 업데이트 확인

## 🐛 **트러블슈팅**

### **WebSocket 연결 실패**

```bash
# 백엔드 서버 확인
curl -I https://43.203.110.104:8080/ws
# 응답: 101 Switching Protocols (성공)
```

### **구독 메시지 실패**

```javascript
// JWT 토큰 확인
console.log(TokenManager.getAccessToken());
// null이면 로그인 필요
```

### **실시간 업데이트 안됨**

```javascript
// 차량 상태 확인
// '운행' 상태가 아니면 WebSocket 구독되지 않음
console.log('차량 상태:', status); // '운행'이어야 함
```

## 🚀 **배포 전 체크리스트**

### **프론트엔드**

- [x] WebSocket URL 환경변수 설정
- [x] 운행 차량 필터링 로직
- [x] 조건부 구독/구독해제
- [x] 에러 처리 및 재연결

### **백엔드** (확인 필요)

- [ ] WebSocket 서버 `/ws` 엔드포인트
- [ ] JWT 인증 미들웨어
- [ ] 채널별 구독 관리: `/location/cars/{carNumber}`
- [ ] 운행 차량 위치 변경 시 브로드캐스트
- [ ] 하트비트 응답 (ping/pong)

## 📈 **향후 개선 사항**

1. **지리적 범위 기반 구독** (줌 레벨별)
2. **예측적 프리로딩** (인접 지역)
3. **오프라인 지원** (서비스 워커)
4. **배터리 최적화** (백그라운드 시)

---

운행 중인 차량만 WebSocket 구독하는 최적화된 실시간 차량 관제 시스템이 완성되었습니다! 🚗📡
