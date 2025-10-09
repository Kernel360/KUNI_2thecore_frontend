import { Client, IMessage } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { TokenManager } from './token-manager';

export interface UseStompOptions {
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  reconnectDelay?: number;
  debug?: boolean;
}

export interface UseStompReturn {
  client: Client | null;
  connected: boolean;
  subscribe: (
    destination: string,
    callback: (message: IMessage) => void
  ) => void;
  unsubscribe: (destination: string) => void;
  send: (destination: string, payload: any) => void;
  disconnect: () => void;
}

/**
 * Spring STOMP WebSocket 연결을 위한 커스텀 훅
 * - SockJS + STOMP 프로토콜 사용
 * - JWT 토큰 자동 전송
 * - 자동 재연결 지원
 */
export function useStomp(options: UseStompOptions): UseStompReturn {
  const {
    url,
    onConnect,
    onDisconnect,
    onError,
    reconnectDelay = 5000,
    debug = process.env.NODE_ENV === 'development',
  } = options;

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // SockJS는 HTTP/http URL을 받아야 함 (ws:// 프로토콜 자동 변환)
    const httpUrl = url
      .replace(/^ws:\/\//, 'http://')
      .replace(/^ws:\/\//, 'http://');
    const sock = new SockJS(httpUrl);

    // JWT 액세스 토큰 가져오기
    const accessToken = TokenManager.getAccessToken();

    const stompClient = new Client({
      webSocketFactory: () => sock as any,
      reconnectDelay,
      debug: debug ? str => console.log('[STOMP]', str) : undefined,

      // STOMP 연결 시 Authorization 헤더에 액세스 토큰 포함
      connectHeaders: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},

      onConnect: () => {
        if (debug) console.log('✅ STOMP 연결 성공');
        setConnected(true);
        onConnect?.();
      },

      onDisconnect: () => {
        if (debug) console.log('🔴 STOMP 연결 종료');
        setConnected(false);
        onDisconnect?.();
      },

      onStompError: frame => {
        console.error('❌ STOMP 에러:', frame.headers['message']);
        console.error('상세:', frame.body);
        onError?.(frame);
      },

      onWebSocketError: event => {
        console.error('❌ WebSocket 에러:', event);
        onError?.(event);
      },
    });

    // STOMP 연결 활성화
    stompClient.activate();
    clientRef.current = stompClient;

    // Cleanup: 컴포넌트 unmount 시 연결 종료
    return () => {
      if (debug) console.log('🧹 STOMP 연결 정리 중...');
      subscriptionsRef.current.clear();
      stompClient.deactivate();
    };
  }, [url, reconnectDelay, debug, onConnect, onDisconnect, onError]);

  /**
   * STOMP 채널 구독
   * @param destination 구독할 채널 (예: /location/cars/12가1234)
   * @param callback 메시지 수신 시 실행할 콜백
   */
  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void) => {
      const client = clientRef.current;

      if (!client || !connected) {
        console.warn('⚠️ STOMP 연결 대기 중... 구독 실패:', destination);
        return;
      }

      // 이미 구독 중이면 스킵
      if (subscriptionsRef.current.has(destination)) {
        if (debug) console.log('⚠️ 이미 구독 중:', destination);
        return;
      }

      try {
        const subscription = client.subscribe(destination, callback);
        subscriptionsRef.current.set(destination, subscription);
        if (debug) console.log('📡 구독 시작:', destination);
      } catch (error) {
        console.error('❌ 구독 실패:', destination, error);
      }
    },
    [connected, debug]
  );

  /**
   * STOMP 채널 구독 해제
   * @param destination 구독 해제할 채널
   */
  const unsubscribe = useCallback(
    (destination: string) => {
      const subscription = subscriptionsRef.current.get(destination);

      if (subscription) {
        subscription.unsubscribe();
        subscriptionsRef.current.delete(destination);
        if (debug) console.log('📴 구독 해제:', destination);
      }
    },
    [debug]
  );

  /**
   * STOMP 메시지 전송
   * @param destination 메시지 목적지 (예: /app/request)
   * @param payload 전송할 데이터 (JSON 객체)
   */
  const send = useCallback(
    (destination: string, payload: any) => {
      const client = clientRef.current;

      if (!client || !connected) {
        console.warn('⚠️ STOMP 연결 대기 중... 전송 실패:', destination);
        return;
      }

      try {
        client.publish({
          destination,
          body: JSON.stringify(payload),
        });
        if (debug) console.log('📤 메시지 전송:', destination, payload);
      } catch (error) {
        console.error('❌ 메시지 전송 실패:', destination, error);
      }
    },
    [connected, debug]
  );

  /**
   * STOMP 연결 수동 종료
   */
  const disconnect = useCallback(() => {
    const client = clientRef.current;
    if (client) {
      subscriptionsRef.current.clear();
      client.deactivate();
      if (debug) console.log('🔌 STOMP 연결 종료');
    }
  }, [debug]);

  return {
    client: clientRef.current,
    connected,
    subscribe,
    unsubscribe,
    send,
    disconnect,
  };
}
