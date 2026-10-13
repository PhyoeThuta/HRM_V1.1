const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

const env = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env')));
const client = new pg.Client({
  connectionString: env.SUPABASE_DB_URL || 'postgresql://postgres:PHYOEthuta123!%40%23@db.kcswzfrwpvioaaizfpnk.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    
    console.log('Creating hrm_manual_categories...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hrm_manual_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Creating hrm_manual_articles...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hrm_manual_articles (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES hrm_manual_categories(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        draft_content TEXT,
        published_content TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        version INTEGER DEFAULT 1,
        order_index INTEGER DEFAULT 0,
        created_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        updated_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        published_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Creating hrm_manual_versions...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hrm_manual_versions (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES hrm_manual_articles(id) ON DELETE CASCADE,
        content TEXT,
        version INTEGER NOT NULL,
        created_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Creating hrm_manual_permissions...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS hrm_manual_permissions (
        id SERIAL PRIMARY KEY,
        employee_id UUID UNIQUE REFERENCES "Employees"(id) ON DELETE CASCADE,
        can_edit BOOLEAN DEFAULT false,
        can_publish BOOLEAN DEFAULT false,
        can_manage_editors BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('Ensuring all audit columns exist (Upgrade mode)...');
    await client.query(`
      ALTER TABLE hrm_manual_articles 
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES sys_users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

      ALTER TABLE hrm_manual_versions
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES sys_users(id) ON DELETE SET NULL;
    `);

    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_hrm_manual_articles_category ON hrm_manual_articles(category_id, order_index);
      CREATE INDEX IF NOT EXISTS idx_hrm_manual_articles_status ON hrm_manual_articles(status);
      CREATE INDEX IF NOT EXISTS idx_hrm_manual_versions_article ON hrm_manual_versions(article_id, version DESC);
    `);

    console.log('Manual tables created and updated successfully.');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
  }
}

run();
