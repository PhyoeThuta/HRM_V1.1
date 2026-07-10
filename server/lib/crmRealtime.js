import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';

let io = null;

const CRM_ROLES = ['boss', 'admin', 'manager', 'marketing_manager', 'marketing_junior'];

export function initCrmRealtime(httpServer) {
  const corsOrigins = (
    process.env.CRM_WS_CORS_ORIGINS ||
    'http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,https://hrm.duolinkmm.com'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    path: '/socket.io',
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization || '').replace(/^Bearer\s+/i, '');
      if (!token) return next(new Error('Unauthorized'));
      const user = jwt.verify(token, JWT_SECRET);
      if (!user?.id) return next(new Error('Unauthorized'));
      if (!CRM_ROLES.includes(user.role)) {
        return next(new Error('CRM access required'));
      }
      socket.user = user;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join('crm:inbox');
    console.log(`[CRM WS] connected user=${socket.user?.username || socket.user?.id}`);

    socket.on('inquiry:join', (inquiryId) => {
      if (!inquiryId || typeof inquiryId !== 'string') return;
      socket.join(`inquiry:${inquiryId}`);
    });

    socket.on('inquiry:leave', (inquiryId) => {
      if (!inquiryId || typeof inquiryId !== 'string') return;
      socket.leave(`inquiry:${inquiryId}`);
    });

    socket.on('disconnect', () => {
      // no-op
    });
  });

  console.log('[CRM WS] Socket.IO ready on /socket.io');
  return io;
}

export function getCrmIo() {
  return io;
}

export function emitInquiryMessage(inquiryId, message) {
  if (!io || !inquiryId || !message) return;
  const payload = { inquiry_id: inquiryId, message };
  io.to('crm:inbox').emit('inquiry:message', payload);
  io.to(`inquiry:${inquiryId}`).emit('inquiry:message', payload);
}

export function emitInquiryUpdated(inquiry) {
  if (!io || !inquiry?.id) return;
  const payload = {
    inquiry_id: inquiry.id,
    inquiry: {
      id: inquiry.id,
      status: inquiry.status,
      service_interest_confidence: inquiry.service_interest_confidence,
      ai_analysis_result: inquiry.ai_analysis_result,
      prospect_name: inquiry.prospect_name,
      prospect_contact: inquiry.prospect_contact,
      source: inquiry.source,
      service_interest: inquiry.service_interest,
      updated_at: inquiry.updated_at,
      created_at: inquiry.created_at,
    },
  };
  io.to('crm:inbox').emit('inquiry:updated', payload);
  io.to(`inquiry:${inquiry.id}`).emit('inquiry:updated', payload);
}

export function emitInquiryCreated(inquiry) {
  if (!io || !inquiry?.id) return;
  io.to('crm:inbox').emit('inquiry:created', { inquiry });
}
