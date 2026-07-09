import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Multer memory storage for photo uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
});

// Helper: generate customer code
async function generateCustomerCode() {
  const { count } = await supabaseAdmin
    .schema('crm')
    .from('customers')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(3, '0');
  return `BBD-${num}`;
}

// ──────────────────────────────────────────────────────────────────
// SETTINGS (LEVELS)
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/level-settings
router.get('/level-settings', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .select('*')
      .order('required_purchases', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET LEVEL SETTINGS]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/level-settings
router.post('/level-settings', verifyToken, async (req, res) => {
  try {
    const { id, level_name, required_purchases, color } = req.body;
    
    if (!level_name || required_purchases === undefined) {
      return res.status(400).json({ error: 'Level name and required purchases are required' });
    }

    let result;
    if (id) {
      // Update
      const { data, error } = await supabaseAdmin
        .schema('crm')
        .from('level_settings')
        .update({ level_name, required_purchases: parseInt(required_purchases), color })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Insert
      const { data, error } = await supabaseAdmin
        .schema('crm')
        .from('level_settings')
        .insert({ level_name, required_purchases: parseInt(required_purchases), color })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return res.json(result);
  } catch (e) {
    console.error('[CRM POST LEVEL SETTING]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/level-settings/:id
router.delete('/level-settings/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE LEVEL SETTING]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// CUSTOMERS
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/customers
router.get('/customers', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select(`
        *,
        customer_packages (count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch level settings to calculate levels
    const { data: levelSettings } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .select('*')
      .order('required_purchases', { ascending: false });

    // Flatten package count and calculate level
    const result = data.map(c => {
      const packageCount = c.customer_packages?.[0]?.count || 0;
      
      // Determine level based on packageCount
      let calculatedLevel = null;
      if (levelSettings && levelSettings.length > 0) {
        for (const setting of levelSettings) {
          if (packageCount >= setting.required_purchases) {
            calculatedLevel = setting;
            break; // found the highest level since it's ordered descending
          }
        }
      }

      return {
        ...c,
        packages: packageCount,
        level: calculatedLevel,
      };
    });

    return res.json(result);
  } catch (e) {
    console.error('[CRM GET CUSTOMERS]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/customers
router.post('/customers', verifyToken, async (req, res) => {
  try {
    const {
      full_name, facebook_name, age, gender, email, phone, address, delivery_address, delivery_notes,
      food_restriction, activity_level, fasting_willingness,
      current_weight, goal_weight, height, time_frame,
      medical_condition, other_condition, medicine_taking, special_requests
    } = req.body;

    if (!full_name) return res.status(400).json({ error: 'full_name is required' });

    const customer_code = await generateCustomerCode();

    // Insert customer
    const { data: customer, error: custErr } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .insert({ full_name, facebook_name, age: age || null, gender, email, phone, address, delivery_address, delivery_notes, customer_code })
      .select()
      .single();

    if (custErr) throw custErr;

    // Insert health record
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

    // Insert lifestyle record
    await supabaseAdmin.schema('crm').from('customer_lifestyle').insert({
      customer_id: customer.id,
      food_restriction: food_restriction || 'None',
      activity_level: activity_level || 'Sedentary',
      fasting_willingness: fasting_willingness || 'No',
    });

    return res.status(201).json(customer);
  } catch (e) {
    console.error('[CRM POST CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/crm/customers/:id
router.get('/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: customer, error } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !customer) return res.status(404).json({ error: 'Customer not found' });

    const [healthRes, lifestyleRes, packagesRes, galleryRes, feedbackRes] = await Promise.all([
      supabaseAdmin.schema('crm').from('customer_health').select('*').eq('customer_id', id).single(),
      supabaseAdmin.schema('crm').from('customer_lifestyle').select('*').eq('customer_id', id).single(),
      supabaseAdmin.schema('crm').from('customer_packages').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
      supabaseAdmin.schema('crm').from('gallery_photos').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
      supabaseAdmin.schema('crm').from('feedbacks').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
    ]);

    const packagesList = packagesRes.data || [];
    const packageCount = packagesList.length;

    // Fetch level settings to calculate level
    const { data: levelSettings } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .select('*')
      .order('required_purchases', { ascending: false });

    let calculatedLevel = null;
    if (levelSettings && levelSettings.length > 0) {
      for (const setting of levelSettings) {
        if (packageCount >= setting.required_purchases) {
          calculatedLevel = setting;
          break;
        }
      }
    }

    return res.json({
      ...customer,
      health: healthRes.data || {},
      lifestyle: lifestyleRes.data || {},
      packages_list: packagesList,
      level: calculatedLevel,
      gallery: galleryRes.data || [],
      feedbacks: feedbackRes.data || [],
    });
  } catch (e) {
    console.error('[CRM GET CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customers/:id/health
router.put('/customers/:id/health', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { current_weight, goal_weight, height, medical_condition, allergies, time_frame, other_condition, medicine_taking, special_requests } = req.body;

    const { data: existing } = await supabaseAdmin.schema('crm').from('customer_health').select('id').eq('customer_id', id).single();

    if (existing) {
      await supabaseAdmin.schema('crm').from('customer_health')
        .update({ current_weight, goal_weight, height, medical_condition, allergies, time_frame, other_condition, medicine_taking, special_requests, updated_at: new Date() })
        .eq('customer_id', id);
    } else {
      await supabaseAdmin.schema('crm').from('customer_health')
        .insert({ customer_id: id, current_weight, goal_weight, height, medical_condition, allergies, time_frame, other_condition, medicine_taking, special_requests });
    }

    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM PUT HEALTH]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/customers/:id
router.delete('/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Cascade deletes health, lifestyle, packages, gallery (ON DELETE CASCADE)
    const { error } = await supabaseAdmin.schema('crm').from('customers').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// CUSTOMER PACKAGES
// ──────────────────────────────────────────────────────────────────

// POST /api/crm/customers/:id/packages
router.post('/customers/:id/packages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, meal_type, meal_count, start_date, expires_at, payment_status, status } = req.body;

    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .insert({ customer_id: id, name, duration, meal_type, meal_count, start_date, expires_at, payment_status: payment_status || 'Unpaid', status: status || 'Active' })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (e) {
    console.error('[CRM POST PACKAGE]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customer-packages/:id
router.put('/customer-packages/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration, meal_type, meal_count, start_date, expires_at, payment_status, status } = req.body;
    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ name, duration, meal_type, meal_count, start_date, expires_at, payment_status, status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM PUT CUSTOMER_PACKAGE]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/customer-packages/:id
router.delete('/customer-packages/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE CUSTOMER_PACKAGE]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customer-packages/:id/pause
router.put('/customer-packages/:id/pause', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ status: 'Paused' })
      .eq('id', id)
      .select().single();
    if (error) throw error;
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customer-packages/:id/resume
router.put('/customer-packages/:id/resume', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { days_paused } = req.body; // To extend expiry date
    
    // First get current expiry
    const { data: pkg, error: pkgErr } = await supabaseAdmin.schema('crm').from('customer_packages').select('expires_at').eq('id', id).single();
    if (pkgErr) throw pkgErr;
    
    let newExpiry = pkg.expires_at;
    if (days_paused && pkg.expires_at) {
      const expDate = new Date(pkg.expires_at);
      expDate.setDate(expDate.getDate() + parseInt(days_paused));
      newExpiry = expDate.toISOString().split('T')[0];
    }

    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ status: 'Active', expires_at: newExpiry })
      .eq('id', id)
      .select().single();
    if (error) throw error;
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/kitchen-dashboard/deduct-meals
router.post('/kitchen-dashboard/deduct-meals', verifyToken, async (req, res) => {
  try {
    // We fetch all active packages that have meal_count > 0 and deduct 1
    const { data: packages, error: fetchErr } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select('id, meal_count')
      .eq('status', 'Active')
      .gt('meal_count', 0);
      
    if (fetchErr) throw fetchErr;
    
    let deductedCount = 0;
    // Basic loop update (in production, use RPC for bulk update)
    for (const pkg of packages) {
      const { error } = await supabaseAdmin.schema('crm')
        .from('customer_packages')
        .update({ meal_count: pkg.meal_count - 1 })
        .eq('id', pkg.id);
      if (!error) deductedCount++;
    }
    
    return res.json({ success: true, message: `Deducted 1 meal from ${deductedCount} active packages.` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/crm/kitchen-dashboard
router.get('/kitchen-dashboard', verifyToken, async (req, res) => {
  try {
    // Get all active packages today with customer info
    const { data: packages, error } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select(`
        *,
        customers:customer_id ( full_name, phone, address, delivery_address, delivery_notes ),
        customer_health!inner ( allergies, medical_condition, special_requests ),
        customer_lifestyle!inner ( food_restriction )
      `)
      .eq('status', 'Active')
      .gt('meal_count', 0);

    if (error) throw error;
    
    let totalLunch = 0;
    let totalDinner = 0;
    const specialRequests = [];

    // Parse the data for kitchen view
    const deliveryList = packages.map(pkg => {
      let isLunch = pkg.meal_type.toLowerCase().includes('lunch');
      let isDinner = pkg.meal_type.toLowerCase().includes('dinner');
      
      if (isLunch) totalLunch++;
      if (isDinner) totalDinner++;
      
      const restrictions = [];
      const health = pkg.customer_health || {};
      const lifestyle = pkg.customer_lifestyle || {};
      
      if (health.allergies && health.allergies !== 'None') restrictions.push(health.allergies);
      if (health.special_requests && health.special_requests !== 'None') restrictions.push(health.special_requests);
      if (lifestyle.food_restriction && lifestyle.food_restriction !== 'None') restrictions.push(lifestyle.food_restriction);
      
      const restrictionStr = restrictions.join(', ');
      if (restrictionStr) {
        specialRequests.push({ customer: pkg.customers.full_name, request: restrictionStr, type: pkg.meal_type });
      }

      return {
        package_id: pkg.id,
        customer_id: pkg.customer_id,
        name: pkg.customers.full_name,
        phone: pkg.customers.phone,
        delivery_address: pkg.customers.delivery_address || pkg.customers.address || 'No Address',
        delivery_notes: pkg.customers.delivery_notes || '',
        meal_type: pkg.meal_type,
        restrictions: restrictionStr || 'None'
      };
    });

    return res.json({
      headcount: { totalLunch, totalDinner },
      specialRequests,
      deliveryList
    });
  } catch (e) {
    console.error('[CRM KITCHEN DASHBOARD]', e);
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// GALLERY PHOTOS
// ──────────────────────────────────────────────────────────────────

// POST /api/crm/customers/:id/gallery  (file upload)
router.post('/customers/:id/gallery', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'Before' or 'After'

    let url = req.body.url || null;
    let storage_path = null;

    if (req.file) {
      // Upload to Supabase Storage bucket "crm-gallery"
      const ext = req.file.originalname.split('.').pop();
      const filePath = `customer_${id}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabaseAdmin.storage
        .from('crm-gallery')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('crm-gallery')
        .getPublicUrl(filePath);

      url = urlData.publicUrl;
      storage_path = filePath;
    }

    if (!url) return res.status(400).json({ error: 'No photo file or URL provided' });

    const { data, error } = await supabaseAdmin.schema('crm').from('gallery_photos')
      .insert({ customer_id: id, type: type || 'Before', url, storage_path })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (e) {
    console.error('[CRM POST GALLERY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/gallery/:photoId
router.delete('/gallery/:photoId', verifyToken, async (req, res) => {
  try {
    const { photoId } = req.params;

    // Get photo to find storage_path
    const { data: photo } = await supabaseAdmin.schema('crm').from('gallery_photos').select('*').eq('id', photoId).single();

    if (photo?.storage_path) {
      // Delete from Supabase Storage
      await supabaseAdmin.storage.from('crm-gallery').remove([photo.storage_path]);
    }

    const { error } = await supabaseAdmin.schema('crm').from('gallery_photos').delete().eq('id', photoId);
    if (error) throw error;

    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE GALLERY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// INQUIRIES / LEADS
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/inquiries
router.get('/inquiries', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .select(`
        *,
        inquiries_messages ( id, message_text, sender_type, created_at )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET INQUIRIES]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/crm/inquiries/:id/messages
router.get('/inquiries/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries_messages')
      .select('*')
      .eq('inquiry_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET INQUIRY MESSAGES]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// AI Analysis Helper
async function triggerAIAnalysis(inquiryId) {
  if (!process.env.GEMINI_API_KEY) {
    await supabaseAdmin.schema('crm').from('inquiries').update({ updated_at: new Date() }).eq('id', inquiryId);
    return;
  }
  
  try {
    const { data: history } = await supabaseAdmin.schema('crm').from('inquiries_messages')
      .select('sender_type, message_text')
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: true })
      .limit(15);
      
    if (!history || history.length === 0) return;
      
    const chatHistory = history.map(m => `${m.sender_type.toUpperCase()}: ${m.message_text}`).join('\n');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `
You are an expert CRM AI Assistant for a Diet & Meal Delivery service. 
Analyze the following conversation history between a PROSPECT and our ADMIN.

Chat History:
${chatHistory}

Task:
Provide a JSON response analyzing the prospect's intent, sentiment, recommended action for the admin, and a confidence score (0-100) of how likely they are to purchase a diet package.
The JSON must have the following exact keys:
{
  "intent": "string (e.g., pricing_inquiry, general_question, complaint, ready_to_buy)",
  "sentiment": "string (e.g., positive, curious, neutral, frustrated)",
  "recommended_action": "string (1-2 sentences of what the admin should reply. Write this strictly in Myanmar language / Burmese)",
  "confidence_score": integer (0 to 100)
}

Respond ONLY with the raw JSON object. Do not include markdown formatting or backticks.
    `;
    
    const result = await model.generateContent(prompt);
    let aiText = result.response.text().trim();
    if (aiText.startsWith('\`\`\`json')) aiText = aiText.substring(7, aiText.length - 3).trim();
    else if (aiText.startsWith('\`\`\`')) aiText = aiText.substring(3, aiText.length - 3).trim();
    
    const aiJson = JSON.parse(aiText);
    
    await supabaseAdmin.schema('crm').from('inquiries')
      .update({ 
        updated_at: new Date(),
        ai_analysis_result: {
          intent: aiJson.intent,
          sentiment: aiJson.sentiment,
          recommended_action: aiJson.recommended_action
        },
        service_interest_confidence: aiJson.confidence_score,
        status: aiJson.confidence_score > 80 ? 'in_progress' : undefined
      })
      .eq('id', inquiryId);
  } catch (aiErr) {
    console.error('[CRM AI ANALYSIS ERROR]', aiErr);
  }
}

// GET /api/crm/webhooks/zernio (For Webhook Verification Pings)
router.get('/webhooks/zernio', (req, res) => {
  return res.status(200).send(req.query['hub.challenge'] || 'OK');
});

// POST /api/crm/webhooks/zernio (No verifyToken because it's a public webhook)
router.post('/webhooks/zernio', async (req, res) => {
  try {
    const payload = req.body;
    console.log('[ZERNIO WEBHOOK RECEIVED]', JSON.stringify(payload).substring(0, 500));

    // Try to extract text based on common webhook formats
    let text = '';
    if (typeof payload.text === 'string') text = payload.text;
    else if (payload.message && typeof payload.message.text === 'string') text = payload.message.text;
    else if (payload.entry?.[0]?.messaging?.[0]?.message?.text) {
      text = payload.entry[0].messaging[0].message.text;
    }
    if (!text) text = "[Zernio Msg] " + JSON.stringify(payload).substring(0, 100);

    // Extract prospect name or ID
    let prospectName = payload.sender?.name || payload.message?.sender?.name || payload.sender_name || payload.contact_name || payload.name || 'Zernio Contact';
    if (payload.entry?.[0]?.messaging?.[0]?.sender?.id) {
      prospectName = 'FB User ' + payload.entry[0].messaging[0].sender.id;
    }

    // Check if inquiry exists
    const { data: existing } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('id').eq('prospect_name', prospectName).order('created_at', { ascending: false }).limit(1).maybeSingle();

    let inquiryId = existing?.id;
    
    if (!inquiryId) {
      const { data: newInq } = await supabaseAdmin.schema('crm').from('inquiries')
        .insert({ prospect_name: prospectName, source: 'messenger', service_interest: 'Zernio Incoming' })
        .select('id').single();
      inquiryId = newInq.id;
    }

    const cleanMetadata = {
      conversationId: payload.message?.conversationId || payload.conversationId,
      sender: {
        id: payload.sender?.id || payload.message?.sender?.id || payload.entry?.[0]?.messaging?.[0]?.sender?.id
      }
    };

    await supabaseAdmin.schema('crm').from('inquiries_messages')
      .insert({ inquiry_id: inquiryId, message_text: text, sender_type: 'prospect', metadata: cleanMetadata });

    setTimeout(() => triggerAIAnalysis(inquiryId), 100);

    return res.status(200).send('OK');
  } catch (err) {
    console.error('[ZERNIO WEBHOOK ERROR]', err);
    return res.status(500).send('Internal Error');
  }
});

// POST /api/crm/inquiries/:id/messages
router.post('/inquiries/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message_text, sender_type, metadata } = req.body;
    
    if (!message_text) return res.status(400).json({ error: 'message_text is required' });

    // 1. Insert the new message
    const { data: newMsg, error: insertError } = await supabaseAdmin.schema('crm').from('inquiries_messages')
      .insert({ 
        inquiry_id: id, 
        message_text, 
        sender_type: sender_type || 'admin', 
        metadata 
      })
      .select()
      .single();

    if (insertError) throw insertError;
    
    // 2. Run AI Analysis in the background
    setTimeout(() => triggerAIAnalysis(id), 100);

    // 3. Send message to Facebook via Zernio (or direct FB fallback) if it's an admin reply
    if ((!sender_type || sender_type === 'admin') && (process.env.ZERNIO_API_KEY || process.env.FACEBOOK_PAGE_ACCESS_TOKEN)) {
      try {
        const { data: prospectMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
          .select('metadata')
          .eq('inquiry_id', id)
          .eq('sender_type', 'prospect')
          .not('metadata', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1);

        if (prospectMsgs && prospectMsgs.length > 0) {
          const meta = prospectMsgs[0].metadata;
          const conversationId = meta?.message?.conversationId || meta?.conversationId;
          
          if (conversationId && process.env.ZERNIO_API_KEY) {
            const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`;
            const zernioResponse = await fetch(zernioUrl, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`,
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify({
                accountId: process.env.ZERNIO_ACCOUNT_ID,
                message: message_text
              })
            });
            const zernioResult = await zernioResponse.json();
            if (zernioResult.error) {
              console.error('[ZERNIO SEND ERROR]', zernioResult.error);
            }
          } else {
            // Fallback to direct FB if Zernio API key is missing or not a Zernio webhook
            let psid = meta?.sender?.id || meta?.message?.sender?.id || meta?.entry?.[0]?.messaging?.[0]?.sender?.id;
            if (psid && process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
              const fbUrl = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`;
              const fbResponse = await fetch(fbUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipient: { id: psid },
                  message: { text: message_text },
                  messaging_type: 'RESPONSE'
                })
              });
              const fbResult = await fbResponse.json();
              if (fbResult.error) {
                console.error('[FB SEND ERROR]', fbResult.error);
              }
            }
          }
        }
      } catch (fbErr) {
        console.error('[REPLY SEND ERROR]', fbErr.message);
      }
    }

    return res.status(201).json(newMsg);
  } catch (e) {
    console.error('[CRM POST INQUIRY MESSAGE]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/inquiries
router.post('/inquiries', verifyToken, async (req, res) => {
  try {
    const { prospect_name, prospect_contact, source, service_interest } = req.body;
    if (!prospect_name) return res.status(400).json({ error: 'prospect_name is required' });

    const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .insert({ 
        prospect_name, 
        prospect_contact,
        source: source || 'messenger', 
        service_interest, 
        status: 'new' 
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (e) {
    console.error('[CRM POST INQUIRY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/inquiries/:id
router.put('/inquiries/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, ai_analysis_result, service_interest_confidence } = req.body;

    const updateData = { updated_at: new Date() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (ai_analysis_result) updateData.ai_analysis_result = ai_analysis_result;
    if (service_interest_confidence !== undefined) updateData.service_interest_confidence = service_interest_confidence;

    const { error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM PUT INQUIRY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/inquiries/:id
router.delete('/inquiries/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.schema('crm').from('inquiries').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// PACKAGES (available plans)
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/packages
router.get('/packages', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('packages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/packages
router.post('/packages', verifyToken, async (req, res) => {
  try {
    const { name, duration, price } = req.body;
    const { data, error } = await supabaseAdmin.schema('crm').from('packages')
      .insert({ name, duration, price })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/packages/:id
router.put('/packages/:id', verifyToken, async (req, res) => {
  try {
    const { name, duration, price } = req.body;
    const { error } = await supabaseAdmin.schema('crm').from('packages')
      .update({ name, duration, price })
      .eq('id', req.params.id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/packages/:id
router.delete('/packages/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.schema('crm').from('packages').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
    sevenMonthsAgo.setDate(1);
    const sevenMonthsAgoStr = sevenMonthsAgo.toISOString().split('T')[0];

    const [
      { count: totalCustomers },
      { count: totalLeads },
      { data: convertedLeads },
      { data: activePackages },
      { data: upcomingRenewals },
      { data: recentLeads },
      { data: recentCustomers },
    ] = await Promise.all([
      supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact', head: true }).neq('status', 'Converted'),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact' }).eq('status', 'Converted').gte('created_at', thisMonthStart),
      supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact' }).gte('expires_at', today),
      supabaseAdmin.schema('crm').from('customer_packages').select('*, customers!inner(full_name, facebook_name)').gte('expires_at', today).lte('expires_at', thirtyDaysLater).order('expires_at', { ascending: true }).limit(5),
      supabaseAdmin.schema('crm').from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.schema('crm').from('customers').select('created_at').gte('created_at', sevenMonthsAgoStr),
    ]);

    const mappedRenewals = (upcomingRenewals || []).map(pkg => {
      const daysLeft = Math.ceil((new Date(pkg.expires_at) - new Date(today)) / (1000 * 60 * 60 * 24));
      return {
        customerId: pkg.customer_id,
        customerName: pkg.customers?.full_name || 'Unknown',
        packageName: pkg.name,
        daysLeft: daysLeft
      };
    });

    const customerGrowth = [0, 0, 0, 0, 0, 0, 0];
    const currM = new Date().getMonth();
    const currY = new Date().getFullYear();

    (recentCustomers || []).forEach(c => {
      const d = new Date(c.created_at);
      const diff = (currY - d.getFullYear()) * 12 + (currM - d.getMonth());
      if (diff >= 0 && diff <= 6) {
        customerGrowth[6 - diff] += 1;
      }
    });

    return res.json({
      totalCustomers: totalCustomers || 0,
      activeLeads: totalLeads || 0,
      convertedThisMonth: convertedLeads?.length || 0,
      activePackages: activePackages?.length || 0,
      upcomingRenewals: mappedRenewals,
      recentLeads: recentLeads || [],
      customerGrowth: customerGrowth
    });
  } catch (e) {
    console.error('[CRM DASHBOARD]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/crm/inquiries/:id
router.delete('/inquiries/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabaseAdmin.schema('crm').from('inquiries_messages').delete().eq('inquiry_id', id);
    const { error } = await supabaseAdmin.schema('crm').from('inquiries').delete().eq('id', id);
    if (error) throw error;
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE INQUIRY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
