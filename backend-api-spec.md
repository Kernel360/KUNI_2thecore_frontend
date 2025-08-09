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
- **request**:{
  "loginId": String,
  "password": String
  }
- **request example**:{
  "loginId": "test" , // "로그인 id"
  "password": "test1234" // "비밀번호"
  }
- **response**:{
  "result": Boolean,
  "message": String,
  "data": {
  "accessToken": String,
  "refreshToken": String,
  "expiredAt": String
  }
  }

- **response example**:{
  "result": true, // 요청 성공 여부
  "message": "로그인 성공", // 처리 결과 메시지
  "data": {
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU1MjE4NDk4fQ.iDyvnpso9Z2uOOCMSWD4L60JrUjoZsz76u4xLRWGvUU", // 액세스 토큰 (JWT)
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU2NDMyODk4fQ.DsKfaKOVJz8L0ewjkybm_9CVi4YOmrgefgzE1XyIrwM", // 리프레시 토큰 (JWT)
  "expiredAt": "2025-08-15T09:41:38.2036524" // 액세스 토큰 만료 시각 (ISO 8601 형식)
  }
  }

#### 1.2 회원 정보 수정

- **Method**: PUT
- **Path**: `/api/admin/{loginId}`
- **상태**: 완료
- **request**:{}
- **request example**:{}
- **response**:{
  "result": Boolean,
  "message": String,
  }
- **response example**:{
  }

#### 1.3 회원 삭제

- **Method**: DELETE
- **Path**: `/api/admin/{loginId}`
- **상태**: 완료
- **request**:{
  "loginId":"로그인 id"
  "password": "비밀번호"
  }
- **request example**:
- **response**:{
  "result": true,
  "message": "deletedAdminId admin deleted successfully.",
  "data": null
  }
- **response example**:

#### 1.4 로그인

- **Method**: POST
- **Path**: `/api/auth/login`
- **상태**: 완료
- **request**:{
  "loginId": String,
  "password": String
  }
- **request**:{
  "loginId": String,
  "password": String
  }
- **request example**:{
  "loginId": "test" , // "로그인 id"
  "password": "test1234" // "비밀번호"
  }
- **response**:{
  "result": Boolean,
  "message": String,
  "data": {
  "accessToken": String,
  "refreshToken": String,
  "expiredAt": String
  }
  }
- **response example**:{
  "result": true, // 요청 성공 여부
  "message": "로그인 성공", // 처리 결과 메시지
  "data": {
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU1MjE4NDk4fQ.iDyvnpso9Z2uOOCMSWD4L60JrUjoZsz76u4xLRWGvUU", // 액세스 토큰 (JWT)
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU2NDMyODk4fQ.DsKfaKOVJz8L0ewjkybm_9CVi4YOmrgefgzE1XyIrwM", // 리프레시 토큰 (JWT)
  "expiredAt": "2025-08-15T09:41:38.2036524" // 액세스 토큰 만료 시각 (ISO 8601 형식)
  }
  }

#### 1.5 로그아웃

- **Method**: POST
- **Path**: `/api/auth/logout`
- **상태**: 완료
- **request**: 요청 본문 없음
  헤더에 Authorization: Bearer {accessToken} 필
- **request example**:
- **response**:{
  "result": Boolean,
  "message": String,
  }
- **response example**:{
  "result": true, // 성공 여부
  "message": "로그아웃 처리 완료", // 처리 결과 메시지
  "data": null // 데이터
  }

#### 1.6 리프레시 토큰 검증

- **Method**: POST
- **Path**: `/api/auth/refresh`
- **상태**: 완료
- **request**:{
  "refreshToken": String
  }
- **request example**:{
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxNzIxMywiZXhwIjoxNzU2NDMxNjEzfQ.j-z1JTCOuBTNUgcvz5oNTIZDpDiSnxlAkRjg23nioYk" // 리프레시 토큰
  }
- **response**:{
  "result": Boolean,
  "message": String,
  "data": {
  "accessToken": String,
  "refreshToken": String,
  "expiredAt": String
  }
  }

- **response example**:{
  "result": true, // 성공 여부
  "message": "엑세스 토큰 갱신 성공", // 처리 결과 메시지
  "data": {
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxNzIzOSwiZXhwIjoxNzU1MjE3MjM5fQ.h7LZyKY3aon9jJDPGnsTpvNnJ1np4reYacNFdDvyoas", // 새로 발급된 액세스 토큰
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxNzIzOSwiZXhwIjoxNzU2NDMxNjM5fQ.9CORf3jqMwerBqmvpxI9Zv3yngy9TYDZXs6FhUXHvFo", // 새로 발급된 리프레시 토큰
  "expiredAt": "2025-08-15T09:20:39.3362867" // 액세스 토큰 만료 시간 (ISO 8601 형식)
  }
  }

