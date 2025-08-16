/**
 * JWT 토큰 관리 유틸리티
 * - Access Token: 로컬스토리지에 저장 (10분 유효)
 * - Refresh Token: 백엔드에서 HttpOnly 쿠키로 자동 관리 (7일 유효)
 */
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly LOGIN_ID_KEY = 'loginId';

  /**
   * 로그인 시 토큰 저장
   * @param accessToken JWT 액세스 토큰
   * @param loginId 사용자 로그인 ID
   */
  static setTokens(accessToken: string, loginId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.LOGIN_ID_KEY, loginId);
    }
  }

  /**
   * 새로운 액세스 토큰으로 업데이트
   * @param accessToken 새로운 JWT 액세스 토큰
   */
  static updateAccessToken(accessToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    }
  }

  /**
   * Authorization 헤더용 액세스 토큰 조회
   * @returns Bearer 토큰 형식의 문자열 또는 null
   */
  static getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * 액세스 토큰 조회
   * @returns 액세스 토큰 또는 null
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * 로그인 ID 조회
   * @returns 로그인 ID 또는 null
   */
  static getLoginId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.LOGIN_ID_KEY);
    }
    return null;
  }

  /**
   * 인증 상태 확인 (액세스 토큰 존재 여부)
   * @returns 토큰이 있으면 true, 없으면 false
   */
  static hasValidTokens(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * 로그아웃 처리 - 로컬 토큰 삭제
   * (리프레시 토큰은 백엔드에서 쿠키 삭제로 처리)
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.LOGIN_ID_KEY);
    }
  }
}
