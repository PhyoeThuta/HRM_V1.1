import * as opsRepo from '../repository/index.js';
import { inventoryModule } from '../../inventory/index.js';
import { supabaseAdmin } from '../../../lib/supabase.js';

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
