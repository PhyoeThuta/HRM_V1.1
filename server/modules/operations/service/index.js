import * as opsRepo from '../repository/index.js';
import { inventoryModule } from '../../inventory/index.js';
import { supabaseAdmin } from '../../../lib/supabase.js';
import { crmModule } from '../../crm/index.js';
import { emitInquiryMessage, emitOrderStatusUpdate } from '../../../lib/crmRealtime.js';
import { sendOrderAssignmentToLine } from '../../webhooks/service/lineService.js';
import { sendOrderAssignmentToTelegram } from '../../webhooks/service/telegramRiderService.js';
import xlsx from 'xlsx';
// MENUS
// ==========================================

export async function getEnrichedMenus() {
  const menus = await opsRepo.getAllMenus();
  const recipes = await opsRepo.getAllRecipes();
  const items = await inventoryModule.getItemsBasicInfo();

  return menus.map(m => {
    const menuRecipes = recipes?.filter(r => r.menu_id === m.id) || [];
    const enrichedRecipes = menuRecipes.map(r => ({
      ...r,
      inventory_items: items?.find(i => i.id === r.inventory_item_id) || null
    }));
    return { ...m, recipes: enrichedRecipes };
  });
}

export async function createMenu(data, userId) {
  return opsRepo.createMenu({ ...data, created_by: userId });
}

export async function updateMenu(id, data, userId) {
  return opsRepo.updateMenu(id, {
    ...data,
    updated_by: userId,
    updated_at: new Date().toISOString()
  });
}

export async function deleteMenu(id) {
  return opsRepo.deleteMenu(id);
}

// ==========================================
// RECIPES
// ==========================================

export async function createRecipe(data, userId) {
  return opsRepo.createRecipe({ ...data, created_by: userId });
}

export async function deleteRecipe(id) {
  return opsRepo.deleteRecipe(id);
}

// ==========================================
// MENU PLANS
// ==========================================

export async function getAllMenuPlans() {
  return opsRepo.getAllMenuPlans();
}

export async function importMenuPlan(parsedRows) {
  let count = 0;
  for (const row of parsedRows) {
    try {
      await opsRepo.upsertMenuPlan(row);
      count++;
    } catch (error) {
      console.error('Menu Plan Upsert Error for date:', row.date, error);
    }
  }
  if (count === 0) {
    throw new Error('No valid dates found in the file. Ensure the Date is in Column B.');
  }
  return count;
}

// ==========================================
// SKIP DAYS
// ==========================================

export async function getAllSkipDays() {
  return opsRepo.getAllSkipDays();
}

export async function createSkipDay(data, userId) {
  return opsRepo.createSkipDay({ ...data, created_by: userId });
}

// ==========================================
// RIDERS (Admin Assignment Support)
// ==========================================

// Temporary cross-domain dependency on HRM sys_users table
export async function getActiveRiders() {
  const { data, error } = await supabaseAdmin
    .from('sys_users')
    .select('id, full_name, username')
    .eq('role', 'rider')
    .eq('is_active', true)
    .order('full_name');
    
  if (error) throw error;
  return data || [];
}

// Temporary CRM lookup helper for Orders
async function getCustomersMapForOrders(orderList) {
  const customerIds = [...new Set(orderList.map(o => o.customer_id).filter(Boolean))];
  let customersMap = {};
  if (customerIds.length > 0) {
    try {
      const customers = await crmModule.getCustomerDeliveryInfo(customerIds);
      if (customers && customers.length > 0) {
        customersMap = Object.fromEntries(customers.map(c => [c.id, c]));
      }
    } catch (e) {
      console.error('[OPS_GET_DELIVERY_INFO_ERROR]', e.message);
    }
  }
  return customersMap;
}

// ==========================================
// ORDERS (Basic CRUD)
// ==========================================

