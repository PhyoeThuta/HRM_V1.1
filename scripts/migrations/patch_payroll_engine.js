const fs = require('fs');

let content = fs.readFileSync('server/routes/payroll_engine.js', 'utf8');

// Add import
if (!content.includes('hrmModule')) {
  content = content.replace(
    "import { verifyToken, requireAdmin } from '../middleware/auth.js';",
    "import { verifyToken, requireAdmin } from '../middleware/auth.js';\nimport { hrmModule } from '../modules/hrm/index.js';"
  );
}

// Remove getBkkDateString
content = content.replace(/function getBkkDateString[\s\S]*?\}\n/, '');

// Replace calculatePayroll body
const startMarker = "export async function calculatePayroll(employee_id, month, req_working_days = 26) {";
const endMarker = "// 4. Calculate Final KPI & Salary";

const replacement = `export async function calculatePayroll(employee_id, month, req_working_days = 26) {
  const context = await hrmModule.getEmployeeCompensationContext(employee_id, month, req_working_days);
  const base_salary = context.base_salary;
  const working_days = parseInt(req_working_days || 26);
  
  // Fetch Settings
  const settings = await getSettings();
  const w_att = settings.auto_weights.attendance || 0;
  const w_punct = settings.auto_weights.punctuality || 0;
  const w_sops = settings.auto_weights.sops || 0;
  const w_peer = settings.auto_weights.peer_voting || 0;
  
  const {
    actual_attendance,
    on_time_count,
    attendance_score,
    punctuality_score,
    completed_sops_count,
    total_sops_count,
    sop_score,
    peer_votes_count,
    peer_score
  } = context;
  
  // 4. Calculate Final KPI & Salary`;

content = content.replace(new RegExp(startMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "[\\s\\S]*?" + endMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), replacement);

fs.writeFileSync('server/routes/payroll_engine.js', content);
console.log('Patched payroll_engine.js');
