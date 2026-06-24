import express from 'express';
import bcryptjs from 'bcryptjs';
import { dbFetchOne, dbUpdate } from '../lib/supabase.js';
import { generateToken, verifyToken, hashPassword } from '../middleware/auth.js';

const router = express.Router();

// Verify password: bcrypt (if starts with $2b$) OR SHA-256 fallback
function verifyPassword(plain, stored) {
  if (!stored) return false;
  if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
    return bcryptjs.compareSync(plain, stored);
  }
  return hashPassword(plain) === stored;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await dbFetchOne('sys_users', '*', { username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const stored = user.password_hash || '';
    const valid = verifyPassword(password, stored);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = {
      id: String(user.id),
      username: user.username,
      role: user.role,
      full_name: user.full_name || user.username,
      employee_id: String(user.employee_id || ''),
    };

    const token = generateToken(payload);

    return res.json({
      token,
      user: payload,
    });
  } catch (e) {
    console.error('[AUTH LOGIN]', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  return res.json({ user: req.user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // JWT is stateless; client just deletes the token
  return res.json({ message: 'Logged out successfully' });
});

export default router;
