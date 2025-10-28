# WebSocket 연결 디버깅 가이드

## 현재 문제

```
WebSocket connection to 'ws://43.203.110.104:8080/ws' failed
```

## 원인

백엔드 WebSocket 설정에서 `.setAllowedOrigins()`가 명시적으로 설정되지 않음.

## 해결 방법

### 1. 백엔드 수정 (권장) ⭐

**파일 위치**: `C:\KUNI_2thecore_backend\back\main-server\src\main\java\com\example\mainserver\config\WebSocketConfig.java`

**현재 코드** (21번째 줄):

```java
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    // STOMP 엔드포인트: "/ws"
    registry.addEndpoint("/ws").setAllowedOriginPatterns("*");
}
```

**수정 후**:

```java
@Override
public void registerStompEndpoints(StompEndpointRegistry registry) {
    // STOMP 엔드포인트: "/ws"
    registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")  // 패턴 매칭 (개발용)
            .setAllowedOrigins(  // 명시적 Origin 허용 (필수!)
                // 로컬 개발 환경
                "http://localhost:3000",
                "http://localhost:3001",
                // S3 배포 환경
                "http://2thecore20250809.s3-website.ap-northeast-2.amazonaws.com",
                "http://2thecore-fe.s3-website.ap-northeast-2.amazonaws.com"
            );
}
```

**중요**: `.setAllowedOriginPatterns("*")`만으로는 WebSocket 연결이 안됩니다! `.setAllowedOrigins()`를 **반드시** 추가해야 합니다.

### 2. 임시 해결 (개발 환경만)

Chrome을 CORS 제한 없이 실행:

**Windows PowerShell:**

```powershell
# Chrome 완전 종료 후 실행
Start-Process "chrome.exe" -ArgumentList "--disable-web-security", "--user-data-dir=C:\temp\chrome-dev", "http://localhost:3001"
```

**주의**: 이 방법은 보안이 취약하므로 개발 환경에서만 사용!

### 3. 연결 테스트

백엔드 수정 후 브라우저 콘솔에서 다음 로그 확인:

```javascript
[STOMP] Opening Web Socket...
[STOMP] Web Socket Opened...
[STOMP] >>> CONNECT
Authorization:Bearer eyJhbGc...
✅ STOMP 연결 성공
```

## 참고

- Spring WebSocket은 HTTP CORS와 별도로 WebSocket CORS 설정 필요
- `.setAllowedOriginPatterns("*")`만으로는 부족
- `.setAllowedOrigins()`를 명시적으로 설정해야 함