### 2. 차량 관련 API

#### 2.1 차량 등록

- **Method**: POST
- **Path**: `/api/cars`
- **상태**: 완료
- **request**:{
  "brand": String, // 차량 브랜드
  "model": String, // 차량 모델명
  "carYear": Integer, // 차량 연식
  "carType": String, // 차량 종류
  "carNumber": String, // 차량 번호
  "sumDist": Double // 총 주행 거리(km)
  }
- **request example**: {
  "brand": "현대",  
   "model": "아반떼",  
   "carYear": 2025,  
   "carType": "중형",  
   "carNumber": "12가3456",
  "sumDist": 12345.67  
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
  "message": "차량 등록이 성공적으로 완료되었습니다.", // "차량 등록 성공 여부"
  "data": {
  "brand": "현대", // 차량 브랜드
  "model": "아반떼", // 차량 모델명
  "car_year": 2025, // 차량 연식
  "status": "대기", // 차량 상태 (초기값: "대기", 선택값: "운행", "대기", "수리")
  "car_type": "중형", // 차량 종류
  "car_number": "12가1598", // 차량 번호
  "sum_dist": 12345.67 // 총 주행 거리 (km)
  }
  }

#### 2.2 차량 정보 수정

- **Method**: PATCH
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료
- **request**:{// 필수 X, 수정할 정보만 선택적 입력
  {
  "brand": String,
  "model": String,
  "carYear": Integer,
  "carType": String,
  "status": String,
  "carNumber": String,
  "sumDist": Double
  }
- **request example**:
  {
  "brand": "현대",
  "model" : "아반떼",
  "carYear" : 2015,
  "carType" : "중형",
  "status" : "운행",
  "carNumber" : "12가3456",
  "sumDist" : 12345.67
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
  "lastLatitude": String,
  "lastLongitude": String,
  "sum_dist": double
  }
  }
- **response example**:{
  "result": true,
  "message": "차량 정보가 성공적으로 수정되었습니다.", // "차량 정보 수정 성공 여부"
  "data": {
  "brand": "현대", // 차량 브랜드
  "model": "아반떼", // 차량 모델명
  "car_year": 2025, // 차량 연식
  "status": "대기", // 차량 상태 (초기값: "대기", 선택값: "운행", "대기", "수리")
  "car_type": "중형", // 차량 종류
  "car_number": "12가1598", // 차량 번호
  "lastLatitude": "12.54",
  "lastLongitude": "12.54",
  "sum_dist": 12345.67 // 총 주행 거리 (km)
  }
  }

#### 2.3 차량 삭제

- **Method**: DELETE
- **Path**: `/api/cars/{car_number}`
- **request**: // 필요없음
- **response (성공)**:{
  "brand": String,
  "model": String,
  "carNumber": String
  }
- **response example**:{
  "result": true,
  "message": "차량 삭제가 성공적으로 완료되었습니다.",
  "data": {
  "brand": "현대", // 차량 브랜드
  "model": "아반떼", // 차량 모델명
  "car_number": "12가1598" // 차량 번호
  }
  }
- **response (실패 - 404)**:

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
- **request**: X
- **Response**:{
  "result": Boolean,
  "message": null,
  "data": {
  "content": [
  {
  "brand": String,
  "model": String,
  "carYear": Integer,
  "carType": String,
  "status": String,
  "carNumber": String,
  "lastLatitude": String,
  "lastLongitude": String,
  "sumDist": Double
  }
  ],
  "pageable": {
  "pageNumber": int,
  "pageSize": int,
  "sort": // 정렬 관련 정보{
  "empty": Boolean, // 정렬 조건이 비어있는지
  "sorted": Boolean, // 정렬 여부
  "unsorted": Boolean // 비정렬 여부
  },
  "offset": int , // 전체 결과 내에서 현재 페이지의 시작 위치 index
  "paged": Boolean, // pagination 적용 여부
  "unpaged": Boolean // pagination 비적용 여부
  },
  "last": Boolean, // 현재 페이지가 마지막인지
  "totalPages": int, // 전체 페이지수
  "totalElements": int, // 전체 항목 수
  "first": Boolean, // 현재 페이지가 첫 번째 페이지인지
  "numberOfElements": int, // 현재 페이지에 포함된 데이터 수
  "size": int, // 한 페이지에 보여줄 항목의 수
  "number": int, // 현재 페이지 번호
  "sort": // 정렬 조건 (pageable이랑 동일){
  "empty": Boolean,
  "sorted": Boolean,
  "unsorted": Boolean
  },
  "empty": Boolean // 현재 페이지가 비어있는지 여부
  }
  }
