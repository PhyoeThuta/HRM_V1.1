import { supabaseAdmin } from './lib/supabase.js';

async function check() {
  const p = await supabaseAdmin.from('positions').select('*').limit(1);
  const r = await supabaseAdmin.from('recruitment_candidates').select('*').limit(1);
  console.log("Positions columns:", Object.keys(p.data?.[0] || {}));
  console.log("Recruitment columns:", Object.keys(r.data?.[0] || {}));
}

check();
