// 사용 예시 파일 - 실제 컴포넌트에서 참고용

import { useWebSocket, WebSocketMessage } from './use-websocket';

export function WebSocketExample() {
  const { connectionStatus, lastMessage, sendMessage, reconnect, disconnect } =
    useWebSocket({
      url: 'ws://localhost:8080/websocket',
      onOpen: event => {
        console.log('WebSocket 연결됨:', event);
      },
      onMessage: (message: WebSocketMessage) => {
        console.log('메시지 수신:', message);
        // 특정 메시지 타입에 따른 처리
        switch (message.type) {
          case 'car_update':
            // 차량 정보 업데이트 처리
            break;
          case 'gps_location':
            // GPS 위치 업데이트 처리
            break;
          case 'system_alert':
            // 시스템 알림 처리
            break;
        }
      },
      onError: event => {
        console.error('WebSocket 오류:', event);
      },
      onClose: event => {
        console.log('WebSocket 연결 종료:', event);
      },
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      heartbeat: {
        message: JSON.stringify({ type: 'ping' }),
        interval: 30000,
      },
    });

  const handleSendMessage = () => {
    sendMessage({
      type: 'car_request',
      data: { carNumber: '12가 1234' },
    });
  };

  const handleSendGpsUpdate = () => {
    sendMessage({
      type: 'gps_update',
      data: {
        carNumber: '12가 1234',
        latitude: 37.5665,
        longitude: 126.978,
      },
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-semibold">연결 상태:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'Open'
              ? 'bg-green-100 text-green-800'
              : connectionStatus === 'Connecting'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }`}
        >
          {connectionStatus === 'Open'
            ? '연결됨'
            : connectionStatus === 'Connecting'
              ? '연결 중'
              : connectionStatus === 'Closing'
                ? '종료 중'
                : '연결 끊김'}
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleSendMessage}
          disabled={connectionStatus !== 'Open'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          차량 정보 요청
        </button>
        <button
          onClick={handleSendGpsUpdate}
          disabled={connectionStatus !== 'Open'}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          GPS 위치 전송
        </button>
        <button
          onClick={reconnect}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          재연결
        </button>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          연결 종료
        </button>
      </div>

      {lastMessage && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">마지막 수신 메시지:</h3>
          <pre className="text-sm">{JSON.stringify(lastMessage, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// 차량 실시간 추적용 훅 사용 예시
export function usecarTracking() {
  return useWebSocket({
    url: 'ws://localhost:8080/car-tracking',
    onMessage: message => {
      if (message.type === 'car_location') {
        // 지도에 차량 위치 업데이트
        console.log('차량 위치 업데이트:', message.data);
      } else if (message.type === 'car_status') {
        // 차량 상태 업데이트 (운행/대기/수리)
        console.log('차량 상태 변경:', message.data);
      }
    },
    reconnectAttempts: 10,
    reconnectInterval: 5000,
    heartbeat: {
      message: JSON.stringify({ type: 'heartbeat' }),
      interval: 30000,
    },
  });
}

// GPS 에뮬레이터 제어용 훅 사용 예시
export function useEmulatorControl() {
  return useWebSocket({
    url: 'ws://localhost:8080/emulator-control',
    onMessage: message => {
      if (message.type === 'emulator_status') {
        // 에뮬레이터 ON/OFF 상태 업데이트
        console.log('에뮬레이터 상태:', message.data);
      } else if (message.type === 'emulator_registered') {
        // 새 에뮬레이터 등록 완료
        console.log('에뮬레이터 등록됨:', message.data);
      }
    },
  });
}
