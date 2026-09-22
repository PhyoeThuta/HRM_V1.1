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
