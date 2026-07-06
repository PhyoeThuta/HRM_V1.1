import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete, dbFetchOne } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

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

router.post('/positions/:id/post-to-facebook', requireAdmin, async (req, res) => {
  try {
    const posId = req.params.id;
    const pos = await dbFetchOne('positions', '*', { id: posId });
    if (!pos) return res.status(404).json({ error: 'Position not found' });
    if (!pos.is_hiring) return res.status(400).json({ error: 'Position is not open for hiring.' });

    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const PAGE_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !PAGE_TOKEN) {
      return res.status(500).json({ error: 'Facebook credentials not configured in server.' });
    }

    // 1. Generate Facebook Post Content with AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const appUrl = req.headers.origin || 'http://34.87.23.76'; // Use request origin or fallback to IP
    
    const prompt = `
      You are an expert HR copywriter for CorpHRM Enterprise. We are hiring for the following position:
      - Job Title: ${pos.title}
      - Level: ${pos.level || 'Mid Level'}
      - Department/Team: ${pos.team || 'Any'}
      - Base Salary: ${pos.base_salary ? pos.base_salary + ' MMK' : 'Competitive'}

      Write a highly engaging, professional, and attractive Facebook post (in Burmese and English) announcing this job opening.
      Include emojis.
      CRITICAL INSTRUCTION: You MUST include this exact link in the "How to Apply" section for them to apply online: ${appUrl}/careers
      Also mention they can send their CV to hr@corphrm.com as an alternative.
      Keep it clean and readable for Facebook users.
      Return ONLY the post text.
    `;

    const result = await model.generateContent(prompt);
    const postContent = result.response.text().trim();

    // 2. Post to Facebook using Graph API
    const fbResponse = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: postContent,
        access_token: PAGE_TOKEN
      })
    });

    const fbData = await fbResponse.json();

    if (fbData.error) {
      console.error('FB API Error:', fbData.error);
      throw new Error(fbData.error.message || 'Failed to post to Facebook');
    }

    // Audit log
    await dbInsert('sys_audit_logs', {
      user_id: req.user.id,
      action: 'CREATE',
      module: 'Positions',
      details: `Used AI to automatically post job opening for ${pos.title} to Facebook. Post ID: ${fbData.id}`,
      ip_address: req.ip || '0.0.0.0'
    });

    return res.json({ success: true, post_id: fbData.id, message: postContent });
  } catch (e) {
    console.error('FB Auto Post Error:', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
