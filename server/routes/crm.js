import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { supabaseAdmin, isSupabaseServiceRoleConfigured } from '../lib/supabase.js';
import { verifyToken, requireBoss } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { emitInquiryMessage, emitInquiryUpdated, emitInquiryCreated } from '../lib/crmRealtime.js';
import { packageBodySchema, resumePackageSchema } from '../schemas/crmPackagesSchema.js';
import { crmPackagesService } from '../services/crmPackagesService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as crmController from '../modules/crm/controller/index.js';
import { triggerAIAnalysis } from '../modules/ai/service/webhookAiService.js';

const router = express.Router();

// ── SECURITY: Global authentication guard ────────────────────────
// ALL CRM routes require a valid JWT, EXCEPT for public webhooks.
router.use((req, res, next) => {
  if (req.path === '/webhooks/zernio') {
    return next();
  }
  return verifyToken(req, res, next);
});

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

class Mutex {
  constructor() {
    this._queue = [];
    this._locked = false;
  }
  async acquire() {
    return new Promise(resolve => {
      this._queue.push(resolve);
      this._dispatch();
    });
  }
  _dispatch() {
    if (this._locked || this._queue.length === 0) return;
    this._locked = true;
    const resolve = this._queue.shift();
    resolve(() => {
      this._locked = false;
      this._dispatch();
    });
  }
}

const customerCreationMutex = new Mutex();

// ──────────────────────────────────────────────────────────────────
// SETTINGS (LEVELS)
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/level-settings
router.get('/level-settings', verifyToken, crmController.getLevelSettings);

// POST /api/crm/level-settings
router.post('/level-settings', verifyToken, crmController.upsertLevelSetting);

