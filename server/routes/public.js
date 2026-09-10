import express from 'express';
import multer from 'multer';
import { dbFetch, dbInsert, supabase, supabaseAdmin } from '../lib/supabase.js';
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
  const { data } = await supabaseAdmin
    .schema('crm')
    .from('customers')
    .select('customer_code')
    .order('id', { ascending: false })
    .limit(1);
    
  let num = 1;
  if (data && data.length > 0 && data[0].customer_code) {
    const match = data[0].customer_code.match(/\d+$/);
    if (match) {
      num = parseInt(match[0], 10) + 1;
    }
  }
  return `BBD-${String(num).padStart(3, '0')}`;
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

    const { data: customer, error: custErr } = await supabaseAdmin.schema('crm').from('customers')
      .insert({ full_name, facebook_name, age: age ? parseInt(age) : null, gender, email, phone, address, delivery_address, delivery_notes, customer_code })
      .select().single();

    if (custErr) throw custErr;

    await supabaseAdmin.schema('crm').from('customer_health').insert({
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

    await supabaseAdmin.schema('crm').from('customer_lifestyle').insert({
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
    
    if (!customer_id) return res.status(400).json({ error: 'Missing customer ID' });

    const finalRating = rating !== null && rating !== undefined ? parseInt(rating) : null;

    const { data, error } = await supabaseAdmin.schema('crm').from('feedbacks')
      .insert({ customer_id: parseInt(customer_id), rating: finalRating, comment: comment || '' })
      .select().single();
      
    if (error) throw error;
    
    // Notify boss
    const { data: cust } = await supabaseAdmin.schema('crm').from('customers').select('full_name').eq('id', customer_id).single();
    const custName = cust ? cust.full_name : 'Customer';
    
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
    
    // Fetch customer profile
    const { data: customer, error: custErr } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (custErr || !customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    // Fetch health data
    const { data: health } = await supabaseAdmin
      .schema('crm')
      .from('customer_health')
      .select('*')
      .eq('customer_id', id)
      .single();

    // Fetch lifestyle data
    const { data: lifestyle } = await supabaseAdmin
      .schema('crm')
      .from('customer_lifestyle')
      .select('*')
      .eq('customer_id', id)
      .single();

    // Fetch customer packages
    const { data: packages } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    // Fetch customer feedbacks
    const { data: feedbacks } = await supabaseAdmin
      .schema('crm')
      .from('feedbacks')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    // Calculate total spend
    const totalSpend = (packages || []).reduce((sum, pkg) => sum + (pkg.amount || 0), 0);

    return res.json({
      customer: {
        id: customer.id,
        customer_code: customer.customer_code,
        full_name: customer.full_name,
        facebook_name: customer.facebook_name,
        phone: customer.phone,
        total_spend: totalSpend
      },
      health: health || {},
      lifestyle: lifestyle || {},
      packages: packages || [],
      feedbacks: feedbacks || []
    });
  } catch (e) {
    console.error('[PUBLIC WELCOME DOSSIER ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/public/crm/monthly-review/:id
router.get('/crm/monthly-review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch customer profile
    const { data: customer, error: custErr } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('id, customer_code, full_name, facebook_name, phone')
      .eq('id', id)
      .single();

    if (custErr || !customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    // Fetch health data for starting & goal weight
    const { data: health } = await supabaseAdmin
      .schema('crm')
      .from('customer_health')
      .select('*')
      .eq('customer_id', id)
      .single();

    // Fetch latest assigned active/paused package
    const { data: packages } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('*')
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    return res.json({
      customer,
      health: health || {},
      package: packages && packages.length > 0 ? packages[0] : null
    });
  } catch (e) {
    console.error('[PUBLIC GET MONTHLY REVIEW ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/public/crm/monthly-review/:id
router.post('/crm/monthly-review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { current_weight, active_feeling, health_improvements, feedback_comment } = req.body;

    if (!current_weight) {
      return res.status(400).json({ error: 'Current weight is required' });
    }

    // 1. Update customer_health with new current_weight
    const { data: existingHealth } = await supabaseAdmin
      .schema('crm')
      .from('customer_health')
      .select('*')
      .eq('customer_id', id)
      .single();

    const newWeightStr = `${current_weight} kg`;
    if (existingHealth) {
      await supabaseAdmin
        .schema('crm')
        .from('customer_health')
        .update({ current_weight: newWeightStr, updated_at: new Date().toISOString() })
        .eq('customer_id', id);
    } else {
      await supabaseAdmin
        .schema('crm')
        .from('customer_health')
        .insert({ customer_id: id, current_weight: newWeightStr });
    }

    // 2. Insert feedback entry for BBD admin tracking
    const commentStr = `[Monthly Review Milestone]\nCurrent Weight Reported: ${newWeightStr}\nFeel Active & Light: ${active_feeling || 'Yes'}\nHealth Improvements: ${health_improvements || 'None'}\nComment: ${feedback_comment || 'None'}`;

    await supabaseAdmin
      .schema('crm')
      .from('feedbacks')
      .insert({
        customer_id: parseInt(id),
        rating: 5,
        comment: commentStr
      });

    // 3. Notify Boss & Admin
    const { data: cust } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('full_name')
      .eq('id', id)
      .single();

    const custName = cust ? cust.full_name : 'Boss Customer';
    const notiMsg = `🎉 ${custName} completed monthly review! Current weight: ${newWeightStr}. Check e-Certificate achievement!`;

    await dbInsert('system_notifications', {
      recipient_role: 'boss',
      title: 'Monthly Review Completed!',
      message: notiMsg,
      link_url: `/crm/customers/${id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Monthly milestone review submitted successfully!',
      updatedWeight: newWeightStr
    });
  } catch (e) {
    console.error('[PUBLIC POST MONTHLY REVIEW ERROR]', e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
