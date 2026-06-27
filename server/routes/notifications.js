import express from 'express';
import { dbFetch, dbUpdate } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await dbFetch('notifications', '*', { user_id: req.user.id }, { order: 'created_at', ascending: false });
    return res.json({ notifications: notifications || [] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    await dbUpdate('notifications', req.params.id, { is_read: true });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
  try {
    const notifications = await dbFetch('notifications', 'id', { user_id: req.user.id, is_read: false });
    if (notifications && notifications.length > 0) {
      await Promise.all(notifications.map(n => dbUpdate('notifications', n.id, { is_read: true })));
    }
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
