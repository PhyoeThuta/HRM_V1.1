import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS public.employee_daily_schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_id UUID REFERENCES public."Employees"(id) NOT NULL,
        schedule_date DATE NOT NULL,
        shift_id UUID REFERENCES public.shifts(id),
        is_off_day BOOLEAN DEFAULT FALSE,
        UNIQUE (employee_id, schedule_date)
      );

      ALTER TABLE public.employee_daily_schedules ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Enable read access for all users" ON public.employee_daily_schedules;
      CREATE POLICY "Enable read access for all users" ON public.employee_daily_schedules FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Enable all access for all users" ON public.employee_daily_schedules;
      CREATE POLICY "Enable all access for all users" ON public.employee_daily_schedules FOR ALL USING (true) WITH CHECK (true);
    `;
    await client.query(sql);
    console.log('Table employee_daily_schedules created successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
