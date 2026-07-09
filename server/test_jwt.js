import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'hrm-secret-key-fallback';

const token = jwt.sign(
  { id: '123', username: 'test', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '15m' }
);

console.log('Token:', token);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Decoded:', decoded);
} catch (e) {
  console.error('Verify error:', e.message);
}
