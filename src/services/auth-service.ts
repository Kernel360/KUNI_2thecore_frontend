import { mainApi } from '@/lib/api';
import { TokenManager } from '@/lib/token-manager';
import { ApiResponse } from '@/types/api';

// 로그인 요청 타입
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 인증 서비스
export class AuthService {
  // 로그인
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await mainApi.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        credentials
      );

      if (response.data.result && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;

        // 토큰을 로컬 스토리지에 저장
        TokenManager.setTokens(accessToken, refreshToken);

        return response.data.data;
      } else {
        throw new Error(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      throw new Error(error.message || '로그인 중 오류가 발생했습니다.');
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청 (선택사항)
      await mainApi.post('/auth/logout');
    } catch (error) {
      // 서버 로그아웃 실패해도 로컬 토큰은 제거
      console.warn('서버 로그아웃 실패:', error);
    } finally {
      // 로컬 토큰 제거
      TokenManager.clearTokens();
    }
  }

  // 현재 로그인 상태 확인
  static isAuthenticated(): boolean {
    return TokenManager.hasValidTokens();
  }

  // 토큰 갱신
  static async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
      }

      const response = await mainApi.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >('/auth/refresh', {
        refreshToken,
      });

      if (response.data.result && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        TokenManager.setTokens(accessToken, newRefreshToken);
        return accessToken;
      } else {
        throw new Error('토큰 갱신에 실패했습니다.');
      }
    } catch (error) {
      TokenManager.clearTokens();
      throw error;
    }
  }

  // 현재 토큰으로 인증 상태 확인
  static async verifyToken(): Promise<boolean> {
    try {
      // 간단한 API 호출로 토큰 유효성 검증 (예: 사용자 정보 조회)
      const response = await mainApi.get('/auth/verify');
      return response.data.result === true;
    } catch (error) {
      return false;
    }
  }
}