export async function getEnrichedOrders(user) {
  const isRider = user.role === 'rider';
  let orders = [];
  
  if (isRider) {
    const assignments = await opsRepo.getRiderAssignmentsByRiderId(user.id);
    if (!assignments || assignments.length === 0) return [];
    
    const assignedOrderIds = assignments.map(a => a.order_id);
    const assignmentsMap = Object.fromEntries(assignments.map(a => [a.order_id, a]));
    
    orders = await opsRepo.getOrdersByIds(assignedOrderIds);
    const dailyMenus = await opsRepo.getAllDailyMenusWithoutLimit();
    const customersMap = await getCustomersMapForOrders(orders);
    
    return orders.map(o => ({
      ...o,
      daily_menus: dailyMenus?.find(dm => dm.id === o.daily_menu_id) || null,
      customer: customersMap[o.customer_id] || { full_name: 'Unknown' },
      rider_id: assignmentsMap[o.id]?.rider_id || user.id,
      rider_status: o.delivery_status === 'DELIVERED' ? 'DELIVERED' : (assignmentsMap[o.id]?.status || 'ASSIGNED'),
    }));
  } else {
    orders = await opsRepo.getAllOrders();
    const orderIds = orders.map(o => o.id);
    
    let assignmentsMap = {};
    if (orderIds.length > 0) {
      const assignments = await opsRepo.getRiderAssignmentsByOrderIds(orderIds);
      if (assignments) assignmentsMap = Object.fromEntries(assignments.map(a => [a.order_id, a]));
    }
    
    const dailyMenus = await opsRepo.getAllDailyMenusWithoutLimit();
    const customersMap = await getCustomersMapForOrders(orders);
    
    return orders.map(o => ({
      ...o,
      daily_menus: dailyMenus?.find(dm => dm.id === o.daily_menu_id) || null,
      customer: customersMap[o.customer_id] || { full_name: 'Unknown (Please restart backend server)' },
      rider_id: assignmentsMap[o.id]?.rider_id || null,
      rider_status: assignmentsMap[o.id]?.status || null,
    }));
  }
}

export async function createOrder(data, userId) {
  return opsRepo.createOrder({ ...data, created_by: userId });
}

export async function updateOrderCustomAddress(id, customAddress, userId) {
  return opsRepo.updateOrderCustomAddress(id, {
    custom_delivery_address: customAddress,
    updated_by: userId,
    updated_at: new Date().toISOString()
  });
}

export async function deleteOrder(id) {
  return opsRepo.deleteOrder(id);
}

// ==========================================
// DAILY MENUS & MENU TYPES
// ==========================================

export async function getEnrichedDailyMenus() {
  const dailyMenus = await opsRepo.getRecentDailyMenus();
  const menuTypes = await opsRepo.getAllMenuTypes();
  const menus = await opsRepo.getAllMenus();

  return dailyMenus.map(dm => {
    const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
    const enrichedTypes = types.map(mt => ({
      ...mt,
      menus: menus?.find(m => m.id === mt.menu_id) || null
    }));
    return { ...dm, menu_types: enrichedTypes };
  });
}

export async function createDailyMenu(data, menuTypes, userId) {
  const dailyMenu = await opsRepo.createDailyMenu({
    date: data.date,
    meal_type: data.meal_type,
    with_rice: data.with_rice,
    created_by: userId
  });
  
  if (menuTypes && menuTypes.length > 0) {
    const typesToInsert = menuTypes.map(mt => ({
      daily_menus_id: dailyMenu.id,
      menu_id: mt.menu_id,
      is_main: mt.is_main || false,
      created_by: userId
    }));
    await opsRepo.createMenuTypes(typesToInsert);
  }
  
  return dailyMenu;
}

export async function updateDailyMenu(id, data, menuTypes, userId) {
  const dailyMenu = await opsRepo.updateDailyMenu(id, {
    date: data.date,
    meal_type: data.meal_type,
    with_rice: data.with_rice,
    updated_by: userId,
    updated_at: new Date().toISOString()
  });
  
  if (menuTypes) {
    // Clear existing menu types for this daily menu
    await opsRepo.deleteMenuTypesByDailyMenuId(id);
    
    if (menuTypes.length > 0) {
      const typesToInsert = menuTypes.map(mt => ({
        daily_menus_id: id,
        menu_id: mt.menu_id,
        is_main: mt.is_main || false,
        created_by: userId
      }));
      await opsRepo.createMenuTypes(typesToInsert);
    }
  }
  
  return dailyMenu;
}

