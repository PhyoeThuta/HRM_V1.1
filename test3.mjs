import { supabase } from './server/lib/supabase.js';

async function test() {
  const data = {
    employee_id: 'EMP999', Full_name: 'Test Name',
    email: null, phone: null,
    Dept_id: null, position_id: null,
    Manager_id: null,
    hire_date: null, date_of_birth: null,
    national_id: null, address: null,
    employment_type: 'Full-Time',
    status: 'Active',
    salary: null,
    created_at: new Date().toISOString(),
  };

  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '')
  );

  const { data: result, error } = await supabase.from('Employees').insert(clean).select();
  console.log('Error:', error);
  console.log('Result:', result);
}
test();
