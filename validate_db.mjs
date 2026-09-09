import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('./server/.env') });
import { supabase, supabaseAdmin } from './server/lib/supabase.js';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.mjs')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('./server');
const tableNames = new Set();
const crmTables = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // match .from('table_name') (ignoring .storage.from)
  const fromRegex = /(?<!storage)\.from\(['"`](.*?)['"`]\)/g;
  let match;
  while ((match = fromRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('$')) tableNames.add(match[1]);
  }

  // match dbFetch('table_name')
  const fetchRegex = /dbFetch(?:One)?\(['"`](.*?)['"`]/g;
  while ((match = fetchRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('$')) tableNames.add(match[1]);
  }
  
  // match schema('crm').from('table_name')
  const crmRegex = /\.schema\(['"`]crm['"`]\)\.from\(['"`](.*?)['"`]\)/g;
  while ((match = crmRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('$')) {
      crmTables.add(match[1]);
      tableNames.delete(match[1]); // Remove from public set if it's CRM
    }
  }
});

console.log(`Found ${tableNames.size} public tables and ${crmTables.size} CRM tables in code.`);

async function validateTables() {
  const missingTables = [];

  for (const table of Array.from(tableNames)) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error && error.code === 'PGRST205') {
      missingTables.push(`public.${table}`);
    }
  }

  for (const table of Array.from(crmTables)) {
    const { error } = await supabaseAdmin.schema('crm').from(table).select('*').limit(1);
    if (error && error.code === 'PGRST205') {
      missingTables.push(`crm.${table}`);
    }
  }

  if (missingTables.length > 0) {
    console.error('\n🚨 MISSING TABLES DETECTED IN DATABASE:');
    missingTables.forEach(t => console.error(`- ${t}`));
    process.exit(1);
  } else {
    console.log('\n✅ All referenced tables exist in the database!');
  }
}

validateTables();
