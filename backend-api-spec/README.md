# 백엔드 API 명세서 - 분할된 카테고리별 문서

## 개요

"2 the Core" 차량 관제 시스템의 백엔드 API 명세서가 기능별 카테고리로 분할되어 정리되었습니다.

## API 카테고리별 문서

### 📁 API 문서 구조

```
backend-api-spec/
├── README.md                     # 이 파일 - API 문서 인덱스
├── backend-auth-api-spec.md     # 인증 관련 API (1.x)
├── backend-car-api-spec.md  # 차량 관련 API (2.x)  
├── backend-log-api-spec.md      # 로그 관련 API (3.x)
└── backend-map-api-spec.md      # 지도 관련 API (5.x)
```

## 🔐 [인증 관련 API](./backend-auth-api-spec.md)

JWT 기반 사용자 인증 및 권한 관리

| 섹션 | 엔드포인트 | 상태 | 설명 |
|------|------------|------|------|
| 1.1 | `POST /api/admin/signup` | ✅ 완료 | 관리자 회원가입 |
| 1.2 | `PUT /api/admin/{loginId}` | ✅ 완료 | 회원 정보 수정 |
| 1.3 | `DELETE /api/admin/{loginId}` | ✅ 완료 | 회원 삭제 |
| 1.4 | `POST /api/auth/login` | ✅ 완료 | 로그인 |
| 1.5 | `POST /api/auth/logout` | ✅ 완료 | 로그아웃 |
| 1.6 | `POST /api/auth/refresh` | ✅ 완료 | 토큰 갱신 |

**주요 기능**: JWT 토큰 발급/갱신, 세션 관리, 권한 인증

## 🚗 [차량 관련 API](./backend-vehicle-api-spec.md)

차량 등록, 조회, 수정, 삭제 및 통계 관리

| 섹션 | 엔드포인트 | 상태 | 설명 |
|------|------------|------|------|
| 2.1 | `POST /api/cars` | ✅ 완료 | 차량 등록 |
| 2.2 | `PATCH /api/cars/{car_number}` | ✅ 완료 | 차량 정보 수정 |
| 2.3 | `DELETE /api/cars/{car_number}` | ✅ 완료 | 차량 삭제 |
| 2.4 | `GET /api/cars` | ✅ 완료 | 차량 전체 조회 (페이징) |
| 2.5 | `GET /api/cars/{car_number}` | ✅ 완료 | 차량 상세 조회 |
| 2.6 | `GET /api/cars/search` | ✅ 완료 | 차량 검색 (필터링) |
| 2.8 | `GET /api/cars/statistics` | ✅ 완료 | 대시보드 차량 통계 |

**주요 기능**: 차량 CRUD 작업, 검색/필터링, 상태별 통계, 페이징 처리

## 📊 [로그 관련 API](./backend-log-api-spec.md)

차량 주행 기록 및 GPS 로그 관리

| 섹션 | 엔드포인트 | 상태 | 설명 |
|------|------------|------|------|
| 3.1 | `GET /api/logs` | ✅ 완료 | 차량 주행 기록 조회 |
| 3.2 | `GET /api/logs/{car_number}` | ✅ 완료 | 특정 차량 운행 정보 |
| 3.3 | `POST /api/logs/power` | 🔄 진행중 | 시동 로그 |
| 3.4 | `POST /api/logs/gps` | ✅ 완료 | GPS 로그 수신 (애뮬레이터용) |

**주요 기능**: 주행 이력 추적, GPS 좌표 저장, 시동 ON/OFF 로그

## 🗺️ [지도 관련 API](./backend-map-api-spec.md)

실시간 차량 위치 추적 및 지도 기능

| 섹션 | 엔드포인트 | 상태 | 설명 |
|------|------------|------|------|
| 5.1 | `WS /ws/map/running` | ✅ 완료 | 실시간 차량 위치 (WebSocket) |
| 5.2 | `GET /api/map/route` | ❌ 시작전 | 주행 경로 조회 |

**주요 기능**: WebSocket 실시간 위치, 주행 경로 표시

## 🏗️ 서버 아키텍처

### 포트 구성
- **Port 8080**: 주요 API 서버 (차량, 인증, 로그, 지도)
- **Port 8081**: 에뮬레이터 전용 서버

### 인증 방식
- **Authorization Header**: `Bearer {JWT_TOKEN}`
- **토큰 갱신**: Refresh Token 기반 자동 갱신

## 📝 API 상태 범례

| 상태 | 아이콘 | 설명 |
|------|-------|------|
| 완료 | ✅ | 구현 완료 및 테스트 완료 |
| 진행중 | 🔄 | 개발 진행 중 |
| 시작전 | ❌ | 개발 시작 전 |
| 구현 필요 | ⚠️ | 프론트엔드에서 요구하지만 명세서에 누락 |

## 🔄 통합 개발 우선순위

### Phase 1: 핵심 기능 (현재 완료)
- ✅ 인증 API (로그인/로그아웃/토큰 갱신)
- ✅ 차량 CRUD API  
- ✅ 차량 통계 API
- ✅ 주행 기록 조회 API

### Phase 2: 실시간 기능
- 🔄 시동 로그 API 완성
- ⚠️ 에뮬레이터 관리 API 구현

### Phase 3: 고급 기능
- ❌ 주행 경로 조회 API
- 차량 예약/대여 시스템 (미정의)
- 고급 분석 및 리포팅 (미정의)

## 🔗 관련 문서

- **프론트엔드 아키텍처**: `/CLAUDE.md`
- **타입 정의**: `/src/types/`
- **서비스 레이어**: `/src/services/`
- **API 클라이언트**: `/src/lib/api.ts`

---

> **업데이트 이력**: 2025-08-09 - 원본 API 명세서를 5개 카테고리로 분할 정리