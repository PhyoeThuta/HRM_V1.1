import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import { startBirthdayCron, checkAndNotifyBirthdays } from './cron/birthdays.js';
import { initCrmRealtime } from './lib/crmRealtime.js';

// Routes
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
import inventoryRoutes from './routes/inventory.js';
import operationsRoutes from './routes/operations.js';
import telegramRouter from './routes/telegram.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ── Security & Middleware ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:4173', 
      'http://127.0.0.1:5173', 
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://hrm.duolinkmm.com'
    ];
    if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
    if (process.env.DIET_BUDDY_URL) allowedOrigins.push(process.env.DIET_BUDDY_URL);

    // Allow requests with no origin (like mobile apps or curl requests)
    // Allow localhost/env origins
    // Allow any Vercel deployment dynamically
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' })); // Increased for video
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads')); // Serve uploaded files

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── Routes ─────────────────────────────────────────────────────
// Health Check must be at the top to avoid being blocked by global middlewares in other routers
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

app.use('/api/public', publicRouter); // /api/public/jobs, /api/public/apply
app.use('/api/crm', crmRouter);       // Must be before orgRouter to prevent verifyToken leakage to public webhooks
app.use('/api/auth', authRouter);
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
app.use('/api/telegram', telegramRouter);

// ── Test Endpoints ─────────────────────────────────────────────
app.post('/api/test/trigger-birthdays', async (req, res) => {
  const result = await checkAndNotifyBirthdays();
  res.json(result);
});

// ── 404 ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error Handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: err.stack || err.message || 'Internal server error' });
});

initCrmRealtime(server);

server.listen(PORT, () => {
  console.log(`\n🚀 Busy Boss Diet API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔌 CRM WebSocket: ws://localhost:${PORT}/socket.io\n`);

  // Start background jobs
  startBirthdayCron();
});
