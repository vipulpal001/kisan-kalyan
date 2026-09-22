import { useState, useEffect } from 'react';
import websocketService from '../services/websocket';

/**
 * Hook for subscribing to a WebSocket topic with automatic cleanup
 */
export function useWebSocketSubscription(topic, callback) {
  useEffect(() => {
    if (!topic || !callback) return;
    const unsubscribe = websocketService.subscribe(topic, callback);
    return () => unsubscribe();
  }, [topic, callback]);
}

/**
 * Hook for tracking WebSocket connection status
 */
export function useWebSocketStatus() {
  const [status, setStatus] = useState(websocketService.status);

  useEffect(() => {
    const unsub = websocketService.addStatusListener(setStatus);
    return () => unsub();
  }, []);

  return status;
}

export default websocketService;