export async function deleteDailyMenu(id) {
  await opsRepo.deleteMenuTypesByDailyMenuId(id);
  await opsRepo.deleteDailyMenu(id);
}

// ==========================================
// AUTO-GENERATE ORDERS
// ==========================================

export async function autoGenerateOrders(inputDate, userId, authorizationHeader, host, protocol) {
  // Get Bangkok date string (YYYY-MM-DD)
  const getBkkDate = () => {
    const d = new Date();
    const bkkStr = d.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    const bkkDate = new Date(bkkStr);
    const yyyy = bkkDate.getFullYear();
    const mm = String(bkkDate.getMonth() + 1).padStart(2, '0');
    const dd = String(bkkDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const targetDate = inputDate || getBkkDate();

  // 0. Sunday Block (BBD doesn't deliver on Sundays)
  const dObj = new Date(targetDate);
  if (dObj.getDay() === 0) {
    return { success: true, generatedCount: 0, message: 'BBD does not deliver on Sundays.' };
  }

  // 1. Fetch active customer packages overlapping target date via CRM boundary
  let activePackages = [];
  try {
    activePackages = await crmModule.getActivePackagesForDate(targetDate);
  } catch (pkgErr) {
    throw pkgErr;
  }

  if (!activePackages || activePackages.length === 0) {
    return { success: true, generatedCount: 0, message: 'No active customer packages found in database.' };
  }

  // Auto-activate any Upcoming packages that have reached their start date
  const upcomingToActivate = activePackages.filter(p => p.status === 'Upcoming' || p.status === 'UPCOMING');
  if (upcomingToActivate.length > 0) {
    const upcomingIds = upcomingToActivate.map(p => p.id);
    try {
      await supabaseAdmin.schema('crm').from('customer_packages')
        .update({ status: 'Active' })
        .in('id', upcomingIds);
      
      activePackages = activePackages.map(p => 
        upcomingIds.includes(p.id) ? { ...p, status: 'Active' } : p
      );
    } catch (actErr) {
      console.error('[OPS_AUTO_ACTIVATE_ERROR]', actErr.message);
    }
  }

  // Extract needed meal types from active packages
  const neededMealTypes = new Set();
  activePackages.forEach(pkg => {
    const pkgMeals = (pkg.meal_type || 'LUNCH, DINNER').toUpperCase();
    if (pkgMeals.includes('BREAKFAST')) neededMealTypes.add('Breakfast');
    if (pkgMeals.includes('LUNCH')) neededMealTypes.add('Lunch');
    if (pkgMeals.includes('DINNER')) neededMealTypes.add('Dinner');
  });

  // 2. Fetch planned menus for target date (STRICT MODE)
  // Daily Menus must be explicitly planned or synced from Monthly Plan before generating orders.
  // Auto-creating menus from catalog is not allowed — it leads to incorrect default menus (e.g. same dish every day).
  const dailyMenus = await opsRepo.getDailyMenusByDate(targetDate);

  if (!dailyMenus || dailyMenus.length === 0) {
    const err = new Error(
      `No daily menus planned for ${targetDate}. Please sync from Monthly Plan or manually plan the daily menus for this date before generating orders.`
    );
    err.status = 400;
    throw err;
  }

  // 3. Fetch existing orders to prevent duplicates
  const existingOrders = await opsRepo.getOrdersSummaryByDate(targetDate);
  const existingSet = new Set(existingOrders?.map(o => `${o.customer_id}-${o.daily_menu_id}`) || []);

  const newOrders = [];

  // 4. Match packages to daily menus
  for (const pkg of activePackages) {
    const pkgMeals = (pkg.meal_type || 'LUNCH, DINNER').toUpperCase(); // Default to LUNCH, DINNER if unspecified
    
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
            created_by: userId
          });
          existingSet.add(comboKey); // Prevent exact duplicates
          fulfilledMealTypes.add(menuType); // Mark this meal type as fulfilled!
        }
      }
    }
  }

  // 5. Bulk Insert
  if (newOrders.length > 0) {
    await opsRepo.bulkInsertOrders(newOrders);
    
    // AUTO TRIGGER TELEGRAM CHEF ALERT
    try {
      const { checkAndSendKitchenAlert } = await import('../../../cron/kitchen_alerts.js');
      await checkAndSendKitchenAlert(targetDate);
    } catch (tgErr) {
      console.error('[AUTO GENERATE -> CHEF ALERT ERROR]', tgErr);
      // We don't throw tgErr here because order generation succeeded and we don't want to 500 the whole request
      // just because Telegram/Messenger alerts failed.
    }
  }

  return { success: true, generatedCount: newOrders.length };
}

