import { ApiError, ApiResponse } from '@/types/api';
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { TokenManager } from './token-manager';

// 환경변수 기반 API 설정
const API_BASE_URL =
  process.env.CAR_BASE_URL || 'http://52.78.122.150:8080/api';
const EMULATOR_API_BASE_URL =
  process.env.EMULATOR_BASE_URL || 'http://52.78.122.150:8081/api';

// 페이징 응답 타입 (차량 목록 등에서 사용)
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// 한국어 에러 메시지 매핑
const getKoreanErrorMessage = (status: number, message?: string): string => {
  const defaultMessages: Record<number, string> = {
    400: '잘못된 요청입니다. 입력 정보를 확인해주세요.',
    401: '인증이 필요합니다. 다시 로그인해주세요.',
    403: '접근 권한이 없습니다.',
    404: '요청한 데이터를 찾을 수 없습니다.',
    409: '중복된 데이터가 존재합니다.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    503: '서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
  };

  return (
    message || defaultMessages[status] || '알 수 없는 오류가 발생했습니다.'
  );
};

/**
 * JWT 시스템을 지원하는 Axios 인스턴스 생성
 * - Access Token 자동 헤더 추가
 * - newAccessToken 자동 갱신 처리
 * - result: false 시 자동 로그아웃
 */
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키(Refresh Token) 전송을 위해 필요
  });

  // 요청 인터셉터: JWT 토큰 자동 추가
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Authorization 헤더에 JWT 토큰 자동 추가
      const authHeader = TokenManager.getAuthHeader();
      if (authHeader) {
        config.headers = config.headers || {};
        config.headers.Authorization = authHeader;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터: JWT 시스템 자동 처리
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // JWT 필터 응답 처리
      if (response.data) {
        // result: false면 refresh token도 만료 - 즉시 로그아웃
        if (response.data.result === false) {
          console.warn('리프레시 토큰 만료 - 자동 로그아웃 처리');
          //TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(
            new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 401)
          );
        }

        // newAccessToken이 응답 헤더에 있으면 자동 업데이트
        if (response.headers['new-access-token']) {
          console.log('새로운 액세스 토큰 수신 - 자동 업데이트');
          TokenManager.updateAccessToken(response.headers['new-access-token']);
        }
      }
      return response;
    },
    async error => {
      // 401 에러 시 즉시 로그아웃 (JWT 필터에서 이미 처리됨)
      if (error.response?.status === 401) {
        console.warn('401 인증 오류 - 자동 로그아웃 처리');
        //TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // 에러 객체 생성
      const apiError = new ApiError(
        getKoreanErrorMessage(
          error.response?.status || 500,
          error.response?.data?.message
        ),
        error.response?.status || 500,
        error.response?.data?.code,
        error.response?.data,
        new Date().toISOString()
      );

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// API 인스턴스들 export
export const mainApi = createApiInstance(API_BASE_URL);
export const emulatorApi = createApiInstance(EMULATOR_API_BASE_URL);

// 타입과 유틸리티 export
export { TokenManager };
export type { ApiResponse };
