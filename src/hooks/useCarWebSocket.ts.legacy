import { useThrottledCallback } from '@/hooks/useThrottledCallback';
import { useTokenBucketRateLimiter } from '@/hooks/useTokenBucketRateLimiter';
import { TokenManager } from '@/lib/token-manager';
import {
  useWebSocket,
  UseWebSocketOptions,
  WebSocketMessage,
} from '@/lib/use-websocket';
import {
  CarLocationMessage,
  SingleCarLocationMessage,
} from '@/types/websocket';
import { useRef } from 'react';

const WEBSOCKET_URL =
  import.meta.env.VITE_WEBSOCKET_URL || 'ws://43.203.110.104:8080/ws';

// 개별 차량 구독용 WebSocket 훅 (Detail 페이지용)
export function useSingleCarWebSocket(
  carNumber: string,
  onCarLocationUpdate: (carData: SingleCarLocationMessage['data']) => void,
  enabled: boolean = true
) {
  // Token Bucket: capacity=4 (버스트 4회), refillRate=2 (초당 2개 충전)
  const { tryExecute: tryUpdateLocation } = useTokenBucketRateLimiter(4, 2);

  // 쓰로틀링 추가 (2초마다 최대 1회) - 이중 보호
  const throttledUpdate = useThrottledCallback(
    (carData: SingleCarLocationMessage['data']) => {
      tryUpdateLocation(() => onCarLocationUpdate(carData));
    },
    2000
  );

  // enabled가 false일 때는 빈 URL로 연결 시도하지 않음
  const websocket = useWebSocket({
    url: enabled && carNumber ? WEBSOCKET_URL : '',
    onOpen: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`차량 ${carNumber} WebSocket 연결됨`);
      }

      // JWT 토큰이 있다면 인증 메시지 전송
      const token = TokenManager.getAccessToken();
      if (token && websocket.socket) {
        websocket.sendMessage({
          type: 'auth',
          token: token,
        });
      }
    },
    onMessage: (message: WebSocketMessage) => {
      try {
        if (message.type === 'car_location_update' && message.data) {
          throttledUpdate(message.data);
        }
      } catch (error) {
        console.error(`차량 ${carNumber} 메시지 처리 오류:`, error);
      }
    },
    onError: event => {
      console.error(`차량 ${carNumber} WebSocket 오류:`, event);
    },
    onClose: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`차량 ${carNumber} WebSocket 종료:`, event.code);
      }
    },
    reconnectAttempts: 3,
    reconnectInterval: 5000,
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 300000, // 5분마다 하트비트
    },
  });

  const subscribedRef = useRef(false);

  // 메시지 전송도 Token Bucket 적용 (capacity=2, refillRate=1)
  const { tryExecute: trySendMessage } = useTokenBucketRateLimiter(2, 1);

  return {
    ...websocket,
    isConnected: websocket.connectionStatus === 'Open',
    subscribeToCarLocation: () => {
      if (
        websocket.socket &&
        websocket.connectionStatus === 'Open' &&
        !subscribedRef.current
      ) {
        trySendMessage(() => {
          websocket.sendMessage({
            type: 'subscribe',
            channel: `/location/cars/${carNumber}`,
          });
        });
        subscribedRef.current = true;
        if (process.env.NODE_ENV === 'development') {
          console.log(`차량 ${carNumber} 구독 시작`);
        }
      }
    },
    unsubscribeFromCarLocation: () => {
      if (
        websocket.socket &&
        websocket.connectionStatus === 'Open' &&
        subscribedRef.current
      ) {
        trySendMessage(() => {
          websocket.sendMessage({
            type: 'unsubscribe',
            channel: `/location/cars/${carNumber}`,
          });
        });
        subscribedRef.current = false;
        if (process.env.NODE_ENV === 'development') {
          console.log(`차량 ${carNumber} 구독 해제`);
        }
      }
    },
  };
}