- **Response example**:{
  "result": true,
  "message": null,
  "data": {
  "content": [
  {
  "brand": "현대",
  "model": "소나타",
  "carYear": 2020,
  "status": "대기",
  "carType": "중형",
  "carNumber": "12가1233",
  "lastLatitude": "12.3451",
  "lastLongitude": "12.3412",
  "sumDist": 0.1
  },
  ],
  "pageable": {
  "pageNumber": "서버 상의 현재 페이지 넘버",
  "pageSize": "현재 페이지의 content 수",
  "sort": // 정렬 관련 정보{
  "empty": true, // 정렬 조건이 비어있는지
  "sorted": false, // 정렬 여부
  "unsorted": true // 비정렬 여부
  },
  "offset": 0 , // 전체 결과 내에서 현재 페이지의 시작 위치 index
  "paged": true, // pagination 적용 여부
  "unpaged": false // pagination 비적용 여부
  },
  "last": false, // 현재 페이지가 마지막인지
  "totalPages": 10, // 전체 페이지수
  "totalElements": 10, // 전체 항목 수
  "first": true, // 현재 페이지가 첫 번째 페이지인지
  "numberOfElements": 1, // 현재 페이지에 포함된 데이터 수
  "size": 1, // 한 페이지에 보여줄 항목의 수
  "number": 0, // 현재 페이지 번호
  "sort": // 정렬 조건 (pageable이랑 동일){
  "empty": true,
  "sorted": false,
  "unsorted": true
  },
  "empty": false // 현재 페이지가 비어있는지 여부
  }
  }

#### 2.5 차량 상세 조회

- **Method**: GET
- **Path**: `/api/cars/{car_number}`
- **상태**: 완료
- **request**://필요없음
- **response**:{
  "result": Boolean
  "message": null,
  "data": {
  "brand": String,
  "model": String,
  "carYear": Int,
  "status": String,
  "carType": String,
  "carNumber": String,
  "sumDist": Double,
  "lastLatitude": String,
  "lastLongitude": String
  }
  }
- **Response example**:{
  "result": true,
  "message": null,
  "data": {
  "brand": "현대",
  "model": "아이오닉",
  "carYear": 2023,
  "status": "대기",
  "carType": "소형",
  "carNumber": "12가1234",
  "sumDist": 23.42,
  "lastLatitude": "123.23",
  "lastLongitude": "123.23"
  }
  }

#### 2.6 차량 검색

// - 미입력 시 차량 전체 조회
// - 검색 필터용 (nullable)

- **Method**: GET
- **Path**: `/api/cars/search`
- **상태**: 완료
- **query parameters**:
  carNumber: String, // 차량 번호
  model: String, // 차량 모델
  brand: String, // 차량 브랜드
  status: String, // 차량 상태
  twoParam: Boolean, // 브랜드 + 모델명으로 입력 받을 때 길이 체크 용도 (주의: false가 되는 경우는 오직 브랜드 + 모델명 길이가 1인 경우)
  // 모든 조건이 안들어가있을때도 true
  page: Integer, // 프론트에서 요청하는 페이지 넘버
  offset: Integer // 한 페이지에 요청하는 데이터 수
- **query parameters example**:
  carNumber: "12가3456" // 차량 번호
  model: "아반떼" // 차량 모델
  brand: "현대" // 차량 브랜드
  status: "대기" // 차량 상태 (“운행”, “대기”, “수리”)
  twoParam: true // 브랜드 + 모델명으로 입력 받을 때 길이 체크 용도 (false인 경우는 오직 브랜드 + 모델명 길이가 1인 경우)
  page: 1 // 프론트에서 요청하는 페이지 넘버
  offset: 10 // 한 페이지에 요청하는 데이터 수
