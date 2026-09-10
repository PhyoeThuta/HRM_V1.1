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

    // 1. Query OpsHub Auto Generated Orders (operations_orders) for this customer and date
    const { data: customerOrders } = await supabase
      .from('operations_orders')
      .select('id, daily_menu_id, date, delivery_status')
      .eq('customer_id', customer_id)
      .eq('date', date);

    let enrichedMenus = [];
    let hasOrder = customerOrders && customerOrders.length > 0;

    // 2. Fetch menus linked to generated orders
    if (hasOrder) {
      const dailyMenuIds = customerOrders.map(o => o.daily_menu_id).filter(Boolean);
      if (dailyMenuIds.length > 0) {
        const { data: dailyMenus } = await supabase
          .from('operations_daily_menus')
          .select('*')
          .in('id', dailyMenuIds);

        const { data: menuTypes } = await supabase.from('operations_menu_types').select('*');
        const { data: menus } = await supabase.from('operations_menus').select('*');

        enrichedMenus = (dailyMenus || []).map(dm => {
          const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
          const enrichedTypes = types.map(mt => ({
            ...mt,
            menus: menus?.find(m => m.id === mt.menu_id) || null
          }));
          return { ...dm, menu_types: enrichedTypes };
        });
      }
    }

    // 3. Fallback: If no order generated for this customer yet, check operations_daily_menus for date directly
    if (enrichedMenus.length === 0) {
      const { data: dailyMenus } = await supabase
        .from('operations_daily_menus')
        .select('*')
        .eq('date', date);

      if (dailyMenus && dailyMenus.length > 0) {
        const { data: menuTypes } = await supabase.from('operations_menu_types').select('*');
        const { data: menus } = await supabase.from('operations_menus').select('*');

        enrichedMenus = dailyMenus.map(dm => {
          const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
          const enrichedTypes = types.map(mt => ({
            ...mt,
            menus: menus?.find(m => m.id === mt.menu_id) || null
          }));
          return { ...dm, menu_types: enrichedTypes };
        });
      }
    }

    // 4. Fallback for testing catalog menus if date has no scheduled menu in OpsHub
    if (enrichedMenus.length === 0) {
      const { data: catalogMenus } = await supabase
        .from('operations_menus')
        .select('id, name_en, name_mm, code')
        .limit(4);

      if (catalogMenus && catalogMenus.length > 0) {
        enrichedMenus = [
          {
            id: 'catalog_lunch',
            meal_type: 'LUNCH',
            menu_types: catalogMenus.slice(0, 2).map(m => ({ menus: m }))
          },
          ...(catalogMenus.length > 2 ? [{
            id: 'catalog_dinner',
            meal_type: 'DINNER',
            menu_types: catalogMenus.slice(2, 4).map(m => ({ menus: m }))
          }] : [])
        ];
      }
    }

    // 5. Check if customer already submitted feedback today
    const { data: existingFeedback } = await supabaseAdmin
      .schema('crm')
      .from('daily_feedbacks')
      .select('id')
      .eq('customer_id', customer_id)
      .eq('date', date)
      .limit(1);

    return res.json({
      hasOrder,
      customerOrders: customerOrders || [],
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
