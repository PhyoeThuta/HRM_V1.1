import { supabase, supabaseAdmin } from '../../../lib/supabase.js';

// ==========================================
// MENUS
// ==========================================

export async function getAllMenus() {
  const { data, error } = await supabase.from('operations_menus').select('*').order('name_en', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createMenu(data) {
  const { data: result, error } = await supabase.from('operations_menus').insert(data).select().single();
  if (error) throw error;
  return result;
}

export async function updateMenu(id, data) {
  const { data: result, error } = await supabase.from('operations_menus').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result;
}

export async function deleteMenu(id) {
  const { error } = await supabase.from('operations_menus').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// RECIPES
// ==========================================

export async function getAllRecipes() {
  const { data, error } = await supabase.from('operations_recipes').select('*');
  if (error) throw error;
  return data;
}

export async function createRecipe(data) {
  const { data: result, error } = await supabase.from('operations_recipes').insert(data).select().single();
  if (error) throw error;
  return result;
}

export async function deleteRecipe(id) {
  const { error } = await supabase.from('operations_recipes').delete().eq('id', id);
  if (error) throw error;
}

// ==========================================
// MENU PLANS
// ==========================================

export async function getAllMenuPlans() {
  const { data, error } = await supabaseAdmin.from('operations_menu_plans').select('*').order('date', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertMenuPlan(data) {
  const { data: result, error } = await supabaseAdmin.from('operations_menu_plans').upsert(data, { onConflict: 'date' });
  if (error) throw error;
  return result;
}

// ==========================================
// SKIP DAYS
// ==========================================

export async function getAllSkipDays() {
  const { data, error } = await supabase.from('operations_skip_days').select('*');
  if (error) throw error;
  return data;
}

export async function createSkipDay(data) {
  const { data: result, error } = await supabase.from('operations_skip_days').insert(data).select().single();
  if (error) throw error;
  return result;
}

// ==========================================
// ORDERS (Basic CRUD)
// ==========================================

export async function createOrder(data) {
  const { data: result, error } = await supabase.from('operations_orders').insert(data).select().single();
  if (error) throw error;
  return result;
}

export async function updateOrderCustomAddress(id, data) {
  // Uses supabaseAdmin as per legacy route behavior
  const { data: result, error } = await supabaseAdmin.from('operations_orders').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result;
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('operations_orders').delete().eq('id', id);
  if (error) throw error;
}

export async function getAllOrders() {
  const { data, error } = await supabase.from('operations_orders').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getOrdersByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase.from('operations_orders').select('*').in('id', ids).order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getRiderAssignmentsByRiderId(riderId) {
  const { data, error } = await supabase.from('operations_rider_assignments').select('order_id, status, picked_up_at').eq('rider_id', riderId);
  if (error) throw error;
  return data || [];
}

export async function getRiderAssignmentsByOrderIds(orderIds) {
  if (!orderIds || orderIds.length === 0) return [];
  const { data, error } = await supabase.from('operations_rider_assignments').select('order_id, rider_id, status').in('order_id', orderIds);
  if (error) throw error;
  return data || [];
}

export async function getAllDailyMenusWithoutLimit() {
  const { data, error } = await supabase.from('operations_daily_menus').select('*');
  if (error) throw error;
  return data || [];
}

// ==========================================
// DAILY MENUS & MENU TYPES
// ==========================================

export async function getRecentDailyMenus() {
  const { data, error } = await supabase
    .from('operations_daily_menus')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data;
}

export async function getAllMenuTypes() {
  const { data, error } = await supabase.from('operations_menu_types').select('*');
  if (error) throw error;
  return data;
}

export async function createDailyMenu(data) {
  const { data: result, error } = await supabase.from('operations_daily_menus').insert(data).select().single();
  if (error) throw error;
  return result;
}

export async function updateDailyMenu(id, data) {
  const { data: result, error } = await supabase.from('operations_daily_menus').update(data).eq('id', id).select().single();
  if (error) throw error;
  return result;
}

export async function deleteDailyMenu(id) {
  const { error } = await supabase.from('operations_daily_menus').delete().eq('id', id);
  if (error) throw error;
}

export async function createMenuTypes(typesToInsert) {
  const { error } = await supabase.from('operations_menu_types').insert(typesToInsert);
  if (error) throw error;
}

export async function deleteMenuTypesByDailyMenuId(dailyMenuId) {
  const { error } = await supabase.from('operations_menu_types').delete().eq('daily_menus_id', dailyMenuId);
  if (error) throw error;
}

// ==========================================
// AUTO-GENERATE ORDERS SPECIFIC
// ==========================================

export async function getDailyMenusByDate(date) {
  const { data, error } = await supabase.from('operations_daily_menus').select('*').eq('date', date);
  if (error) throw error;
  return data || [];
}

export async function getMenuPlansByDate(date) {
  const { data, error } = await supabase.from('operations_menu_plans').select('*').eq('date', date);
  if (error) throw error;
  return data || [];
}

export async function getCatalogMenusLimitTwo() {
  const { data, error } = await supabase.from('operations_menus').select('id').limit(2);
  if (error) throw error;
  return data || [];
}

export async function createDailyMenusBulk(menus) {
  const { data, error } = await supabase.from('operations_daily_menus').insert(menus).select();
  if (error) throw error;
  return data || [];
}

export async function getOrdersSummaryByDate(date) {
  const { data, error } = await supabase.from('operations_orders').select('customer_id, daily_menu_id').eq('date', date);
  if (error) throw error;
  return data || [];
}

export async function bulkInsertOrders(orders) {
  const { error } = await supabase.from('operations_orders').insert(orders);
  if (error) throw error;
}

// ==========================================
// RIDER ASSIGNMENT
// ==========================================

export async function getRiderAssignmentByOrderId(orderId) {
  const { data, error } = await supabase
    .from('operations_rider_assignments')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateRiderAssignment(orderId, updateData) {
  const { error } = await supabase
    .from('operations_rider_assignments')
    .update(updateData)
    .eq('order_id', orderId);
  if (error) throw error;
}

export async function insertRiderAssignment(insertData) {
  const { error } = await supabase
    .from('operations_rider_assignments')
    .insert(insertData);
  if (error) throw error;
}

// ==========================================
// ORDER STATUS & BOM
// ==========================================

export async function updateOrderAndReturn(id, updateData) {
  const clean = Object.fromEntries(
    Object.entries(updateData).filter(([, v]) => v !== undefined)
  );
  const { data: result, error } = await supabase.from('operations_orders').update(clean).eq('id', id).select();
  if (error) {
    console.error(`[OPS UPDATE] orders:`, error.message);
    throw error;
  }
  return result?.[0] || null;
}

export async function getOrderBOMDetails(id) {
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
  return orderDetails;
}

// ==========================================
// RIDER STATUS METHODS
// ==========================================

export async function updateRiderAssignmentWithFallback(orderId, assignmentUpdate) {
  try {
    const { error } = await supabaseAdmin
      .from('operations_rider_assignments')
      .update(assignmentUpdate)
      .eq('order_id', orderId);
    if (error) throw error;
  } catch (err) {
    if (assignmentUpdate.proof_of_delivery_url) {
      delete assignmentUpdate.proof_of_delivery_url;
      const { error } = await supabaseAdmin
        .from('operations_rider_assignments')
        .update(assignmentUpdate)
        .eq('order_id', orderId);
      if (error) throw error;
    } else {
      throw err;
    }
  }
}

export async function updateOrderDeliveryStatus(orderId, orderUpdate) {
  try {
    const { error } = await supabaseAdmin
      .from('operations_orders')
      .update(orderUpdate)
      .eq('id', orderId);
    if (error) throw error;
  } catch (err) {
    if (orderUpdate.proof_of_delivery_url) {
      delete orderUpdate.proof_of_delivery_url;
      const { error } = await supabaseAdmin
        .from('operations_orders')
        .update(orderUpdate)
        .eq('id', orderId);
      if (error) throw error;
    } else {
      throw err;
    }
  }
}

export async function getOrderCustomerId(orderId) {
  const { data, error } = await supabaseAdmin
    .from('operations_orders')
    .select('customer_id')
    .eq('id', orderId)
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// IMPORT COSTING METHODS
// ==========================================

export async function getMenuIdByNameEnAdmin(nameEn) {
  const { data } = await supabaseAdmin
    .from('operations_menus')
    .select('id')
    .eq('name_en', nameEn)
    .limit(1);
  return data;
}

export async function updateMenuAdmin(id, menuData) {
  await supabaseAdmin
    .from('operations_menus')
    .update(menuData)
    .eq('id', id);
}

export async function insertMenuAdmin(menuData) {
  const { data } = await supabaseAdmin
    .from('operations_menus')
    .insert(menuData)
    .select('id');
  return data;
}

export async function deleteRecipesByMenuIdAdmin(menuId) {
  await supabaseAdmin
    .from('operations_recipes')
    .delete()
    .eq('menu_id', menuId);
}

export async function insertRecipeAdmin(recipeData) {
  await supabaseAdmin
    .from('operations_recipes')
    .insert(recipeData);
}

// ==========================================
// BOM RECALCULATION
// ==========================================

export async function bulkUpdateMenuBom(bomValue, menuIds) {
  const { error } = await supabase.from('operations_menus')
    .update({ total_bill_of_materials: parseFloat(bomValue) })
    .in('id', menuIds);
  if (error) throw error;
}
