import express from 'express';
import multer from 'multer';
import { dbFetch, dbInsert, supabase } from '../lib/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// GET /api/public/jobs
router.get('/jobs', async (req, res) => {
  try {
    const positions = await dbFetch('positions', '*');
    const openJobs = positions.filter(p => p.is_hiring === true);

    openJobs.forEach(p => {
      p.department_name = p.team || 'General';
      p.description = 'Join our dynamic team and help us build amazing things.';
    });

    return res.json({ jobs: openJobs });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/apply
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { position_id, candidate_name, email, phone, cover_letter } = req.body;

    if (!position_id || !candidate_name) {
      return res.status(400).json({ error: 'Position ID and Candidate Name are required' });
    }

    let resumeUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) {
        console.error('[STORAGE UPLOAD ERROR]', error);
        // Fallback to null or return error? We can just proceed without resume or return error.
        // Let's just log and proceed without resumeUrl if bucket doesn't exist, to not break completely.
      } else {
        const { data: pubData } = supabase.storage.from('resumes').getPublicUrl(fileName);
        resumeUrl = pubData?.publicUrl || null;
      }
    }

    let aiScore = null;
    let aiReasoning = null;
    let finalStatus = 'Applied';

    // Evaluate with Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        // Fetch position title for context
        const positions = await dbFetch('positions', 'id,title');
        const pos = positions.find(p => p.id === position_id);
        const posTitle = pos ? pos.title : 'General Position';

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
        Evaluate this job application for the position: "${posTitle}".
        Candidate Cover Letter/Notes/Resume Text: ${cover_letter || 'No cover letter provided. Assume general match.'}
        
        Return ONLY valid JSON in exactly this format:
        {"score": <integer 1-10>, "reasoning": "<brief justification>"}
        `;
        const result = await model.generateContent(prompt);
        const respText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(respText);
        aiScore = aiData.score || 5;
        aiReasoning = aiData.reasoning || "No reasoning provided.";

        if (aiScore >= 8) {
          finalStatus = 'Screening';
        }

        if (aiScore >= 7) {
          const notiMsg = `We found a strong candidate (${aiScore}/10) for ${posTitle}. Review their application in Recruitment.`;
          await dbInsert('system_notifications', {
            recipient_role: 'hr_manager',
            title: 'High-Scoring Candidate Alert!',
            message: notiMsg,
            link_url: '/recruitment',
            created_at: new Date().toISOString()
          });
          await dbInsert('system_notifications', {
            recipient_role: 'boss',
            title: 'High-Scoring Candidate Alert!',
            message: notiMsg,
            link_url: '/recruitment',
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('[AI Eval Error]', err);
      }
    }

    const inserted = await dbInsert('recruitment_candidates', {
      position_id,
      full_name: candidate_name,
      email,
      phone,
      notes: cover_letter,
      status: finalStatus,
      resume_url: resumeUrl,
      ai_score: aiScore,
      ai_reasoning: aiReasoning,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Application submitted successfully', ai_score: aiScore });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
