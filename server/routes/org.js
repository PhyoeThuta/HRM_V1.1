import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

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
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/departments/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('Departments', req.params.id);
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
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/positions/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('positions', req.params.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

export default router;
