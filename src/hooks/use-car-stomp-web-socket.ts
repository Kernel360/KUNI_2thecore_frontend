import { useStomp } from '@/lib/use-stomp';
import { CarLocationData } from '@/types/websocket';
import { IMessage } from '@stomp/stompjs';
import { useCallback, useEffect } from 'react';
import { useThrottledCallback } from './use-throttled-callback';
import { useTokenBucketRateLimiter } from './use-token-bucket-rate-limiter';

const WEBSOCKET_URL =
  import.meta.env.VITE_WEBSOCKET_URL || 'wss://43.203.110.104:8080/wss';

/**
 * 개별 차량 위치 구독용 STOMP WebSocket 훅 (Detail 페이지용)
 * Spring STOMP 서버와 통신
 */
export function useSingleCarStompWebSocket(
  carNumber: string,
  onCarLocationUpdate: (carData: CarLocationData) => void,
  enabled: boolean = true
) {
  // Token Bucket: capacity=4 (버스트 4회), refillRate=2 (초당 2개 충전)
  const { tryExecute: tryUpdateLocation } = useTokenBucketRateLimiter(4, 2);

  // 쓰로틀링 추가 (2초마다 최대 1회) - 이중 보호
  const throttledUpdate = useThrottledCallback((carData: CarLocationData) => {
    tryUpdateLocation(() => onCarLocationUpdate(carData));
  }, 2000);

  const { connected, subscribe, unsubscribe, disconnect } = useStomp({
    url: enabled && carNumber ? WEBSOCKET_URL : '',
    onConnect: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ 차량 ${carNumber} STOMP 연결 성공`);
      }
    },
    onDisconnect: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔴 차량 ${carNumber} STOMP 연결 종료`);
      }
    },
    onError: error => {
      console.error(`❌ 차량 ${carNumber} STOMP 오류:`, error);
    },
    reconnectDelay: 5000,
  });

  // 구독 함수
  const subscribeToCarLocation = useCallback(() => {
    if (!connected || !carNumber) return;

    const destination = `/location/cars/${carNumber}`;

    subscribe(destination, (message: IMessage) => {
      try {
        const data: CarLocationData = JSON.parse(message.body);
        if (process.env.NODE_ENV === 'development') {
          console.log(`📍 차량 ${carNumber} 위치 업데이트:`, data);
        }
        throttledUpdate(data);
      } catch (error) {
        console.error(`❌ 차량 ${carNumber} 메시지 파싱 오류:`, error);
      }
    });
  }, [connected, carNumber, subscribe, throttledUpdate]);

  // 구독 해제 함수
  const unsubscribeFromCarLocation = useCallback(() => {
    if (!carNumber) return;
    const destination = `/location/cars/${carNumber}`;
    unsubscribe(destination);
  }, [carNumber, unsubscribe]);

  // 자동 구독/정리
  useEffect(() => {
    if (connected && enabled && carNumber) {
      subscribeToCarLocation();
    }

    return () => {
      unsubscribeFromCarLocation();
      if (enabled) {
        disconnect();
      }
    };
  }, [
    connected,
    enabled,
    carNumber,
    subscribeToCarLocation,
    unsubscribeFromCarLocation,
    disconnect,
  ]);

  return {
    isConnected: connected,
    subscribeToCarLocation,
    unsubscribeFromCarLocation,
    disconnect,
  };
}

/**
 * 여러 운행 차량 구독용 STOMP WebSocket 훅 (메인 페이지용)
 * Spring STOMP 서버와 통신
 */
export function useMultipleCarStompWebSocket(
  carNumbers: string[],
  onCarLocationUpdate: (carData: CarLocationData) => void,
  enabled: boolean = true
) {
  // Token Bucket: capacity=2 (버스트 2회), refillRate=1 (초당 1개 충전)
  const { tryExecute: tryUpdateLocation } = useTokenBucketRateLimiter(2, 1);

  // 쓰로틀링 추가 (5초마다 최대 1회) - 이중 보호
  const throttledUpdate = useThrottledCallback((carData: CarLocationData) => {
    tryUpdateLocation(() => onCarLocationUpdate(carData));
  }, 5000);

  const { connected, subscribe, unsubscribe, disconnect } = useStomp({
    url: enabled && carNumbers.length > 0 ? WEBSOCKET_URL : '',
    onConnect: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ 다중 차량 STOMP 연결 성공 (${carNumbers.length}대)`);
      }
    },
    onDisconnect: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔴 다중 차량 STOMP 연결 종료`);
      }
    },
    onError: error => {
      console.error(`❌ 다중 차량 STOMP 오류:`, error);
    },
    reconnectDelay: 5000,
  });

  // 구독 함수
  const subscribeToMultipleCars = useCallback(() => {
    if (!connected || carNumbers.length === 0) return;

    carNumbers.forEach(carNumber => {
      const destination = `/location/cars/${carNumber}`;

      subscribe(destination, (message: IMessage) => {
        try {
          const data: CarLocationData = JSON.parse(message.body);
          throttledUpdate(data);
        } catch (error) {
          console.error(`❌ 차량 ${carNumber} 메시지 파싱 오류:`, error);
        }
      });
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 ${carNumbers.length}대 차량 구독 시작`);
    }
  }, [connected, carNumbers, subscribe, throttledUpdate]);

  // 구독 해제 함수
  const unsubscribeFromMultipleCars = useCallback(() => {
    carNumbers.forEach(carNumber => {
      const destination = `/location/cars/${carNumber}`;
      unsubscribe(destination);
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`📴 ${carNumbers.length}대 차량 구독 해제`);
    }
  }, [carNumbers, unsubscribe]);

  // 자동 구독/정리
  useEffect(() => {
    if (connected && enabled && carNumbers.length > 0) {
      subscribeToMultipleCars();
    }

    return () => {
      unsubscribeFromMultipleCars();
      if (enabled) {
        disconnect();
      }
    };
  }, [
    connected,
    enabled,
    carNumbers,
    subscribeToMultipleCars,
    unsubscribeFromMultipleCars,
    disconnect,
  ]);

  return {
    isConnected: connected,
    subscribeToMultipleCars,
    unsubscribeFromMultipleCars,
    disconnect,
  };
}
