# 백엔드 API 명세서 - 로그 관련 API

## 서버 정보

- **차량 전체**: Port 8080

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

## 3. 로그 관련 API

### 3.1 차량 주행 기록 조회

- **Method**: GET
- **Path**: `/api/drivelogs`
- **상태**: 완료
- **query parameters**:
  interface DriveLogQueryParams {
  carNumber?: string; // 차량 번호
  rentDate?: string; // 렌트 시작일 (형식: YYYY-MM-DD)
  returnDate?: string; // 렌트 종료일 (형식: YYYY-MM-DD)
  status?: string; // 차량 상태 (ex: 운행중, 대기중, 점검중)
  brand?: string; // 브랜드명
  model?: string; // 모델명
  }
- **request**: Request 바디 없음
- **request example**: X
- **response**:{
  "result": "boolean",
  "message": "string",
  "data": [
  {
  "carNumber": "string",
  "startPoint": "string",
  "startLatitude": "string",
  "startLongitude": "string",
  "startTime": "string",
  "endPoint": "string",
  "endLatitude": "string",
  "endLongitude": "string",
  "endTime": "string",
  "driveDist": "Number",
  "speed": "string",
  "createdAt": "string",
  "model": "string",
  "brand": "string"
  }
  ]
  }
- **response example**:{
  "result": true, // 요청 성공 여부
  "message": "전체 주행기록 조회 완료", // 처리 결과 메시지
  "data": [
  {
  "carNumber": "1", // 차량 번호
  "startPoint": "서울시 강남구", // 출발지 이름
  "startLatitude": "37.4979", // 출발지 위도
  "startLongitude": "127.0276", // 출발지 경도
  "startTime": "2025-07-31T08:30:00", // 출발 시간 (ISO 8601 형식)
  "endPoint": "서울시 종로구", // 도착지 이름
  "endLatitude": "37.5729", // 도착지 위도
  "endLongitude": "126.9794", // 도착지 경도
  "endTime": "2025-07-31T08:50:00", // 도착 시간 (ISO 8601 형식)
  "driveDist": 12000, // 주행 거리 (미터 단위)
  "speed": "60km/h", // 주행 속도 (문자열)
  "createdAt": "2025-07-31T10:17:34", // 주행기록 저장 시각 (ISO 8601 형식)
  "model": "", // 차량 모델명
  "brand": "" // 차량 브랜드명
  },
  {
  "carNumber": "2",
  "startPoint": "서울시 양천구",
  "startLatitude": "123.456",
  "startLongitude": "789.101",
  "startTime": "2025-08-04T02:53:29",
  "endPoint": "서울시 성북구",
  "endLatitude": "112.131",
  "endLongitude": "415.161",
  "endTime": "2025-08-04T02:53:29",
  "driveDist": 121314,
  "speed": "50e^4km/h",
  "createdAt": "2025-08-04T12:06:26",
  "model": "",
  "brand": ""
  },
  {
  "carNumber": "3",
  "startPoint": "서울역",
  "startLatitude": "37.554722",
  "startLongitude": "126.970833",
  "startTime": "2025-08-08T01:57:10",
  "endPoint": "강남역",
  "endLatitude": "37.498095",
  "endLongitude": "127.027610",
  "endTime": "2025-08-08T02:30:00",
  "driveDist": 15000,
  "speed": "60km/h",
  "createdAt": "2025-08-08T11:10:36",
  "model": "아이오닉5",
  "brand": "현대"
  }
  ]
  }

### 3.2 특정 차량 운행 정보

- **Method**: GET
- **Path**: `/api/logs/{car_number}`
- **상태**: 완료
- **request**: X
- **request example**: X
- **response**:{

      "message": "차량 운행 정보 조회에 성공했습니다.",
      "data": [
      {
        "carNumber": "차량번호",
        "carName" : "차량명", // 브랜드명 + 모델명
        "status" : "상태",    // "운행", "대기", "점검"
          "currLocation" : "현재 위치", // 서울 강남구 역삼동
          "currLatitude" : "현재 위도",
          "currLongitude" : "현재 경도",
        "speed" : "속도",
          "year" : "차량 연식",
          "totalDist" : "주행 거리"
      },
      ...

  ]
  }

- **response example**:{

      "message": "차량 운행 정보 조회에 성공했습니다.",
      "data": [
      {
        "carNumber": "12가 1234",
        "carName" : "기아 K5",
        "status" : "운행",
          "currLocation" : "서울 강남구 역삼동",
          "currLatitude" : "37.503325",
          "currLongitude" : "127.044034",
        "speed" : "60km/h",
          "year" : "2022년",
          "totalDist" : "45,678km"
      },
      ...

  ]
  }

### 3.3 시동 로그

- **Method**: POST
- **Path**: `/api/logs/power`
- **설명**: 애뮬레이터 전원 ON/OFF 로그 및 GPS 정보를 서버로 전송하는 API
- **상태**: 진행 중
- **request**:// 모두 필수!!
  {
  "carNumber": string,
  "loginId": string,
  "powerStatus": string
  }
- **request example**:
  {
  "carNumber" : "12가3456",
  "loginId": "test",
  "powerStatus" : "ON" // "ON" or "OFF"
  }
- **response**:{
  "result": boolean,
  "message": string,
  "data": {
  "carNumber" : string,
  "loginId" : string,
  "powerStatus" : string
  }
  }
- **response example**:{
  "result": true,
  "message": "시동 로그가 성공적으로 저장되었습니다.",
  "data": {
  "car_number" : "12가3456",
  "login_id" : "test",
  "power_status" : "ON" // "ON" or "OFF"
  }
  }

### 3.4 GPS 로그 수신 (프론트 사용 X)

- **Method**: POST
- **Path**: `/api/logs/gps`
- **설명**: 애뮬레이터에서 보낸 GPS 좌표 리스트를 서버에 저장
- **상태**: 완료
- **request**:{
  "carNumber" : "차량 번호",
  "loginId": "로그인ID",
  "startTime" : "로그 collect 시작시간",
  "endTime" : "로그 collect 종료시간"
  "locations": [ // 위치 좌표 리스트
  {
  "latitude": "위도",
  "longitude": "경도",
  "timestamp": "해당 로그의 timestamp"
  }
  ]
  }
- **response**:{
  "result": true,
  "message": "성공메세지",
  "data": {
  "carNumber": "차량번호",
  "start_time" : "로그 collect 시작시간",
  "end_time" : "로그 collect 종료시간"
  }
  }
