import { supabaseAdmin } from './lib/supabase.js';

async function test() {
  try {
    console.log('Testing packages...');
    const { data, error } = await supabaseAdmin.schema('crm').from('packages').select('*');
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Success! Data:', data);
    }
  } catch (e) {
    console.error('Catch Error:', e);
  }
}

test();
