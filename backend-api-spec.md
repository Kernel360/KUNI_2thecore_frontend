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
- **request**:{// header에는
  brand,
  model,
  carYear,
  carType,
  carNumber,
  sumDist
  }
- **response**:{
  "result": boolean,
  "message": String,
  "data": {
  "brand": String,
  "model": String,
  "car_year": Integer,
  "status": String,
  "car_type": String,
  "car_number": String,
  "sum_dist": double
  }
  }
- **response example**:{
  "result": true,
  "message": "차량 등록이 성공적으로 완료되었습니다.",
  "data": {
  "brand": "현대",
  "model": "아반떼",
  "car_year": 2025,
  "status": "대기", // 초기 값은 "대기" - "운행", "대기", "수리"
  "car_type": "중형",
  "car_number": "12가1598",
  "sum_dist": 12345.67
  }
  }

#### 2.2 차량 정보 수정

- **Method**: PATCH
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료
- **request**:{
  brand,
  model,
  carYear,
  carType,
  status, // 상태: "운행", "대기", "수리" 중 1
  carNumber,
  sumDist
  }
- **response**:
  {
  "result": boolean,
  "message": String,
  "data": {
  "brand": String,
  "model": String,
  "car_year": Integer,
  "status": String,
  "car_type": String,
  "car_number": String,
  "sum_dist": double
  }
  }
- **response example**:{
  "result": true,
  "message": "차량 등록이 성공적으로 완료되었습니다.",
  "data": {
  "brand": "현대",
  "model": "아반떼",
  "car_year": 2025,
  "status": "대기", // 초기 값은 "대기" - "운행", "대기", "수리"
  "car_type": "중형",
  "car_number": "12가1598",
  "sum_dist": 12345.67
  }
  }

#### 2.3 차량 삭제

- **Method**: DELETE
- **Path**: `/api/cars/{car_number}`
- **Request**: // 필요없음
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
- **request**:
- **Response**:
- **Response example**:

#### 2.5 차량 상세 조회

- **Method**: GET
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료
- **request**://필요없음
- **Response example**:{
	"message": "차량 조회가 성공적으로 완료되었습니다.",
	"data": {
		"brand": "차량 브랜드명",
		"model" : "차량 모델명",
		"car_year" : "연식",
		"status" : "차량 상태" // "운행", "대기", "점검"
		"carType" : "차종",
		"carNumber" : "차량 번호",
		"sumDist" : "계기판 km"
		"last_latitude" : "마지막 위치의 위도",
		"last_longitude" : "마지막 위치의 경도"
	}
}

#### 2.6 차량 검색
// - 미입력 시 차량 전체 조회
// - 검색 필터용 (nullable)

- **Method**: GET
- **Path**: `/api/cars/search`
- **상태**: 완료
- **request**:{
  "brand" : "소나타", // 브랜드명에 모델명을 넣었을때 테스트
  "twoParam": false,
  "page" : 1, // 프론트에서 현재 1페이지를 요청
  "offset" : 2 // 그 페이지의 데이터는 2개가 최대
}
- **Response example**:{
  "result": true, // 결과가 잘 도착하였는지 여부
  "message": null, // api 메세지 (data만 보내기에 null로)
  "data": // 해당 조건을 통해 필터링 된 데이터들 {
    "content": [
      {
        "car_number": "12가1233",
        "brand": "현대",
        "model": "소나타",
        "status": "IDLE"
      },
      {
        "car_number": "12가5422",
        "brand": "기아",
        "model": "소나타",
        "status": "IDLE"
      }
    ],
    "pageable": {
      "pageNumber": 0, // 서버 상의 현재 페이지 넘버
      "pageSize": 2, // 해당 페이지 내의 데이터 수
      "sort": { // 정렬 조건
        "empty": true, // 정렬 조건이 비어있는지의 여부
        "sorted": false, // 정렬 여부
        "unsorted": true // 비정렬 여부
      },
      "offset": 0, // 전체 페이지 내에서 현제 페이지 시작 인덱스
      "paged": true, // 페이지 적용 여부
      "unpaged": false // 페이지 비적용 여부
    },
    "last": false, // 마지막 페이지 여부
    "totalElements": 6, // 전체 데이터 수
    "totalPages": 3, // 전체 페이지 수
    "size": 2, // 한 페이지 내에 요청받은 데이터수
    "number": 0, // 서버 상의 현재 페이지 넘버
    "sort": // 위와 동일{
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 2,
    "empty": false
  }
}

#### 2.7 차량 상태 조회

- **Method**: GET
- **Path**: `/api/cars/status`
- **상태**: 완료
- **request**:{
  "status": "운행" | "점검" | "대기"
}
- **Response**:{
  "result": true,
  "message": "운행중인 차량 조회가 완료되었습니다.",
  "data": [
    {
      "carNumber": "123나4567",
      "brand": "TESLA",
      "model": "Model S",
      "status": "DRIVING"
    }
  ]
}
- **Response example**:

#### 2.8 대시보드 차량 통계 조회

- **Method**: GET
- **Path**: `/api/cars/statistics`
- **상태**: 완료
- **request**:"" // 헤더에 jwt토큰만 있으면 됨
- **response**:`{
  "result": true,
  "message": null,
  "data": {
    "total": 10, // 전체 차량수
    "operating": 1, // 운행 차량 수
    "waiting": 9, // 대기 차량 수
    "inspecting": 0 // 점검 차량 수
  }`

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
- **request**:{
  carNumber: string;
  }
- **request example**
  {
  "carNumber" : "11가 1111"
  }
- **response**:`

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
