import { io } from 'socket.io-client';

let socket = null;

/**
 * CRM sales inbox realtime — agents only.
 * Customers stay on Messenger/Zernio; inbound webhooks push here.
 */
export function getCrmSocket() {
  if (socket?.connected) return socket;

  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  const serverUrl = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8080' : '');

  socket = io(serverUrl || undefined, {
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
  });

  socket.on('connect_error', (err) => {
    console.warn('[CRM WS] connect_error:', err.message);
  });

  return socket;
}

export function disconnectCrmSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinInquiryRoom(inquiryId) {
  const s = getCrmSocket();
  if (s && inquiryId) s.emit('inquiry:join', inquiryId);
}

export function leaveInquiryRoom(inquiryId) {
  const s = getCrmSocket();
  if (s && inquiryId) s.emit('inquiry:leave', inquiryId);
}
