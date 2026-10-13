import { supabaseAdmin } from '../lib/supabase.js';

async function run() {
  const { data } = await supabaseAdmin.from('hrm_manual_categories').select('*');
  
  const mergeMap = {
    'Dashboard & Core': 'OVERVIEW',
    'Employee Management': 'EMPLOYEE MANAGEMENT',
    'Attendance & Leave': 'ATTENDANCE & LEAVE',
    'Payroll & Performance': 'PAYROLL & PERFORMANCE',
    'Settings & Operations': 'ORGANIZATION & OPERATIONS'
  };

  for (const oldName of Object.keys(mergeMap)) {
    const newName = mergeMap[oldName];
    
    const oldCat = data.find(c => c.name === oldName);
    const newCat = data.find(c => c.name === newName);
    
    if (oldCat && newCat) {
      await supabaseAdmin.from('hrm_manual_articles').update({ category_id: newCat.id }).eq('category_id', oldCat.id);
      await supabaseAdmin.from('hrm_manual_categories').delete().eq('id', oldCat.id);
      console.log(`Merged ${oldName} into ${newName}`);
    }
  }
}
run();