// ==========================================
// SMART SYNC: Monthly Plan → Daily Menus
// ==========================================

/**
 * Syncs a date range from operations_menu_plans into operations_daily_menus.
 * Matches plan dish names against the operations_menus catalog (case-insensitive).
 * Skips dates that already have daily menus planned.
 * Returns a summary: { synced, skipped, noMatchDishes }
 */
export async function syncMonthlyPlanToDailyMenus(startDate, endDate, userId) {
  // 1. Fetch all menu plans in the date range
  const plans = await opsRepo.getMenuPlansByDateRange(startDate, endDate);
  if (!plans || plans.length === 0) {
    return { synced: 0, skipped: 0, noMatchDishes: [], message: 'No monthly plan entries found for this date range.' };
  }

  // 2. Fetch the full menu catalog for name matching
  const catalog = await opsRepo.getAllMenus();
  if (!catalog || catalog.length === 0) {
    const err = new Error('Menu catalog is empty. Please import menus first via Costing Import.');
    err.status = 400;
    throw err;
  }

  // Build a normalized lookup map: lowercase name → menu object
  const catalogMap = new Map();
  for (const m of catalog) {
    if (m.name_en) catalogMap.set(m.name_en.toLowerCase().trim(), m);
    if (m.name_mm) catalogMap.set(m.name_mm.toLowerCase().trim(), m);
  }

  let synced = 0;
  let skipped = 0;
  const noMatchDishes = [];

  for (const plan of plans) {
    const planDate = plan.date;

    // 3. Skip dates that already have daily menus planned
    const existing = await opsRepo.getDailyMenusByDate(planDate);
    if (existing && existing.length > 0) {
      skipped++;
      continue;
    }

    // 4. Determine with_rice from plan
    const withRice = plan.has_rice !== 'NO RICE';

    // 5. Collect all dish names from this plan row
    const dishFields = ['main_dish_1', 'main_dish_2', 'side_dish_1', 'side_dish_2', 'soup', 'dessert'];
    const dishNames = dishFields
      .map(f => (plan[f] || '').trim())
      .filter(n => n.length > 0);

    // 6. Match dish names to catalog entries
    const matchedMenuIds = [];
    for (const dish of dishNames) {
      const match = catalogMap.get(dish.toLowerCase());
      if (match) {
        if (!matchedMenuIds.includes(match.id)) {
          matchedMenuIds.push(match.id);
        }
      } else {
        // Record unmatched dish for reporting, but only once
        if (!noMatchDishes.find(d => d.dish === dish)) {
          noMatchDishes.push({ date: planDate, dish });
        }
      }
    }

    // 7. Create daily menus for LUNCH and DINNER for this date
    // BBD serves both Lunch and Dinner by default
    const mealTypes = ['Lunch', 'Dinner'];
    for (const mealType of mealTypes) {
      const dailyMenu = await opsRepo.createDailyMenu({
        date: planDate,
        meal_type: mealType,
        with_rice: withRice,
        created_by: userId
      });

      // 8. Link matched catalog menus to this daily menu
      if (matchedMenuIds.length > 0) {
        const menuTypes = matchedMenuIds.map((menuId, idx) => ({
          daily_menus_id: dailyMenu.id,
          menu_id: menuId,
          is_main: idx === 0, // First item is main dish
          created_by: userId
        }));
        await opsRepo.createMenuTypes(menuTypes);
      }
    }

    synced++;
  }

  return { synced, skipped, noMatchDishes };
}

// ==========================================
// RIDER ASSIGNMENT
// ==========================================

