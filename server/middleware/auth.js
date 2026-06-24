import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'hrm-secret-key-fallback';

export function hashPassword(plainText) {
  return crypto.createHash('sha256').update(plainText).digest('hex');
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
      employee_id: user.employee_id,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  const adminRoles = ['boss', 'hr_manager', 'general_manager', 'admin'];
  if (!req.user || !adminRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
}

export function requireBoss(req, res, next) {
  const bossRoles = ['boss', 'admin'];
  if (!req.user || !bossRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Boss access required' });
  }
  next();
}

export function requireFinance(req, res, next) {
  const financeRoles = ['boss', 'finance', 'admin'];
  if (!req.user || !financeRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Finance access required' });
  }
  next();
}