// 여러 운행 차량 구독용 WebSocket 훅 (메인 페이지용)
export function useMultipleCarWebSocket(
  carNumbers: string[],
  onCarLocationUpdate: (carData: SingleCarLocationMessage['data']) => void,
  enabled: boolean = true
) {
  // Token Bucket: capacity=2 (버스트 2회), refillRate=1 (초당 1개 충전)
  const { tryExecute: tryUpdateLocation } = useTokenBucketRateLimiter(2, 1);

  // 쓰로틀링 추가 (5초마다 최대 1회) - 이중 보호
  const throttledUpdate = useThrottledCallback(
    (carData: SingleCarLocationMessage['data']) => {
      tryUpdateLocation(() => onCarLocationUpdate(carData));
    },
    5000
  );

  // enabled가 false이거나 차량이 없으면 연결하지 않음
  const websocket = useWebSocket({
    url: enabled && carNumbers.length > 0 ? WEBSOCKET_URL : '',
    onOpen: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`다중 차량 WebSocket 연결됨 (${carNumbers.length}대)`);
      }

      // JWT 토큰이 있다면 인증 메시지 전송
      const token = TokenManager.getAccessToken();
      if (token && websocket.socket) {
        websocket.sendMessage({
          type: 'auth',
          token: token,
        });
      }
    },
    onMessage: (message: WebSocketMessage) => {
      try {
        if (message.type === 'car_location_update' && message.data) {
          throttledUpdate(message.data);
        }
      } catch (error) {
        console.error('다중 차량 메시지 처리 오류:', error);
      }
    },
    onError: event => {
      console.error('다중 차량 WebSocket 오류:', event);
    },
    onClose: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log('다중 차량 WebSocket 종료:', event.code);
      }
    },
    reconnectAttempts: 3,
    reconnectInterval: 5000,
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 300000, // 5분마다 하트비트
    },
  });

  const subscribedCarsRef = useRef(new Set<string>());

  // 메시지 전송도 Token Bucket 적용 (다중 차량이므로 더 보수적)
  const { tryExecute: trySendMessage } = useTokenBucketRateLimiter(2, 0.5);

  return {
    ...websocket,
    isConnected: websocket.connectionStatus === 'Open',
    subscribeToMultipleCars: () => {
      if (websocket.socket && websocket.connectionStatus === 'Open') {
        const newSubscriptions = carNumbers.filter(
          carNumber => !subscribedCarsRef.current.has(carNumber)
        );

        newSubscriptions.forEach(carNumber => {
          trySendMessage(() => {
            websocket.sendMessage({
              type: 'subscribe',
              channel: `/location/cars/${carNumber}`,
            });
          });
          subscribedCarsRef.current.add(carNumber);
        });

        if (
          process.env.NODE_ENV === 'development' &&
          newSubscriptions.length > 0
        ) {
          console.log(
            `신규 차량 ${newSubscriptions.length}대 구독 시작:`,
            newSubscriptions
          );
        }
      }
    },
    unsubscribeFromMultipleCars: () => {
      if (websocket.socket && websocket.connectionStatus === 'Open') {
        carNumbers.forEach(carNumber => {
          if (subscribedCarsRef.current.has(carNumber)) {
            trySendMessage(() => {
              websocket.sendMessage({
                type: 'unsubscribe',
                channel: `/location/cars/${carNumber}`,
              });
            });
            subscribedCarsRef.current.delete(carNumber);
          }
        });

        if (process.env.NODE_ENV === 'development' && carNumbers.length > 0) {
          console.log(`차량 ${carNumbers.length}대 구독 해제`);
        }
      }
    },
  };
}

// 차량 위치 WebSocket 옵션 생성 헬퍼
export function createCarLocationWebSocketOptions(
  onCarLocationUpdate: (cars: CarLocationMessage['data']) => void,
  onError?: (error: Event) => void
): UseWebSocketOptions {
  const WEBSOCKET_URL =
    import.meta.env.VITE_WEBSOCKET_URL ||
    'ws://43.203.110.104:8080/ws/map/running';

  return {
    url: WEBSOCKET_URL,
    onOpen: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log('차량 위치 WebSocket 연결 성공');
      }

      const token = TokenManager.getAccessToken();
      if (token) {
        // WebSocket 연결 후 인증 토큰 전송 (백엔드 구현에 따라)
      }
    },
    onMessage: (message: WebSocketMessage) => {
      try {
        if (message.type === 'car_location_update' && message.data) {
          onCarLocationUpdate(message.data);
        }
      } catch (error) {
        console.error('차량 위치 메시지 처리 오류:', error);
      }
    },
    onError: event => {
      console.error('차량 위치 WebSocket 오류:', event);
      onError?.(event);
    },
    onClose: event => {
      if (process.env.NODE_ENV === 'development') {
        console.log('차량 위치 WebSocket 연결 종료:', event.code, event.reason);
      }
    },
    reconnectAttempts: 3,
    reconnectInterval: 5000,
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 300000,
    },
  };
}

// 차량 위치 실시간 구독 훅 (기존 - 호환성 유지)
export function useCarLocationWebSocket(
  onCarLocationUpdate: (cars: CarLocationMessage['data']) => void,
  enabled: boolean = true
) {
  const options = createCarLocationWebSocketOptions(onCarLocationUpdate);

  const websocket = useWebSocket({
    ...options,
    url: enabled ? options.url : '',
  });

  return {
    ...websocket,
    isConnected: websocket.connectionStatus === 'Open',
    subscribe: () => {
      if (websocket.socket && websocket.connectionStatus === 'Open') {
        websocket.sendMessage({
          type: 'subscribe',
          topic: 'car_locations',
        });
      }
    },
    unsubscribe: () => {
      if (websocket.socket && websocket.connectionStatus === 'Open') {
        websocket.sendMessage({
          type: 'unsubscribe',
          topic: 'car_locations',
        });
      }
    },
  };
}
