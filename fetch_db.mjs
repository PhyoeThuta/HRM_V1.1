import * as dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

async function checkData() {
  const url = `${supabaseUrl}/rest/v1/inquiries?select=status`;
  const res = await fetch(url, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept-Profile': 'crm'
    }
  });
  const data = await res.json();
  const statuses = new Set(data.map(d => d.status));
  console.log([...statuses]);
}
checkData();
