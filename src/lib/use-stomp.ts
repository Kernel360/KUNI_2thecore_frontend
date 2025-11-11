import { Client, IMessage } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    if (!url) return;

    // JWT 액세스 토큰 가져오기
    const accessToken = TokenManager.getAccessToken();

    if (debug) {
      console.log('🔌 STOMP 연결 시도:', {
        url,
        hasToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.slice(0, 20)}...` : 'none',
      });
    }

    const stompClient = new Client({
      // 네이티브 WebSocket 사용 (쿼리 파라미터 없이)
      brokerURL: url,
      reconnectDelay,
      debug: debug ? str => console.log('[STOMP]', str) : undefined,

      // STOMP CONNECT 프레임 헤더에만 토큰 포함
      connectHeaders: {
        get Authorization() {
          const token = TokenManager.getAccessToken();
          return token ? `Bearer ${token}` : '';
        },
      },

      // WebSocket 생성 시 추가 옵션
      beforeConnect: () => {
        if (debug) console.log('🔄 WebSocket 연결 직전...');
      },

      onConnect: () => {
        if (debug) console.log('✅ STOMP 연결 성공', { url });
        setConnected(true);
        onConnect?.();
      },

      onDisconnect: () => {
        if (debug) console.log('🔴 STOMP 연결 종료', { url });
        setConnected(false);
        onDisconnect?.();
      },

      onStompError: frame => {
        console.error('❌ STOMP 에러:', {
          url,
          message: frame.headers['message'],
          body: frame.body,
          headers: frame.headers,
        });
        onError?.(frame);
      },

      onWebSocketError: event => {
        const ws = event.target as any;
        console.error('❌ WebSocket 에러:', {
          url,
          readyState: ws?.readyState,
          readyStateText:
            ['연결중', '연결됨', '닫는중', '닫힘'][ws?.readyState] ||
            '알수없음',
          error: event,
          type: event.type,
        });
        console.error('💡 확인 필요:', {
          '1. 백엔드 서버': `${url} 엔드포인트가 작동 중인가?`,
          '2. CORS 설정': '백엔드에서 현재 오리진을 허용하는가?',
          '3. SSL 인증서': 'wss:// 사용 시 유효한 인증서가 있는가?',
          '4. 방화벽': 'WebSocket 연결이 차단되지 않았는가?',
        });
        onError?.(event);
      },

      onWebSocketClose: event => {
        console.warn('🔌 WebSocket 닫힘:', {
          url,
          code: event.code,
          reason: event.reason || '이유 없음',
          wasClean: event.wasClean,
          reconnectDelay: `${reconnectDelay}ms`,
          commonCodes: {
            1000: '정상 종료',
            1001: '엔드포인트 없음',
            1006: '비정상 종료 (연결 실패)',
            1011: '서버 오류',
            1015: 'TLS 핸드셰이크 실패',
          },
        });
        if (debug && reconnectDelay > 0) {
          console.log(`⏱️ ${reconnectDelay}ms 후 재연결 시도...`);
        }
      },
    });

    // STOMP 연결 활성화
    stompClient.activate();
    clientRef.current = stompClient;

    // Cleanup: URL 변경 시 또는 컴포넌트 unmount 시 연결 종료
    return () => {
      if (debug) console.log('🧹 STOMP 연결 정리 중...');
      subscriptionsRef.current.clear();
      stompClient.deactivate();
    };
  }, [url]); // URL만 의존성에 포함 (다른 props 변경 시 재연결 안 함)

  /**
   * STOMP 채널 구독
   * @param destination 구독할 채널 (예: /location/cars/12가1234)
   * @param callback 메시지 수신 시 실행할 콜백
   */
  const subscribe = useCallback(
    (destination: string, callback: (message: IMessage) => void) => {
      const client = clientRef.current;

      if (!client) {
        console.warn('⚠️ STOMP 클라이언트가 없습니다.');
        return;
      }

      if (!connected) {
        console.warn('⚠️ STOMP 연결 대기 중... 구독 실패:', destination);
        return;
      }

      // 이미 구독 중이면 스킵
      if (subscriptionsRef.current.has(destination)) {
        if (debug) console.log('⚠️ 이미 구독 중:', destination);
        return;
      }

      try {
        if (debug) console.log('📡 구독 시도:', destination);
        const subscription = client.subscribe(destination, callback);
        subscriptionsRef.current.set(destination, subscription);
        if (debug) console.log('✅ 구독 성공:', destination);
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