export async function assignRiderToOrder(orderId, riderId) {
  const existing = await opsRepo.getRiderAssignmentByOrderId(orderId);

  if (existing) {
    await opsRepo.updateRiderAssignment(orderId, {
      rider_id: riderId || null,
      status: riderId ? 'ASSIGNED' : null,
      updated_at: new Date().toISOString()
    });
  } else if (riderId) {
    await opsRepo.insertRiderAssignment({
      order_id: orderId,
      rider_id: riderId,
      status: 'ASSIGNED'
    });
  }

  // Phase 3: Trigger LINE Notification
  if (riderId) {
    try {
      const orders = await opsRepo.getOrdersByIds([orderId]);
      if (orders && orders.length > 0) {
        const order = orders[0];
        const customers = await crmModule.getCustomerDeliveryInfo([order.customer_id]);
        const customer = customers && customers.length > 0 ? customers[0] : null;

        const orderData = {
          orderId: order.id,
          customerName: customer ? customer.full_name : 'Unknown',
          deliveryAddress: order.custom_delivery_address || (customer ? (customer.delivery_address || customer.address) : 'Not specified'),
          phone: customer ? customer.phone : 'Not specified'
        };

        // Fire and forget LINE Notification
        sendOrderAssignmentToLine(riderId, orderData).catch(err => {
          console.error('[LINE_NOTIFY_ERROR_IN_OPS]', err);
        });

        // Fire and forget Telegram Notification
        sendOrderAssignmentToTelegram(riderId, orderData).catch(err => {
          console.error('[TELEGRAM_NOTIFY_ERROR_IN_OPS]', err);
        });
      }
    } catch (notifyErr) {
      console.error('[OPS_ASSIGN_RIDER_NOTIFY_ERROR]', notifyErr);
    }
  }

  return { success: true };
}

// ==========================================
// POD PHOTO UPLOAD
// ==========================================

