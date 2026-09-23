const fs = require('fs');
const glob = require('glob');

const tables = ['customers', 'customer_health', 'customer_lifestyle', 'customer_packages', 'inquiries', 'gallery_photos', 'feedbacks'];

glob.sync('**/*.js', { ignore: ['node_modules/**', 'scripts/**', 'tests/**', 'modules/crm/**', 'routes/crm.js'] }).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  content.split('\n').forEach((line, i) => {
    tables.forEach(table => {
      if (line.includes(`from('${table}')`) || line.includes(`from("${table}")`)) {
        console.log(`[${file}:${i+1}] TABLE: ${table} | LINE: ${line.trim()}`);
      }
    });
  });
});
