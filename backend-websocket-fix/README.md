# 🚨 WebSocket 연결 실패 해결 요청

## 📋 문제 요약

프론트엔드에서 WebSocket 연결 시도 시 다음 에러 발생:

```
WebSocket connection to 'ws://43.203.110.104:8080/ws' failed
```

## 🔍 원인

`WebSocketConfig.java`에서 `.setAllowedOriginPatterns("*")`만 설정되어 있고, **`.setAllowedOrigins()`가 명시적으로 설정되지 않음**.

Spring WebSocket은 https CORS와 별도로 WebSocket CORS를 설정해야 하며, `.setAllowedOriginPatterns("*")`만으로는 부족합니다.

## ✅ 해결 방법

### 파일 수정

**파일**: `back/main-server/src/main/java/com/example/mainserver/config/WebSocketConfig.java`

**현재 코드** (21번째 줄):

```java
registry.addEndpoint("/ws").setAllowedOriginPatterns("*");
```

**수정 후**:

```java
registry.addEndpoint("/ws")
        .setAllowedOriginPatterns("*")
        .setAllowedOrigins(  // ✅ 이 부분 추가
                "https://localhost:3000",
                "https://localhost:3001",
                "https://2thecore20250809.s3-website.ap-northeast-2.amazonaws.com",
                "https://2thecore-fe.s3-website.ap-northeast-2.amazonaws.com"
        );
```

## 📝 수정된 전체 코드

`backend-websocket-fix/WebSocketConfig.java` 파일 참고

## 🧪 테스트 방법

백엔드 수정 후 프론트엔드에서 브라우저 콘솔 확인:

**성공 시 로그**:

```
[STOMP] Opening Web Socket...
[STOMP] Web Socket Opened...
[STOMP] >>> CONNECT
Authorization:Bearer eyJhbGc...
✅ STOMP 연결 성공
📡 구독 시작: /location/cars/103나5592
```

## 📌 참고사항

- Spring Security의 https CORS 설정 (`SecurityConfig.java`)과는 **별도**로 WebSocket CORS 설정 필요
- 프로덕션 환경 배포 시 S3 URL도 반드시 포함해야 함
- `.setAllowedOriginPatterns("*")`와 `.setAllowedOrigins()`를 **둘 다** 설정해야 함

## 🔗 관련 문서

- Spring WebSocket CORS: httpss://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-server-allowed-origins
- STOMP over WebSocket: httpss://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-stomp
