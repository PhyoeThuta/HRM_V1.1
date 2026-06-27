import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  try {
    await client.query("TRUNCATE TABLE public.employee_daily_schedules;");
    console.log('Truncated employee_daily_schedules');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
