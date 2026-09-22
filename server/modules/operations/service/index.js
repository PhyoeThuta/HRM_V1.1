import * as opsRepo from '../repository/index.js';
import { inventoryModule } from '../../inventory/index.js';
import { supabase, supabaseAdmin } from '../../../lib/supabase.js';

// ==========================================
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
      const { data: customers, error: cErr } = await supabaseAdmin.schema('crm').from('customers')
        .select('id, full_name, phone, delivery_address, delivery_notes, delivery_spot_photo_url')
        .in('id', customerIds);
      if (cErr) throw cErr;
      if (customers) customersMap = Object.fromEntries(customers.map(c => [c.id, c]));
    } catch (e) {
      const { data: customers } = await supabaseAdmin.schema('crm').from('customers')
        .select('id, full_name, phone, delivery_address, delivery_notes')
        .in('id', customerIds);
      if (customers) customersMap = Object.fromEntries(customers.map(c => [c.id, c]));
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

  // 1. Fetch planned menus for target date
  let dailyMenus = await opsRepo.getDailyMenusByDate(targetDate);

  // Fallback: If no daily menus scheduled for target date, check menu plans or catalog and auto-create
  if (!dailyMenus || dailyMenus.length === 0) {
    const menuPlans = await opsRepo.getMenuPlansByDate(targetDate);

    const catMenus = await opsRepo.getCatalogMenusLimitTwo();

    if (catMenus && catMenus.length > 0) {
      // Auto-create Lunch and Dinner daily menus for targetDate
      const newDailyMenus = [
        { date: targetDate, meal_type: 'Lunch', with_rice: true, created_by: userId },
        { date: targetDate, meal_type: 'Dinner', with_rice: true, created_by: userId }
      ];
      
      const createdMenus = await opsRepo.createDailyMenusBulk(newDailyMenus);
      
      if (createdMenus && createdMenus.length > 0) {
        dailyMenus = createdMenus;
        // Link first catalog menu
        for (const cm of createdMenus) {
          await opsRepo.createMenuTypes([{
            daily_menus_id: cm.id,
            menu_id: catMenus[0].id,
            is_main: true,
            created_by: userId
          }]);
        }
      }
    }
  }

  if (!dailyMenus || dailyMenus.length === 0) {
    const err = new Error('No daily menus planned for date ' + targetDate);
    err.status = 400;
    throw err;
  }

  // 2. Fetch active customer packages overlapping target date
  const { data: packages, error: pkgErr } = await supabaseAdmin
    .schema('crm')
    .from('customer_packages')
    .select('*')
    .or(`status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid`)
    .gte('expires_at', targetDate);
    
  if (pkgErr) throw pkgErr;

  // Fallback: If no packages match exact dates, fetch all Active packages regardless of start/expire bounds for demo/testing
  let activePackages = packages;
  if (!activePackages || activePackages.length === 0) {
    const { data: fallbackPkgs } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('*');
    activePackages = fallbackPkgs || [];
  }

  if (!activePackages || activePackages.length === 0) {
    return { success: true, generatedCount: 0, message: 'No active customer packages found in database.' };
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
      const fetch = (await import('node-fetch')).default || globalThis.fetch;
      
      // We need to fetch the Kitchen Dashboard data to get the BOM for the chef
      const dashRes = await fetch(`${protocol}://${host}/api/crm/kitchen-dashboard?date=${targetDate}`, {
        headers: { 'Authorization': authorizationHeader } // pass token
      });
      const dashData = await dashRes.json();
      
      if (dashData && dashData.dailyMenus) {
        // Send to Chef Telegram
        await fetch(`${protocol}://${host}/api/telegram/send-to-chef`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authorizationHeader 
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
      throw tgErr;
    }
  }

  return { success: true, generatedCount: newOrders.length };
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

    if (!uploadErr) {
      const { data: publicUrlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(`proof_of_delivery/${filename}`);
      if (publicUrlData?.publicUrl) {
        return { success: true, url: publicUrlData.publicUrl };
      }
    }
  } catch (e) {
    console.warn('[POD_PHOTO_STORAGE_WARN]', e.message);
  }

  // Fallback to original image if storage fails (mirrors legacy behavior)
  return { success: true, url: imageStr };
}
