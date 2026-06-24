import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  await client.connect();
  try {
    await client.query("INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT DO NOTHING;");
    console.log('Bucket created!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
