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

// Helper for generating code
async function generateCustomerCode() {
  const { count } = await supabase.schema('crm').from('customers').select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(3, '0');
  return `BBD-${num}`;
}

// POST /api/public/crm/enroll
router.post('/crm/enroll', async (req, res) => {
  try {
    const {
      full_name, facebook_name, age, gender, email, phone, address, delivery_address, delivery_notes,
      food_restriction, activity_level, fasting_willingness,
      current_weight, goal_weight, height, time_frame,
      medical_condition, other_condition, medicine_taking, special_requests
    } = req.body;

    if (!full_name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    const customer_code = await generateCustomerCode();

    const { data: customer, error: custErr } = await supabase.schema('crm').from('customers')
      .insert({ full_name, facebook_name, age: age ? parseInt(age) : null, gender, email, phone, address, delivery_address, delivery_notes, customer_code })
      .select().single();

    if (custErr) throw custErr;

    await supabase.schema('crm').from('customer_health').insert({
      customer_id: customer.id,
      current_weight: current_weight ? `${current_weight} kg` : null,
      goal_weight: goal_weight ? `${goal_weight} kg` : null,
      height: height ? `${height} cm` : null,
      time_frame,
      medical_condition: medical_condition || 'None',
      other_condition: other_condition || 'None',
      medicine_taking: medicine_taking || 'None',
      special_requests: special_requests || 'None',
    });

    await supabase.schema('crm').from('customer_lifestyle').insert({
      customer_id: customer.id,
      food_restriction: food_restriction || 'None',
      activity_level: activity_level || 'Sedentary',
      fasting_willingness: fasting_willingness || 'No',
    });

    const notiMsg = `New customer enrollment via Messenger: ${full_name} (${phone})`;
    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'New Public Customer Enrollment',
      message: notiMsg,
      link_url: `/crm/customers/${customer.id}`,
      created_at: new Date().toISOString()
    });
    await dbInsert('system_notifications', {
      recipient_role: 'admin',
      title: 'New Public Customer Enrollment',
      message: notiMsg,
      link_url: `/crm/customers/${customer.id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, customerId: customer.id });
  } catch (e) {
    console.error('[PUBLIC ENROLLMENT ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/feedback
router.post('/crm/feedback', async (req, res) => {
  try {
    const { customer_id, rating, comment } = req.body;
    
    if (!customer_id || !rating) return res.status(400).json({ error: 'Missing required fields' });

    const { data, error } = await supabase.schema('crm').from('feedbacks')
      .insert({ customer_id: parseInt(customer_id), rating: parseInt(rating), comment: comment || '' })
      .select().single();
      
    if (error) throw error;
    
    // Notify boss
    const { data: cust } = await supabase.schema('crm').from('customers').select('full_name').eq('id', customer_id).single();
    const custName = cust ? cust.full_name : 'Customer';
    
    const notiMsg = `${custName} submitted a ${rating}-star feedback.`;
    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'New Customer Feedback',
      message: notiMsg,
      link_url: `/crm/customers/${customer_id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, feedback: data });
  } catch (e) {
    console.error('[PUBLIC FEEDBACK ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
