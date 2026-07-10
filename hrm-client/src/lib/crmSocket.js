import { io } from 'socket.io-client';

let socket = null;

/**
 * CRM sales inbox realtime — agents only.
 * Customers stay on Messenger/Zernio; inbound webhooks push here.
 */
export function getCrmSocket() {
  if (socket?.connected) return socket;

  const token = localStorage.getItem('hrm_token');
  if (!token) return null;

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io({
    path: '/socket.io',
    auth: { token },
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
