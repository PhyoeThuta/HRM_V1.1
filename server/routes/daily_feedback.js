import express from 'express';
import { supabaseAdmin, supabase } from '../lib/supabase.js';

const router = express.Router();

// GET /api/daily-feedback/:customer_id?date=YYYY-MM-DD
// Fetches the active package and today's menus from OpsHub
router.get('/:customer_id', async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: 'Date is required' });

    // 1. Check if customer has an active package today
    const { data: pkg, error: pkgErr } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('*')
      .eq('customer_id', customer_id)
      .lte('start_date', date)
      .gte('expires_at', date)
      .in('status', ['Active', 'Upcoming'])
      .limit(1);

    if (pkgErr) throw pkgErr;
    if (!pkg || pkg.length === 0) {
      return res.status(404).json({ error: 'No active package found for this date.' });
    }

    // 2. Fetch today's menus from OpsHub
    const { data: dailyMenus, error: dmErr } = await supabase
      .from('operations_daily_menus')
      .select('*')
      .eq('date', date);

    if (dmErr) throw dmErr;
    if (!dailyMenus || dailyMenus.length === 0) {
      return res.status(404).json({ error: 'No menu scheduled for today.' });
    }

    // 3. Fetch menu types and menus to enrich the response
    const { data: menuTypes } = await supabase.from('operations_menu_types').select('*');
    const { data: menus } = await supabase.from('operations_menus').select('*');

    const enrichedMenus = dailyMenus.map(dm => {
      const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
      const enrichedTypes = types.map(mt => ({
        ...mt,
        menus: menus?.find(m => m.id === mt.menu_id) || null
      }));
      return { ...dm, menu_types: enrichedTypes };
    });

    // 4. Check if they already submitted feedback today
    const { data: existingFeedback } = await supabaseAdmin
      .schema('crm')
      .from('daily_feedbacks')
      .select('id')
      .eq('customer_id', customer_id)
      .eq('date', date)
      .limit(1);

    return res.json({
      package: pkg[0],
      menus: enrichedMenus,
      alreadySubmitted: existingFeedback && existingFeedback.length > 0
    });

  } catch (error) {
    console.error('[GET /daily-feedback]', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/daily-feedback
router.post('/', async (req, res) => {
  try {
    const { customer_id, date, feedbacks } = req.body;

    if (!customer_id || !date || !feedbacks || !Array.isArray(feedbacks)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Check for existing feedback to prevent duplicates
    const { data: existingFeedback } = await supabaseAdmin
      .schema('crm')
      .from('daily_feedbacks')
      .select('id')
      .eq('customer_id', customer_id)
      .eq('date', date)
      .limit(1);

    if (existingFeedback && existingFeedback.length > 0) {
      return res.status(400).json({ error: 'Feedback already submitted for today.' });
    }

    // Insert all feedback items
    const records = feedbacks.map(fb => ({
      customer_id,
      date,
      menu_id: fb.menu_id,
      dish_name_en: fb.dish_name_en,
      dish_name_mm: fb.dish_name_mm,
      meal_type: fb.meal_type,
      rating: fb.rating,
      comment: fb.comment
    }));

    const { error } = await supabaseAdmin.schema('crm').from('daily_feedbacks').insert(records);
    
    if (error) throw error;

    return res.json({ success: true });

  } catch (error) {
    console.error('[POST /daily-feedback]', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
