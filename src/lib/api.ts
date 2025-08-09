import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';

// 환경변수 기반 API 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8080';
const EMULATOR_API_BASE_URL = process.env.NEXT_PUBLIC_EMULATOR_API_URL || 'http://localhost:8081';

// 토큰 관리 유틸리티, 이게 맞는지는 모름
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }
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

  return message || defaultMessages[status] || '알 수 없는 오류가 발생했습니다.';
};

// Axios 인스턴스 생성 함수
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터: 인증 토큰 추가
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = TokenManager.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터: 에러 처리 및 토큰 갱신
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 에러이고 재시도하지 않은 경우 토큰 갱신 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = TokenManager.getRefreshToken();
          if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
          }

          // 토큰 갱신 요청 (메인 API 서버 사용)
          const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });

          if (refreshResponse.data.result) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
            TokenManager.setTokens(accessToken, newRefreshToken);
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }

      // 에러 객체를 한국어 메시지와 함께 생성
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: getKoreanErrorMessage(
          error.response?.status || 500,
          error.response?.data?.message
        ),
        timestamp: new Date().toISOString(),
      };

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// API 인스턴스들
export const mainApi = createApiInstance(API_BASE_URL);
export const emulatorApi = createApiInstance(EMULATOR_API_BASE_URL);

// 토큰 관리 유틸리티 export
export { TokenManager };

// API 응답 타입 재export (하위 호환성)
export type { ApiResponse } from '@/types/api';