export async function uploadPodPhoto(imageStr) {
  if (!imageStr || typeof imageStr !== 'string') {
    const err = new Error('Image data is required');
    err.status = 400;
    throw err;
  }

  const match = imageStr.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    const err = new Error('Invalid image format. Expected base64 data URL.');
    err.status = 400;
    throw err;
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

    if (uploadErr) {
      throw new Error(`Storage upload failed: ${uploadErr.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(`proof_of_delivery/${filename}`);
    if (publicUrlData?.publicUrl) {
      return { success: true, url: publicUrlData.publicUrl };
    } else {
      throw new Error('Failed to retrieve public URL from storage.');
    }
  } catch (e) {
    console.error('[POD_PHOTO_STORAGE_ERROR]', e.message);
    const err = new Error('Failed to upload proof of delivery photo to storage: ' + e.message);
    err.status = 500;
    throw err;
  }
}

// ==========================================
// ZERNIO NOTIFICATIONS (Legacy Extraction)
// ==========================================

const lastSentZernioMap = new Map();

export async function sendDeliveryZernioMessage(customerId, orderId, type = 'DELIVERED', proofUrl = null) {
  try {
    // Deduplicate notifications within 10s per customer per type
    const dedupKey = `${customerId}_${type}`;
    const nowTs = Date.now();
    if (lastSentZernioMap.has(dedupKey) && (nowTs - lastSentZernioMap.get(dedupKey) < 5000)) {
      console.log(`[ZERNIO] Skipping duplicate ${type} message for customer ${customerId}`);
      return;
    }

    const customer = await crmModule.getCustomerDeliveryInfo([customerId]);
    if (!customer || customer.length === 0) return;
    const custData = customer[0];

    const inquiryIds = await crmModule.findInquiriesByName(customerId, custData.facebook_name);
    if (!inquiryIds || inquiryIds.length === 0) return;

    

    let conversationId = custData.zernio_conversation_id || custData.conversation_id || null;

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
    const zernioUrl = `https://hub.zernio.com/api/bot/${process.env.ZERNIO_BOT_ID || '6a4cd5599d9472faaea1c251'}/message`;
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

// ==========================================
// RIDER STATUS
// ==========================================

export async function updateRiderStatus(id, status, proofUrl, userId) {
  const now = new Date().toISOString();

  const assignmentUpdate = { status, updated_at: now };
  if (status === 'ON_THE_WAY') assignmentUpdate.picked_up_at = now;

  await opsRepo.updateRiderAssignmentWithFallback(id, assignmentUpdate);

  let delivery_status = 'PENDING';
  if (status === 'ON_THE_WAY') delivery_status = 'ON_THE_WAY';
  else if (status === 'DELIVERED') delivery_status = 'DELIVERED';

  const orderUpdate = { delivery_status, updated_by: userId, updated_at: now };
  if (status === 'DELIVERED') {
    orderUpdate.delivered_at = now;
  }
  
  await opsRepo.updateOrderDeliveryStatus(id, orderUpdate);

  const order = await opsRepo.getOrderCustomerId(id);
  
  if (proofUrl && order?.customer_id) {
    try {
      await crmModule.updateDeliveryProof(order.customer_id, proofUrl);
    } catch (e) {
      console.warn('[UPDATE_CUST_DELIVERY_PROOF_WARN]', e.message);
    }
  }

  emitOrderStatusUpdate(id, delivery_status, userId);

  if (status === 'ON_THE_WAY' || status === 'DELIVERED') {
    if (order?.customer_id) {
      sendDeliveryZernioMessage(order.customer_id, id, status, proofUrl).catch(e => console.error('[Rider Status Zernio]', e));
    }
  }
  
  return { success: true };
}

// ==========================================
// IMPORT COSTING
// ==========================================

export async function importCostingExcel(buffer) {
  const wb = xlsx.read(buffer, { type: 'buffer' });
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
    const existingMenu = await opsRepo.getMenuIdByNameEnAdmin(menu.name_en);
    let menuId;
    if (existingMenu && existingMenu.length > 0) {
      menuId = existingMenu[0].id;
      await opsRepo.updateMenuAdmin(menuId, {
        code: menu.code,
        name_mm: menu.name_mm,
        sales_prices: menu.sales_prices,
        updated_at: new Date().toISOString()
      });
    } else {
      const newMenu = await opsRepo.insertMenuAdmin({
        code: menu.code,
        name_en: menu.name_en,
        name_mm: menu.name_mm,
        sales_prices: menu.sales_prices
      });
      menuId = newMenu[0].id;
      menusCreated++;
    }

    // Clear existing recipes for this menu so we don't duplicate
    await opsRepo.deleteRecipesByMenuIdAdmin(menuId);

    // 2. Insert/Update Ingredients & Recipes
    for (const ing of menu.ingredients) {
      const { id: itemId, created } = await inventoryModule.getOrCreateItemForCosting(ing.name, ing.uom);
      if (created) itemsCreated++;

      // Add Recipe
      await opsRepo.insertRecipeAdmin({
        menu_id: menuId,
        inventory_item_id: itemId,
        quantity: ing.qty,
        unit_of_measure: ing.uom
      });
      recipesCreated++;
    }
  }

  return { success: true, menusCreated, itemsCreated, recipesCreated, parsedMenusCount: parsedMenus.length };
}

// ==========================================
// BOM RECALCULATION
// ==========================================

export async function recalculateAllBom() {
  const recipes = await opsRepo.getAllRecipes();
  
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
    await opsRepo.bulkUpdateMenuBom(bom, ids);
  }
  
  return { success: true, updated: menuBom.size };
}

// ==========================================
// ORDER STATUS
// ==========================================

export async function updateOrderStatus(orderId, deliveryStatus, userId) {
  const now = new Date().toISOString();
  
  const updateData = {
    delivery_status: deliveryStatus,
    updated_by: userId,
    updated_at: now
  };
  
  if (deliveryStatus === 'DELIVERED') {
    updateData.delivered_at = now;
  }
  
  const result = await opsRepo.updateOrderAndReturn(orderId, updateData);
  
  if (deliveryStatus === 'DELIVERED' && result) {
    const orderDetails = await opsRepo.getOrderBOMDetails(orderId);
      
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
      
      await inventoryModule.deductStockForBOM(deductions, orderId, userId);
    }
    
    // TRIGGER ZERNIO DELIVERY ALERT FOR SINGLE ORDER
    if (result && result.customer_id) {
      await sendDeliveryZernioMessage(result.customer_id, result.id, 'DELIVERED');
    }
  } else if (deliveryStatus === 'ON_THE_WAY' && result && result.customer_id) {
    await sendDeliveryZernioMessage(result.customer_id, result.id, 'ON_THE_WAY');
  }
  
  return result;
}
