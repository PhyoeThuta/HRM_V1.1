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
const issues = [];
const outsideIssues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes("t('") || content.includes('t("')) {
    if (!content.includes('const { t } = useLanguage') && !content.includes('const {t} = useLanguage') && !content.includes('function t(') && !content.includes('const t =')) {
      issues.push(f);
    }
    
    // Quick regex to check if `t(` is used before `export default function` or `function` or `const ... = () =>`?
    // It's hard. But we can look at lines outside of functions roughly.
  }
});

console.log("Missing useLanguage:", issues);

// Also look for `catIcon = { ... t( ... ) }` at top level.
// Let's do a simple regex for top-level `t(` usages (very rudimentary).
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (f.includes('Offboarding.jsx') || f.includes('OrgChart.jsx') || f.includes('Dashboard.jsx') || f.includes('Sidebar.jsx')) {
     // I will just look manually or via a smarter regex for all files.
  }
});
