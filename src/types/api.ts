// 공통 API 응답 타입 정의

/** 기본 API 응답 형식 */
export interface ApiResponse<T> {
  result: boolean;
  message: string | null;
  data: T;
}

/** 페이징 응답 형식 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/** 확장된 페이징 응답 형식 (에뮬레이터용) */
export interface ExtendedPageResponse<T> extends PageResponse<T> {
  first: boolean;
  last: boolean;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

/** HTTP 에러 응답 타입 */
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

/** API 요청 옵션 */
export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}