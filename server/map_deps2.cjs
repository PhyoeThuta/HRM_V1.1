const fs = require('fs');
const path = require('path');

const tables = ['customers', 'customer_health', 'customer_lifestyle', 'customer_packages', 'inquiries', 'gallery_photos', 'feedbacks'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('scripts') && !file.includes('tests') && !file.includes('modules/crm')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') && !file.includes('routes/crm.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

walk('.').forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, i) => {
    tables.forEach(table => {
      if (line.includes(`from('${table}')`) || line.includes(`from("${table}")`)) {
        console.log(`[${file}:${i+1}] TABLE: ${table} | LINE: ${line.trim()}`);
      }
    });
  });
});
