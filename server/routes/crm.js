import express from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

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

    // Flatten package count
    const result = data.map(c => ({
      ...c,
      packages: c.customer_packages?.[0]?.count || 0,
    }));

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
      full_name, facebook_name, age, gender, email, phone, address,
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
      .insert({ full_name, facebook_name, age: age || null, gender, email, phone, address, customer_code })
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

    return res.json({
      ...customer,
      health: healthRes.data || {},
      lifestyle: lifestyleRes.data || {},
      packages_list: packagesRes.data || [],
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
    const { name, duration, meal_type, meal_count, start_date, expires_at } = req.body;

    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .insert({ customer_id: id, name, duration, meal_type, meal_count, start_date, expires_at })
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
    const { name, duration, meal_type, meal_count, start_date, expires_at } = req.body;
    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ name, duration, meal_type, meal_count, start_date, expires_at })
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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET INQUIRIES]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/crm/inquiries
router.post('/inquiries', verifyToken, async (req, res) => {
  try {
    const { prospect_name, source, service } = req.body;
    if (!prospect_name) return res.status(400).json({ error: 'prospect_name is required' });

    const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
      .insert({ prospect_name, source, service, status: 'New' })
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
    const { status, notes } = req.body;

    const { error } = await supabaseAdmin.schema('crm').from('inquiries')
      .update({ status, notes, updated_at: new Date() })
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

    const [
      { count: totalCustomers },
      { count: totalLeads },
      { data: convertedLeads },
      { data: activePackages },
      { data: upcomingRenewals },
      { data: recentLeads },
    ] = await Promise.all([
      supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact', head: true }).neq('status', 'Converted'),
      supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact' }).eq('status', 'Converted').gte('created_at', thisMonthStart),
      supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact' }).gte('expires_at', today),
      supabaseAdmin.schema('crm').from('customer_packages').select('*, customers!inner(full_name, facebook_name)').gte('expires_at', today).lte('expires_at', thirtyDaysLater).order('expires_at', { ascending: true }).limit(5),
      supabaseAdmin.schema('crm').from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    return res.json({
      totalCustomers: totalCustomers || 0,
      activeLeads: totalLeads || 0,
      convertedThisMonth: convertedLeads?.length || 0,
      activePackages: activePackages?.length || 0,
      upcomingRenewals: upcomingRenewals || [],
      recentLeads: recentLeads || [],
    });
  } catch (e) {
    console.error('[CRM DASHBOARD]', e.message);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
