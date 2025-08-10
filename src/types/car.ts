// 차량 관련 타입 정의 (통합)

/** 차량 상태 타입 */
export type CarStatus = '운행' | '대기' | '수리' | 'null';

/** 기본 차량 정보 */
export interface Car {
  carNumber: string;
  brand: string;
  model: string;
  status: CarStatus;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

/** 상세 차량 정보 (백엔드 API 스펙 기준) */
export interface CarDetail extends Car {
  /** 차량 연식 */
  carYear?: number;
  /** 차량 유형 */
  carType?: string;
  /** 총 주행거리 */
  sumDist?: number;
  /** 마지막 위도 */
  lastLatitude?: number;
  /** 마지막 경도 */
  lastLongitude?: number;
  // 기존 레거시 필드들 (하위 호환성)
  year?: string;
  mileage?: string;
}

/** 차량 통계 정보 */
export interface CarSummary {
  total: number;
  operating: number;
  waiting: number;
  inspecting: number;
}

/** 차량 통계 정보 (백엔드 API 응답 형식) */
export interface CarStatistics {
  total: number;
  driving: number;
  idle: number;
  maintenance: number;
}

/** GPS 로그 정보 */
export interface GPSLog {
  latitude: string;
  longitude: string;
  timestamp: string;
}

// API 요청 타입들

/** 차량 필터링 요청 */
export interface CarFilterRequest {
  carNumber?: string;
  brand?: string;
  status?: string;
}

/** 차량 검색 요청 */
export interface CarSearchRequest extends CarFilterRequest {
  page?: number;
  size?: number;
  /** @deprecated Remove twoParam */
  twoParam?: boolean;
  /** @deprecated Use size instead */
  offset?: number;
}

/** 차량 등록 요청 */
export interface CarCreateRequest {
  brand: string;
  model: string;
  carYear: number;
  carType: string;
  carNumber: string;
  sumDist: number;
}

/** 차량 수정 요청 */
export interface CarUpdateRequest {
  brand?: string;
  model?: string;
  carYear?: number;
  carType?: string;
  status?: CarStatus;
  carNumber?: string;
  sumDist?: number;
}

/** 차량 상태별 조회 요청 */
export interface CarStatusRequest {
  status: CarStatus[];
}
