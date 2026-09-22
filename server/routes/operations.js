import express from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { inventoryModule } from '../modules/inventory/index.js';

// Simple in-memory Mutex to prevent race conditions during inventory deduction
// REMOVED: Now using central inventoryModule.deductStockForBOM which coordinates concurrency.

import { verifyToken, requireOperations } from '../middleware/auth.js';
import { emitInquiryMessage, emitOrderStatusUpdate } from '../lib/crmRealtime.js';
import multer from 'multer';
import xlsx from 'xlsx';

const upload = multer({ storage: multer.memoryStorage() });

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
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error(`[OPS FETCH] ${table}:`, e.message);
    throw e;
  }
}

async function opsFetchOne(table, columns = '*', filters = {}) {
  const rows = await opsFetch(table, columns, filters, { limit: 1 });
  return rows[0] || null;
}

async function opsInsert(table, data) {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );
  const { data: result, error } = await supabase.from('operations_' + table).insert(clean).select();
  if (error) {
    console.error(`[OPS INSERT] ${table}:`, error.message);
    throw error;
  }
  return result?.[0] || null;
}

async function opsUpdate(table, id, data, idCol = 'id') {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  const { data: result, error } = await supabase.from('operations_' + table).update(clean).eq(idCol, id).select();
  if (error) {
    console.error(`[OPS UPDATE] ${table}:`, error.message);
    throw error;
  }
  return result?.[0] || null;
}

async function opsDelete(table, id, idCol = 'id') {
  const { error } = await supabase.from('operations_' + table).delete().eq(idCol, id);
  if (error) {
    console.error(`[OPS DELETE] ${table}:`, error.message);
    throw error;
  }
  return true;
}

import * as opsController from '../modules/operations/controller/index.js';
import { sendDeliveryZernioMessage } from '../modules/operations/service/index.js';

// ==========================================
// MENUS
// ==========================================

router.get('/menus', opsController.getMenus);

router.post('/menus', opsController.createMenu);
router.put('/menus/:id', opsController.updateMenu);
router.delete('/menus/:id', opsController.deleteMenu);

// ==========================================
// DYNAMIC COSTING & IMPORT
// ==========================================

router.post('/import-costing', upload.single('file'), opsController.importCostingExcel);
router.get('/menu-plans', opsController.getMenuPlans);
router.post('/import-menu-plan', upload.single('file'), opsController.importMenuPlan);