- **request**:X
- **request example**: X
- **Response**:{
  "result": Boolean, // 결과가 잘 도착하였는지 여부
  "message": String, // API 메세지
  "data": { // 해당 조건을 통해 필터링 된 데이터들
  "content": [
  {
  "carNumber": String, // 차량 번호
  "brand": String, // 차량 브랜드
  "model": String, // 차량 모델
  "status": String // 차량 상태
  },
  ...
  ], // 데이터 목록
  "pageable": { // 페이지 정보
  "pageNumber": Integer, // 서버 상의 현재 페이지 넘버
  "pageSize": Integer, // 해당 페이지 내의 데이터 수
  "sort": { // 정렬 조건
  "empty": Boolean, // 정렬 조건이 비어있는지 여부
  "sorted": Boolean, // 정렬 여부
  "unsorted": Boolean // 비정렬 여부
  },
  "offset": Integer, // 전체 페이지 내에서 현재 페이지 시작 인덱스
  "paged": Boolean, // 페이지 적용 여부
  "unpaged": Boolean // 페이지 비적용 여부
  },
  "last": Boolean, // 마지막 페이지 여부
  "totalElements": Integer,// 전체 데이터 수
  "totalPages": Integer, // 전체 페이지 수
  "size": Integer, // 한 페이지 내에 요청받은 데이터 수
  "number": Integer, // 서버 상의 현재 페이지 넘버
  "sort": { // 정렬 조건 (위와 동일)
  "empty": Boolean,
  "sorted": Boolean,
  "unsorted": Boolean
  },
  "first": Boolean,  
   "numberOfElements": Integer,
  "empty": Boolean
  }
  }
- **Response example**: {
  "result": true, // 결과가 잘 도착하였는지 여부
  "message": null, // api 메세지 (data만 보내기에 null로)
  "data": // 해당 조건을 통해 필터링 된 데이터들 {
  "content": [
  {
  "carNumber": "12가3456",
  "brand": "현대",
  "model": "아반떼",
  "status": "대기"
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

#### 2.8 대시보드 차량 통계 조회

- **Method**: GET
- **Path**: `/api/cars/statistics`
- **상태**: 완료
- **request**:X // 헤더에 jwt토큰만 있으면 됨
- **request example**:X
- **response**:{
  "result": Boolean,
  "message": null,
  "data": {
  "total": Long,
  "operating": Long,
  "waiting": Long,
  "inspecting": Long
  }
  }
- **response example**:{
  "result": true,
  "message": null,
  "data": {
  "total": 120,
  "operating": 85,
  "waiting": 25,
  "inspecting": 10
  }
  }

### 3. 로그 관련 API

#### 3.1 차량 주행 기록 조회

- **Method**: GET
- **Path**: `/api/logs`
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
  "result": "Boolean",
  "message": "String",
  "data": [
  {
  "carNumber": "String",
  "startPoint": "String",
  "startLatitude": "String",
  "startLongitude": "String",
  "startTime": "String",
  "endPoint": "String",
  "endLatitude": "String",
  "endLongitude": "String",
  "endTime": "String",
  "driveDist": "Number",
  "speed": "String",
  "createdAt": "String",
  "model": "String",
  "brand": "String"
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

#### 3.2 특정 차량 운행 정보

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

#### 3.3 시동 로그

- **Method**: POST
- **Path**: `/api/logs/power`
- **설명**: 애뮬레이터 전원 ON/OFF 로그 및 GPS 정보를 서버로 전송하는 API
- **상태**: 진행 중
- **request**:// 모두 필수!!
  {
  "carNumber": String,
  "loginId": String,
  "powerStatus": String
  }
- **request example**:
  {
  "carNumber" : "12가3456",
  "loginId": "test",
  "powerStatus" : "ON" // "ON" or "OFF"
  }
- **response**:{
  "result": boolean,
  "message": String,
  "data": {
  "carNumber" : String,
  "loginId" : String,
  "powerStatus" : String
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

#### 3.4 GPS 로그 수신 (프론트 사용 X)

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

### 5. 지도 관련 API

#### 5.1 운행 중인 차량 실시간 위치

- **Method**: GET (WebSocket)
- **Path**: `ws/map/running`
- **설명**: 운행 중인 차량 위도 경도를 통해 지도 위에서 조회
- **상태**: 완료
- **request**:
  Websocket 연결을 위한 header만 필요합니다

GET /map/running HTTP/1.1
Host: hub-server-address.com:8082
Authorization: Bearer
eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoidXNlcjEyMyIsImlhdCI6MTY5MDY5OTIwMCwiZXhwIjoxNjkwNzAzODAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf3
6POk6yJV_adQssw5c
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

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
