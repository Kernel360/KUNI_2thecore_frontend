# 백엔드 API 명세서

## 서버 정보

- **차량 전체**: Port 8080
- **애뮬레이터**: Port 8081
- **WebSocket**: Port 8082

## 공통 Request Header

```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pblVzZXIxIiwicm9sZXMiOlsiQURNSU4iLCJVU0VSIl0sImlhdCI6MTY3ODkwNTYwMCwiZXhwIjoxNjc4OTA5MjAwfQ.some_very_long_jwt_string
```

## 공통 응답 포맷

### 성공 응답

- **200 OK**: 요청 성공 (가장 일반적)
- **201 Created**: 리소스가 성공적으로 생성됨 (POST 요청 시)
- **204 No Content**: 요청은 성공했지만 응답 본문에 보낼 내용이 없음 (DELETE 요청 시)

### 오류 응답

```json
{
  "result": false,
  "message": "에러에 대한 설명 메세지",
  "data": null
}
```

#### 오류 상태 코드

- **400 Bad Request**: 클라이언트 요청이 잘못됨 (유효성 검사 실패 등)
- **401 Unauthorized**: 인증되지 않은 요청 (유효한 인증 자격 증명이 없음)
- **403 Forbidden**: 인증되었지만 해당 리소스에 접근할 권한이 없음
- **404 Not Found**: 요청한 리소스를 찾을 수 없음
- **409 Conflict**: 리소스 상태가 요청과 충돌함 (예: 중복된 ID로 회원가입 시도)
- **500 Internal Server Error**: 서버 내부 오류
- **503 Service Unavailable**: 서버가 일시적으로 요청을 처리할 수 없음

## API 목록

### 1. 회원 관련 API

#### 1.1 회원가입

- **Method**: POST
- **Path**: `/api/admin/signup`
- **상태**: 완료

#### 1.2 회원 정보 수정

- **Method**: PUT
- **Path**: `/api/admin/{loginId}`
- **상태**: 완료

#### 1.3 회원 삭제

- **Method**: DELETE
- **Path**: `/api/admin/{loginId}`
- **상태**: 완료

#### 1.4 로그인

- **Method**: POST
- **Path**: `/api/auth/login`
- **상태**: 완료

#### 1.5 로그아웃

- **Method**: POST
- **Path**: `/api/auth/logout`
- **상태**: 완료

#### 1.6 리프레시 토큰 검증

- **Method**: POST
- **Path**: `/api/auth/refresh`
- **상태**: 완료

### 2. 차량 관련 API

#### 2.1 차량 등록

- **Method**: POST
- **Path**: `/api/cars`
- **상태**: 완료

#### 2.2 차량 정보 수정

- **Method**: PATCH
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료

#### 2.3 차량 삭제

- **Method**: DELETE
- **Path**: `/api/cars/{car_number}`
- **Request**:

```json
{
  // CarDeleteDto - 모두 필수!!
  "brand": "string",
  "model": "string",
  "carNumber": "string"
}
```

- **Response (성공)**:

```json
{
  "result": true,
  "message": "차량 삭제가 성공적으로 완료되었습니다.",
  "data": {
    "brand": "현대",
    "model": "아반떼",
    "car_number": "12가1598"
  }
}
```

- **Response (실패 - 404)**:

```json
{
  "result": false,
  "message": "해당 차량 ( 12가3456 )은 존재하지 않습니다. 다시 입력해주세요",
  "data": null
}
```

- **상태**: 완료

#### 2.4 차량 전체 조회

- **Method**: GET
- **Path**: `/api/cars`
- **상태**: 완료

#### 2.5 차량 상세 조회

- **Method**: GET
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료

#### 2.6 차량 검색

- **Method**: GET
- **Path**: `/api/cars/search`
- **상태**: 완료

#### 2.7 차량 상태 조회

- **Method**: GET
- **Path**: `/api/cars/status`
- **상태**: 완료

#### 2.8 대시보드 차량 통계 조회

- **Method**: GET
- **Path**: `/api/cars/statistics`
- **상태**: 완료

### 3. 로그 관련 API

#### 3.1 차량 주행 기록 조회

- **Method**: GET
- **Path**: `/api/logs`
- **상태**: 완료

#### 3.2 특정 차량 운행 정보

- **Method**: GET
- **Path**: `/api/logs/{car_number}`
- **상태**: 완료

#### 3.3 시동 로그

- **Method**: POST
- **Path**: `/api/logs/power`
- **설명**: 애뮬레이터 전원 ON/OFF 로그 및 GPS 정보를 서버로 전송하는 API
- **상태**: 진행 중

#### 3.4 GPS 로그 수신 (프론트 사용 X)

- **Method**: POST
- **Path**: `/api/logs/gps`
- **설명**: 애뮬레이터에서 보낸 GPS 좌표 리스트를 서버에 저장
- **상태**: 완료

### 4. 애뮬레이터 관련 API

#### 4.1 애뮬레이터 등록

- **Method**: POST
- **Path**: `/api/emulators`
- **상태**: 완료

#### 4.2 애뮬레이터 상세 조회

- **Method**: GET
- **Path**: `/api/emulators/{device_id}`
- **상태**: 완료

#### 4.3 애뮬레이터 전체 조회

- **Method**: GET
- **Path**: `/api/emulators`
- **상태**: 완료

#### 4.4 애뮬레이터 수정

- **Method**: PATCH
- **Path**: `/api/emulators/{emulator_id}`
- **설명**: 애뮬레이터에 연결된 차량 id를 수정
- **상태**: 완료

#### 4.5 애뮬레이터 삭제

- **Method**: DELETE
- **Path**: `/api/emulators/{emulator_id}`
- **상태**: 완료

### 5. 지도 관련 API

#### 5.1 운행 중인 차량 실시간 위치

- **Method**: GET (WebSocket)
- **Path**: `ws/map/running`
- **설명**: 운행 중인 차량 위도 경도를 통해 지도 위에서 조회
- **상태**: 완료
- **request**: "Websocket 연결을 위한 header만 필요합니다

GET /map/running HTTP/1.1
Host: hub-server-address.com:8082
Authorization: Bearer
eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoidXNlcjEyMyIsImlhdCI6MTY5MDY5OTIwMCwiZXhwIjoxNjkwNzAzODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf3
6POk6yJV_adQssw5c
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13"

- **response**:"
  websocket으로 보내는 JSON 메시지
  {
  "loginId": "string",
  "carNumber": "string",
  "logList": [
  {
  "latitude": "string",
  "longitude": "string",
  "timestamp": "datetime"
  },
  ...
  ]
  }
  "

#### 5.2 차량 주행 경로를 위한 정보 조회

- **Method**: GET
- **Path**: `/api/map/route`
- **설명**: 주행 경로 표시를 위한 정보 조회
- **상태**: 시작 전
