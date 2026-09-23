import { supabase } from './lib/supabase.js';

async function checkData() {
  const date = '1999-01-01';
  console.log(`\n--- CHECKING TEST DATA FOR ${date} ---\n`);

  // 1. operations_daily_menus
  const { data: menus } = await supabase.from('operations_daily_menus').select('*').eq('date', date);
  console.log(`[operations_daily_menus] found ${menus?.length || 0} records.`);
  if (menus?.length) console.log(JSON.stringify(menus, null, 2));

  // 2. operations_menu_types
  if (menus && menus.length > 0) {
    const menuIds = menus.map(m => m.id);
    const { data: mTypes } = await supabase.from('operations_menu_types').select('*').in('daily_menus_id', menuIds);
    console.log(`\n[operations_menu_types] found ${mTypes?.length || 0} records linked to these daily menus.`);
    if (mTypes?.length) console.log(JSON.stringify(mTypes, null, 2));
  } else {
    console.log(`\n[operations_menu_types] skipping (no daily menus found)`);
  }

  // 3. operations_orders
  const { data: orders } = await supabase.from('operations_orders').select('*').eq('date', date);
  console.log(`\n[operations_orders] found ${orders?.length || 0} records.`);
  if (orders?.length) {
     console.log(`Showing first 2 orders:`);
     console.log(JSON.stringify(orders.slice(0, 2), null, 2));
     console.log(`... and ${orders.length - 2} more.`);
  }
}

checkData();
