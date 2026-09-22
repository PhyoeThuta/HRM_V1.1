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

router.post('/import-costing', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const wb = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const parsedMenus = [];
    let currentMenu = null;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row || !row[0]) continue;

      const titleRaw = row[0].toString().trim();
      const match = titleRaw.match(/^([A-Z\s]+[0-9]{3,4})\s*-\s*([^\(]+)(?:\((.+)\))?/);
      
      if (match) {
        if (currentMenu) parsedMenus.push(currentMenu);
        currentMenu = {
          code: match[1].trim(),
          name_en: match[2].trim(),
          name_mm: match[3] ? match[3].trim() : '',
          sales_prices: 0,
          ingredients: []
        };
        continue;
      }

      if (currentMenu && titleRaw.toLowerCase().includes('sales prices')) {
        const priceMatch = titleRaw.match(/[\d.]+/);
        if (priceMatch) currentMenu.sales_prices = parseFloat(priceMatch[0]);
        continue;
      }

      if (currentMenu && titleRaw.toLowerCase() === 'description') {
        continue;
      }
      
      if (currentMenu && titleRaw.toLowerCase().includes('total bill of materials')) {
        continue;
      }

      if (currentMenu && row[2] !== undefined && row[3] !== undefined) {
        currentMenu.ingredients.push({
          name: titleRaw,
          qty: parseFloat(row[2]) || 0,
          uom: row[3].toString().trim().toLowerCase()
        });
      }
    }
    
    if (currentMenu) parsedMenus.push(currentMenu);

    let menusCreated = 0;
    let itemsCreated = 0;
    let recipesCreated = 0;

    for (const menu of parsedMenus) {
      // 1. Insert/Update Menu
      const { data: existingMenu } = await supabaseAdmin.from('operations_menus').select('id').eq('name_en', menu.name_en).limit(1);
      let menuId;
      if (existingMenu && existingMenu.length > 0) {
        menuId = existingMenu[0].id;
        await supabaseAdmin.from('operations_menus').update({
          code: menu.code,
          name_mm: menu.name_mm,
          sales_prices: menu.sales_prices,
          updated_at: new Date().toISOString()
        }).eq('id', menuId);
      } else {
        const { data: newMenu } = await supabaseAdmin.from('operations_menus').insert({
          code: menu.code,
          name_en: menu.name_en,
          name_mm: menu.name_mm,
          sales_prices: menu.sales_prices
        }).select('id');
        menuId = newMenu[0].id;
        menusCreated++;
      }

      // Clear existing recipes for this menu so we don't duplicate
      await supabaseAdmin.from('operations_recipes').delete().eq('menu_id', menuId);

      // 2. Insert/Update Ingredients & Recipes
      for (const ing of menu.ingredients) {
        const { id: itemId, created } = await inventoryModule.getOrCreateItemForCosting(ing.name, ing.uom);
        if (created) itemsCreated++;

        // Add Recipe
        await supabaseAdmin.from('operations_recipes').insert({
          menu_id: menuId,
          inventory_item_id: itemId,
          quantity: ing.qty,
          unit_of_measure: ing.uom
        });
        recipesCreated++;
      }
    }

    return res.json({ success: true, menusCreated, itemsCreated, recipesCreated, parsedMenusCount: parsedMenus.length });
  } catch (err) {
    console.error('[IMPORT COSTING]', err);
    return res.status(500).json({ error: err.message });
  }
});
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
router.post('/upload-pod-photo', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
    }

    const mimeType = match[1];
    const ext = mimeType.split('/')[1] || 'jpg';
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `pod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('gallery')
        .upload(`proof_of_delivery/${filename}`, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (!uploadErr) {
        const { data: publicUrlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(`proof_of_delivery/${filename}`);
        if (publicUrlData?.publicUrl) {
          return res.json({ success: true, url: publicUrlData.publicUrl });
        }
      }
    } catch (e) {
      console.warn('[POD_PHOTO_STORAGE_WARN]', e.message);
    }

    res.json({ success: true, url: image });
  } catch (err) {
    console.error('[UPLOAD_POD_PHOTO_ERR]', err);
    res.status(500).json({ error: 'Failed to process proof photo upload' });
  }
});

const lastSentZernioMap = new Map();

async function sendDeliveryZernioMessage(customerId, orderId, type = 'DELIVERED', proofUrl = null) {
  try {
    // Deduplicate notifications within 10s per customer per type
    const dedupKey = `${customerId}_${type}`;
    const nowTs = Date.now();
    if (lastSentZernioMap.has(dedupKey) && (nowTs - lastSentZernioMap.get(dedupKey) < 5000)) {
      console.log(`[ZERNIO] Skipping duplicate ${type} message for customer ${customerId}`);
      return;
    }

    const { data: customer } = await supabaseAdmin.schema('crm').from('customers').select('full_name, facebook_name').eq('id', customerId).single();
    if (!customer) return;

    let { data: inquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').eq('customer_id', customerId);
    if ((!inquiries || inquiries.length === 0) && customer.facebook_name) {
      const { data: fbInquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').ilike('prospect_name', customer.facebook_name);
      if (fbInquiries && fbInquiries.length > 0) inquiries = fbInquiries;
    }
    if (!inquiries || inquiries.length === 0) return;

    const inquiryIds = inquiries.map(i => i.id);

    let conversationId = customer.zernio_conversation_id || customer.conversation_id || null;

    if (!conversationId) {
      const { data: allMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages')
        .select('metadata')
        .in('inquiry_id', inquiryIds)
        .not('metadata', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);

      if (allMsgs && allMsgs.length > 0) {
        for (const m of allMsgs) {
          const meta = m.metadata;
          const cid = meta?.message?.conversationId || meta?.conversationId || meta?.raw?.message?.conversationId || meta?.raw?.conversationId;
          if (cid) {
            conversationId = cid;
            break;
          }
        }
      }
    }

    if (!conversationId) {
      for (const inq of inquiries) {
        const cid = inq.metadata?.conversationId || inq.metadata?.message?.conversationId;
        if (cid) {
          conversationId = cid;
          break;
        }
      }
    }

    if (!conversationId) {
      console.warn(`[ZERNIO] Could not find conversationId for customer ${customerId} (${customer.full_name})`);
      return;
    }

    lastSentZernioMap.set(dedupKey, nowTs);

    const zernioApiKey = process.env.ZERNIO_API_KEY;
    if (!zernioApiKey) {
      console.warn('[ZERNIO] ZERNIO_API_KEY is not configured on environment');
      return;
    }

    let text = '';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (type === 'ON_THE_WAY') {
      const trackLink = `${frontendUrl}/track/${orderId || customerId}`;
      text = `မင်္ဂလာပါရှင့်။ သင့် အစားအသောက်များ လာပို့နေပါပြီရှင့် 🚚\n\nဒီ Link လေးကနေတစ်ဆင့် Rider ဘယ်ရောက်နေပြီလဲဆိုတာကို Live ကြည့်လို့ရပါတယ်ရှင့် 👇\n${trackLink}`;
    } else {
      const feedbackLink = `${frontendUrl}/feedback/${customerId}`;
      text = `မင်္ဂလာပါရှင့်။ ယနေ့အတွက် Busy Boss Diet ရဲ့ နေ့လယ်စာ/ညစာ လေး ပို့ဆောင်ပေးပြီးပါပြီ 📦✨\n\n`;
      if (proofUrl) {
        if (!proofUrl.startsWith('data:image') && (proofUrl.startsWith('http://') || proofUrl.startsWith('https://'))) {
          text += `📸 ပို့ဆောင်ပြီးကြောင်း အထောက်အထား (Proof of Delivery Photo):\n${proofUrl}\n\n`;
        } else {
          text += `📸 ပို့ဆောင်ပြီးကြောင်း အထောက်အထား (Proof Photo Attached)\n\n`;
        }
      }
      text += `အရသာနဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ Delivery နဲ့ ပတ်သက်ပြီးဖြစ်စေ အထွေထွေ ကိစ္စတွေအတွက် အကြံပြုလိုပါက အောက်ပါ Link လေးမှတစ်ဆင့် ဝင်ရောက်ရေးသားနိုင်ပါတယ်ရှင့် 👇\n\n${feedbackLink}`;
    }

    const quickReplies = [
      { content_type: 'text', title: '🍱 Meal ရရှိပါပြီ', payload: 'DELIVERY_RECEIVED' },
      { content_type: 'text', title: '📝 Feedback ပေးရန်', payload: 'COMPLAINT_FEEDBACK' }
    ];

    // 1. Try standard message send first (valid inside 24h window)
    let zRes = await fetch(zernioUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zernioApiKey}` },
      body: JSON.stringify({
        accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
        message: text,
        quickReplies,
        quick_replies: quickReplies
      })
    });

    let zResult = null;
    try { zResult = await zRes.json(); } catch {}

    // 2. Fallback to tagged message send if standard send failed (outside 24h window)
    if (!zRes.ok || zResult?.error) {
      zRes = await fetch(zernioUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zernioApiKey}` },
        body: JSON.stringify({
          accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
          messagingType: 'MESSAGE_TAG',
          messageTag: 'POST_PURCHASE_UPDATE',
          message: text
        })
      });
      try { zResult = await zRes.json(); } catch {}
    }

    const deliveryFailed = !zRes.ok;
    const deliveryError = deliveryFailed ? (typeof zResult?.error === 'string' ? zResult.error : (zResult?.error?.message || zResult?.message || 'Zernio API Send Failed')) : null;

    if (deliveryFailed) {
      console.error(`[ZERNIO SEND FAILED] ${zRes.status}:`, zResult || 'Unknown error');
    } else {
      console.log(`[ZERNIO] Sent ${type} message & proof photo link to customer ${customerId} (${customer.full_name})`);
    }

    // Insert locally so UI updates instantly
    const { data: newMsg } = await supabaseAdmin.schema('crm')
      .from('inquiries_messages')
      .insert({
        inquiry_id: inquiryIds[0],
        message_text: text,
        sender_type: 'ai_bot',
        metadata: { 
          auto_reply: true, 
          conversationId, 
          delivery_alert: true, 
          proof_url: proofUrl, 
          imageUrl: proofUrl,
          delivery_status: deliveryFailed ? 'failed' : 'sent',
          delivery_error: deliveryError,
          zernio_failed: deliveryFailed
        }
      })
      .select().single();
      
    if (newMsg) emitInquiryMessage(inquiryIds[0], newMsg);

  } catch (err) {
    console.error('[ZERNIO DELIVERY ERROR]', err.message);
  }
}

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
        .eq('id', id)
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
        
        await inventoryModule.deductStockForBOM(deductions, id, req.user.id);
      }
      
      // TRIGGER ZERNIO DELIVERY ALERT FOR SINGLE ORDER
      if (result && result.customer_id) {
        await sendDeliveryZernioMessage(result.customer_id, result.id, 'DELIVERED');
      }
    } else if (delivery_status === 'ON_THE_WAY' && result && result.customer_id) {
      await sendDeliveryZernioMessage(result.customer_id, result.id, 'ON_THE_WAY');
    }
    
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// ==========================================
// RIDERS (for admin assignment dropdown)
// ==========================================

router.get('/riders', opsController.getRiders);

// Admin assigns order to a rider
router.put('/orders/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { rider_id } = req.body;

    // Upsert into rider_assignments
    const { data: existing } = await supabase
      .from('operations_rider_assignments')
      .select('id')
      .eq('order_id', id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('operations_rider_assignments')
        .update({ rider_id: rider_id || null, status: rider_id ? 'ASSIGNED' : null, updated_at: new Date().toISOString() })
        .eq('order_id', id);
      if (error) throw error;
    } else if (rider_id) {
      const { error } = await supabase
        .from('operations_rider_assignments')
        .insert({ order_id: id, rider_id, status: 'ASSIGNED' });
      if (error) throw error;
    }

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Rider updates their own delivery status
// Flow: ASSIGNED → PICKING_UP → ON_THE_WAY → DELIVERED
router.put('/orders/:id/rider-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, proof_of_delivery_url } = req.body; // PICKING_UP | ON_THE_WAY | DELIVERED
    const now = new Date().toISOString();

    const assignmentUpdate = { status, updated_at: now };
    if (status === 'ON_THE_WAY') assignmentUpdate.picked_up_at = now;
    if (proof_of_delivery_url) assignmentUpdate.proof_of_delivery_url = proof_of_delivery_url;

    try {
      await supabaseAdmin
        .from('operations_rider_assignments')
        .update(assignmentUpdate)
        .eq('order_id', id);
    } catch (err) {
      delete assignmentUpdate.proof_of_delivery_url;
      await supabaseAdmin
        .from('operations_rider_assignments')
        .update(assignmentUpdate)
        .eq('order_id', id);
    }

    // Sync delivery_status on orders table
    let delivery_status = 'PENDING';
    if (status === 'ON_THE_WAY') delivery_status = 'ON_THE_WAY';
    else if (status === 'DELIVERED') delivery_status = 'DELIVERED';

    const orderUpdate = { delivery_status, updated_by: req.user.id, updated_at: now };
    if (status === 'DELIVERED') {
      orderUpdate.delivered_at = now;
      if (proof_of_delivery_url) orderUpdate.proof_of_delivery_url = proof_of_delivery_url;
    }
    
    try {
      const { error: oErr } = await supabaseAdmin.from('operations_orders').update(orderUpdate).eq('id', id);
      if (oErr) throw oErr;
    } catch (err) {
      delete orderUpdate.proof_of_delivery_url;
      await supabaseAdmin.from('operations_orders').update(orderUpdate).eq('id', id);
    }

    // Fetch order's customer_id
    const { data: order } = await supabaseAdmin.from('operations_orders').select('customer_id').eq('id', id).single();
    
    // Also save proof_of_delivery_url onto crm.customers.delivery_spot_photo_url & delivery_notes so it displays everywhere!
    if (proof_of_delivery_url && order?.customer_id) {
      try {
        await supabaseAdmin.schema('crm').from('customers')
          .update({ delivery_spot_photo_url: proof_of_delivery_url })
          .eq('id', order.customer_id);
      } catch (e) {
        console.warn('[UPDATE_CUST_SPOT_PHOTO_WARN]', e.message);
      }

      try {
        const { data: cust } = await supabaseAdmin.schema('crm').from('customers')
          .select('delivery_notes').eq('id', order.customer_id).single();
        let currentNotes = cust?.delivery_notes || '';
        if (!currentNotes.includes(proof_of_delivery_url)) {
          const photoTag = `📸 POD: ${proof_of_delivery_url}`;
          const newNotes = currentNotes ? `${currentNotes} | ${photoTag}` : photoTag;
          await supabaseAdmin.schema('crm').from('customers')
            .update({ delivery_notes: newNotes })
            .eq('id', order.customer_id);
        }
      } catch (e) {
        console.warn('[UPDATE_CUST_NOTES_WARN]', e.message);
      }
    }

    // Notify admins in real-time via socket (so Dashboard refreshes without polling)
    emitOrderStatusUpdate(id, delivery_status, req.user.id);

    // Fire Zernio notification for ON_THE_WAY and DELIVERED
    if (status === 'ON_THE_WAY' || status === 'DELIVERED') {
      if (order?.customer_id) {
        sendDeliveryZernioMessage(order.customer_id, id, status, proof_of_delivery_url).catch(e => console.error('[Rider Status Zernio]', e));
      }
    }

    return res.json({ success: true });
  } catch (e) {
    console.error('[Rider Status Error]:', e);
    return res.status(500).json({ error: e.message || e });
  }
});

// ==========================================
// SKIP DAYS
// ==========================================

router.get('/skip-days', opsController.getSkipDays);
router.post('/skip-days', opsController.createSkipDay);
export default router;
