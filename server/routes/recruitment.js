import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete, dbFetchOne } from '../lib/supabase.js';
import { verifyToken, requireAdmin, hashPassword } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer';

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
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'CREATE', module: 'Recruitment', details: `Added candidate ${d.candidate_name}`, ip_address: req.ip || '0.0.0.0' });
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
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Recruitment', details: `Updated candidate ${d.candidate_name || req.params.id}`, ip_address: req.ip || '0.0.0.0' });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// DELETE /api/recruitment/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await dbDelete('recruitment_candidates', req.params.id);
    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'DELETE', module: 'Recruitment', details: `Deleted candidate ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });
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
    
    const aiReasoning = cand.ai_reasoning || 'No AI reasoning available.';
    const formData = cand.form_data ? JSON.stringify(cand.form_data, null, 2) : 'No form data available.';

    const prompt = `
    You are an expert HR Manager preparing for an interview.
    Generate a concise, 5-question interview guide tailored for a candidate applying for the "${posTitle}" role.
    
    CRITICAL INSTRUCTIONS:
    - Base your questions STRICTLY on the candidate's specific background, weaknesses, and strengths identified below.
    - DO NOT generate generic questions (e.g. "tell me about yourself"). Focus on their specific experiences and the company's requirements.
    - The output MUST be in English.
    - Return ONLY a clean text/markdown guide, no JSON.

    --- CANDIDATE AI EVALUATION ---
    ${aiReasoning}

    --- CANDIDATE APPLICATION FORM ---
    ${formData}
    `;

    const result = await model.generateContent(prompt);
    const guideText = result.response.text().trim();

    await dbUpdate('recruitment_candidates', req.params.id, {
      interview_guide: guideText,
      updated_at: new Date().toISOString()
    });

    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Recruitment', details: `Generated interview guide for candidate ID: ${req.params.id}`, ip_address: req.ip || '0.0.0.0' });

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

    const { date, time, link } = req.body;

    // Fetch position title for email
    let posTitle = 'Unknown Role';
    if (cand.position_id) {
      const pos = await dbFetchOne('positions', 'title', { id: cand.position_id });
      if (pos) posTitle = pos.title;
    }

    // Send real email using nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      let formattedTime = time;
      if (time && /^\d{2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        formattedTime = `${h12}:${minutes} ${ampm}`;
      }

      const meetingDetailsText = date && time && link 
        ? `\n\nInterview Schedule:\nDate: ${date}\nTime: ${formattedTime} (Thailand Time)\nMeeting Link / Location: ${link}` 
        : '\n\nWe will contact you shortly with the exact schedule and meeting link.';

      const meetingDetailsHtml = date && time && link
        ? `<br><br><strong>Interview Schedule:</strong><br><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${formattedTime} (Thailand Time)<br><strong>Meeting Link / Location:</strong> ${link}`
        : '<br><br>We will contact you shortly with the exact schedule and meeting link.';

      const mailOptions = {
        from: `"LM Group of Business Recruiting" <${process.env.EMAIL_USER}>`,
        to: cand.email,
        subject: `Interview Invitation for ${posTitle} at LM Group of Business`,
        text: `Dear ${cand.full_name},\n\nCongratulations! We are pleased to inform you that you have been shortlisted for the ${posTitle} position at LM Group of Business.\n\nOur hiring team was highly impressed with your background and experiences. We believe that your skills align well with our company's goals, and we would love to invite you for an interview to discuss your application and the role in more detail.\n\nPlease find the details of your scheduled interview below:${meetingDetailsText}\n\nIf you have any questions or need to reschedule, please do not hesitate to reply directly to this email.\n\nWe look forward to speaking with you and learning more about how you can contribute to our team.\n\nBest regards,\n\nHuman Resources Department\nLM Group of Business`,
        html: `<p>Dear ${cand.full_name},</p><p>Congratulations! We are pleased to inform you that you have been shortlisted for the <strong>${posTitle}</strong> position at LM Group of Business.</p><p>Our hiring team was highly impressed with your background and experiences. We believe that your skills align well with our company's goals, and we would love to invite you for an interview to discuss your application and the role in more detail.</p><p>Please find the details of your scheduled interview below:${meetingDetailsHtml}</p><p>If you have any questions or need to reschedule, please do not hesitate to reply directly to this email.</p><p>We look forward to speaking with you and learning more about how you can contribute to our team.</p><p>Best regards,<br><br><strong>Human Resources Department</strong><br>LM Group of Business</p>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL] Sent interview offer to ${cand.email}`);
    } catch (emailError) {
      console.error('[EMAIL ERROR]', emailError);
      return res.status(500).json({ error: `Email failed to send: ${emailError.message}` });
    }

    // Add a notification so HR knows it was sent
    await dbInsert('system_notifications', {
      recipient_role: 'hr_manager',
      title: 'Interview Offer Sent',
      message: `Interview offer successfully sent to ${cand.full_name}.`,
      link_url: '/recruitment',
      created_at: new Date().toISOString()
    });

    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Recruitment', details: `Sent interview offer to candidate ${cand.full_name}`, ip_address: req.ip || '0.0.0.0' });

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

    // 1.5 Determine Default Shift based on Position
    let defaultShiftId = null;
    if (cand.position_id) {
      const pos = await dbFetchOne('positions', 'title', { id: cand.position_id });
      if (pos && pos.title) {
        const shifts = await dbFetch('shifts', 'id, shift_name');
        const posTitle = pos.title.toLowerCase();

        let matchedShift = null;
        if (posTitle.includes('reception')) {
          matchedShift = shifts.find(s => s.shift_name.toLowerCase().includes('reception'));
        } else if (posTitle.includes('kitchen')) {
          matchedShift = shifts.find(s => s.shift_name.toLowerCase().includes('kitchen'));
        } else if (posTitle.includes('housekeep')) {
          matchedShift = shifts.find(s => s.shift_name.toLowerCase().includes('housekeep'));
        }

        if (!matchedShift) {
          // Fallback to Office Regular
          matchedShift = shifts.find(s => s.shift_name.toLowerCase().includes('office'));
        }

        if (matchedShift) {
          defaultShiftId = matchedShift.id;
        }
      }
    }

    // 2. Insert into Employees
    const empResult = await dbInsert('Employees', {
      employee_id: empId,
      Full_name: cand.full_name,
      email: cand.email || null,
      phone: cand.phone || null,
      position_id: cand.position_id || null,
      default_shift_id: defaultShiftId,
      status: 'Active',
      employment_type: 'Full-Time',
      created_at: new Date().toISOString()
    });

    if (!empResult) throw new Error('Failed to create employee record');

    // 3. Auto-create sys_users
    const username = cand.email ? cand.email.split('@')[0].toLowerCase() : empId.toLowerCase();
    const defaultPassword = 'MUST_CHANGE:' + hashPassword('password123'); // Default password

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

    await dbInsert('sys_audit_logs', { user_id: req.user.id, action: 'UPDATE', module: 'Recruitment', details: `Converted candidate ${cand.full_name} to employee`, ip_address: req.ip || '0.0.0.0' });

    return res.json({ success: true, message: 'Candidate converted to Employee successfully!' });
  } catch (e) {
    console.error('[Convert Candidate Error]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
