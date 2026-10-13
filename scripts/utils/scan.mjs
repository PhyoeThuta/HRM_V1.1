import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('server');
let issues = [];
files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  if (code.match(/for\s*\([^)]*\)\s*\{[^}]*await /)) {
    issues.push(f + ' -> Potential N+1 query (await inside loop)');
  }
  if (code.match(/\.filter\s*\(/) && code.match(/dbFetch|supabase/)) {
    issues.push(f + ' -> Potential memory filtering after DB fetch');
  }
  if (code.match(/req\.body\.employee_id/) && (code.match(/dbUpdate/) || code.match(/dbInsert/))) {
    issues.push(f + ' -> Trust Boundary Risk: Using req.body.employee_id directly for mutation');
  }
});

console.log(issues.join('\n'));
