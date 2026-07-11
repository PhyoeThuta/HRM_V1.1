import express from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyToken, requireOperations } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);
router.use(requireOperations);

// DB helpers for 'operations' schema
async function opsFetch(table, columns = '*', filters = {}, options = {}) {
  try {
    let q = supabase.from('operations_' + table).select(columns);
    for (const [col, val] of Object.entries(filters)) {
      q = q.eq(col, val);
    }
    if (options.order) q = q.order(options.order, { ascending: options.ascending ?? false });
    if (options.limit) q = q.limit(options.limit);
    else q = q.limit(500);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error(`[OPS FETCH] ${table}:`, e.message);
    return [];
  }
}

async function opsFetchOne(table, columns = '*', filters = {}) {
  const rows = await opsFetch(table, columns, filters, { limit: 1 });
  return rows[0] || null;
}

async function opsInsert(table, data) {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );
    const { data: result, error } = await supabase.from('operations_' + table).insert(clean).select();
    if (error) throw error;
    return result?.[0] || null;
  } catch (e) {
    console.error(`[OPS INSERT] ${table}:`, e.message);
    return null;
  }
}

async function opsUpdate(table, id, data, idCol = 'id') {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    const { data: result, error } = await supabase.from('operations_' + table).update(clean).eq(idCol, id).select();
    if (error) throw error;
    return result?.[0] || null;
  } catch (e) {
    console.error(`[OPS UPDATE] ${table}:`, e.message);
    return null;
  }
}

async function opsDelete(table, id, idCol = 'id') {
  try {
    const { error } = await supabase.from('operations_' + table).delete().eq(idCol, id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`[OPS DELETE] ${table}:`, e.message);
    return false;
  }
}

// ==========================================
// MENUS
// ==========================================

router.get('/menus', async (req, res) => {
  try {
    const { data: menus, error } = await supabase
      .from('operations_menus')
      .select('*')
      .order('name_en', { ascending: true });
    
    if (error) throw error;

    const { data: recipes } = await supabase.from('operations_recipes').select('*');
    const { data: items } = await supabase.from('inventory_items').select('id, name_eng, unit_of_measure, item_code');

    const enriched = menus.map(m => {
      const menuRecipes = recipes?.filter(r => r.menu_id === m.id) || [];
      const enrichedRecipes = menuRecipes.map(r => ({
        ...r,
        inventory_items: items?.find(i => i.id === r.inventory_item_id) || null
      }));
      return { ...m, recipes: enrichedRecipes };
    });

    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/menus', async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user.id;
    const result = await opsInsert('menus', data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put('/menus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.updated_by = req.user.id;
    data.updated_at = new Date().toISOString();
    
    const result = await opsUpdate('menus', id, data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/menus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await opsDelete('menus', id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// RECIPES
// ==========================================

router.post('/recipes', async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user.id;
    const result = await opsInsert('recipes', data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    await opsDelete('recipes', req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// DAILY MENUS & MENU TYPES
// ==========================================

router.get('/daily-menus', async (req, res) => {
  try {
    const { data: dailyMenus, error } = await supabase
      .from('operations_daily_menus')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);
    
    if (error) throw error;

    const { data: menuTypes } = await supabase.from('operations_menu_types').select('*');
    const { data: menus } = await supabase.from('operations_menus').select('*');

    const enriched = dailyMenus.map(dm => {
      const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
      const enrichedTypes = types.map(mt => ({
        ...mt,
        menus: menus?.find(m => m.id === mt.menu_id) || null
      }));
      return { ...dm, menu_types: enrichedTypes };
    });

    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/daily-menus', async (req, res) => {
  try {
    const { date, meal_type, with_rice, menu_types } = req.body;
    
    const dailyMenu = await opsInsert('daily_menus', {
      date, meal_type, with_rice, created_by: req.user.id
    });
    
    if (menu_types && menu_types.length > 0) {
      const typesToInsert = menu_types.map(mt => ({
        daily_menus_id: dailyMenu.id,
        menu_id: mt.menu_id,
        is_main: mt.is_main || false,
        created_by: req.user.id
      }));
      await supabase.from('operations_menu_types').insert(typesToInsert);
    }
    
    return res.json(dailyMenu);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// ORDERS
// ==========================================

router.get('/orders', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('operations_orders')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    const { data: dailyMenus } = await supabase.from('operations_daily_menus').select('*');
    
    const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];
    let customersMap = {};
    if (customerIds.length > 0) {
      const { data: customers } = await supabase.schema('crm').from('customers').select('id, full_name, phone, delivery_address').in('id', customerIds);
      if (customers) {
        customersMap = Object.fromEntries(customers.map(c => [c.id, c]));
      }
    }
    
    const enrichedOrders = orders.map(o => ({
      ...o,
      daily_menus: dailyMenus?.find(dm => dm.id === o.daily_menus_id) || null,
      customer: customersMap[o.customer_id] || { full_name: 'Unknown' }
    }));
    
    return res.json(enrichedOrders);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user.id;
    const result = await opsInsert('orders', data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { delivery_status } = req.body;
    const now = new Date().toISOString();
    
    const updateData = {
      delivery_status,
      updated_by: req.user.id,
      updated_at: now
    };
    
    if (delivery_status === 'DELIVERED') {
      updateData.delivered_at = now;
    }
    
    const result = await opsUpdate('orders', id, updateData);
    
    if (delivery_status === 'DELIVERED' && result) {
      const { data: orderDetails } = await supabase.schema('operations')
        .from('orders')
        .select(`
          count,
          daily_menus (
            menu_types (
              menus (
                recipes (inventory_item_id, qty)
              )
            )
          )
        `)
        .eq('id', id)
        .single();
        
      if (orderDetails && orderDetails.daily_menus) {
        const orderCount = orderDetails.count || 1;
        const deductions = {}; 
        
        orderDetails.daily_menus.menu_types.forEach(mt => {
          if (mt.menus && mt.menus.recipes) {
            mt.menus.recipes.forEach(r => {
              if (r.inventory_item_id && r.qty) {
                deductions[r.inventory_item_id] = (deductions[r.inventory_item_id] || 0) + (r.qty * orderCount);
              }
            });
          }
        });
        
        for (const [itemId, deductQty] of Object.entries(deductions)) {
          // Fetch balance from inventory schema
          const { data: balData } = await supabase.schema('inventory').from('balances').select('*').eq('item_id', itemId).single();
          if (balData) {
            await supabase.schema('inventory').from('transactions').insert({
              item_id: itemId,
              transaction_type: 'USAGE_OUT',
              quantity_change: deductQty,
              reference_type: 'ORDER',
              reference_id: id,
              created_by: req.user.id
            });
            await supabase.schema('inventory').from('balances').update({
              current_quantity: parseFloat(balData.current_quantity) - parseFloat(deductQty),
              updated_by: req.user.id,
              updated_at: now
            }).eq('id', balData.id);
          }
        }
      }
    }
    
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// SKIP DAYS
// ==========================================

router.get('/skip-days', async (req, res) => {
  try {
    const skips = await opsFetch('skip_days');
    return res.json(skips);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/skip-days', async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user.id;
    const result = await opsInsert('skip_days', data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
