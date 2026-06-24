import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

// Routes
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import employeesRouter from './routes/employees.js';
import attendanceRouter from './routes/attendance.js';
import leaveRouter from './routes/leave.js';
import payrollRouter from './routes/payroll.js';
import payrollEngineRouter from './routes/payroll_engine.js';
import bossRouter from './routes/api_boss.js';
import orgRouter from './routes/org.js';
import recruitmentRouter from './routes/recruitment.js';
import lifecycleRouter from './routes/lifecycle.js';
import miscRouter from './routes/misc.js';
import publicRouter from './routes/public.js';
import financeRouter from './routes/finance.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security & Middleware ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' })); // Increased for video
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static('uploads')); // Serve uploaded files

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/public', publicRouter); // /api/public/jobs, /api/public/apply
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/payroll', payrollRouter);
app.use('/api/payroll-engine', payrollEngineRouter);
app.use('/api', orgRouter);           // /api/departments, /api/positions
app.use('/api/recruitment', recruitmentRouter);
app.use('/api', lifecycleRouter);     // /api/onboarding, /api/offboarding
app.use('/api/boss', bossRouter);
app.use('/api/finance', financeRouter);
app.use('/api', miscRouter);          // /api/notifications, /api/portal, /api/sops, etc.

// ── Health Check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// ── 404 ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error Handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 CorpHRM API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health\n`);
});
