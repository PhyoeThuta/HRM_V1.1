const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let braceDepth = 0;
  lines.forEach((line, i) => {
    braceDepth += (line.match(/\{/g) || []).length;
    braceDepth -= (line.match(/\}/g) || []).length;
    
    // We are looking for lines that contain t(' or t(" outside of functions
    if (braceDepth === 0 || (braceDepth === 1 && line.includes('const ') && line.includes('='))) { 
      if (line.includes("t('") || line.includes('t("')) {
        console.log('Suspicious t() at depth', braceDepth, 'in', f, 'line', i+1, ':', line.trim());
      }
    }
  });
});
