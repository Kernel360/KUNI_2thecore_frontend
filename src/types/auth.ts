// 인증 관련 타입 정의 (통합)

/** JWT 토큰 정보 */
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** 로그인 사용자 정보 */
export interface User {
  loginId: string;
  email?: string;
  roles: string[];
}

/** 로그인 응답 */
export interface LoginResponse {
  user: User;
  tokens: TokenInfo;
}

/** 토큰 검증 응답 */
export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
}

// API 요청 타입들

/** 로그인 요청 */
export interface LoginRequest {
  loginId: string;
  password: string;
}

/** 회원가입 요청 */
export interface SignupRequest {
  loginId: string;
  password: string;
  email?: string;
}

/** 사용자 정보 수정 요청 */
export interface UserUpdateRequest {
  email?: string;
  password?: string;
}

/** 토큰 리프레시 요청 */
export interface RefreshTokenRequest {
  refreshToken: string;
}