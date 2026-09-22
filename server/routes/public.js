import express from 'express';
import multer from 'multer';
import { dbFetch, dbInsert, supabase, supabaseAdmin } from '../lib/supabase.js';
import { crmModule } from '../modules/crm/index.js';
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

// POST /api/public/crm/enroll
router.post('/crm/enroll', async (req, res) => {
  try {
    const { full_name, phone } = req.body;

    if (!full_name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    const customer = await crmModule.enrollPublicCustomer(req.body);

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
    
    if (!customer_id) return res.status(400).json({ error: 'Missing customer ID' });

    const { feedback: data, customerName: custName, finalRating } = await crmModule.submitPublicFeedback({
      customerId: customer_id,
      rating,
      comment
    });
    
    // Notify boss
    const notiMsg = finalRating !== null 
      ? `${custName} submitted a ${finalRating}-star feedback.` 
      : `${custName} submitted a new request or complaint.`;
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
// GET /api/public/menu-plans?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/menu-plans', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ error: 'Missing date range' });

    const { data, error } = await supabaseAdmin.from('operations_menu_plans')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[PUBLIC MENU PLANS ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/menu-feedback
router.post('/crm/menu-feedback', async (req, res) => {
  try {
    const { customer_id, week_name, ratings_json, best_pick, worst_pick, comment } = req.body;
    
    if (!customer_id || !week_name) return res.status(400).json({ error: 'Missing customer or week info' });

    const { data, error } = await supabaseAdmin.from('crm_menu_feedbacks')
      .insert({
        customer_id: parseInt(customer_id),
        week_name,
        ratings_json,
        best_pick: best_pick || null,
        worst_pick: worst_pick || null,
        comment: comment || null
      })
      .select().single();
      
    if (error) throw error;
    
    // Notify boss
    const { data: cust } = await supabaseAdmin.schema('crm').from('customers').select('full_name').eq('id', customer_id).single();
    const custName = cust ? cust.full_name : 'Customer';
    
    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'New Weekly Menu Feedback',
      message: `${custName} submitted feedback for ${week_name}.`,
      link_url: `/crm/weekly-feedbacks`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, feedback: data });
  } catch (e) {
    console.error('[PUBLIC MENU FEEDBACK ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/public/tracking/:orderId
router.get('/tracking/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    let customerId = orderId;
    
    // Check if orderId is actually an order ID
    const { data: order } = await supabaseAdmin.from('operations_orders')
      .select('customer_id')
      .eq('id', orderId)
      .single();
      
    if (order && order.customer_id) {
      customerId = order.customer_id;
    }
    
    const { data: customer, error } = await supabaseAdmin.schema('crm').from('customers')
      .select('full_name, phone, delivery_address')
      .eq('id', customerId)
      .single();
      
    if (error) throw error;
    
    return res.json({ customer });
  } catch (e) {
    console.error('[PUBLIC TRACKING ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/public/crm/welcome-dossier/:id
router.get('/crm/welcome-dossier/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      const dossier = await crmModule.getCustomerWelcomeDossier(id);
      return res.json(dossier);
    } catch (err) {
      if (err.code === 'PGRST116') {
        return res.status(404).json({ error: 'Customer profile not found' });
      }
      throw err;
    }
  } catch (e) {
    console.error('[PUBLIC WELCOME DOSSIER ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/public/crm/monthly-review/:id
router.get('/crm/monthly-review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      const reviewData = await crmModule.getCustomerMonthlyReview(id);
      return res.json(reviewData);
    } catch (err) {
      if (err.code === 'PGRST116') {
        return res.status(404).json({ error: 'Customer profile not found' });
      }
      throw err;
    }
  } catch (e) {
    console.error('[PUBLIC GET MONTHLY REVIEW ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/monthly-review/:id
router.post('/crm/monthly-review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { current_weight } = req.body;

    if (!current_weight) {
      return res.status(400).json({ error: 'Current weight is required' });
    }

    // Submit via CRM module
    const result = await crmModule.submitCustomerMonthlyReview(id, req.body);

    // Notify Boss & Admin
    const notiMsg = `🎉 ${result.customerName} completed monthly review! Current weight: ${result.updatedWeight}. Check e-Certificate achievement!`;

    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'Monthly Review Completed!',
      message: notiMsg,
      link_url: `/crm/customers/${id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      updatedWeight: result.updatedWeight
    });
  } catch (e) {
    console.error('[PUBLIC POST MONTHLY REVIEW ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/churn-exit
router.post('/crm/churn-exit', async (req, res) => {
  try {
    const { customer_id, reason_category, comments, would_recommend } = req.body;
    if (!customer_id) return res.status(400).json({ error: 'Missing customer ID' });

    const { feedback: data, customerName: custName } = await crmModule.submitChurnExit({
      customerId: customer_id,
      reasonCategory: reason_category,
      comments: comments,
      wouldRecommend: would_recommend
    });

    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'Customer Exit Survey Submitted',
      message: `${custName} submitted churn exit survey: ${reason_category}`,
      link_url: `/crm/customers/${customer_id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, feedback: data });
  } catch (e) {
    console.error('[PUBLIC CHURN EXIT ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/referral
router.post('/crm/referral', async (req, res) => {
  try {
    const { referrer_customer_id, referred_name, referred_phone, note } = req.body;
    if (!referred_name || !referred_phone) {
      return res.status(400).json({ error: 'Friend\'s name and phone number are required' });
    }

    const { inquiry, referrerName } = await crmModule.submitReferral({
      referrerCustomerId: referrer_customer_id,
      referredName: referred_name,
      referredPhone: referred_phone,
      note
    });

    // Notify Boss
    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: '🎁 New Customer Referral!',
      message: `${referrerName} referred a new lead: ${referred_name} (${referred_phone})`,
      link_url: `/crm/inquiries`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, inquiry });
  } catch (e) {
    console.error('[PUBLIC REFERRAL ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;

