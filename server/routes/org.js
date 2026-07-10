import express from 'express';
import multer from 'multer';
import { dbFetch, dbInsert, dbUpdate, dbDelete, dbFetchOne } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getFacebookConnectionStatus,
  generatePositionCaption,
  publishPositionToFacebook,
} from '../lib/positionFacebook.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = express.Router();
router.use(verifyToken);

// Departments
router.get('/departments', async (req, res) => {
  try {
    const [depts, employees] = await Promise.all([
      dbFetch('Departments', '*', {}, { order: 'Department_name', ascending: true }),
      dbFetch('Employees', 'id,Dept_id'),
    ]);
    const countMap = {};
    employees.forEach(e => { countMap[e.Dept_id] = (countMap[e.Dept_id] || 0) + 1; });
    depts.forEach(d => { d.emp_count = countMap[d.id] || 0; });
    return res.json({ departments: depts });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/departments', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbInsert('Departments', {
      Department_name: d.Department_name,
      Descriptions: d.Descriptions
    });
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'CREATE',
      module: 'Departments',
      details: `Created department ${d.Department_name}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/departments/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('Departments', req.params.id, {
      Department_name: d.Department_name,
      Descriptions: d.Descriptions
    });
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'UPDATE',
      module: 'Departments',
      details: `Updated department ${d.Department_name}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/departments/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('Departments', req.params.id);
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'DELETE',
      module: 'Departments',
      details: `Deleted department ID: ${req.params.id}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// Positions
router.get('/positions', async (req, res) => {
  try {
    const [positions, employees] = await Promise.all([
      dbFetch('positions', '*', {}, { order: 'title', ascending: true }),
      dbFetch('Employees', 'id,position_id'),
    ]);
    const countMap = {};
    employees.forEach(e => { countMap[e.position_id] = (countMap[e.position_id] || 0) + 1; });
    positions.forEach(p => { p.emp_count = countMap[p.id] || 0; });
    return res.json({ positions });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/positions', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('positions', { title: d.title, level: d.level || 'Mid', team: d.department || null, base_salary: parseFloat(d.base_salary || 0), is_hiring: d.is_hiring === 'true' || d.is_hiring === true, created_at: new Date().toISOString() });
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'CREATE',
      module: 'Positions',
      details: `Created position ${d.title}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: !!result, position: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/positions/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const updateData = { title: d.title, level: d.level, base_salary: parseFloat(d.base_salary || 0) };
    if (d.is_hiring !== undefined) {
      updateData.is_hiring = d.is_hiring === 'true' || d.is_hiring === true;
    }
    await dbUpdate('positions', req.params.id, updateData);
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'UPDATE',
      module: 'Positions',
      details: `Updated position ${d.title}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/positions/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('positions', req.params.id);
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'DELETE',
      module: 'Positions',
      details: `Deleted position ID: ${req.params.id}`,
      ip_address: req.ip || '0.0.0.0'
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// GET /api/positions/facebook-connection — Zernio / Graph status
router.get('/positions/facebook-connection', requireAdmin, async (req, res) => {
  try {
    const status = await getFacebookConnectionStatus();
    return res.json(status);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/positions/:id/generate-caption — AI draft for announcement
router.post('/positions/:id/generate-caption', requireAdmin, async (req, res) => {
  try {
    const pos = await dbFetchOne('positions', '*', { id: req.params.id });
    if (!pos) return res.status(404).json({ error: 'Position not found' });
    if (!pos.is_hiring) return res.status(400).json({ error: 'Position is not open for hiring.' });

    const appUrl = process.env.PUBLIC_APP_URL || req.headers.origin || 'http://localhost:5173';
    const caption = await generatePositionCaption(pos, appUrl);
    return res.json({ caption });
  } catch (e) {
    console.error('Generate caption error:', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/positions/:id/publish-facebook — publish with caption + optional image (Zernio flow)
router.post('/positions/:id/publish-facebook', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const posId = req.params.id;
    const pos = await dbFetchOne('positions', '*', { id: posId });
    if (!pos) return res.status(404).json({ error: 'Position not found' });
    if (!pos.is_hiring) return res.status(400).json({ error: 'Position is not open for hiring.' });

    const caption = (req.body.caption || '').trim();
    if (!caption) return res.status(400).json({ error: 'Caption is required.' });

    let imageBuffer = null;
    let imageMeta = null;
    if (req.file) {
      imageBuffer = req.file.buffer;
      imageMeta = { filename: req.file.originalname, mimetype: req.file.mimetype };
    }

    const result = await publishPositionToFacebook(caption, imageBuffer, imageMeta);

    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'CREATE',
      module: 'Positions',
      details: `Published hiring announcement for ${pos.title} via ${result.provider}. Post: ${result.zernioPostId || result.postId}`,
      ip_address: req.ip || '0.0.0.0'
    });

    return res.json({
      success: true,
      caption,
      provider: result.provider,
      zernio_post_id: result.zernioPostId,
      facebook_post_url: result.facebookUrl,
      post_id: result.postId,
    });
  } catch (e) {
    console.error('Publish Facebook error:', e);
    return res.status(500).json({ error: e.message });
  }
});

// Legacy: quick AI post (text only, no preview) — redirects to generate + graph/zernio
router.post('/positions/:id/post-to-facebook', requireAdmin, async (req, res) => {
  try {
    const pos = await dbFetchOne('positions', '*', { id: req.params.id });
    if (!pos) return res.status(404).json({ error: 'Position not found' });
    if (!pos.is_hiring) return res.status(400).json({ error: 'Position is not open for hiring.' });

    const appUrl = process.env.PUBLIC_APP_URL || req.headers.origin || 'http://localhost:5173';
    const caption = await generatePositionCaption(pos, appUrl);
    const result = await publishPositionToFacebook(caption, null, null);

    return res.json({ success: true, message: caption, post_id: result.postId, facebook_post_url: result.facebookUrl });
  } catch (e) {
    console.error('FB Auto Post Error:', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
