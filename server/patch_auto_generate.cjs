const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('c:/Users/Phyoe/Desktop/hrm_react/server/routes/operations.js');
let content = fs.readFileSync(targetFile, 'utf8');

const originalLogic = `    // 3. Fetch existing orders to prevent duplicates
    const { data: existingOrders, error: orderErr } = await supabase
      .from('operations_orders')
      .select('customer_id, daily_menu_id')
      .eq('date', targetDate);
      
    if (orderErr) throw orderErr;
    
    const existingSet = new Set(existingOrders?.map(o => \`\${o.customer_id}-\${o.daily_menu_id}\`) || []);

    const newOrders = [];

    // 4. Match packages to daily menus
    for (const pkg of packages) {
      const pkgMeals = (pkg.meal_type || '').toUpperCase(); // e.g. "LUNCH, DINNER"
      
      for (const menu of dailyMenus) {
        const menuType = (menu.meal_type || '').toUpperCase(); // e.g. "LUNCH"
        
        if (pkgMeals.includes(menuType)) {
          const comboKey = \`\${pkg.customer_id}-\${menu.id}\`;
          if (!existingSet.has(comboKey)) {
            newOrders.push({
              customer_id: pkg.customer_id,
              daily_menu_id: menu.id,
              date: targetDate,
              count: 1,
              delivery_status: 'PENDING',
              created_by: req.user.id
            });
            existingSet.add(comboKey); // Prevent duplicates in the same loop if any
          }
        }
      }
    }`;

const newLogic = `    // 3. Fetch existing orders to prevent duplicates
    const { data: existingOrders, error: orderErr } = await supabase
      .from('operations_orders')
      .select('customer_id, daily_menu_id')
      .eq('date', targetDate);
      
    if (orderErr) throw orderErr;
    
    // existingSet prevents same customer from getting the same exact menu
    const existingSet = new Set(existingOrders?.map(o => \`\${o.customer_id}-\${o.daily_menu_id}\`) || []);
    
    // new set to prevent same customer from getting 2 LUNCHes or 2 DINNERs even if menus are different
    const customerMealTypeSet = new Set();
    
    if (existingOrders) {
      existingOrders.forEach(o => {
        const menu = dailyMenus.find(m => m.id === o.daily_menu_id);
        if (menu && menu.meal_type) {
          customerMealTypeSet.add(\`\${o.customer_id}-\${menu.meal_type.toUpperCase()}\`);
        }
      });
    }

    const newOrders = [];

    // 4. Match packages to daily menus
    for (const pkg of packages) {
      const pkgMeals = (pkg.meal_type || '').toUpperCase(); // e.g. "LUNCH, DINNER"
      
      for (const menu of dailyMenus) {
        const menuType = (menu.meal_type || '').toUpperCase(); // e.g. "LUNCH"
        
        if (pkgMeals.includes(menuType)) {
          const comboKey = \`\${pkg.customer_id}-\${menu.id}\`;
          const mealTypeKey = \`\${pkg.customer_id}-\${menuType}\`;
          
          // STRICT FIX: Ensure we only ever give 1 LUNCH and 1 DINNER maximum!
          if (!existingSet.has(comboKey) && !customerMealTypeSet.has(mealTypeKey)) {
            newOrders.push({
              customer_id: pkg.customer_id,
              daily_menu_id: menu.id,
              date: targetDate,
              count: 1,
              delivery_status: 'PENDING',
              created_by: req.user.id
            });
            existingSet.add(comboKey);
            customerMealTypeSet.add(mealTypeKey); // Prevent duplicate LUNCH in the same loop
          }
        }
      }
    }`;

if (content.includes(originalLogic)) {
  content = content.replace(originalLogic, newLogic);
  fs.writeFileSync(targetFile, content);
  console.log('Successfully patched operations.js to prevent duplicate LUNCH orders.');
} else {
  console.log('Original logic not found. File might have been altered.');
}
