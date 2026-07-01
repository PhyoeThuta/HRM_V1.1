#!/usr/bin/env node
/**
 * Run handover table migration against Supabase.
 * Usage: node server/scripts/run_handover_migration.js
 * Requires SUPABASE_URL and SUPABASE_KEY in server/.env
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const sqlPath = path.join(__dirname, 'create_handover_tables.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.log(`
Handover migration SQL is at: server/scripts/create_handover_tables.sql

Run it manually in Supabase Dashboard → SQL Editor.

Or set DATABASE_URL (Postgres connection string) in server/.env and re-run this script.
`);
  process.exit(0);
}

const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log('Handover tables migration completed successfully.');
} catch (e) {
  console.error('Migration failed:', e.message);
  process.exit(1);
} finally {
  await client.end();
}
