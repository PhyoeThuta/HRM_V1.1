const fs = require('fs');
let code = fs.readFileSync('server/routes/operations.js', 'utf8');

const target1 = `const { data: orderDetails } = await supabase.schema('operations')
          .from('orders')
          .select(\`
            count,
            daily_menus (
              menu_types (
                menus (
                  recipes (inventory_item_id, qty)
                )
              )
            )
          \`)
          .eq('id', order.id)
          .single();
          
        if (orderDetails && orderDetails.daily_menus) {
          const orderCount = orderDetails.count || 1;
          const deductions = {}; 
          
          orderDetails.daily_menus.menu_types.forEach(mt => {
            if (mt.menus && mt.menus.recipes) {
              mt.menus.recipes.forEach(r => {`;

const replacement1 = `const { data: orderDetails } = await supabase
          .from('operations_orders')
          .select(\`
            count,
            operations_daily_menus (
              operations_menu_types (
                operations_menus (
                  operations_recipes (inventory_item_id, qty)
                )
              )
            )
          \`)
          .eq('id', order.id)
          .single();
          
        if (orderDetails && orderDetails.operations_daily_menus) {
          const orderCount = orderDetails.count || 1;
          const deductions = {}; 
          
          orderDetails.operations_daily_menus.operations_menu_types.forEach(mt => {
            if (mt.operations_menus && mt.operations_menus.operations_recipes) {
              mt.operations_menus.operations_recipes.forEach(r => {`;

code = code.replace(target1, replacement1);

const target2 = `const { data: orderDetails } = await supabase.schema('operations')
        .from('orders')
        .select(\`
          count,
          daily_menus (
            menu_types (
              menus (
                recipes (inventory_item_id, qty)
              )
            )
          )
        \`)
        .eq('id', id)
        .single();
        
      if (orderDetails && orderDetails.daily_menus) {
        const orderCount = orderDetails.count || 1;
        const deductions = {}; 
        
        orderDetails.daily_menus.menu_types.forEach(mt => {
          if (mt.menus && mt.menus.recipes) {
            mt.menus.recipes.forEach(r => {`;

const replacement2 = `const { data: orderDetails } = await supabase
        .from('operations_orders')
        .select(\`
          count,
          operations_daily_menus (
            operations_menu_types (
              operations_menus (
                operations_recipes (inventory_item_id, qty)
              )
            )
          )
        \`)
        .eq('id', id)
        .single();
        
      if (orderDetails && orderDetails.operations_daily_menus) {
        const orderCount = orderDetails.count || 1;
        const deductions = {}; 
        
        orderDetails.operations_daily_menus.operations_menu_types.forEach(mt => {
          if (mt.operations_menus && mt.operations_menus.operations_recipes) {
            mt.operations_menus.operations_recipes.forEach(r => {`;

code = code.replace(target2, replacement2);

code = code.replaceAll("supabase.schema('inventory').from('balances')", "supabase.from('inventory_balances')");
code = code.replaceAll("supabase.schema('inventory').from('transactions')", "supabase.from('inventory_transactions')");

fs.writeFileSync('server/routes/operations.js', code);
console.log('Successfully applied replacements');
