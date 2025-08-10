import { TokenManager } from './token-manager';

// 환경변수 기반 API 설정
const API_BASE_URL =
  process.env.CAR_BASE_URL || 'http://52.78.122.150:8080/api';
const EMULATOR_BASE_URL =
  process.env.EMULATOR_BASE_URL || 'http://localhost:8081';

// 공통 API 응답 타입 (모든 API에서 사용)
export interface ApiResponse<T = any> {
  result: boolean;
  message: string | null;
  data: T;
}

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
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API 요청 옵션 타입
interface ApiRequestOptions {
  method?: HttpMethod;
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
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

// URL에 쿼리 파라미터 추가 헬퍼 함수
const buildUrl = (baseUrl: string, endpoint: string, params?: Record<string, any>): string => {
  const url = `${baseUrl}${endpoint}`;
  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Fetch 기반 API 클라이언트 클래스
class FetchApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, headers: customHeaders = {} } = options;

    // 헤더 설정
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // 토큰이 있으면 Authorization 헤더 추가
    const token = TokenManager.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // URL 구성
    const url = buildUrl(this.baseURL, endpoint, params);

    // 요청 설정
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // body가 있으면 추가
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, fetchOptions);

      // 401 에러 시 토큰 갱신 시도
      if (response.status === 401 && endpoint !== '/auth/refresh') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // 새 토큰으로 재시도
          const newToken = TokenManager.getAccessToken();
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            fetchOptions.headers = headers;
            return this.makeRequest(endpoint, options);
          }
        }
        // 토큰 갱신 실패 시 로그인 페이지로 리디렉션
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      // 응답이 성공이 아닌 경우
      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          // JSON 파싱 실패 시 무시
        }

        const apiError = {
          status: response.status,
          message: getKoreanErrorMessage(
            response.status,
            errorData?.message
          ),
          timestamp: new Date().toISOString(),
        };

        throw apiError;
      }

      return await response.json();
    } catch (error: any) {
      if (error.status) {
        // 이미 처리된 API 에러
        throw error;
      }
      
      // 네트워크 에러 등
      const apiError = {
        status: 0,
        message: getKoreanErrorMessage(500, '네트워크 오류가 발생했습니다.'),
        timestamp: new Date().toISOString(),
      };

      throw apiError;
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      if (data.result && data.data) {
        TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  // HTTP 메서드들
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

// API 인스턴스들
export const mainApi = new FetchApiClient(API_BASE_URL);

// 토큰 관리 유틸리티 export
export { TokenManager };
