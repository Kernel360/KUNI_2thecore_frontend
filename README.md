# KUNI_2thecore_frontend

차량 관제 시스템 프론트엔드 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Code Formatting**: Prettier

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- pnpm (권장)

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 코드 포맷팅

이 프로젝트는 Prettier를 사용하여 코드 포맷팅을 자동화합니다.

```bash
# 전체 프로젝트 포맷팅
pnpm format

# 포맷팅 체크
pnpm format:check
```

VS Code에서 `Ctrl+S`를 누르면 자동으로 코드가 정렬됩니다.

## Claude Code 설정

이 프로젝트는 Claude Code와 함께 사용할 수 있도록 설정되어 있습니다.

### 설정 파일들
- `.claude`: Claude Code 전용 설정
- `.cursorrules`: Cursor IDE 규칙
- `.vscode/settings.json`: VS Code 설정
- `.prettierrc.json`: Prettier 설정

### 사용 방법
1. Claude Code에서 이 프로젝트를 열기
2. `.claude` 파일의 설정을 따라 코드 생성
3. 프로젝트 구조와 코딩 스타일을 준수

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   ├── map/            # 지도 관련 컴포넌트
│   ├── search-box/     # 검색 관련 컴포넌트
│   └── ...
├── hooks/              # 커스텀 React 훅
├── store/              # Zustand 상태 관리
├── types/              # TypeScript 타입 정의
└── utils.ts            # 유틸리티 함수
```

## 코딩 컨벤션

- **컴포넌트**: PascalCase (예: `CarLocationMap`)
- **함수/변수**: camelCase (예: `carStatusFilter`)
- **파일명**: kebab-case (예: `car-location-map.tsx`)
- **들여쓰기**: 2칸 공백
- **따옴표**: 작은따옴표 사용
- **세미콜론**: 사용

## 상태 관리

Zustand를 사용하여 전역 상태를 관리합니다:

```typescript
// store/detail-store.ts
export const useDetailStore = create<DetailStore>((set) => ({
  carNumber: '',
  brand: '',
  model: '',
  status: '',
  setDetail: (detail) => set(detail),
}));
```

## 컴포넌트 개발 가이드

### 새 컴포넌트 생성 시
1. 적절한 디렉토리에 위치
2. TypeScript 타입 정의
3. 접근성 속성 포함
4. JSDoc 주석 추가 (복잡한 함수의 경우)

### 스타일링
- Tailwind CSS 클래스 사용
- CSS 모듈은 필요한 경우에만 사용
- 반응형 디자인 고려

## 테스트

```bash
# 테스트 실행 (추후 추가 예정)
pnpm test
```

## 배포

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 기여 가이드

1. 새로운 기능은 별도 브랜치에서 개발
2. 코드 포맷팅 확인 (`pnpm format:check`)
3. TypeScript 타입 체크 확인
4. 커밋 메시지는 명확하게 작성

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
