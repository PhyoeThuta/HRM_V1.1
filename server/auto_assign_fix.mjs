import { supabase } from './lib/supabase.js';

async function runAutoAssign() {
  const month = '2026-09';
  const [year, monthStr] = month.split('-');
  const lastDay = new Date(parseInt(year, 10), parseInt(monthStr, 10), 0).getDate();

  console.log(`Processing month: ${month} (1 to ${lastDay} days)`);

  // Get templates
  const { data: templates } = await supabase.from('sop_templates').select('*');
  console.log('Templates found:', templates?.length);

  // Get all active employees
  const { data: employees } = await supabase.from('Employees').select('id, position_id, Full_name').eq('status', 'Active');
  console.log('Active employees found:', employees?.length);

  // Fetch existing SOPs for the month
  const monthStart = `${year}-${monthStr}-01T00:00:00.000Z`;
  const monthEnd = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

  const { data: existingSOPs } = await supabase
    .from('daily_sops')
    .select('id, employee_id, created_at')
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd);

  const existingSet = new Set();
  existingSOPs?.forEach(sop => {
    if (sop.created_at) {
      const dateStr = sop.created_at.split('T')[0];
      existingSet.add(`${sop.employee_id}_${dateStr}`);
    }
  });

  const records = [];
  for (const template of (templates || [])) {
    const positionEmployees = (employees || []).filter(e => e.position_id === template.position_id);
    console.log(`Position ${template.position_id} matches employees:`, positionEmployees.map(e => e.Full_name));

    for (let day = 1; day <= lastDay; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}T06:00:00.000Z`;
      const dayDate = `${year}-${monthStr}-${dayStr}`;

      for (const emp of positionEmployees) {
        if (existingSet.has(`${emp.id}_${dayDate}`)) continue;

        records.push({
          employee_id: emp.id,
          task_description: template.task_description,
          is_completed: false,
          created_at: dateStr
        });
      }
    }
  }

  console.log('New records to insert for missing employees:', records.length);
  if (records.length > 0) {
    const { error } = await supabase.from('daily_sops').insert(records);
    console.log('Insert result error:', error);
  }
}

runAutoAssign();
