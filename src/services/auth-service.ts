import { ApiResponse, mainApi } from '@/lib/api';
import { TokenManager } from '@/lib/token-manager';

// 로그인 요청 타입
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 인증 토큰 데이터 타입 - 프론트엔드에서 관리하는 데이터만
export interface AuthTokenData {
  accessToken: string;
  // refreshToken은 백엔드에서 쿠키로 자동 관리하므로 프론트엔드 타입에서 제외
}

// 로그인 응답 타입 - 백엔드 명세에 맞게
export interface LoginResponse extends ApiResponse<AuthTokenData> {}

// 로그아웃 응답 타입 - 백엔드 명세에 맞게
export interface LogoutResponse extends ApiResponse<null> {}

// 토큰 검증 응답 데이터 타입
export interface TokenValidationData {
  valid: boolean;
  newAccessToken?: string;
}

// 토큰 검증 응답 타입
export interface TokenValidationResponse
  extends ApiResponse<TokenValidationData> {}

// 인증 서비스
export class AuthService {
  // 로그인
  static async login(credentials: LoginRequest): Promise<AuthTokenData> {
    const response = await mainApi.post<LoginResponse>(
      '/auth/login',
      credentials
    );

    if (response.data.result && response.data.data) {
      // Access Token만 로컬스토리지에 저장 (Refresh Token은 쿠키로 자동 관리)
      TokenManager.setTokens(
        response.data.data.accessToken,
        credentials.loginId
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

  // 인증 상태 확인 (로컬 토큰 존재 여부만 체크)
  static hasValidTokens(): boolean {
    return TokenManager.hasValidTokens();
  }
}