router.post('/recalculate-bom', async (req, res) => {
  try {
    // Fetch all recipes with their current inventory cost
    const { data: recipes, error: rErr } = await supabase.from('operations_recipes').select('*');
    if (rErr) throw rErr;
    
    const balances = await inventoryModule.getBalancesCosts();
    
    // Create lookup map for costs
    const costMap = new Map();
    for (const b of balances) {
      costMap.set(b.item_id, b.one_unit_cost || 0);
    }
    
    // Group by menu_id and sum up
    const menuBom = new Map();
    for (const r of recipes) {
      const cost = costMap.get(r.inventory_item_id) || 0;
      const total = cost * (r.qty || 0);
      
      if (!menuBom.has(r.menu_id)) menuBom.set(r.menu_id, 0);
      menuBom.set(r.menu_id, menuBom.get(r.menu_id) + total);
    }
    
    // Group by totalBom to minimize DB calls
    const groups = {};
    for (const [menuId, totalBom] of menuBom.entries()) {
      const roundedBom = totalBom.toFixed(2); // Group by 2 decimal places
      if (!groups[roundedBom]) groups[roundedBom] = [];
      groups[roundedBom].push(menuId);
    }
    
    // Update menus in bulk per unique BOM value
    for (const [bom, ids] of Object.entries(groups)) {
      await supabase.from('operations_menus')
        .update({ total_bill_of_materials: parseFloat(bom) })
        .in('id', ids);
    }
    
    return res.json({ success: true, updated: menuBom.size });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// RECIPES
// ==========================================

router.post('/recipes', opsController.createRecipe);
router.delete('/recipes/:id', opsController.deleteRecipe);

// ==========================================
// DAILY MENUS & MENU TYPES
// ==========================================

router.get('/daily-menus', opsController.getDailyMenus);
router.post('/daily-menus', opsController.createDailyMenu);
router.put('/daily-menus/:id', opsController.updateDailyMenu);
router.delete('/daily-menus/:id', opsController.deleteDailyMenu);

// ==========================================
// ORDERS
// ==========================================

router.get('/orders', opsController.getOrders);


router.post('/orders', opsController.createOrder);

router.post('/orders/auto-generate', opsController.autoGenerateOrders);

// POST /api/operations/upload-pod-photo - Realtime proof of delivery photo upload
router.post('/upload-pod-photo', opsController.uploadPodPhoto);



router.put('/orders/:id', opsController.updateOrder);

router.put('/orders/batch-status', async (req, res) => {
  try {
    const { order_ids, delivery_status, proof_of_delivery_url } = req.body;
    if (!Array.isArray(order_ids) || order_ids.length === 0) {
      return res.status(400).json({ error: 'order_ids array is required' });
    }
    
    const now = new Date().toISOString();
    const updateData = {
      delivery_status,
      updated_by: req.user.id,
      updated_at: now
    };
    if (delivery_status === 'DELIVERED') {
      updateData.delivered_at = now;
      if (proof_of_delivery_url) {
        updateData.proof_of_delivery_url = proof_of_delivery_url;
      }
    }
    
    // Update all orders (with fallback if proof_of_delivery_url column is not present)
    let updatedOrders = null;
    try {
      const resUpdate = await supabase
        .from('operations_orders')
        .update(updateData)
        .in('id', order_ids)
        .select();
      if (resUpdate.error) throw resUpdate.error;
      updatedOrders = resUpdate.data;
    } catch (e) {
      delete updateData.proof_of_delivery_url;
      const resUpdate = await supabase
        .from('operations_orders')
        .update(updateData)
        .in('id', order_ids)
        .select();
      if (resUpdate.error) throw resUpdate.error;
      updatedOrders = resUpdate.data;
    }

    // Process inventory deduction if DELIVERED
    if (delivery_status === 'DELIVERED' && updatedOrders && updatedOrders.length > 0) {
      for (const order of updatedOrders) {
        const { data: orderDetails, error: orderErr } = await supabase
          .from('operations_orders')
          .select(`
            count,
            operations_daily_menus (
              operations_menu_types (
                operations_menus (
                  operations_recipes (inventory_item_id, quantity)
                )
              )
            )
          `)
          .eq('id', order.id)
          .single();
          
        if (orderErr) {
          console.error('[BOM DEDUCTION ERROR] Could not fetch order details:', orderErr);
          throw new Error('Failed to fetch order details for BOM deduction');
        }
          
        if (orderDetails && orderDetails.operations_daily_menus) {
          const orderCount = orderDetails.count || 1;
          const deductions = {}; 
          
          orderDetails.operations_daily_menus.operations_menu_types.forEach(mt => {
            if (mt.operations_menus && mt.operations_menus.operations_recipes) {
              mt.operations_menus.operations_recipes.forEach(r => {
                if (r.inventory_item_id && r.quantity) {
                  deductions[r.inventory_item_id] = (deductions[r.inventory_item_id] || 0) + (r.quantity * orderCount);
                }
              });
            }
          });
          
          await inventoryModule.deductStockForBOM(deductions, `BATCH-${order.id}`, req.user.id);
        }
      }
      
      // TRIGGER ZERNIO DELIVERY ALERT (Include proof of delivery photo)
      const customerIds = [...new Set(updatedOrders.map(o => o.customer_id).filter(Boolean))];
      if (proof_of_delivery_url) {
        for (const cid of customerIds) {
          try {
            await supabaseAdmin.schema('crm').from('customers')
              .update({ delivery_spot_photo_url: proof_of_delivery_url })
              .eq('id', cid);
          } catch (e) {}

          try {
            const { data: cust } = await supabaseAdmin.schema('crm').from('customers')
              .select('delivery_notes').eq('id', cid).single();
            let currentNotes = cust?.delivery_notes || '';
            if (!currentNotes.includes(proof_of_delivery_url)) {
              const photoTag = `📸 POD: ${proof_of_delivery_url}`;
              const newNotes = currentNotes ? `${currentNotes} | ${photoTag}` : photoTag;
              await supabaseAdmin.schema('crm').from('customers')
                .update({ delivery_notes: newNotes })
                .eq('id', cid);
            }
          } catch (e) {}
        }
      }
      for (const cid of customerIds) {
        await sendDeliveryZernioMessage(cid, null, 'DELIVERED', proof_of_delivery_url);
      }
    } else if (delivery_status === 'ON_THE_WAY' && updatedOrders && updatedOrders.length > 0) {
      const customerIds = [...new Set(updatedOrders.map(o => o.customer_id))];
      for (const cid of customerIds) {
        await sendDeliveryZernioMessage(cid, null, 'ON_THE_WAY');
      }
    }
    
    return res.json({ success: true, updatedCount: updatedOrders?.length || 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/orders/:id', opsController.deleteOrder);

// Move single order status below batch-status to avoid route shadowing
router.put('/orders/:id/status', opsController.updateOrderStatus);

// ==========================================
// RIDERS (for admin assignment dropdown)
// ==========================================

router.get('/riders', opsController.getRiders);

// Admin assigns order to a rider
router.put('/orders/:id/assign', opsController.assignRiderToOrder);

// Rider updates their own delivery status
// Flow: ASSIGNED → PICKING_UP → ON_THE_WAY → DELIVERED
router.put('/orders/:id/rider-status', opsController.updateRiderStatus);

// ==========================================
// SKIP DAYS
// ==========================================

router.get('/skip-days', opsController.getSkipDays);
router.post('/skip-days', opsController.createSkipDay);
export default router;
