import express from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyToken, requireOperations } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);
router.use(requireOperations);

// DB helpers for 'inventory' schema
async function invFetch(table, columns = '*', filters = {}, options = {}) {
  try {
    let q = supabase.schema('inventory').from(table).select(columns);
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
    console.error(`[INV FETCH] ${table}:`, e.message);
    return [];
  }
}

async function invFetchOne(table, columns = '*', filters = {}) {
  const rows = await invFetch(table, columns, filters, { limit: 1 });
  return rows[0] || null;
}

async function invInsert(table, data) {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );
    const { data: result, error } = await supabase.schema('inventory').from(table).insert(clean).select();
    if (error) throw error;
    return result?.[0] || null;
  } catch (e) {
    console.error(`[INV INSERT] ${table}:`, e.message);
    return null;
  }
}

async function invUpdate(table, id, data, idCol = 'id') {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    const { data: result, error } = await supabase.schema('inventory').from(table).update(clean).eq(idCol, id).select();
    if (error) throw error;
    return result?.[0] || null;
  } catch (e) {
    console.error(`[INV UPDATE] ${table}:`, e.message);
    return null;
  }
}

async function invDelete(table, id, idCol = 'id') {
  try {
    const { error } = await supabase.schema('inventory').from(table).delete().eq(idCol, id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`[INV DELETE] ${table}:`, e.message);
    return false;
  }
}

// ==========================================
// INVENTORY ITEMS
// ==========================================

router.get('/items', async (req, res) => {
  try {
    const items = await invFetch('items', '*', {}, { order: 'name_eng', ascending: true });
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/items', async (req, res) => {
  try {
    const data = req.body;
    data.created_by = req.user.id;
    const result = await invInsert('items', data);
    
    if (result) {
      await invInsert('balances', {
        item_id: result.id,
        current_quantity: 0,
        min_quantity: data.min_quantity || 0,
        one_unit_cost: data.one_unit_cost || 0,
        created_by: req.user.id
      });
    }
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.updated_by = req.user.id;
    data.updated_at = new Date().toISOString();
    
    const result = await invUpdate('items', id, data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await invDelete('items', id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// INVENTORY BALANCES
// ==========================================

router.get('/balances', async (req, res) => {
  try {
    const { data: balances, error } = await supabase.schema('inventory')
      .from('balances')
      .select('*');
    if (error) throw error;
    
    const { data: items } = await supabase.schema('inventory').from('items').select('*');
    
    const enriched = balances.map(b => ({
      ...b,
      inventory_items: items?.find(i => i.id === b.item_id) || null
    }));

    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.put('/balances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.updated_by = req.user.id;
    data.updated_at = new Date().toISOString();
    
    const result = await invUpdate('balances', id, data);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// INVENTORY TRANSACTIONS
// ==========================================

router.get('/transactions', async (req, res) => {
  try {
    const { data: transactions, error } = await supabase.schema('inventory')
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;

    const { data: items } = await supabase.schema('inventory').from('items').select('id, name_eng, item_code, unit_of_measure');
    
    const enriched = transactions.map(t => ({
      ...t,
      inventory_items: items?.find(i => i.id === t.item_id) || null
    }));

    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { item_id, transaction_type, quantity_change, unit_price_at_transaction, reference_type, reference_id } = req.body;
    
    const balance = await invFetchOne('balances', '*', { item_id });
    if (!balance) return res.status(404).json({ error: 'Balance record not found for this item' });
    
    const changeAmount = parseFloat(quantity_change);
    let newQty = parseFloat(balance.current_quantity);
    
    if (transaction_type === 'PURCHASE_IN') {
      newQty += changeAmount;
    } else if (transaction_type === 'USAGE_OUT' || transaction_type === 'SPOILAGE') {
      newQty -= changeAmount;
    } else if (transaction_type === 'ADJUSTMENT') {
      newQty = changeAmount;
    }

    const tx = await invInsert('transactions', {
      item_id,
      transaction_type,
      quantity_change: changeAmount,
      unit_price_at_transaction,
      reference_type,
      reference_id,
      created_by: req.user.id
    });
    
    await invUpdate('balances', balance.id, {
      current_quantity: newQty,
      last_restocked_at: transaction_type === 'PURCHASE_IN' ? new Date().toISOString() : balance.last_restocked_at,
      updated_by: req.user.id,
      updated_at: new Date().toISOString()
    });

    return res.json({ success: true, transaction: tx, new_quantity: newQty });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
