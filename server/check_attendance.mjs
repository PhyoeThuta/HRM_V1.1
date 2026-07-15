import { createClient } from '@supabase/supabase-js';
import { WebSocket } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY, {
  realtime: { transport: WebSocket }
});

import { Client } from 'pg';

async function check() {
  const targetDate = '2026-07-15';
  
  // Try calling the auto generate logic directly
  const { data: dailyMenus } = await supabaseAdmin.from('operations_daily_menus').select('*').eq('date', targetDate);
  const { data: packages } = await supabaseAdmin.schema('crm').from('customer_packages').select('*').eq('status', 'Active').lte('start_date', targetDate).gte('expires_at', targetDate);
  
  console.log(`Found ${packages?.length} active packages overlapping ${targetDate}`);
  
  const existingSet = new Set();
  const newOrders = [];
  
  if (packages && dailyMenus) {
    for (const pkg of packages) {
      const pkgMeals = (pkg.meal_type || '').toUpperCase();
      for (const menu of dailyMenus) {
        const menuType = (menu.meal_type || '').toUpperCase();
        if (pkgMeals.includes(menuType)) {
          newOrders.push({
            customer_id: pkg.customer_id,
            daily_menu_id: menu.id,
            date: targetDate,
            count: 1,
            delivery_status: 'PENDING'
          });
        }
      }
    }
  }
  
  console.log('Orders to generate:', newOrders);
}
check();
