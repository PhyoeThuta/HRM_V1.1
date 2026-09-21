import { supabase, supabaseAdmin } from '../../../lib/supabase.js';

// ==========================================
// ITEMS
// ==========================================
export async function getItems(options = {}) {
  let q = supabase.from('inventory_items').select('*');
  if (options.order) q = q.order(options.order, { ascending: options.ascending ?? false });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getItemsBasicInfo() {
  const { data, error } = await supabase.from('inventory_items').select('id, name_eng, unit_of_measure, item_code');
  if (error) throw error;
  return data || [];
}

export async function getItemByName(name, useAdmin = false) {
  const client = useAdmin ? supabaseAdmin : supabase;
  const { data, error } = await client.from('inventory_items').select('id').eq('name_eng', name).limit(1);
  if (error) throw error;
  return data?.[0] || null;
}

export async function createItem(data, useAdmin = false) {
  const client = useAdmin ? supabaseAdmin : supabase;
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ''));
  const { data: result, error } = await client.from('inventory_items').insert(clean).select();
  if (error) throw error;
  return result?.[0] || null;
}

export async function updateItem(id, data) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
  const { data: result, error } = await supabase.from('inventory_items').update(clean).eq('id', id).select();
  if (error) throw error;
  return result?.[0] || null;
}

export async function deleteItem(id) {
  const { error } = await supabase.from('inventory_items').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// ==========================================
// BALANCES
// ==========================================
export async function getBalances() {
  const { data, error } = await supabase.from('inventory_balances').select('*');
  if (error) throw error;
  return data || [];
}

export async function getBalancesCosts() {
  const { data, error } = await supabase.from('inventory_balances').select('item_id, one_unit_cost');
  if (error) throw error;
  return data || [];
}

export async function getBalanceByItemId(itemId) {
  const { data, error } = await supabase.from('inventory_balances').select('*').eq('item_id', itemId).maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function createBalance(data) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ''));
  const { data: result, error } = await supabase.from('inventory_balances').insert(clean).select();
  if (error) throw error;
  return result?.[0] || null;
}

export async function updateBalance(id, data) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
  const { data: result, error } = await supabase.from('inventory_balances').update(clean).eq('id', id).select();
  if (error) throw error;
  return result?.[0] || null;
}

// ==========================================
// TRANSACTIONS
// ==========================================
export async function getTransactions(options = {}) {
  let q = supabase.from('inventory_transactions').select('*');
  if (options.order) q = q.order(options.order, { ascending: options.ascending ?? false });
  if (options.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function createTransaction(data) {
  const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ''));
  const { data: result, error } = await supabase.from('inventory_transactions').insert(clean).select();
  if (error) throw error;
  return result?.[0] || null;
}
