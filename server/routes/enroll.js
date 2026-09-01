import express from 'express';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const router = express.Router();
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket }
});

// GET /api/enroll/:token - Fetch form schema and inquiry details
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // 1. Get Inquiry
    const { data: inquiry, error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('*')
      .eq('onboarding_token', token)
      .single();

    if (inqErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (inquiry.onboarding_status === 'completed') {
      return res.status(400).json({ error: 'Form already submitted', completed: true });
    }

    // 2. Get Form Schema
    const { data: formSettings } = await supabaseAdmin.schema('crm').from('form_settings')
      .select('schema')
      .eq('form_name', 'enrollment')
      .single();

    res.json({
      inquiry: {
        id: inquiry.id,
        prospect_name: inquiry.prospect_name,
        service_interest: inquiry.service_interest,
        package: inquiry.selected_package
      },
      schema: formSettings?.schema || []
    });

  } catch (err) {
    console.error('[ENROLL GET ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/enroll/:token - Submit form data
router.post('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const formData = req.body;

    // 1. Validate Token
    const { data: inquiry, error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('*')
      .eq('onboarding_token', token)
      .single();

    if (inqErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (inquiry.onboarding_status === 'completed') {
      return res.status(400).json({ error: 'Form already submitted' });
    }

    // 2. Create Customer Profile
    const { data: newCustomer, error: custErr } = await supabaseAdmin.schema('crm').from('customers')
      .insert({
        name: formData.name || inquiry.prospect_name,
        email: formData.email || null,
        phone: formData.phone || inquiry.prospect_contact || null,
        level: inquiry.selected_package?.level || 'Starter',
        address: formData.address || null,
        status: 'active',
        metadata: {
          ...formData, // Save all dynamic form answers here
          inquiry_id: inquiry.id,
          enrolled_via: 'auto_onboarding'
        }
      })
      .select()
      .single();

    if (custErr) throw custErr;

    // 3. Update Inquiry Status
    await supabaseAdmin.schema('crm').from('inquiries')
      .update({ 
        onboarding_status: 'completed',
        customer_id: newCustomer.id,
        status: 'won'
      })
      .eq('id', inquiry.id);

    // 4. (Optional) Create initial payment/package record if needed, but for now we just store in customer level/metadata.
    
    // Send success to client, no CRM UI update needed directly because real-time will catch the update
    res.json({ success: true, customer_id: newCustomer.id });

  } catch (err) {
    console.error('[ENROLL POST ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
