// JWT 토큰 관리 유틸리티
export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly LOGIN_ID_KEY = 'loginId';

  // Access Token 저장
  static setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  // Refresh Token 저장
  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  // loginId 저장
  static setLoginId(loginId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.LOGIN_ID_KEY, loginId);
    }
  }

  // 두 토큰을 함께 저장
  static setTokens(accessToken: string, refreshToken: string, loginId: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setLoginId(loginId);
  }

  // Access Token 조회
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // Refresh Token 조회
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  // loginId 조회
  static getLoginId(): string {
    if (typeof window !== 'undefined') {
      const loginId = localStorage.getItem(this.LOGIN_ID_KEY);
      if (loginId) {
        return loginId;
      }
    }
    return '저장된 로그인 ID가 없습니다.'; 
  }

  // 토큰 존재 여부 확인
  static hasValidTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  // 모든 토큰 삭제 (로그아웃)
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.LOGIN_ID_KEY);
    }
  }
}
