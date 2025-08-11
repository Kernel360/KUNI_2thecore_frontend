# 백엔드 API 명세서 - 인증 관련 API

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

## 1. 회원 관련 API

### 1.1 회원가입

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
  "result": true,                                  // 요청 성공 여부
  "message": "로그인 성공",                         // 처리 결과 메시지
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU1MjE4NDk4fQ.iDyvnpso9Z2uOOCMSWD4L60JrUjoZsz76u4xLRWGvUU",   // 액세스 토큰 (JWT)
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU2NDMyODk4fQ.DsKfaKOVJz8L0ewjkybm_9CVi4YOmrgefgzE1XyIrwM",  // 리프레시 토큰 (JWT)
    "expiredAt": "2025-08-15T09:41:38.2036524"       // 액세스 토큰 만료 시각 (ISO 8601 형식)
  }
}

### 1.2 회원 정보 수정

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

### 1.3 회원 삭제

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

### 1.4 로그인

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
  "result": true,                                  // 요청 성공 여부
  "message": "로그인 성공",                         // 처리 결과 메시지
  "data": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU1MjE4NDk4fQ.iDyvnpso9Z2uOOCMSWD4L60JrUjoZsz76u4xLRWGvUU",   // 액세스 토큰 (JWT)
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU2NDMyODk4fQ.DsKfaKOVJz8L0ewjkybm_9CVi4YOmrgefgzE1XyIrwM",  // 리프레시 토큰 (JWT)
    "expiredAt": "2025-08-15T09:41:38.2036524"       // 액세스 토큰 만료 시각 (ISO 8601 형식)
  }
}

### 1.5 로그아웃

- **Method**: POST
- **Path**: `/api/auth/logout`
- **상태**: 완료
- **request**: 요청 본문 없음
헤더에 Authorization: Bearer {accessToken} 필
- **request example**: X
- **response**:{
  "result": Boolean,
  "message": String,
}
- **response example**:{
  "result": true, // 성공 여부
  "message": "로그아웃 처리 완료", // 처리 결과 메시지
  "data": null // 데이터
}


### 1.6 리프레시 토큰 검증

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
