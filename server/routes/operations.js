import express from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import { verifyToken, requireOperations } from '../middleware/auth.js';
import { emitInquiryMessage } from '../lib/crmRealtime.js';
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
        const { data: existingItem } = await supabaseAdmin.from('inventory_items').select('id').eq('name_eng', ing.name).limit(1);
        let itemId;
        if (existingItem && existingItem.length > 0) {
          itemId = existingItem[0].id;
        } else {
          const { data: newItem } = await supabaseAdmin.from('inventory_items').insert({
            name_eng: ing.name,
            category: 'RECIPE_INGREDIENT',
            unit_of_measure: ing.uom
          }).select('id');
          itemId = newItem[0].id;
          itemsCreated++;
        }

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
router.get('/menu-plans', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('operations_menu_plans').select('*').order('date', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/import-menu-plan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Use header: "A" to force keys to be "A", "B", "C" etc. This prevents column shifting if Column A is empty.
    const rows = xlsx.utils.sheet_to_json(sheet, { header: "A" });

    let count = 0;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;

      let dateRaw = row['B']; // Date is in Column B
      if (!dateRaw || String(dateRaw).trim().toLowerCase() === 'date' || String(dateRaw).trim() === '') continue;
      
      let parsedDate;
      if (typeof dateRaw === 'number') {
         // Excel serial date
         parsedDate = new Date((dateRaw - (25567 + 2)) * 86400 * 1000);
      } else {
         // Fix string dates like "1-Jun-26" -> node might parse as 2001 instead of 2026.
         // Or timezone issues.
         const strDate = String(dateRaw);
         if (strDate.includes('-')) {
             const parts = strDate.split('-');
             if (parts.length === 3) {
                 const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                 const monthMap = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'};
                 const monthStr = parts[1].substring(0, 3);
                 const month = monthMap[monthStr] || '01';
                 const day = parts[0].padStart(2, '0');
                 parsedDate = new Date(`${year}-${month}-${day}T12:00:00Z`); // use midday UTC to avoid TZ issues
             } else {
                 parsedDate = new Date(strDate);
             }
         } else {
             parsedDate = new Date(strDate);
         }
      }

      if (isNaN(parsedDate.getTime())) continue; // Skip invalid dates

      const formattedDate = parsedDate.toISOString().split('T')[0];
      
      // Look at the next row for night dishes (assuming 2 rows per day)
      const nextRow = (r + 1 < rows.length) ? rows[r+1] : {};

      const mainDish1 = row['E'] ? String(row['E']).trim() : null; // Column E
      const mainDish2 = nextRow['E'] ? String(nextRow['E']).trim() : null;
      
      const sideDish1 = row['F'] ? String(row['F']).trim() : null; // Column F
      const sideDish2 = nextRow['F'] ? String(nextRow['F']).trim() : null;
      
      const dessert = row['G'] ? String(row['G']).trim() : null; // Column G
      const soup = row['H'] ? String(row['H']).trim() : null; // Column H
      
      let hasRice = null;
      if (row['I']) hasRice = String(row['I']).trim();
      else if (nextRow['I']) hasRice = String(nextRow['I']).trim();

      const { error } = await supabaseAdmin.from('operations_menu_plans')
        .upsert({
          date: formattedDate,
          main_dish_1: mainDish1,
          main_dish_2: mainDish2,
          side_dish_1: sideDish1,
          side_dish_2: sideDish2,
          soup,
          dessert,
          has_rice: hasRice
        }, { onConflict: 'date' });

      if (error) {
        console.error('Menu Plan Upsert Error for date:', formattedDate, error);
      } else {
        count++;
      }
    }

    if (count === 0) {
       return res.status(400).json({ error: 'No valid dates found in the file. Ensure the Date is in Column B.' });
    }

    res.json({ success: true, count });
  } catch (err) {
    console.error('[IMPORT MENU PLAN ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/recalculate-bom', async (req, res) => {
  try {
    // Fetch all recipes with their current inventory cost
    const { data: recipes, error: rErr } = await supabase.from('operations_recipes').select('*');
    if (rErr) throw rErr;
    
    const { data: balances, error: bErr } = await supabase.from('inventory_balances').select('item_id, one_unit_cost');
    if (bErr) throw bErr;
    
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
    
    // Update all menus
    for (const [menuId, totalBom] of menuBom.entries()) {
      await supabase.from('operations_menus').update({ total_bill_of_materials: totalBom }).eq('id', menuId);
    }
    
    return res.json({ success: true, updated: menuBom.size });
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
      const { data: customers, error: cErr } = await supabaseAdmin.schema('crm').from('customers').select('id, full_name, phone, delivery_address').in('id', customerIds);
      if (cErr) {
        console.error("[GET /orders] Error fetching customers:", cErr);
      }
      if (customers) {
        customersMap = Object.fromEntries(customers.map(c => [c.id, c]));
      }
    }
    
    const enrichedOrders = orders.map(o => ({
      ...o,
      daily_menus: dailyMenus?.find(dm => dm.id === o.daily_menu_id) || null,
      customer: customersMap[o.customer_id] || { full_name: 'Unknown (Please restart backend server)' }
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

router.post('/orders/auto-generate', async (req, res) => {
  try {
    const targetDate = req.body.date || new Date().toISOString().split('T')[0];

    // 1. Fetch planned menus for target date
    const { data: dailyMenus, error: menuErr } = await supabase
      .from('operations_daily_menus')
      .select('*')
      .eq('date', targetDate);
    
    if (menuErr) throw menuErr;
    if (!dailyMenus || dailyMenus.length === 0) {
      return res.status(400).json({ error: 'No daily menus planned for this date.' });
    }

    // 2. Fetch active customer packages overlapping target date
    const { data: packages, error: pkgErr } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('*')
      .eq('status', 'Active')
      .lte('start_date', targetDate)
      .gte('expires_at', targetDate);
      
    if (pkgErr) throw pkgErr;
    if (!packages || packages.length === 0) {
      return res.json({ success: true, generatedCount: 0, message: 'No active packages found for this date.' });
    }

    // 3. Fetch existing orders to prevent duplicates
    const { data: existingOrders, error: orderErr } = await supabase
      .from('operations_orders')
      .select('customer_id, daily_menu_id')
      .eq('date', targetDate);
      
    if (orderErr) throw orderErr;
    
    const existingSet = new Set(existingOrders?.map(o => `${o.customer_id}-${o.daily_menu_id}`) || []);

    const newOrders = [];

    // 4. Match packages to daily menus
    for (const pkg of packages) {
      const pkgMeals = (pkg.meal_type || '').toUpperCase(); // e.g. "LUNCH, DINNER"
      
      // Track which meal types this customer already has orders for on this date
      const customerExistingOrders = existingOrders?.filter(o => o.customer_id === pkg.customer_id) || [];
      const fulfilledMealTypes = new Set();
      
      for (const eo of customerExistingOrders) {
        const menu = dailyMenus.find(m => m.id === eo.daily_menu_id);
        if (menu && menu.meal_type) {
          fulfilledMealTypes.add(menu.meal_type.toUpperCase());
        }
      }
      
      for (const menu of dailyMenus) {
        const menuType = (menu.meal_type || '').toUpperCase(); // e.g. "LUNCH"
        
        // If package includes this meal type AND we haven't already fulfilled it for this customer today
        if (pkgMeals.includes(menuType) && !fulfilledMealTypes.has(menuType)) {
          const comboKey = `${pkg.customer_id}-${menu.id}`;
          if (!existingSet.has(comboKey)) {
            newOrders.push({
              customer_id: pkg.customer_id,
              daily_menu_id: menu.id,
              date: targetDate,
              count: 1,
              delivery_status: 'PENDING',
              created_by: req.user.id
            });
            existingSet.add(comboKey); // Prevent exact duplicates
            fulfilledMealTypes.add(menuType); // Mark this meal type as fulfilled!
          }
        }
      }
    }

    // 5. Bulk Insert
    if (newOrders.length > 0) {
      const { error: insertErr } = await supabase
        .from('operations_orders')
        .insert(newOrders);
        
      if (insertErr) throw insertErr;
      
      // AUTO TRIGGER TELEGRAM CHEF ALERT
      try {
        const fetch = (await import('node-fetch')).default || globalThis.fetch;
        const host = req.get('host');
        const protocol = req.protocol || 'http';
        
        // We need to fetch the Kitchen Dashboard data to get the BOM for the chef
        const dashRes = await fetch(`${protocol}://${host}/api/crm/kitchen-dashboard?date=${targetDate}`, {
          headers: { 'Authorization': req.headers.authorization } // pass token
        });
        const dashData = await dashRes.json();
        
        if (dashData && dashData.dailyMenus) {
          // Send to Chef Telegram
          await fetch(`${protocol}://${host}/api/telegram/send-to-chef`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': req.headers.authorization 
            },
            body: JSON.stringify({
              targetDate,
              dailyMenus: dashData.dailyMenus,
              aggregatedBOM: dashData.aggregatedBOM
            })
          });
        }
      } catch (tgErr) {
        console.error('[AUTO GENERATE -> CHEF ALERT ERROR]', tgErr);
      }
    }

    return res.json({ success: true, generatedCount: newOrders.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

async function sendDeliveryZernioMessage(customerId, orderId, type = 'DELIVERED') {
  try {
    const { data: customer } = await supabaseAdmin.schema('crm').from('customers').select('full_name, facebook_name').eq('id', customerId).single();
    if (!customer) return;

    let { data: inquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').eq('customer_id', customerId);
    if ((!inquiries || inquiries.length === 0) && customer.facebook_name) {
      const { data: fbInquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').ilike('prospect_name', customer.facebook_name);
      if (fbInquiries && fbInquiries.length > 0) inquiries = fbInquiries;
    }
    if (!inquiries || inquiries.length === 0) return;

    const inquiryIds = inquiries.map(i => i.id);
    const { data: prospectMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages').select('metadata').in('inquiry_id', inquiryIds).eq('sender_type', 'prospect').not('metadata', 'is', null).order('created_at', { ascending: false }).limit(1);

    if (!prospectMsgs || prospectMsgs.length === 0) return;
    const meta = prospectMsgs[0].metadata;
    const conversationId = meta?.message?.conversationId || meta?.conversationId;
    if (!conversationId) return;

    const zernioApiKey = process.env.ZERNIO_API_KEY;
    if (!zernioApiKey) return;

    let text = '';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (type === 'ON_THE_WAY') {
      const trackLink = `${frontendUrl}/track/${orderId || customerId}`;
      text = `မင်္ဂလာပါရှင့်။ သင့် အစားအသောက်များ လာပို့နေပါပြီရှင့် 🚚\n\nဒီ Link လေးကနေတစ်ဆင့် Rider ဘယ်ရောက်နေပြီလဲဆိုတာကို Live ကြည့်လို့ရပါတယ်ရှင့် 👇\n${trackLink}`;
    } else {
      const feedbackLink = `${frontendUrl}/feedback/${customerId}`;
      text = `မင်္ဂလာပါရှင့်။ ယနေ့အတွက် Busy Boss Diet ရဲ့ နေ့လယ်စာ/ညစာ လေး ပို့ဆောင်ပေးပြီးပါပြီ။ အရသာနဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ Delivery နဲ့ ပတ်သက်ပြီးဖြစ်စေ အထွေထွေ ကိစ္စတွေအတွက်ဖြစ်စေ အကြံပြုလိုပါက (သို့မဟုတ်) တိုင်ကြားလိုပါက အောက်ပါ Link လေးမှတစ်ဆင့် ဝင်ရောက်ရေးသားနိုင်ပါတယ်ရှင့် 👇\n\n${feedbackLink}`;
    }

    const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`;
    await fetch(zernioUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${zernioApiKey}` },
      body: JSON.stringify({
        accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
        message: text
      })
    });
    console.log(`[ZERNIO] Sent delivery feedback link to customer ${customerId}`);

    // Insert locally so UI updates instantly
    const { data: newMsg } = await supabaseAdmin.schema('crm')
      .from('inquiries_messages')
      .insert({
        inquiry_id: inquiryIds[0],
        message_text: text,
        sender_type: 'ai_bot',
        metadata: { auto_reply: true, conversationId, delivery_alert: true }
      })
      .select().single();
      
    if (newMsg) emitInquiryMessage(inquiryIds[0], newMsg);

  } catch (err) {
    console.error('[ZERNIO DELIVERY ERROR]', err.message);
  }
}

router.put('/orders/batch-status', async (req, res) => {
  try {
    const { order_ids, delivery_status } = req.body;
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
    }
    
    // Update all orders
    const { data: updatedOrders, error: updateErr } = await supabase
      .from('operations_orders')
      .update(updateData)
      .in('id', order_ids)
      .select();
      
    if (updateErr) throw updateErr;

    // Process inventory deduction if DELIVERED
    if (delivery_status === 'DELIVERED' && updatedOrders && updatedOrders.length > 0) {
      for (const order of updatedOrders) {
        // Just duplicate the single order deduction logic here for safety
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
          .eq('id', order.id)
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
            const { data: balData } = await supabase.from('inventory_balances').select('*').eq('item_id', itemId).single();
            if (balData) {
              await supabase.from('inventory_transactions').insert({
                item_id: itemId,
                transaction_type: 'USAGE_OUT',
                quantity_change: deductQty,
                reference_type: 'ORDER_BATCH',
                reference_id: order.id,
                created_by: req.user.id
              });
              await supabase.from('inventory_balances').update({
                current_quantity: parseFloat(balData.current_quantity) - parseFloat(deductQty),
                updated_by: req.user.id,
                updated_at: now
              }).eq('id', balData.id);
            }
          }
        }
      }
      
      // TRIGGER ZERNIO DELIVERY ALERT
      const customerIds = [...new Set(updatedOrders.map(o => o.customer_id))];
      for (const cid of customerIds) {
        // Run asynchronously without awaiting so we don't delay the API response
        sendDeliveryZernioMessage(cid, null, 'DELIVERED').catch(e => console.error('[Batch Zernio Error]', e));
      }
    } else if (delivery_status === 'ON_THE_WAY' && updatedOrders && updatedOrders.length > 0) {
      const customerIds = [...new Set(updatedOrders.map(o => o.customer_id))];
      for (const cid of customerIds) {
        sendDeliveryZernioMessage(cid, null, 'ON_THE_WAY').catch(e => console.error('[Batch Zernio Error]', e));
      }
    }
    
    return res.json({ success: true, updatedCount: updatedOrders?.length || 0 });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await opsDelete('orders', id);
    return res.json({ success: true });
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
          const { data: balData } = await supabase.from('inventory_balances').select('*').eq('item_id', itemId).single();
          if (balData) {
            await supabase.from('inventory_transactions').insert({
              item_id: itemId,
              transaction_type: 'USAGE_OUT',
              quantity_change: deductQty,
              reference_type: 'ORDER',
              reference_id: id,
              created_by: req.user.id
            });
            await supabase.from('inventory_balances').update({
              current_quantity: parseFloat(balData.current_quantity) - parseFloat(deductQty),
              updated_by: req.user.id,
              updated_at: now
            }).eq('id', balData.id);
          }
        }
      }
      
      // TRIGGER ZERNIO DELIVERY ALERT FOR SINGLE ORDER
      if (result && result.customer_id) {
        sendDeliveryZernioMessage(result.customer_id, result.id, 'DELIVERED').catch(e => console.error('[Single Zernio Error]', e));
      }
    } else if (delivery_status === 'ON_THE_WAY' && result && result.customer_id) {
      sendDeliveryZernioMessage(result.customer_id, result.id, 'ON_THE_WAY').catch(e => console.error('[Single Zernio Error]', e));
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
