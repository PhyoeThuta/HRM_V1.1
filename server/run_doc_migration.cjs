const { Client } = require('pg');

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected to PostgreSQL with SSL');
    
    const query = `
      ALTER TABLE employee_documents
        ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
        ADD COLUMN IF NOT EXISTS file_url TEXT,
        ADD COLUMN IF NOT EXISTS description TEXT,
        ADD COLUMN IF NOT EXISTS uploaded_by_user_id UUID;
    `;
    
    await client.query(query);
    console.log('Migration executed successfully.');
    
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'employee_documents' 
        AND column_name IN ('category', 'file_url', 'description', 'uploaded_by_user_id');
    `);
    
    console.log('Verified columns:');
    console.table(res.rows);
    
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
