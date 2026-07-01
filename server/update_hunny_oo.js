import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  const { data, error } = await supabase.from('sys_users').update({ role: 'manager' }).eq('username', 'cnx-0028');
  console.log('Update Mrs. Hunny Oo role:', { data, error });
}
main();
