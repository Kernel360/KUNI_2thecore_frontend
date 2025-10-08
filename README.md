# KUNI 2thecore Frontend - 차량 관제 시스템

본 프로젝트는 React, Vite, TypeScript를 기반으로 구축된 차량 관제 시스템의 프론트엔드입니다. 실시간 차량 위치 추적, 주행 기록 관리, 데이터 분석 등 렌터카 및 법인 차량 관리를 위한 종합적인 기능을 제공합니다.

## ✨ 주요 기능

- **실시간 차량 관제**: Kakao Maps API를 활용하여 운행 중인 차량의 위치를 실시간으로 클러스터링하여 보여줍니다.
- **차량 관리**: 차량의 등록, 조회, 수정 및 삭제(CRUD) 기능을 제공하며, 무한 스크롤을 통해 사용자 경험을 개선했습니다.
- **주행 기록 조회**: 날짜, 차량 번호, 브랜드 등 다양한 조건으로 주행 기록을 검색하고 정렬할 수 있으며, 결과를 Excel 파일로 다운로드할 수 있습니다.
- **데이터 분석**: 월별/계절별 선호 차종, 연도별 트렌드, 일별 운행량 예측, 지역별 수요 클러스터링 등 다양한 분석 데이터를 시각화하여 제공합니다.
- **에뮬레이터 제어**: 가상의 차량 GPS 데이터를 생성하고 시동을 ON/OFF 하는 등 테스트 및 시뮬레이션 기능을 제공합니다.

## 🛠️ 기술 스택

| 구분              | 기술                              | 설명                                                                       |
| :---------------- | :-------------------------------- | :------------------------------------------------------------------------- |
| **Core**          | React 19, Vite, TypeScript        | 최신 React 기능과 빠른 개발 서버 및 빌드 속도를 제공합니다.                |
| **Styling**       | Tailwind CSS, CSS Modules         | 유틸리티 기반의 CSS 프레임워크와 컴포넌트 기반 스타일링을 함께 사용합니다. |
| **UI Components** | shadcn/ui, Radix UI, Lucide React | 재사용 가능하고 접근성 높은 UI 컴포넌트를 구축합니다.                      |
| **State Mgt.**    | Zustand                           | 가볍고 간편한 전역 상태 관리를 제공합니다.                                 |
| **Routing**       | React Router DOM                  | 클라이언트 사이드 라우팅을 구현합니다.                                     |
| **Forms**         | React Hook Form, Zod              | 효율적인 폼 상태 관리 및 스키마 기반 유효성 검사를 수행합니다.             |
| **Data Fetching** | Axios, React Query                | 서버와의 비동기 통신 및 데이터 캐싱/관리를 담당합니다.                     |
| **Charts/Maps**   | Recharts, Kakao Maps API          | 데이터 시각화 및 지도 기능을 구현합니다.                                   |
| **CI/CD**         | Jenkins, AWS S3                   | Jenkins 파이프라인을 통해 빌드 및 S3 버킷으로의 자동 배포를 수행합니다.    |
| **Formatting**    | Prettier                          | 코드 포맷팅을 자동화합니다.                                                |

## 🚀 시작하기

### 요구사항

- Node.js 18+
- pnpm

### 설치 및 실행

1.  **의존성 설치**

    ```bash
    pnpm install
    ```

2.  **환경변수 설정**
    프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 채워주세요.

    ```env
    VITE_KAKAO_MAP_API_KEY=여러분의_카카오맵_API_키
    VITE_CAR_BASE_URL=[http://52.78.122.150:8080/api](http://52.78.122.150:8080/api)
    VITE_EMULATOR_BASE_URL=[http://15.165.171.174:8081/api](http://15.165.171.174:8081/api)
    VITE_ANALYSIS_API_BASE_URL=[http://192.168.1.60:5000/api](http://192.168.1.60:5000/api)
    ```

3.  **개발 서버 실행**
    ```bash
    pnpm dev
    ```
    서버는 http://localhost:3000 에서 실행됩니다.

### 주요 명령어

- `pnpm dev`: 개발 서버를 실행합니다.
- `pnpm build`: 프로덕션용으로 프로젝트를 빌드합니다.
- `pnpm preview`: 프로덕션 빌드를 로컬에서 미리 확인합니다.
- `pnpm lint`: ESLint로 코드 품질을 검사합니다.
- `pnpm format`: Prettier로 전체 코드 포맷을 맞춥니다.

## 📂 프로젝트 구조

```
src/
├── app/                 # 페이지 컴포넌트 (라우팅)
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/              # shadcn/ui 기반 기본 UI 컴포넌트
│   ├── address/         # 주소 검색 관련 컴포넌트
│   ├── map/             # 지도 관련 컴포넌트
│   └── ...
├── hooks/               # 커스텀 React 훅
├── lib/                 # API 클라이언트, 토큰 관리 등 라이브러리
├── services/            # API 호출 서비스 레이어
├── store/               # Zustand 전역 상태 관리
├── styles/              # 전역 CSS 스타일
└── types/               # TypeScript 타입 정의
```

## 📝 코딩 컨벤션

- **컴포넌트**: PascalCase (예: `CarLocationMap`)
- **함수/변수**: camelCase (예: `carStatusFilter`)
- **파일명**: kebab-case (예: `car-location-map.tsx`)
- **들여쓰기**: 2칸 공백
- **따옴표**: 작은따옴표 사용
- **세미콜론**: 사용

## 🌐 상태 관리 (Zustand)

Zustand를 사용하여 전역 상태를 관리합니다. 예를 들어, 차량 상세 정보는 아래와 같이 관리됩니다.

```typescript
// src/store/detail-store.ts
export const useDetailStore = create<DetailStore>(set => ({
  carNumber: '',
  brand: '',
  model: '',
  status: '',
  setDetail: detail => set(detail),
}));
```

## 🚢 배포

Jenkins 파이프라인을 통해 AWS S3로 자동 배포됩니다. 자세한 내용은 `JenkinsFile`을 참고하세요.

## 📄 API 문서

백엔드 API 명세는 `backend-api-spec/` 디렉토리 내의 마크다운 파일들에서 확인할 수 있습니다.
