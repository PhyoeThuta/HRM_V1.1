const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: 'c:/Users/Phyoe/Desktop/hrm_react/server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase
    .from('operations_orders')
    .update({ delivery_status: 'PENDING' })
    .eq('date', '2026-09-02');
    
  if (error) console.error(error);
  else console.log('Successfully reset all orders to PENDING for testing!');
}

run();