// DELETE /api/crm/level-settings/:id
router.delete('/level-settings/:id', verifyToken, crmController.deleteLevelSetting);

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
        customer_packages (
          id,
          name,
          status,
          amount,
          start_date,
          expires_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch level settings to calculate levels
    const { data: rawLevelSettings } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .select('*')
      .order('required_spend', { ascending: false });

    const levelSettings = (rawLevelSettings || []).map(item => {
      let color = item.color || 'blue';
      let max_spend = null;
      if (color && color.includes('|max_spend:')) {
        const parts = color.split('|max_spend:');
        color = parts[0];
        max_spend = parseInt(parts[1], 10);
      }
      return {
        ...item,
        min_spend: item.min_spend !== undefined && item.min_spend !== null ? item.min_spend : (item.required_spend || 0),
        max_spend,
        color
      };
    }).sort((a, b) => b.min_spend - a.min_spend);

    // Flatten package amounts and calculate level
    const result = data.map(c => {
      const rawPackages = c.customer_packages || [];
      const totalSpend = rawPackages.reduce((sum, pkg) => sum + (pkg.amount || 0), 0) || 0;
      const packageCount = rawPackages.length;
      
      // Determine "is_active" using BOTH status and expiry date.
      // This ensures the Customer List page is always consistent with the Dashboard count.
      const _today = new Date();
      _today.setHours(0, 0, 0, 0);

      const activePkg = rawPackages.find(p => {
        const hasValidStatus = ['Active', 'Paused', 'Booking Confirmed', 'Upcoming'].includes(p.status);
        if (!hasValidStatus) return false;

        // A package is only truly active if it has NOT expired yet
        const expiresAtDate = p.expires_at ? new Date(p.expires_at) : null;
        if (!expiresAtDate) return false; // No expiry date = treat as not active (data integrity)
        expiresAtDate.setHours(0, 0, 0, 0);

        return expiresAtDate >= _today;
      });

      const isActive = !!activePkg;
      // Only show package names for active packages to avoid confusing expired plan names
      const packageNames = rawPackages.map(p => p.name).filter(Boolean);

      // Determine level based on totalSpend range
      let calculatedLevel = null;
      if (levelSettings && levelSettings.length > 0) {
        for (const setting of levelSettings) {
          const min = setting.min_spend;
          const max = setting.max_spend;

          if (totalSpend >= min) {
            calculatedLevel = { ...setting, min_spend: min, max_spend: max };
            break;
          }
        }
      }

      return { 
        ...c, 
        level: calculatedLevel, 
        total_spend: totalSpend, 
        packages: packageCount,
        is_active: isActive,
        package_names: packageNames,
        customer_packages: rawPackages
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

    const release = await customerCreationMutex.acquire();
    try {
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

    // Add to MailerLite
    if (email) {
      import('./mailerlite.js').then(({ default: mailerlite }) => {
        mailerlite.addSubscriber(email, full_name, { age, gender, phone }).catch(e => console.error('[MailerLite Add Failed]', e.message));
      }).catch(err => console.error('Failed to load mailerlite module', err));
    }

    return res.status(201).json(customer);
    } finally {
      release();
    }
  } catch (e) {
    console.error('[CRM POST CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});
// POST /api/crm/customers/:id/avatar
router.post('/customers/:id/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const { id } = req.params;
    const file = req.file;
    const filename = id; // use customer id as filename
    
    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(filename);
    const avatarUrl = `${publicUrl}?t=${Date.now()}`; // cache busting
    
    res.json({ success: true, avatar_url: avatarUrl });
  } catch (err) {
    console.error('[AVATAR UPLOAD ERROR]', err.message);
    res.status(500).json({ error: err.message });
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

    const customerPackages = packagesRes.data || [];

    // Fetch level settings to calculate level
    const { data: levelSettings } = await supabaseAdmin
      .schema('crm')
      .from('level_settings')
      .select('*')
      .order('required_spend', { ascending: false });

    // Calculate total spend
    const totalSpend = customerPackages?.reduce((sum, pkg) => sum + (pkg.amount || 0), 0) || 0;

    let calculatedLevel = null;
    if (levelSettings && levelSettings.length > 0) {
      for (const setting of levelSettings) {
        if (totalSpend >= setting.required_spend) {
          calculatedLevel = setting;
          break;
        }
      }
    }

    return res.json({
      ...customer,
      health: healthRes.data || {},
      lifestyle: lifestyleRes.data || {},
      packages_list: customerPackages,
      level: calculatedLevel,
      total_spend: totalSpend,
      gallery: galleryRes.data || [],
      feedbacks: feedbackRes.data || [],
    });
  } catch (e) {
    console.error('[CRM GET CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/customers/:id/zernio-remind
router.post('/customers/:id/zernio-remind', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { packageName, duration, daysLeft } = req.body;

    // 1. Fetch customer details
    const { data: customer, error: custErr } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .select('full_name, facebook_name')
      .eq('id', id)
      .single();

    if (custErr || !customer) return res.status(404).json({ error: 'Customer not found' });

    // Find linked inquiry
    let { data: inquiries } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .select('id')
      .eq('customer_id', id);

    // Fallback: If no direct link, try to match by facebook_name
    if ((!inquiries || inquiries.length === 0) && customer.facebook_name) {
      const { data: fbInquiries } = await supabaseAdmin
        .schema('crm')
        .from('inquiries')
        .select('id')
        .ilike('prospect_name', customer.facebook_name);
      
      if (fbInquiries && fbInquiries.length > 0) {
        inquiries = fbInquiries;
      }
    }

    if (!inquiries || inquiries.length === 0) {
      return res.status(400).json({ 
        error: 'No linked Facebook/Zernio chat found.', 
        code: 'NO_LINKED_CHAT' 
      });
    }

    // Find latest prospect message with metadata to get conversationId
    const inquiryIds = inquiries.map(i => i.id);
    const { data: prospectMsgs } = await supabaseAdmin
      .schema('crm')
      .from('inquiries_messages')
      .select('metadata')
      .in('inquiry_id', inquiryIds)
      .eq('sender_type', 'prospect')
      .not('metadata', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!prospectMsgs || prospectMsgs.length === 0) {
      return res.status(400).json({ error: 'No recent Messenger conversation found to reply to.' });
    }

    const meta = prospectMsgs[0].metadata;
    const conversationId = meta?.message?.conversationId || meta?.conversationId;

    if (!conversationId) {
      return res.status(400).json({ error: 'Invalid or missing conversation ID in the chat history.' });
    }

    // 2. Build the message based on duration and daysLeft
    let messageText = '';
    const durationLower = (duration || '').toLowerCase();
    
    if (daysLeft < 0) {
      // Past expiry
      messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${packageName} လေး ကုန်သွားတာ ${Math.abs(daysLeft)} ရက် ရှိသွားပါပြီရှင်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေခဲ့ရဲ့လားရှင်။\n\nနောက်ရက်တွေအတွက် Plan လေးများ ပြန်စဖို့ အစီအစဉ်ရှိမလား သိချင်လို့ပါရှင် 🥗✨`;
    } else if (durationLower.includes('month') || durationLower.includes('30 day')) {
      // Monthly plan renewal reminder
      messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${packageName} လေးက နောက် ${daysLeft} ရက်နေရင် ကုန်ပါတော့မယ်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေရဲ့လားရှင်။\n\nနောက်လအတွက် Plan လေး ဆက်ယူဖြစ်မလား သိချင်လို့ပါရှင် 🥗✨`;
    } else {
      // Default / Weekly plan renewal reminder
      messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${packageName} လေးက နောက် ${daysLeft === 0 ? 'ဒီနေ့' : daysLeft + ' ရက်နေရင်'} ကုန်ပါတော့မယ်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေရဲ့လားရှင်။\n\nနောက်ပြီး Plan လေး ဆက်ယူဖြစ်မလား သိချင်လို့ပါရှင် 🥗✨`;
    }

    // 3. Send message via Zernio API 
    const zernioApiKey = process.env.ZERNIO_API_KEY;

    if (!zernioApiKey) {
      return res.status(500).json({ error: 'ZERNIO_API_KEY is missing on the live server environment variables.' });
    }
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID not found for this customer.' });
    }

    const quickReplies = [
      { content_type: 'text', title: '🥗 Plan ဆက်ယူမည်', payload: 'RENEW_PLAN' },
      { content_type: 'text', title: '💬 မေးမြန်းမည်', payload: 'INQUIRE_MORE' }
    ];

    // Try standard send first (works when recipient in 24h window)
    let zernioResponse = await fetch(zernioUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zernioApiKey}` },
      body: JSON.stringify({
        accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
        message: messageText,
        quickReplies,
        quick_replies: quickReplies
      })
    });
    let zernioResult = await zernioResponse.json();

    // If standard send failed, try tagged payload fallback for outside 24h window
    if (!zernioResponse.ok || zernioResult.error) {
      zernioResponse = await fetch(zernioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zernioApiKey}` },
        body: JSON.stringify({
          accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
          messagingType: 'MESSAGE_TAG',
          messageTag: 'POST_PURCHASE_UPDATE',
          message: messageText
        })
      });
      zernioResult = await zernioResponse.json();
    }

    if (!zernioResponse.ok || zernioResult.error) {
      const errorDetail = zernioResult.error || zernioResult.message || zernioResult.detail || JSON.stringify(zernioResult);
      console.error('[ZERNIO SEND ERROR]', errorDetail);
      return res.status(500).json({ error: `Zernio API Error: ${errorDetail}` });
    }

    // 5. Save the sent message to chat history so it shows up in CRM Inbox
    try {
      await supabaseAdmin.schema('crm')
        .from('inquiries_messages')
        .insert({
          inquiry_id: inquiryIds[0],
          message_text: messageText,
          sender_type: 'admin', 
          metadata: { manual_reminder: true, conversationId }
        });
    } catch (saveErr) {
      console.error('[MANUAL REMIND] Failed to save sent message to inquiries_messages:', saveErr.message);
    }

    return res.json({ success: true, message: 'Reminder sent via Zernio Chat!' });
  } catch (e) {
    console.error('[CRM POST ZERNIO REMIND]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customers/:id/link-chat
router.put('/customers/:id/link-chat', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { inquiry_id } = req.body;
    
    if (!inquiry_id) return res.status(400).json({ error: 'inquiry_id is required' });

    // Link the inquiry to this customer
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .update({ customer_id: id, updated_at: new Date().toISOString() })
      .eq('id', inquiry_id)
      .select()
      .single();

    if (error) throw error;
    
    emitInquiryUpdated(data);
    return res.json({ success: true, inquiry: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/customers/:id
router.put('/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name, facebook_name, age, gender, email, phone, address, delivery_address, delivery_notes
    } = req.body;

    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('customers')
      .update({ full_name, facebook_name, age: age || null, gender, email, phone, address, delivery_address, delivery_notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM UPDATE CUSTOMER]', e.message);
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
router.post('/customers/:id/packages', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = packageBodySchema.parse(req.body);
  const data = await crmPackagesService.createPackage(id, validatedData);
  return res.status(201).json(data);
}));

// PUT /api/crm/customer-packages/:id
router.put('/customer-packages/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = packageBodySchema.parse(req.body);
  const data = await crmPackagesService.updatePackage(id, validatedData);
  return res.json(data);
}));

// DELETE /api/crm/customer-packages/:id
router.delete('/customer-packages/:id', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  await crmPackagesService.deletePackage(id);
  return res.json({ success: true });
}));

// PUT /api/crm/customer-packages/:id/pause
router.put('/customer-packages/:id/pause', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { package: data, customerId } = await crmPackagesService.pausePackage(id);
  await crmPackagesService.notifyPause(customerId);
  return res.json(data);
}));

// PUT /api/crm/customer-packages/:id/resume
router.put('/customer-packages/:id/resume', verifyToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { days_paused } = resumePackageSchema.parse(req.body);
  const data = await crmPackagesService.resumePackage(id, days_paused);
  return res.json(data);
}));

// POST /api/crm/customer-packages/:id/renew (Deprecated by UI, but kept for API compatibility)
router.post('/customer-packages/:id/renew', verifyToken, asyncHandler(async (req, res) => {
  return res.status(501).json({ error: 'Please use /api/crm/customers/:id/packages instead' });
}));

// POST /api/crm/kitchen-dashboard/deduct-meals
router.post('/kitchen-dashboard/deduct-meals', verifyToken, crmController.deductKitchenMeals);

// GET /api/crm/kitchen-dashboard
router.get('/kitchen-dashboard', verifyToken, crmController.getKitchenDashboard);

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

// GET /api/crm/inquiries/recent
// AND GET /api/crm/inquiries/unlinked (alias for cached frontends)
router.get(['/inquiries/recent', '/inquiries/unlinked'], verifyToken, async (req, res) => {
  try {
    // Fetch 20 most recent inquiries regardless of link status, to allow force re-linking
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .select('id, prospect_name, created_at, updated_at, source, customer_id')
      .order('updated_at', { ascending: false })
      .limit(30);

    if (error) throw error;
    
    return res.json(data || []);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/crm/inquiries
router.get('/inquiries', verifyToken, async (req, res) => {
  try {
    if (!isSupabaseServiceRoleConfigured()) {
      return res.status(500).json({
        error: 'CRM requires SUPABASE_SERVICE_KEY in server/.env (Supabase → Project Settings → API → service_role). Anon key cannot read crm.inquiries.',
      });
    }
    let query = supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .select(`
        *,
        inquiries_messages ( id, message_text, sender_type, created_at )
      `)
      .order('updated_at', { ascending: false });

    if (req.query.unlinked === 'true') {
      query = query.is('customer_id', null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET INQUIRIES]', e.message);
    const hint = /permission denied/i.test(e.message)
      ? ' Check SUPABASE_SERVICE_KEY and run GRANT USAGE ON SCHEMA crm TO service_role; plus table grants from server/scripts/ai_inquiries_schema.sql'
      : '';
    return res.status(500).json({ error: e.message + hint });
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

// GET /api/crm/customers/:id/inquiries
router.get('/customers/:id/inquiries', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .schema('crm')
      .from('inquiries')
      .select(`
        *,
        inquiries_messages ( id, message_text, sender_type, created_at )
      `)
      .eq('customer_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET CUSTOMER INQUIRIES]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/crm/inquiries/:id/link-customer
router.put('/inquiries/:id/link-customer', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id } = req.body;
    
    if (customer_id === undefined) return res.status(400).json({ error: 'customer_id is required' });

    let updateData = {};
    if (customer_id === null) {
      updateData = {
        customer_id: null,
        status: 'in_progress',
        updated_at: new Date()
      };
    } else {
      updateData = {
        customer_id,
        status: 'converted',
        onboarding_token: null, // Revoke the onboarding token link
        updated_at: new Date()
      };
    }

    const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM LINK INQUIRY TO CUSTOMER]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// AI Analysis Helper moved to server/modules/ai/service/webhookAiService.js

// GET /api/crm/webhooks/zernio (For Webhook Verification Pings)
router.get('/webhooks/zernio', (req, res) => {
  return res.status(200).send(req.query['hub.challenge'] || 'OK');
});

// POST /api/crm/webhooks/zernio (No verifyToken because it's a public webhook)
router.post('/webhooks/zernio', async (req, res) => {
  try {
    const payload = req.body;
    console.log('[ZERNIO WEBHOOK RECEIVED]', JSON.stringify(payload).substring(0, 500));

    // 1. Ignore irrelevant events immediately
    const eventType = payload.event;
    if (eventType && eventType !== 'message.received' && eventType !== 'message_created') {
      console.log('[WEBHOOK IGNORED EVENT]', eventType);
      return res.status(200).json({ ok: true, ignored_event: eventType });
    }

    // Try to extract text based on common webhook formats
    let text = '';
    if (typeof payload.text === 'string') text = payload.text;
    else if (payload.message && typeof payload.message.text === 'string') text = payload.message.text;
    else if (payload.message && typeof payload.message.content === 'string') text = payload.message.content;
    else if (payload.message && typeof payload.message.body === 'string') text = payload.message.body;
    else if (payload.entry?.[0]?.messaging?.[0]?.message?.text) {
      text = payload.entry[0].messaging[0].message.text;
    }

    // Handle attachments (images)
    let imageUrl = null;
    
    const attachments = payload.message?.attachments || payload.entry?.[0]?.messaging?.[0]?.message?.attachments;
    if (attachments && attachments.length > 0) {
      const type = attachments[0].type || 'attachment';
      if (!text) {
        text = `[Received ${type}]`;
      }
      
      // Zernio often puts the URL in payload.message.attachments[0].data_url or .payload.url
      const att = attachments[0];
      imageUrl = att.data_url || att.url || att.payload?.url || null;
    }


    if (!text) {
      console.log('[WEBHOOK NO TEXT OR ATTACHMENT]', JSON.stringify(payload).substring(0, 100));
      return res.status(200).json({ ok: true, ignored_empty: true });
    }

    // Extract prospect name or ID (Prioritize Zernio's 'contact' object to avoid grabbing the Page's name)
    let prospectName = payload.contact?.name || payload.message?.contact?.name || payload.sender?.name || payload.message?.sender?.name || payload.sender_name || payload.contact_name || payload.name || 'Zernio Contact';
    
    // If the name is somehow the Facebook Page name ("DDB" or "Busy Boss Diet"), we should try to rely on the conversation ID matching
    if (payload.entry?.[0]?.messaging?.[0]?.sender?.id) {
      prospectName = 'FB User ' + payload.entry[0].messaging[0].sender.id;
    }

    const conversationId = 
      payload.message?.conversationId || 
      payload.conversationId || 
      payload.conversation_id || 
      payload.data?.conversationId || 
      payload.data?.conversation_id || 
      null;
    let inquiryId = null;

    // 1. Try to find existing inquiry by conversationId (most accurate for active chats)
    if (conversationId) {
      // Query Supabase for any message that has this exact conversationId in metadata
      // Supabase supports JSONB querying with ->> or @>
      const { data: existingMsgs, error: msgErr } = await supabaseAdmin.schema('crm')
        .from('inquiries_messages')
        .select('inquiry_id')
        .contains('metadata', { conversationId: conversationId })
        .limit(1)
        .maybeSingle();

      if (existingMsgs) {
        inquiryId = existingMsgs.inquiry_id;
      } else {
        // Try fallback JSON structure if message.conversationId was used
        const { data: fallbackMsgs } = await supabaseAdmin.schema('crm')
          .from('inquiries_messages')
          .select('inquiry_id')
          .contains('metadata', { message: { conversationId: conversationId } })
          .limit(1)
          .maybeSingle();
          
        if (fallbackMsgs) {
          inquiryId = fallbackMsgs.inquiry_id;
        }
      }
    }

    // 2. Fallback to finding by prospect_name
    if (!inquiryId) {
      const { data: existing } = await supabaseAdmin.schema('crm').from('inquiries')
        .select('id').eq('prospect_name', prospectName).order('created_at', { ascending: false }).limit(1).maybeSingle();
      inquiryId = existing?.id;
    }

    let createdInquiry = null;
    
    if (!inquiryId) {
      const { data: newInq } = await supabaseAdmin.schema('crm').from('inquiries')
        .insert({ prospect_name: prospectName, source: 'messenger', service_interest: 'Messenger' })
        .select()
        .single();
      inquiryId = newInq.id;
      createdInquiry = newInq;
      emitInquiryCreated(newInq);
    }

    const cleanMetadata = {
      conversationId: conversationId,
      sender: {
        id: payload.sender?.id || payload.message?.sender?.id || payload.entry?.[0]?.messaging?.[0]?.sender?.id
      },
      imageUrl: imageUrl,
      // Note: raw payload is intentionally NOT stored to prevent PII data accumulation in DB
    };

    // Ignore webhooks for outgoing messages (e.g. admin replying from Facebook Pages)
    // or Zernio's echo of our own API sends.
    const direction = payload.message?.direction || payload.direction;
    if (direction === 'outgoing') {
      console.log('[WEBHOOK OUTGOING IGNORED]', text.substring(0, 50));
      return res.status(200).json({ ok: true, ignored_outgoing: true });
    }

    // Deduplication & Echo Prevention
    // Zernio sends webhooks for outgoing messages too. Since we already save 'ai_bot' and 'admin' 
    // messages to the DB when we send them via API, we MUST ignore the webhook echo to prevent infinite loops.
    const { data: recentMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
      .select('id, created_at, message_text, sender_type')
      .eq('inquiry_id', inquiryId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentMsgs && recentMsgs.length > 0) {
      // Only deduplicate prospect messages (same sender within 10 seconds).
      // NEVER skip an incoming prospect message just because an admin sent the same text.
      const match = recentMsgs.find(m => m.message_text?.trim() === text.trim() && m.sender_type === 'prospect');
      if (match) {
        const timeDiff = Math.abs(new Date() - new Date(match.created_at));
        const isEcho = timeDiff < 10000; // only 10s dedup for prospect echoes
                       
        if (isEcho) {
          console.log('[WEBHOOK ECHO IGNORED]', text.substring(0, 50));
          return res.status(200).json({ ok: true, ignored_echo: true });
        }
      }
    }

    const { data: newMsg } = await supabaseAdmin.schema('crm').from('inquiries_messages')
      .insert({ inquiry_id: inquiryId, message_text: text, sender_type: 'prospect', metadata: cleanMetadata })
      .select()
      .single();

    if (newMsg) emitInquiryMessage(inquiryId, newMsg);

    // Auto-Reply with Feedback Form Link if customer tapped "Feedback ပေးရန်" or typed Feedback / Complain / တိုင်ကြား / အကြံပြု
    const lowerText = (text || '').toLowerCase();
    const rawPayloadStr = JSON.stringify(payload || {}).toLowerCase();
    const isFeedbackTrigger = 
      lowerText.includes('feedback') || 
      lowerText.includes('တိုင်ကြား') || 
      lowerText.includes('complain') || 
      lowerText.includes('အကြံပြု') ||
      rawPayloadStr.includes('complaint_feedback') ||
      rawPayloadStr.includes('feedback') ||
      payload.message?.quick_reply?.payload === 'COMPLAINT_FEEDBACK' ||
      payload.postback?.payload === 'COMPLAINT_FEEDBACK';

    if (isFeedbackTrigger) {
      try {
        const { data: currentInq } = await supabaseAdmin.schema('crm').from('inquiries').select('customer_id').eq('id', inquiryId).single();
        const targetCustId = currentInq?.customer_id || inquiryId;
        const frontendUrl = process.env.FRONTEND_ONBOARDING_URL || process.env.FRONTEND_URL || 'https://hrm.duolinkmm.com';
        const feedbackUrl = `${frontendUrl}/feedback/${targetCustId}`;

        const autoFeedbackText = `အရသာနဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ Delivery နဲ့ ပတ်သက်ပြီးဖြစ်စေ အထွေထွေ ကိစ္စတွေအတွက်ဖြစ်စေ အကြံပြုလိုပါက (သို့မဟုတ်) တိုင်ကြားလိုပါက အောက်ပါ Link လေးမှတစ်ဆင့် ဝင်ရောက်ရေးသားနိုင်ပါတယ်ရှင့် 👇\n\n${feedbackUrl}`;

        // Resolve conversationId if missing from current webhook payload
        let activeConvId = conversationId;
        if (!activeConvId && inquiryId) {
          const { data: prevMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
            .select('metadata')
            .eq('inquiry_id', inquiryId)
            .not('metadata', 'is', null)
            .order('created_at', { ascending: false })
            .limit(100);

          if (prevMsgs && prevMsgs.length > 0) {
            for (const pm of prevMsgs) {
              const cid = pm.metadata?.message?.conversationId || pm.metadata?.conversationId;
              if (cid) { activeConvId = cid; break; }
            }
          }
        }

        if (activeConvId && process.env.ZERNIO_API_KEY) {
          const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${activeConvId}/messages`;
          // 1. Try standard message send first (valid inside 24h window)
          let autoRes = await fetch(zernioUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}` },
            body: JSON.stringify({
              accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
              message: autoFeedbackText
            })
          });
          let autoResult = await autoRes.json();

          // 2. Fallback to tagged message send if standard send failed
          if (!autoRes.ok || autoResult.error) {
            await fetch(zernioUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}` },
              body: JSON.stringify({
                accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
                messagingType: 'MESSAGE_TAG',
                messageTag: 'POST_PURCHASE_UPDATE',
                message: autoFeedbackText
              })
            });
          }
        }

        const { data: botMsg } = await supabaseAdmin.schema('crm').from('inquiries_messages')
          .insert({
            inquiry_id: inquiryId,
            message_text: autoFeedbackText,
            sender_type: 'ai_bot',
            metadata: { auto_reply: true, conversationId }
          })
          .select().single();

        if (botMsg) emitInquiryMessage(inquiryId, botMsg);
      } catch (fbAutoErr) {
        console.error('[ZERNIO AUTO FEEDBACK LINK ERROR]', fbAutoErr);
      }
    }

    setTimeout(() => triggerAIAnalysis(inquiryId, conversationId).catch(err => console.error('[CRM AI BACKGROUND ERROR]', err)), 100);

    return res.status(200).json({ ok: true, inquiry_id: inquiryId, message_id: newMsg?.id, created: !!createdInquiry });
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

    emitInquiryMessage(id, newMsg);
    
    // 2. Run AI Analysis in the background
    setTimeout(() => triggerAIAnalysis(id).catch(err => console.error('[CRM AI BACKGROUND ERROR]', err)), 100);

    // 3. Send message to Facebook via Zernio (or direct FB fallback) if it's an admin reply
    if ((!sender_type || sender_type === 'admin') && (process.env.ZERNIO_API_KEY || process.env.FACEBOOK_PAGE_ACCESS_TOKEN)) {
      try {
        const { data: prospectMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
          .select('metadata')
          .eq('inquiry_id', id)
          .eq('sender_type', 'prospect')
          .not('metadata', 'is', null)
          .order('created_at', { ascending: false })
          .limit(100);

        let conversationId = null;
        let prospectMeta = null;
        if (prospectMsgs && prospectMsgs.length > 0) {
          for (const pm of prospectMsgs) {
            const cid = pm.metadata?.message?.conversationId || pm.metadata?.conversationId;
            if (cid) {
              conversationId = cid;
              prospectMeta = pm.metadata;
              break;
            }
          }
        }

        if (conversationId && process.env.ZERNIO_API_KEY) {
          const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`;
          const quickReplies = [
            { content_type: 'text', title: '🍱 Meal ရရှိပါပြီ', payload: 'DELIVERY_RECEIVED' },
            { content_type: 'text', title: '📝 Feedback ပေးရန်', payload: 'COMPLAINT_FEEDBACK' }
          ];

          // 1. Try standard message send first (valid when recipient in 24h window)
          let zernioResponse = await fetch(zernioUrl, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
              message: message_text,
              quickReplies,
              quick_replies: quickReplies
            })
          });
          let zernioResult = await zernioResponse.json();

          // 2. Fallback to tagged message if standard send failed (outside 24h window)
          if (!zernioResponse.ok || zernioResult.error) {
            console.warn('[ZERNIO] Standard send failed, retrying with Message Tag...', zernioResult.error || zernioResult.message);
            zernioResponse = await fetch(zernioUrl, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`,
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify({
                accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
                messagingType: 'MESSAGE_TAG',
                messageTag: 'POST_PURCHASE_UPDATE',
                message: message_text
              })
            });
            zernioResult = await zernioResponse.json();
          }

          if (!zernioResponse.ok || zernioResult.error) {
            const errorDetail = typeof zernioResult.error === 'string'
              ? zernioResult.error 
              : (zernioResult.error?.message || zernioResult.message || zernioResult.detail || JSON.stringify(zernioResult));
            console.error('[ZERNIO SEND ERROR]', errorDetail);
            throw new Error(errorDetail);
          }
        } else {
          // Fallback to direct FB if Zernio API key is missing or not a Zernio webhook
          let psid = null;
          if (prospectMsgs && prospectMsgs.length > 0) {
            for (const pm of prospectMsgs) {
              const p = pm.metadata?.sender?.id || pm.metadata?.message?.sender?.id || pm.metadata?.entry?.[0]?.messaging?.[0]?.sender?.id;
              if (p) { psid = p; break; }
            }
          }
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
              throw new Error(fbResult.error.message || JSON.stringify(fbResult.error));
            }
          }
        }
      } catch (fbErr) {
        console.error('[REPLY SEND ERROR]', fbErr.message);
        
        // BEST PRACTICE: If third-party delivery fails, mark it in the local DB instead of returning 500
        const updatedMeta = { 
          ...(newMsg.metadata || {}), 
          delivery_status: 'failed', 
          delivery_error: fbErr.message,
          zernio_failed: true 
        };
        
        await supabaseAdmin.schema('crm').from('inquiries_messages')
          .update({ metadata: updatedMeta })
          .eq('id', newMsg.id);
          
        newMsg.metadata = updatedMeta;
        emitInquiryMessage(id, newMsg);
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
    emitInquiryCreated(data);
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
    const { status, notes, ai_analysis_result, service_interest_confidence, is_ai_enabled } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (ai_analysis_result) updateData.ai_analysis_result = ai_analysis_result;
    if (service_interest_confidence !== undefined) updateData.service_interest_confidence = service_interest_confidence;
    if (is_ai_enabled !== undefined) updateData.is_ai_enabled = is_ai_enabled;

    const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) emitInquiryUpdated(data);
    return res.json({ success: true, inquiry: data });
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
router.get('/packages', verifyToken, crmController.getPackages);

