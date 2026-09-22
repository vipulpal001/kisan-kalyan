import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const getWsUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiUrl && apiUrl.startsWith('http')) {
    return apiUrl.replace(/\/api\/?$/, '') + '/ws';
  }
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}/ws`;
  }
  return 'http://localhost:8080/ws';
};

const WS_URL = getWsUrl();

class WebSocketService {
  constructor() {
    this.client = null;
    this.status = 'DISCONNECTED'; // 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
    this.listeners = new Set();
    this.subscriptions = new Map(); // topic -> Set of callback functions
    this.activeStompSubscriptions = new Map(); // topic -> Stomp subscription object
    this.reconnectAttempts = 0;
  }

  connect() {
    if (this.client && (this.client.active || this.status === 'CONNECTING')) {
      return;
    }

    this._setStatus('CONNECTING');

    this.client = new Client({
      // Using SockJS factory for full cross-browser & proxy compatibility
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => {
        if (import.meta.env.DEV) {
          // console.debug('[STOMP]', msg);
        }
      },
      onConnect: (frame) => {
        this.reconnectAttempts = 0;
        this._setStatus('CONNECTED');
        console.log('[WebSocket] Connected to Kisan Kalyan STOMP Broker:', frame.headers);

        // Re-establish any subscriptions that were requested before connection or lost
        this.subscriptions.forEach((callbacks, topic) => {
          this._subscribeToTopic(topic);
        });
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP Broker Error:', frame.headers['message'], frame.body);
        this._setStatus('ERROR');
      },
      onWebSocketClose: () => {
        this._setStatus('DISCONNECTED');
        this.reconnectAttempts++;
      },
      onWebSocketError: (event) => {
        console.warn('[WebSocket] Connection error:', event);
        this._setStatus('ERROR');
      }
    });

    try {
      this.client.activate();
    } catch (err) {
      console.error('[WebSocket] Activation failed:', err);
      this._setStatus('ERROR');
    }
  }

  disconnect() {
    if (this.client) {
      try {
        this.client.deactivate();
      } catch (err) {
        console.error('[WebSocket] Deactivation error:', err);
      }
    }
    this.activeStompSubscriptions.clear();
    this._setStatus('DISCONNECTED');
  }

  /**
   * Subscribe to any STOMP topic with a callback
   * Returns an unsubscribe function for React useEffect cleanup
   */
  subscribe(topic, callback) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic).add(callback);

    // If already connected, initiate active STOMP subscription
    if (this.status === 'CONNECTED' && this.client?.connected) {
      this._subscribeToTopic(topic);
    } else {
      // Connect if not already connected
      this.connect();
    }

    // Return cleanup function
    return () => {
      const callbacks = this.subscriptions.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscriptions.delete(topic);
          const stompSub = this.activeStompSubscriptions.get(topic);
          if (stompSub) {
            try {
              stompSub.unsubscribe();
            } catch (e) {}
            this.activeStompSubscriptions.delete(topic);
          }
        }
      }
    };
  }

  _subscribeToTopic(topic) {
    if (!this.client || !this.client.connected) return;
    if (this.activeStompSubscriptions.has(topic)) return;

    try {
      const stompSub = this.client.subscribe(topic, (message) => {
        try {
          const payload = JSON.parse(message.body);
          const callbacks = this.subscriptions.get(topic);
          if (callbacks) {
            callbacks.forEach((cb) => cb(payload));
          }
        } catch (parseErr) {
          console.error('[WebSocket] Failed to parse message on ' + topic, parseErr);
        }
      });
      this.activeStompSubscriptions.set(topic, stompSub);
    } catch (err) {
      console.error('[WebSocket] Error subscribing to ' + topic, err);
    }
  }

  _setStatus(status) {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }

  addStatusListener(listener) {
    this.listeners.add(listener);
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  // Domain-specific helpers
  subscribeToQueue(callback) {
    return this.subscribe('/topic/queue', callback);
  }

  subscribeToCenterQueue(centerId, callback) {
    return this.subscribe(`/topic/queue/${centerId}`, callback);
  }

  subscribeToAdminAnalytics(callback) {
    return this.subscribe('/topic/admin/analytics', callback);
  }

  subscribeToNotifications(username, callback) {
    const unsubGlobal = this.subscribe('/topic/notifications', callback);
    let unsubUser = () => {};
    if (username) {
      unsubUser = this.subscribe(`/topic/notifications/${username}`, callback);
    }
    return () => {
      unsubGlobal();
      unsubUser();
    };
  }

  subscribeToBookings(callback) {
    return this.subscribe('/topic/bookings', callback);
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
