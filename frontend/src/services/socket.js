import { io } from 'socket.io-client';

const normalizeSocketUrl = (url) => String(url || '').replace(/\/$/, '').replace(/\/api$/, '');
const SOCKET_URL = normalizeSocketUrl(import.meta.env.VITE_API_URL) || 'http://localhost:5000';

let socket = null;
let socketToken = null;

export function connectSocket(token) {
  if (!token) return null;

  if (socket && socketToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

  socketToken = token;

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    socketToken = null;
  }
}

export function getSocket() {
  return socket;
}
