import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete, dbFetchOne } from '../lib/supabase.js';
import { verifyToken, requireAdmin, hashPassword } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const router = express.Router();
router.use(verifyToken);

// GET /api/recruitment
router.get('/', async (req, res) => {
  try {
    const [candidates, positions] = await Promise.all([
      dbFetch('recruitment_candidates', '*', {}, { order: 'created_at', ascending: false }),
      dbFetch('positions', 'id,title'),
    ]);
    const posMap = Object.fromEntries(positions.map(p => [p.id, p.title]));
    candidates.forEach(c => { 
      c.position_title = posMap[c.position_id] || '—'; 
      c.candidate_name = c.full_name;
    });
    return res.json({ candidates, positions });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/recruitment
router.post('/', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    const result = await dbInsert('recruitment_candidates', {
      full_name: d.candidate_name, email: d.email || null,
      phone: d.phone || null, position_id: d.position_id || null,
      status: d.status || 'Applied', notes: d.notes || null,
      created_at: new Date().toISOString(),
    });
    return res.json({ success: !!result, candidate: result });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// PUT /api/recruitment/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('recruitment_candidates', req.params.id, {
      full_name: d.candidate_name, email: d.email, phone: d.phone,
      position_id: d.position_id, status: d.status, notes: d.notes,
      updated_at: new Date().toISOString(),
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/recruitment/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('recruitment_candidates', req.params.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// POST /api/recruitment/:id/interview-guide
router.post('/:id/interview-guide', requireAdmin, async (req, res) => {
  try {
    const cand = await dbFetchOne('recruitment_candidates', '*', { id: req.params.id });
    if (!cand) return res.status(404).json({ error: 'Candidate not found' });
    
    let posTitle = 'Unknown Role';
    if (cand.position_id) {
      const pos = await dbFetchOne('positions', 'title', { id: cand.position_id });
      if (pos) posTitle = pos.title;
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
    Generate a concise, 5-question interview guide tailored for a candidate applying for the "${posTitle}" role.
    Candidate Cover Letter/Notes: ${cand.notes || 'None provided.'}
    Return ONLY a clean text/markdown guide, no JSON.
    `;
    
    const result = await model.generateContent(prompt);
    const guideText = result.response.text().trim();
    
    await dbUpdate('recruitment_candidates', req.params.id, {
      interview_guide: guideText,
      updated_at: new Date().toISOString()
    });
    
    return res.json({ success: true, interview_guide: guideText });
  } catch (e) {
    console.error('[Generate Guide Error]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/recruitment/:id/send-interview
router.post('/:id/send-interview', requireAdmin, async (req, res) => {
  try {
    const cand = await dbFetchOne('recruitment_candidates', '*', { id: req.params.id });
    if (!cand) return res.status(404).json({ error: 'Candidate not found' });
    
    // Update status to Interview
    await dbUpdate('recruitment_candidates', req.params.id, {
      status: 'Interview',
      updated_at: new Date().toISOString()
    });
    
    // In a real application, we would send an email here using nodemailer or Resend
    console.log(`[SIMULATED EMAIL] Sent interview offer to ${cand.email || 'Candidate'} with Interview Guide.`);
    
    // Add a notification so HR knows it was sent
    await dbInsert('system_notifications', {
      recipient_role: 'hr_manager',
      title: 'Interview Offer Sent',
      message: `Interview offer successfully sent to ${cand.full_name}.`,
      link_url: '/recruitment',
      created_at: new Date().toISOString()
    });
    
    return res.json({ success: true, message: 'Interview offer sent successfully!' });
  } catch (e) {
    console.error('[Send Interview Error]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/recruitment/:id/convert
router.post('/:id/convert', requireAdmin, async (req, res) => {
  try {
    const cand = await dbFetchOne('recruitment_candidates', '*', { id: req.params.id });
    if (!cand) return res.status(404).json({ error: 'Candidate not found' });
    if (cand.status !== 'Hired') return res.status(400).json({ error: 'Candidate must be in Hired status' });

    // 1. Generate Employee ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const empId = `EMP-${randomNum}`;

    // 2. Insert into Employees
    const empResult = await dbInsert('Employees', {
      employee_id: empId,
      Full_name: cand.full_name,
      email: cand.email || null,
      phone: cand.phone || null,
      position_id: cand.position_id || null,
      status: 'Active',
      employment_type: 'Full-Time',
      created_at: new Date().toISOString()
    });

    if (!empResult) throw new Error('Failed to create employee record');

    // 3. Auto-create sys_users
    const username = cand.email ? cand.email.split('@')[0].toLowerCase() : empId.toLowerCase();
    const defaultPassword = hashPassword('password123'); // Default password

    await dbInsert('sys_users', {
      username: username,
      password_hash: defaultPassword,
      role: 'employee',
      employee_id: empResult.id,
      created_at: new Date().toISOString()
    });

    // 4. Update candidate status to Converted so they disappear from Hired tab
    await dbUpdate('recruitment_candidates', req.params.id, {
      status: 'Converted',
      updated_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Candidate converted to Employee successfully!' });
  } catch (e) {
    console.error('[Convert Candidate Error]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
