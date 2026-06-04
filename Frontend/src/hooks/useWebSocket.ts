"use client";
import { useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { wsService } from "@/services/websocket.service";
import { WSMessage } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useAlertStore } from "@/stores/alert.store";

export function useWebSocket(path = "/dashboard/") {
  const { isAuthenticated } = useAuthStore();
  const { incrementUnread } = useAlertStore();
  const cleanupRef = useRef<(() => void)[]>([]);

  const handleMessage = useCallback(
    (message: WSMessage) => {
      switch (message.type) {
        case "event":
          toast(
            `New event: ${(message.payload as { event_name?: string })?.event_name || "Unknown"}`,
            { icon: "📊", duration: 3000 }
          );
          break;
        case "alert":
          incrementUnread();
          toast.error(
            `Alert triggered: ${(message.payload as { name?: string })?.name || "Unknown"}`,
            { duration: 5000 }
          );
          break;
        case "stats_update":
          // Stats update handled by query invalidation
          break;
      }
    },
    [incrementUnread]
  );

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;

    wsService.connect(path);

    const unsubMessage = wsService.onMessage(handleMessage);
    const unsubConnect = wsService.onConnect(() => {
      console.log("[WS] Dashboard connected");
    });
    const unsubDisconnect = wsService.onDisconnect(() => {
      console.log("[WS] Dashboard disconnected");
    });

    cleanupRef.current = [unsubMessage, unsubConnect, unsubDisconnect];

    return () => {
      cleanupRef.current.forEach((fn) => fn());
      wsService.disconnect();
    };
  }, [isAuthenticated, path, handleMessage]);

  return {
    isConnected: wsService.isConnected,
    send: wsService.send.bind(wsService),
  };
}
