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

    let stored = user.password_hash || '';
    let mustChange = false;
    if (stored.startsWith('MUST_CHANGE:')) {
      mustChange = true;
      stored = stored.substring(12);
    }

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
      must_change_password: mustChange,
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

// POST /api/auth/change-password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Missing required fields' });
    
    // 1. Fetch user to verify old password
    const user = await dbFetchOne('sys_users', '*', { id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let stored = user.password_hash || '';
    if (stored.startsWith('MUST_CHANGE:')) {
      stored = stored.substring(12);
    }
    
    const valid = verifyPassword(oldPassword, stored);
    if (!valid) return res.status(401).json({ error: 'Incorrect current password' });
    
    // 2. Hash new password and update
    const newHash = hashPassword(newPassword);
    await dbUpdate('sys_users', user.id, { password_hash: newHash });
    
    return res.json({ message: 'Password updated successfully' });
  } catch (e) {
    console.error('[AUTH CHANGE PASSWORD]', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
