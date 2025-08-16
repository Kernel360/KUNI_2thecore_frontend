# 백엔드 API 명세서 - 인증 관련 API

response의 data 안에 들어있는 내용이 response body고 나머지는 response header임

## 서버 정보

- **차량 전체**: Port 8080

## 공통 Request Header

- 클라이언트는 API 요청 시 헤더에는 액세스 토큰만, 쿠키에는 리프레시 토큰만 포함
  Headers: Authorization: Bearer {accessToken}

## 공통 응답 포맷

Response:
{
"result": Boolean,
"message": String,
"data": {
"valid": Boolean,
"newAccessToken": String
}
}

Response example:
// 토큰 유효
{
"result": true,
"message": "엑세스 토큰 유효",
"data": {
"valid": true,
"newAccessToken" : null
}
}

// 토큰 만료 → 새 토큰 발급
{
"result": true,
"message": "엑세스 토큰 재발급 성공",
"data": {
"valid": true,
"newAccessToken": "새로운*엑세스*토큰"
}
}

//리프레시 토큰 만료
{
"result": false,
"message": "리프레시 토큰 만료",
"data": {
}
}

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

### 1.1 로그인

- **Method**: POST
- **Path**: `/api/auth/login`
- **상태**: 완료
- **request**:{
  "loginId": String,
  "password": String
  }
- **request example**:{
  "loginId": "dev" , // "로그인 id"
  "password": "1234" // "비밀번호"
  }
  {
  "result": Boolean,
  "message": String,
  "data": {
  "accessToken": String,
  "refreshToken": String,
  }
  }
- **response example**:
  {
  "result": true, // 요청 성공 여부
  "message": "로그인 성공", // 처리 결과 메시지
  "data": {
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtcXRlc3QiLCJlbWFpbCI6Im1xdGVzdCIsImlhdCI6MTc1NDYxODQ5OCwiZXhwIjoxNzU1MjE4NDk4fQ.iDyvnpso9Z2uOOCMSWD4L60JrUjoZsz76u4xLRWGvUU", // 액세스 토큰 (JWT)
  }
  }

### 1.2 로그아웃

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
