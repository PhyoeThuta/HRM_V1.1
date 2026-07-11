import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'hrm-secret-key-fallback';

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
    { expiresIn: '15m' } // Short-lived access token
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token
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

export function requireOperations(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Grant access to cnx-0028 explicitly, or general admins
  const adminRoles = ['boss', 'general_manager', 'admin'];
  if (req.user.username === 'cnx-0028' || adminRoles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Operations access required' });
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
