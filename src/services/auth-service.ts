import { ApiResponse, mainApi } from '@/lib/api';
import { TokenManager } from '@/lib/token-manager';

// 회원가입 요청 타입
export interface SignupRequest {
  loginId: string;
  password: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 토큰 갱신 요청 타입
export interface RefreshTokenRequest {
  refreshToken: string;
}

// 인증 토큰 데이터 타입
export interface AuthTokenData {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
}

// 회원가입 응답 타입
export interface SignupResponse extends ApiResponse<AuthTokenData> {}

// 로그인 응답 타입
export interface LoginResponse extends ApiResponse<AuthTokenData> {}

// 로그아웃 응답 타입
export interface LogoutResponse extends ApiResponse<null> {}

// 토큰 갱신 응답 타입
export interface RefreshTokenResponse extends ApiResponse<AuthTokenData> {}

// 인증 서비스
export class AuthService {
  // 회원가입
  static async signup(credentials: SignupRequest): Promise<AuthTokenData> {
    const response = await mainApi.post<SignupResponse>(
      '/admin/signup',
      credentials
    );

    if (response.data.result && response.data.data) {
      // 토큰을 로컬 스토리지에 저장
      TokenManager.setTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );

      return response.data.data;
    } else {
      throw new Error(response.data.message || '회원가입에 실패했습니다.');
    }
  }

  // 로그인
  static async login(credentials: LoginRequest): Promise<AuthTokenData> {
    const response = await mainApi.post<LoginResponse>(
      '/auth/login',
      credentials
    );

    if (response.data.result && response.data.data) {
      // 토큰을 로컬 스토리지에 저장
      TokenManager.setTokens(
        response.data.data.accessToken,
        response.data.data.refreshToken
      );

      return response.data.data;
    } else {
      throw new Error(response.data.message || '로그인에 실패했습니다.');
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    try {
      // 서버에 로그아웃 요청
      await mainApi.post<LogoutResponse>('/auth/logout');
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

      const response = await mainApi.post<RefreshTokenResponse>(
        '/auth/refresh',
        { refreshToken }
      );

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

  // 현재 토큰으로 인증 상태 확인 (로컬에서만 체크)
  static verifyToken(): boolean {
    return TokenManager.hasValidTokens();
  }
}
