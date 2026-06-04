import { tokenStorage } from "@/lib/axios";
import { WSMessage } from "@/types";

type MessageHandler = (message: WSMessage) => void;
type ConnectionHandler = () => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string = "";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectHandlers: Set<ConnectionHandler> = new Set();
  private disconnectHandlers: Set<ConnectionHandler> = new Set();
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isIntentionallyClosed = false;

  connect(path: string = "/dashboard/"): void {
    const BASE_WS_URL =
      process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000/ws";
    const token = tokenStorage.getAccess();

    this.url =
      `${BASE_WS_URL}${path}${token
        ? `?token=${token}`
        : ""
      }`;

    console.log(
      "WS URL:",
      this.url
    );
    this.isIntentionallyClosed = false;
    this._connect();
  }

  private _connect(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("[WebSocket] Connected");
        this.reconnectAttempts = 0;
        this.connectHandlers.forEach((h) => h());
        this._startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.messageHandlers.forEach((h) => h(message));
        } catch {
          console.error("[WebSocket] Failed to parse message:", event.data);
        }
      };

      this.ws.onclose = (event) => {
        console.log("[WebSocket] Disconnected:", event.code, event.reason);
        this._stopPing();
        this.disconnectHandlers.forEach((h) => h());

        if (!this.isIntentionallyClosed) {
          this._scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
      };
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error);
      this._scheduleReconnect();
    }
  }

  private _scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[WebSocket] Max reconnection attempts reached");
      return;
    }

    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
    console.log(
      `[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this._connect();
    }, delay);
  }

  private _startPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: "ping", payload: null, timestamp: new Date().toISOString() });
    }, 30000);
  }

  private _stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    this._stopPing();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: Partial<WSMessage>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.add(handler);
    return () => this.connectHandlers.delete(handler);
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => this.disconnectHandlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Singleton instance
export const wsService = new WebSocketService();
export default wsService;
