import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[SUPABASE] Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

// Anon client (existing HRM system)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: WebSocket },
});

// Service role admin client (CRM — bypasses RLS for backend operations)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { transport: WebSocket }
    })
  : supabase; // fallback to anon if key missing

if (!supabaseServiceKey) {
  console.warn(
    '[SUPABASE] SUPABASE_SERVICE_KEY is missing — CRM routes will fail with "permission denied" on crm.* tables. Add the service_role key from Supabase → Project Settings → API.'
  );
}

export function isSupabaseServiceRoleConfigured() {
  return !!supabaseServiceKey;
}

// ── DB helpers ────────────────────────────────────────────────
export async function dbFetch(table, columns = '*', filters = {}, options = {}) {
  try {
    let q = supabase.from(table).select(columns);
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
    console.error(`[DB FETCH] ${table}:`, e.message);
    return [];
  }
}

export async function dbFetchOne(table, columns = '*', filters = {}) {
  const rows = await dbFetch(table, columns, filters, { limit: 1 });
  return rows[0] || null;
}

export async function dbInsert(table, data) {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
    );
    const { data: result, error } = await supabase.from(table).insert(clean).select();
    if (error) throw error;
    return result?.[0] || null;
  } catch (e) {
    console.error(`[DB INSERT] ${table}:`, e.message);
    return null;
  }
}

export async function dbUpdate(table, id, data, idCol = 'id') {
  try {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    const { error } = await supabase.from(table).update(clean).eq(idCol, id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`[DB UPDATE] ${table}:`, e.message);
    return false;
  }
}

export async function dbDelete(table, id, idCol = 'id') {
  try {
    const { error } = await supabase.from(table).delete().eq(idCol, id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error(`[DB DELETE] ${table}:`, e.message);
    return false;
  }
}
