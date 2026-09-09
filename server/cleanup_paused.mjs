import dotenv from 'dotenv';
dotenv.config();
import { supabaseAdmin } from './lib/supabase.js';

async function cleanup() {
  const today = new Date().toISOString().split('T')[0];
  
  // Find customers whose ONLY packages are paused/expired
  // Actually, let's just find all paused packages
  const { data: pausedPkgs } = await supabaseAdmin.schema('crm').from('customer_packages').select('customer_id').eq('status', 'Paused');
  
  if (pausedPkgs && pausedPkgs.length > 0) {
    const custIds = pausedPkgs.map(p => p.customer_id);
    console.log('Cleaning up orders for paused customers:', custIds);
    
    const { data, error } = await supabaseAdmin.from('operations_orders')
      .delete()
      .in('customer_id', custIds)
      .gte('date', today)
      .eq('delivery_status', 'PENDING');
      
    if (error) console.error(error);
    else console.log('Cleaned up successfully');
  }
}
cleanup();
