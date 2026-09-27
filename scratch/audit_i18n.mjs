import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../hrm-client/src');
const localesDir = path.join(srcDir, 'locales/en');

// Read all JSON files
const locales = {};
for (const file of fs.readdirSync(localesDir)) {
  if (file.endsWith('.json')) {
    const ns = file.replace('.json', '');
    locales[ns] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
  }
}

const checkKey = (keyPath) => {
  const parts = keyPath.split('.');
  const ns = parts.shift();
  if (!locales[ns]) return false;
  
  let current = locales[ns];
  for (const part of parts) {
    if (current === undefined || current === null) return false;
    current = current[part];
  }
  return current !== undefined && current !== null;
};

const findKeysInFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Look for t('namespace.key.etc') or t("namespace.key.etc")
  const regex = /t\(['"]([^'"]+)['"]\)/g;
  let match;
  const missing = [];
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    if (key.includes('.') && /^[a-z]+\./.test(key)) {
      if (!checkKey(key)) {
        missing.push(key);
      }
    }
  }
  return missing;
};

const walk = (dir, results = []) => {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      walk(full, results);
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
};

const allFiles = walk(srcDir);
const report = {};

for (const file of allFiles) {
  const missing = findKeysInFile(file);
  if (missing.length > 0) {
    const rel = path.relative(srcDir, file);
    report[rel] = [...new Set(missing)];
  }
}

console.log(JSON.stringify(report, null, 2));
