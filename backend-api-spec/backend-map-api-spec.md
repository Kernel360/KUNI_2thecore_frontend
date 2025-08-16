# 백엔드 API 명세서 - 지도 관련 API

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

## 5. 지도 관련 API

### 5.1 운행 중인 차량 실시간 위치

- **Method**: GET (axios)
- **Path**: `/api/car/locations`
- **설명**: 운행 중인 차량 위도 경도를 통해 지도 위에서 조회
- **상태**: 완료
- **request**:{
  "status" : String // 운행, 대기, 수리 중 입력 가능하고
  //입력하지 않으면 전체 차량을 불러옴
  }
- **request example**
  {
  "status" : 운행 // 운행인 차량을 불러옴
  }
- **response**:
  {
  "result": boolean,
  "message": String,
  "data": {
  "carNumber": String,
  "status": String,
  "lastLatitude": String,
  "lastLongitude": String
  }
  }
- **response example**:{
  "result": true, // 요청 성공 여부 (true: 성공, false: 실패)
  "message": "전체 차량 위치 조회 완료", // 요청 처리에 대한 메시지
  "data": [ // 차량 위치 정보 리스트
  {
  "carNumber": "12가1234", // 차량 번호
  "status": "대기", // 차량 상태 (운행, 대기, 수리)
  "lastLatitude": "12.1238", // 마지막으로 기록된 위도 (GPS 좌표)
  "lastLongitude": "12.2325" // 마지막으로 기록된 경도 (GPS 좌표)
  },
  {
  "carNumber": "12가1233",
  "status": "대기",
  "lastLatitude": "12.3451",
  "lastLongitude": "12.3412"
  },
  {
  "carNumber": "12가1236",
  "status": "대기",
  "lastLatitude": "35.8585",
  "lastLongitude": "129.1975"
  },
  {
  "carNumber": "12가3456",
  "status": "운행",
  "lastLatitude": null,
  "lastLongitude": null
  },
  {
  "carNumber": "12가5132",
  "status": "대기",
  "lastLatitude": "string",
  "lastLongitude": "string"
  }
  ]
  }

### 5.2 차량 주행 경로를 위한 정보 조회

- **Method**: GET
- **Path**: `/api/map/route`
- **설명**: 주행 경로 표시를 위한 정보 조회
- **상태**: 시작 전
- **query parameters**:
  rentDate : 렌트 시작일
  returnDate : 렌트 종료일
  status : 상태
  brand: 브랜드
  model: 모델명
  carNumber : 차량 번호
- **request**:X
- **request example**:X
- **response**:{
  "result": true,
  "message":"정보 조회가 성공적으로 완료되었습니다.",
  "data": {
  "carNumber": "차량 번호",
  "startLocation": "출발지",
  "startLatitude": "출발지 위도",
  "startLongitude": "출발지 경도",
  "endLocation": "도착지",
  "endLatitude": "도착지 위도",
  "endLongitude": "도착지 경도",
  "drivingTime": "주행 시간"
  }
  }
