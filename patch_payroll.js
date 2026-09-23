const fs = require('fs');

let content = fs.readFileSync('server/routes/payroll.js', 'utf8');

// Add import
if (!content.includes('hrmModule')) {
  content = content.replace(
    "import { calculatePayroll } from './payroll_engine.js';",
    "import { calculatePayroll } from './payroll_engine.js';\nimport { hrmModule } from '../modules/hrm/index.js';"
  );
}

const startMarker = "const [payrolls, employees, positions, kpis] = await Promise.all([";
const endMarker = "dbFetch('kpis', '*', {}, { order: 'created_at', ascending: false })";

const replacement = `const [payrolls, { employees, positions }, kpis] = await Promise.all([
      dbFetch('payrolls', '*', {}, { order: 'month', ascending: false }),
      hrmModule.getEmployeesForPayroll(),
      dbFetch('kpis', '*', {}, { order: 'created_at', ascending: false })`;

content = content.replace(new RegExp(startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "[\\s\\S]*?" + endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), replacement);

fs.writeFileSync('server/routes/payroll.js', content);
console.log('Patched payroll.js');
