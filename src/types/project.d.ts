// 프로젝트 전역 타입 정의

// 차량 상태 타입
export type CarStatus = '운행중' | '수리중' | '대기중' | 'null';

// 차량 정보 인터페이스
export interface CarInfo {
  carNumber: string;
  brand: string;
  model: string;
  status: CarStatus;
  year?: string;
  driveDist?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// 상세 정보 인터페이스
export interface Detail {
  carNumber: string;
  brand: string;
  model: string;
  status: CarStatus;
  year?: string;
  driveDist?: string;
}

// 지도 관련 타입
export interface MapConfig {
  width: string;
  height: string;
  carStatusFilter?: CarStatus;
}

// 검색 필터 타입
export interface SearchFilter {
  carNumber?: string;
  brand?: string;
  model?: string;
  status?: CarStatus;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 컴포넌트 Props 타입들
export interface StatusContainerProps {
  carStatusFilter: CarStatus;
  setCarStatusFilter: (status: CarStatus) => void;
}

export interface CarLocationMapProps {
  carInfo?: CarInfo;
}

export interface CarClustererMapProps extends MapConfig {
  carStatusFilter?: CarStatus;
}

// Zustand 스토어 타입들
export interface DetailStore {
  carNumber: string;
  brand: string;
  model: string;
  status: CarStatus;
  setDetail: (detail: Partial<Detail>) => void;
}

export interface DetailChangeStore {
  detailChange: boolean;
  setDetailChange: (change: boolean) => void;
}

// 유틸리티 타입들
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
