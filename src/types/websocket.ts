// WebSocket 메시지 타입
export type CarStatus = '운행' | '대기' | '수리';

// 차량 위치 데이터
export interface CarLocationData {
  carNumber: string;
  status: CarStatus;
  lastLatitude: string;
  lastLongitude: string;
  timestamp?: string;
}

// 차량 위치 WebSocket 메시지
export interface CarLocationMessage {
  type: 'car_location_update' | 'car_status_change' | 'heartbeat';
  data: CarLocationData[];
}

// 개별 차량 WebSocket 메시지
export interface SingleCarLocationMessage {
  type: 'car_location_update' | 'car_status_change' | 'heartbeat';
  data: CarLocationData;
}
