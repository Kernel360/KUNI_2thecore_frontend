import { useCallback, useEffect, useRef, useState } from 'react'

export interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: number
}

export interface UseWebSocketOptions {
  url: string
  protocols?: string | string[]
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  reconnectAttempts?: number
  reconnectInterval?: number
  heartbeat?: {
    message: string
    interval: number
  }
}

export interface UseWebSocketReturn {
  socket: WebSocket | null
  lastMessage: WebSocketMessage | null
  connectionStatus: 'Connecting' | 'Open' | 'Closing' | 'Closed'
  sendMessage: (message: any) => void
  reconnect: () => void
  disconnect: () => void
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    protocols,
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectAttempts = 3,
    reconnectInterval = 3000,
    heartbeat
  } = options

  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Open' | 'Closing' | 'Closed'>('Closed')
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(true)

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      setConnectionStatus('Connecting')
      const ws = new WebSocket(url, protocols)

      ws.onopen = (event) => {
        setConnectionStatus('Open')
        setSocket(ws)
        reconnectAttemptsRef.current = 0
        
        if (heartbeat) {
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(heartbeat.message)
            }
          }, heartbeat.interval)
        }
        
        onOpen?.(event)
      }

      ws.onmessage = (event) => {
        let message: WebSocketMessage
        try {
          const parsedData = JSON.parse(event.data)
          message = {
            type: parsedData.type || 'message',
            data: parsedData.data || parsedData,
            timestamp: Date.now()
          }
        } catch {
          message = {
            type: 'message',
            data: event.data,
            timestamp: Date.now()
          }
        }
        
        setLastMessage(message)
        onMessage?.(message)
      }

      ws.onerror = (event) => {
        setConnectionStatus('Closed')
        onError?.(event)
      }

      ws.onclose = (event) => {
        setConnectionStatus('Closed')
        setSocket(null)
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
        }
        
        if (shouldReconnectRef.current && reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectAttemptsRef.current += 1
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
        
        onClose?.(event)
      }

    } catch (error) {
      setConnectionStatus('Closed')
      console.error('WebSocket 연결 오류:', error)
    }
  }, [url, protocols, onOpen, onMessage, onError, onClose, reconnectAttempts, reconnectInterval, heartbeat])

  const sendMessage = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      if (typeof message === 'string') {
        socket.send(message)
      } else {
        socket.send(JSON.stringify(message))
      }
    }
  }, [socket])

  const reconnect = useCallback(() => {
    shouldReconnectRef.current = true
    reconnectAttemptsRef.current = 0
    if (socket) {
      socket.close()
    } else {
      connect()
    }
  }, [socket, connect])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    if (socket) {
      setConnectionStatus('Closing')
      socket.close()
    }
  }, [socket])

  useEffect(() => {
    connect()
    
    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [])

  return {
    socket,
    lastMessage,
    connectionStatus,
    sendMessage,
    reconnect,
    disconnect
  }
}