// POST /api/crm/packages
router.post('/packages', verifyToken, crmController.createPackage);

// PUT /api/crm/packages/:id
router.put('/packages/:id', verifyToken, crmController.updatePackage);

// DELETE /api/crm/packages/:id
router.delete('/packages/:id', verifyToken, crmController.deletePackage);

// ──────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────────────────────────

// GET /api/crm/dashboard
router.get('/dashboard', verifyToken, crmController.getDashboard);

// GET /api/crm/segments/:segment
router.get('/segments/:segment', verifyToken, crmController.getSegment);

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

// POST /api/crm/inquiries/:id/generate-link
router.post('/inquiries/:id/generate-link', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const onboarding_token = crypto.randomUUID();
    
    const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update({ onboarding_token })
      .eq('id', id)
      .select('onboarding_token')
      .single();
      
    if (error) throw error;
    
    const baseUrl = req.headers.origin || process.env.DIET_BUDDY_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${baseUrl}/enroll?token=${data.onboarding_token}`;
    
    return res.json({ link });
  } catch (e) {
    console.error('[CRM GENERATE LINK]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/crm/onboarding/verify
router.get('/onboarding/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const { data: inquiry, error: inquiryErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('id, status, prospect_name')
      .eq('onboarding_token', token)
      .single();

    if (inquiryErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (inquiry.status === 'converted') {
      return res.status(400).json({ error: 'Profile already submitted for this link' });
    }

    return res.status(200).json({
      prospect_name: inquiry.prospect_name
    });
  } catch (e) {
    console.error('[ONBOARDING VERIFY]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/onboarding/submit (Public route)
router.post('/onboarding/submit', async (req, res) => {
  try {
    const { token, ...customerData } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    // 1. Find inquiry by token
    const { data: inquiry, error: inquiryErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('id, status, prospect_name')
      .eq('onboarding_token', token)
      .single();

    if (inquiryErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }
    
    if (inquiry.status === 'converted') {
      return res.status(400).json({ error: 'This inquiry is already converted' });
    }

    // 2. Extract customer data (handles both old and ProfileCard payloads)
    const {
      full_name, facebook_name, age, gender, email, phone, address,
      current_weight, goal_weight, height, medical_condition, allergies, medicine_taking,
      food_restriction, activity_level, fasting_willingness
    } = customerData;

    const safeArrayJoin = (val) => Array.isArray(val) ? val.join(', ') : val;

    // Generate customer code
    const { count } = await supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true });
    const num = String((count || 0) + 1).padStart(3, '0');
    const customer_code = `BBD-${num}`;

    // Insert customer
    const { data: customer, error: custErr } = await supabaseAdmin.schema('crm').from('customers')
      .insert({ 
        full_name: full_name || inquiry.prospect_name, 
        facebook_name, age: age || null, gender, email, phone, address, 
        customer_code 
      })
      .select()
      .single();

    if (custErr) throw custErr;

    // Insert health record
    await supabaseAdmin.schema('crm').from('customer_health').insert({
      customer_id: customer.id,
      current_weight: current_weight || null,
      goal_weight: goal_weight || null,
      height: height || null,
      medical_condition: safeArrayJoin(medical_condition) || 'None',
      allergies: allergies || 'None'
    });

    // Insert lifestyle record
    const mapActivityLevelToString = (levelNum) => {
      if (typeof levelNum === 'string') return levelNum;
      const labels = ["Sedentary", "Light", "Moderate", "Highly Active"];
      return labels[levelNum] || "Light";
    };

    await supabaseAdmin.schema('crm').from('customer_lifestyle').insert({
      customer_id: customer.id,
      food_restriction: safeArrayJoin(food_restriction) || 'None',
      activity_level: mapActivityLevelToString(activity_level),
      fasting_willingness: fasting_willingness || 'No'
    });

    // Update inquiry to link customer, set converted, and clear token
    await supabaseAdmin.schema('crm').from('inquiries')
      .update({ 
        customer_id: customer.id, 
        status: 'converted', 
        onboarding_token: null,
        updated_at: new Date()
      })
      .eq('id', inquiry.id);

    return res.status(200).json({ success: true, customer_id: customer.id });
  } catch (e) {
    console.error('[ONBOARDING SUBMIT]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// GET All Feedbacks (For Customer Voices)
router.get('/feedbacks', verifyToken, crmController.getAllFeedbacks);

// DELETE Feedback (Boss only)
router.delete('/feedbacks/:id', verifyToken, requireBoss, crmController.deleteFeedback);

// -----------------------------------------
// CUSTOMER ONBOARDING (DYNAMIC FORMS & MARK PAID)
// -----------------------------------------

// GET /api/crm/settings/form
router.get('/settings/form', verifyToken, crmController.getFormSettings);

// PUT /api/crm/settings/form
router.put('/settings/form', verifyToken, crmController.upsertFormSettings);

// POST /api/crm/inquiries/:id/mark-paid
router.post('/inquiries/:id/mark-paid', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { package: selectedPackage } = req.body;

    const newToken = crypto.randomUUID();

    // 1. Generate token and update inquiry status
    const { data: inquiry, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update({ 
        onboarding_status: 'form_sent',
        selected_package: selectedPackage,
        onboarding_token: newToken
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 2. Auto-send the form link via AI Bot (or admin)
    const token = inquiry.onboarding_token;
    const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || 'https://hrm.duolinkmm.com';
    const link = `${frontendUrl}/enroll?token=${token}`;
    const text = `ငွေလွှဲပြေစာ လက်ခံရရှိပါပြီရှင်။ 🎉\n\nအစ်ကို/အစ်မအတွက် Diet Plan ဆွဲပေးနိုင်ဖို့ အောက်က လင့်ခ်လေးကိုနှိပ်ပြီး ကျန်းမာရေးနဲ့ အချက်အလက်လေးတွေ ဖြည့်ပေးပါဦးနော်။\n\n${link}`;

    // Insert message into history so it sends to Facebook
    const { data: newMsg } = await supabaseAdmin.schema('crm').from('inquiries_messages')
      .insert({ 
        inquiry_id: id, 
        message_text: text, 
        sender_type: 'ai_bot', 
        metadata: { is_auto_onboarding: true } 
      })
      .select()
      .single();

    if (newMsg) {
      // Assuming emitInquiryMessage is defined in the file
      emitInquiryMessage(id, newMsg);
      // Wait, we need to send to Facebook via Zernio! 
      // I will implement the send logic inline just like the normal message API does.
      
      const { data: prospectMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
        .select('metadata')
        .eq('inquiry_id', id)
        .eq('sender_type', 'prospect')
        .not('metadata', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (prospectMsgs && prospectMsgs.length > 0 && process.env.ZERNIO_API_KEY) {
        const meta = prospectMsgs[0].metadata;
        const conversationId = meta?.message?.conversationId || meta?.conversationId;
        
        if (conversationId) {
          fetch(`https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
              message: text
            })
          }).catch(e => console.error('[ZERNIO SEND ERROR]', e));
        }
      }
    }

    res.json({ success: true, inquiry });
  } catch (err) {
    console.error('[MARK PAID ERROR]', err);
    res.status(500).send('Internal Error');
  }
});
// GET /api/crm/weekly-feedbacks (Daily & Weekly Menu Feedbacks)
router.get('/weekly-feedbacks', verifyToken, crmController.getWeeklyFeedbacks);

// POST /api/crm/feedback/:id/resolve
router.post('/feedback/:id/resolve', verifyToken, crmController.resolveFeedback);

// POST /api/crm/ai-assistant - Universal Agentic Admin CRM AI Copilot
router.post('/ai-assistant', async (req, res) => {
  try {
    const { processAiAssistantQuery } = await import('../modules/ai/service/copilotAiService.js');
    const result = await processAiAssistantQuery(req.body.query, req.user);
    return res.json(result);
  } catch (err) {
    console.error('[CRM AI ASSISTANT ERROR]', err);
    return res.status(500).json({ error: err.message || 'Failed to process request' });
  }
});

export default router;
