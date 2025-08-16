1. 개요

- 모든 사용자 요청은 JWT Access Token을 통해 인증됩니다.(일부 필터에서 제외한 것 제외)
- Access Token 만료 시 Refresh Token을 사용하여 자동 재발급이 가능합니다.
- Refresh Token은 HttpOnly 쿠키로 저장되어 클라이언트 JS에서 접근할 수 없습니다.

2. 토큰 정의

- Access Token : 유효기간(10분), 저장 위치(JS)
- Refresh Token : 유효기간(7일), 저장 위치(HttpOnly 쿠키, Redis)

3. API 동작 흐름
   IF) 인증 필요 API 요청이 들어왔을 때
   3-1. 클라이언트가 Access Token을 Authorization: Bearer <AccessToken> 헤더로 전송
   3-2. 서버 JwtAuthenticationFilter 처리 - Access Token 유효 -> 요청 처리 - Access Token 만료/무효 -> 401 Unauthorized
   3-3. Access Token 재발급(자동 재로그인) - 서버 필터에서 자동 처리 - 클라이언트는 새 Access Token을 받아 사용 - Refresh Token을 수동으로 호출할 필요 없음
   -> 서버 입장에서 자동 재로그인(유효한 세션을 가진 것)이 된 상태

4. access token이 무효하고 refresh token은 유효할 때 로직 정리(순서대로)

- 프론트가 API 요청 -> Access Token 만료
- 서버 필터가 새 Access Token 발급 -> 응답으로 새 토큰 반환
- 프론트에서 새 토큰을 받아 같은 API 요청을 다시 보냄
- 서버에서 정상적으로 API 처리 -> 프론트가 데이터 수신

## 공통 Request Header

- 클라이언트는 API 요청 시 헤더에는 액세스 토큰만, 쿠키에는 리프레시 토큰만 포함
  Headers: Authorization: Bearer {accessToken}

## 공통 응답 포맷

Response:
{
"result": Boolean,
"message": String,
"data": {
"newAccessToken": String
}
}

Response example:
// 토큰 유효
{
"result": true,
"message": "엑세스 토큰 유효",
"data": {
"newAccessToken" : null
}
}

// 토큰 만료 → 새 토큰 발급
{
"result": true,
"message": "엑세스 토큰 재발급 성공",
"data": {
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
