import { io, Socket } from "socket.io-client";
import { secureStorage } from "@/utils/secureStorage";

const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await secureStorage.getAccessToken();

  socket = io(WS_URL, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000,
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

// Chat-specific helpers layered on top of the shared socket connection.
export async function joinLiveChat(classId: string) {
  const s = await getSocket();
  s.emit("live:join", { classId });
  return s;
}

export function leaveLiveChat(classId: string) {
  socket?.emit("live:leave", { classId });
}
