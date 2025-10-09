// WebSocket Service - STOMP 기반 (Spring STOMP 백엔드 지원)
// Native WebSocket → STOMP Protocol 마이그레이션 완료

export type {
  CarLocationData,
  CarLocationMessage,
  CarStatus,
  SingleCarLocationMessage,
} from '@/types/websocket';

// ✅ STOMP 기반 훅만 export (Spring STOMP 백엔드 지원)
export {
  useMultipleCarStompWebSocket,
  useSingleCarStompWebSocket,
} from '@/hooks/useCarStompWebSocket';
