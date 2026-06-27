import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function migrate() {
  await client.connect();
  try {
    console.log('Fetching active employees...');
    const res = await client.query(`
      SELECT e.id, p.title as position, e.default_shift_id 
      FROM public."Employees" e
      LEFT JOIN public.positions p ON e.position_id = p.id
      WHERE e.status = 'Active'
    `);
    const employees = res.rows;
    
    const dynamicEmployees = employees.filter(e => {
      const p = (e.position || '').toLowerCase();
      return p.includes('housekeeping') || p.includes('kitchen');
    });
    
    console.log(`Found ${dynamicEmployees.length} dynamic employees (Housekeeping/Kitchen).`);
    
    if (dynamicEmployees.length === 0) {
      console.log('No employees to migrate.');
      return;
    }
    
    const entries = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = 0; i < 28; i++) { // Generate for 4 weeks
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      for (const emp of dynamicEmployees) {
        if (emp.default_shift_id) {
          entries.push(`('${emp.id}', '${dateStr}', '${emp.default_shift_id}', false)`);
        }
      }
    }
    
    if (entries.length > 0) {
      console.log(`Inserting ${entries.length} schedule entries...`);
      const insertSql = `
        INSERT INTO public.employee_daily_schedules (employee_id, schedule_date, shift_id, is_off_day)
        VALUES ${entries.join(', ')}
        ON CONFLICT (employee_id, schedule_date) DO NOTHING;
      `;
      await client.query(insertSql);
      console.log('Migration successful!');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

migrate();
