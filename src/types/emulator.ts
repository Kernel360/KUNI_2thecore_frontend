// 에뮬레이터 관련 타입 정의 (통합)

/** 에뮬레이터 상태 타입 */
export type EmulatorStatus = 'ON' | 'OFF';

/** 에뮬레이터 기본 정보 */
export interface Emulator {
  deviceId: string;
  carNumber: string;
  emulatorStatus: EmulatorStatus;
}

/** WebSocket 메시지 타입 */
export interface WebSocketMessage {
  loginId: string;
  carNumber: string;
  logList: Array<{
    latitude: string;
    longitude: string;
    timestamp: string;
  }>;
}

// API 요청 타입들

/** 에뮬레이터 등록/수정 요청 */
export interface EmulatorRequest {
  carNumber: string;
  emulatorStatus?: EmulatorStatus;
}

/** 에뮬레이터 페이징 요청 */
export interface EmulatorPageRequest {
  page: number;
  size: number;
  sort?: string;
}