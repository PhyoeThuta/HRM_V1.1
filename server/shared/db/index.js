import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/^["']|["']$/g, '');
const supabaseKey = process.env.SUPABASE_KEY?.trim().replace(/^["']|["']$/g, '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY?.trim().replace(/^["']|["']$/g, '');

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
    
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error(`[DB FETCH] ${table}:`, e.message);
    throw e;
  }
}

export async function dbFetchOne(table, columns = '*', filters = {}) {
  const rows = await dbFetch(table, columns, filters, { limit: 1 });
  return rows[0] || null;
}

export async function dbInsert(table, data) {
  if (table === 'sys_audit_logs') {
    const { auditContext } = await import('../../middleware/auditContext.js');
    const { parseUserAgent } = await import('../../utils/uaParser.js');
    const { resolveIp } = await import('../../utils/ipResolver.js');
    const req = auditContext.getStore();
    
    if (req) {
      const uaString = req.headers['user-agent'] || '';
      const { os, browser, device } = parseUserAgent(uaString);
      const realIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || req.ip || '0.0.0.0';
      const user = req.user || {};
      const location = resolveIp(realIp);
      
      const meta = {
        user_name: user.full_name || user.email || 'System',
        user_role: user.role || 'Unknown',
        device_type: device,
        os: os,
        browser: browser,
        user_agent: uaString,
        ip_address: realIp,
        location: location
      };
      
      // Merge with existing details
      data.details = `${data.details} ||| ${JSON.stringify(meta)}`;
      data.ip_address = realIp; // Overwrite if it was '0.0.0.0'
      // Use real authenticated ID
      if (user.id && (!data.user_id || data.user_id === '00000000-0000-0000-0000-000000000000')) {
        data.user_id = user.id;
      }
    }
  }

  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );
  const { data: result, error } = await supabase.from(table).insert(clean).select();
  if (error) {
    console.error(`[DB INSERT] ${table}:`, error.message);
    throw error;
  }
  return result?.[0] || null;
}

export async function dbUpdate(table, id, data, idCol = 'id') {
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  const { error } = await supabase.from(table).update(clean).eq(idCol, id);
  if (error) {
    console.error(`[DB UPDATE] ${table}:`, error.message);
    throw error;
  }
  return true;
}

export async function dbDelete(table, id, idCol = 'id') {
  const { error } = await supabase.from(table).delete().eq(idCol, id);
  if (error) {
    console.error(`[DB DELETE] ${table}:`, error.message);
    throw error;
  }
  return true;
}
