import { supabaseAdmin } from '../lib/supabase.js';

async function test() {
  const { data, error } = await supabaseAdmin.from('sys_audit_logs').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    action: 'TEST',
    module: 'TEST',
    details: 'TEST',
    user_name: 'test',
    user_role: 'test',
    device_type: 'test',
    os: 'test',
    browser: 'test',
    user_agent: 'test'
  }).select();
  console.log(data, error);
}

test();
