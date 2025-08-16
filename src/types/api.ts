/**
 * API 응답 관련 타입 정의
 */

// 기본 API 응답 타입 - 백엔드 JWT 시스템에 맞게
export interface ApiResponse<T = any> {
  result: boolean;          // 요청 성공 여부 (false면 refresh token도 만료)
  message: string;          // 응답 메시지
  data: T;                  // 실제 응답 데이터
  newAccessToken?: string;  // 토큰 갱신 시 새 액세스 토큰
}

// API 에러 클래스
export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: any;
  public timestamp?: string;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    data?: any,
    timestamp?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.timestamp = timestamp;

    // Error 클래스 상속 시 필요한 설정
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 성공 응답 타입
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

// 에러 응답 타입
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// 통계 응답 타입
export interface StatisticsResponse {
  total: number;
  운행: number;
  대기: number;
  수리: number;
}
