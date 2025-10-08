// WebSocket Service - Re-exports for backward compatibility
// 이 파일은 기존 import 경로 호환성을 위해 유지됩니다.

export type {
  CarLocationData,
  CarLocationMessage,
  CarStatus,
  SingleCarLocationMessage,
} from '@/types/websocket';

export {
  createCarLocationWebSocketOptions,
  useCarLocationWebSocket,
  useMultipleCarWebSocket,
  useSingleCarWebSocket,
} from '@/hooks/useCarWebSocket';
