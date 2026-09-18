process.env.TZ = 'Asia/Bangkok';

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
process.env.TZ = 'Asia/Bangkok'; // Ensure Bangkok (UTC+7) timezone across all server operations


import { startBirthdayCron, checkAndNotifyBirthdays } from './cron/birthdays.js';
import { startFollowupCron, checkAndNotifyFollowups } from './cron/customer_followups.js';
import { startDailyFeedbackCron, checkAndNotifyDailyFeedback } from './cron/daily_feedback.js';
import { startKitchenAlertCron, checkAndSendKitchenAlert } from './cron/kitchen_alerts.js';
import { initCrmRealtime } from './lib/crmRealtime.js';
import { startVectorSyncCron } from './services/vectorSync.js';

// Routes
import { requireAdmin } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import employeesRouter from './routes/employees.js';
import attendanceRouter from './routes/attendance.js';
import overtimeRouter from './routes/overtime.js';
import leaveRouter from './routes/leave.js';
import payrollRouter from './routes/payroll.js';
import payrollEngineRouter from './routes/payroll_engine.js';
import bossRouter from './routes/api_boss.js';
import orgRouter from './routes/org.js';
import recruitmentRouter from './routes/recruitment.js';
import lifecycleRouter from './routes/lifecycle.js';
import handoverRouter from './routes/handover.js';
import miscRouter from './routes/misc.js';
import publicRouter from './routes/public.js';
import financeRouter from './routes/finance.js';
import crmRouter from './routes/crm.js';
import analyticsRouter from './routes/analytics.js';
import enrollRouter from './routes/enroll.js';
import inventoryRoutes from './routes/inventory.js';
import operationsRoutes from './routes/operations.js';
import telegramRouter from './routes/telegram.js';
import dailyFeedbackRouter from './routes/daily_feedback.js';
import performanceRouter from './routes/performance.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// ── Security & Middleware ──────────────────────────────────────
app.set('trust proxy', 1); // Trust the first proxy to get real client IPs

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcElem: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "https://*.supabase.co"],
      connectSrc: ["'self'", "https:", "wss:", "ws:", "https://*.supabase.co"],
      mediaSrc: ["'self'", "data:", "blob:", "https:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
    },
  },
}));

const defaultAllowedOrigins = [
  'https://hrm.duolinkmm.com',
  'http://hrm.duolinkmm.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    let allowedOrigins = defaultAllowedOrigins;
    if (process.env.ALLOWED_ORIGINS) {
      const customOrigins = process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim());
      allowedOrigins = Array.from(new Set([...allowedOrigins, ...customOrigins]));
    }
    
    if (allowedOrigins.includes(origin) || origin.includes('duolinkmm.com') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json({ limit: '50mb' })); // Increased for video
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/uploads', express.static('uploads')); // Serve safely under /api path
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// DEBUG ROUTE REMOVED — Never expose stack traces or internal tooling in production.

// Auth-specific rate limiter: stricter, applied only to login/refresh
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow login attempts
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  skip: (req) => req.path === '/me', // /api/auth/me is never rate-limited (it's read-only)
});

// General API rate limiter: generous, excludes auth routes (they have their own)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  skip: (req) => req.path.includes('auth'), // Auth has its own limiter
});
app.use('/api/', limiter);

// ── Routes ─────────────────────────────────────────────────────
// Health Check must be at the top to avoid being blocked by global middlewares in other routers
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// Auth routes get their own rate limiter — NOT the general one
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/public', publicRouter); // /api/public/jobs, /api/public/apply
app.use('/api/crm/analytics', analyticsRouter);
app.use('/api/crm', crmRouter);       // Must be before orgRouter to prevent verifyToken leakage to public webhooks
app.use('/api/telegram', telegramRouter);
app.use('/api/enroll', enrollRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/overtime', overtimeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/payroll-engine', payrollEngineRouter);
app.use('/api', orgRouter);           // /api/departments, /api/positions
app.use('/api/recruitment', recruitmentRouter);
app.use('/api', lifecycleRouter);     // /api/onboarding, /api/offboarding
app.use('/api/handover', handoverRouter);
app.use('/api/boss', bossRouter);
app.use('/api/finance', financeRouter);
app.use('/api', miscRouter);          // /api/notifications, /api/portal, /api/sops, etc.
app.use('/api/inventory', inventoryRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/daily-feedback', dailyFeedbackRouter);
app.use('/api/performance', performanceRouter);
// ── Test Endpoints (Admin-Only) ─────────────────────────────────────────────
// These endpoints are protected by requireAdmin to prevent unauthorized Cron triggering.
app.post('/api/test/trigger-birthdays', requireAdmin, async (req, res) => {
  const result = await checkAndNotifyBirthdays();
  res.json(result);
});

app.post('/api/test/trigger-followups', requireAdmin, async (req, res) => {
  const result = await checkAndNotifyFollowups();
  res.json(result);
});

app.post('/api/test/trigger-daily-feedback', requireAdmin, async (req, res) => {
  const result = await checkAndNotifyDailyFeedback();
  res.json(result);
});

app.post('/api/test/trigger-kitchen-alert', requireAdmin, async (req, res) => {
  try {
    const targetDate = req.body?.targetDate || null;
    const result = await checkAndSendKitchenAlert(targetDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Serve React Frontend (Single-Container Deployment) ───────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../hrm-client/dist')));

// Fallback all non-API routes to React's index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../hrm-client/dist/index.html'));
});

// ── 404 for API ────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Process-Level Error Handlers (Fail-Safe) ───────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});

// ── Error Handler ──────────────────────────────────────────────
// SECURITY: Never expose stack traces or internal error details to the client.
// Stack traces reveal file paths, library versions, and server internals to attackers.
app.use((err, req, res, next) => {
  // Check if it's a Zod validation error
  if (err.name === 'ZodError' || err.errors) {
    console.error(`[VALIDATION ERROR] ${req.method} ${req.originalUrl}`);
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  // Always log the full error server-side for debugging.
  console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}`, err.stack || err);
  
  // Only send a safe, generic message to the client.
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ error: err.message || 'Internal server error' });
});

initCrmRealtime(server);

server.listen(PORT, () => {
  console.log(`\n🚀 Busy Boss Diet API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔌 CRM WebSocket: ws://localhost:${PORT}/socket.io\n`);

  // Start background jobs
  startBirthdayCron();
  startVectorSyncCron();
  startFollowupCron();
  startDailyFeedbackCron();
  startKitchenAlertCron(); // 05:00 AM ICT Kitchen Daily Alert (Telegram + Messenger)
});
