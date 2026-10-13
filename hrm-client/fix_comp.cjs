const fs = require('fs');
const path = require('path');

const ocPath = path.join(__dirname, 'src/pages/OrgChart.jsx');
let oc = fs.readFileSync(ocPath, 'utf8');

// add tDyn to OrgChart
oc = oc.replace('const { t } = useLanguage();', 'const { t, tDyn } = useLanguage();');
if (!oc.includes('const { t, tDyn } = useLanguage();')) {
  oc = oc.replace('const { t } = useLanguage()', 'const { t, tDyn } = useLanguage()');
}

oc = oc.replace('{node.children.length} direct report{node.children.length !== 1 ? \'s\' : \'\'}', '{node.children.length} {t(\'hrm.orgChart.directReports\')}');
oc = oc.replace('{ value: \'\', label: \'— No Manager (Root Level) —\' }', '{ value: \'\', label: t(\'hrm.orgChart.noManagerRoot\') }');
oc = oc.replace('placeholder="— No Manager (Root Level) —"', 'placeholder={t(\'hrm.orgChart.noManagerRoot\')}');
oc = oc.replace('<p className="oc-reassign-title text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Reassign Direct Manager</p>', '<p className="oc-reassign-title text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">{t(\'hrm.orgChart.reassignTitle\')}</p>');
oc = oc.replace('{reassigning ? \'Saving...\' : \'Confirm Reassignment\'}', '{reassigning ? t(\'hrm.orgChart.saving\') : t(\'hrm.orgChart.confirmReassignment\')}');
oc = oc.replace('Changes are saved immediately to database', '{t(\'hrm.orgChart.changesSaved\')}');
oc = oc.replace('View Full Profile →', '{t(\'hrm.orgChart.viewFullProfile\')}');

// employee drawer rows
oc = oc.replace('[\'Position\',       node.position],', '[t(\'hrm.orgChart.position\'),       node.position],');
oc = oc.replace('[\'Department\',     node.department],', '[t(\'hrm.orgChart.drawerDepartment\'),     tDyn("hrm.departments", node.department) || node.department],');
oc = oc.replace('[\'Level\',          node.level],', '[t(\'hrm.orgChart.level\'),          node.level],');
oc = oc.replace('[\'Email\',          node.email || \'—\'],', '[t(\'hrm.orgChart.email\'),          node.email || \'—\'],');
oc = oc.replace('[\'Hire Date\',      node.hire_date ? new Date(node.hire_date).toLocaleDateString() : \'—\'],', '[t(\'hrm.orgChart.hireDate\'),      node.hire_date ? new Date(node.hire_date).toLocaleDateString() : \'—\'],');
oc = oc.replace('[\'Direct Reports\', node.children?.length ?? 0],', '[t(\'hrm.orgChart.directReportsDrawer\'), node.children?.length ?? 0],');
oc = oc.replace('{node.level} Level', '{node.level} {t(\'hrm.orgChart.levelBadge\')}');

// org node department
oc = oc.replace('<p className="oc-node-dept text-[9px] text-slate-500 mt-0.5">{node.department}</p>', '<p className="oc-node-dept text-[9px] text-slate-500 mt-0.5">{tDyn("hrm.departments", node.department) || node.department}</p>');

// org chart dept options
oc = oc.replace('label: d.Department_name }', 'label: tDyn("hrm.departments", d.Department_name) || d.Department_name }');
oc = oc.replace('placeholder="All Departments"', 'placeholder={t(\'hrm.orgChart.allDepartments\')}');

fs.writeFileSync(ocPath, oc, 'utf8');

const ptPath = path.join(__dirname, 'src/pages/PerformanceTracker.jsx');
let pt = fs.readFileSync(ptPath, 'utf8');

if (!pt.includes('const { t, tDyn } = useLanguage();')) {
  pt = pt.replace('const { t } = useLanguage();', 'const { t, tDyn } = useLanguage();');
}
if (!pt.includes('tDyn = useLanguage')) {
  pt = pt.replace(/export default function PerformanceTracker\(\) \{\s+const \{ t \} = useLanguage\(\);/, 'export default function PerformanceTracker() {\n  const { t, tDyn } = useLanguage();');
}

// deptOptions inside pt
pt = pt.replace('<option key={d.id} value={d.id}>{d.name}</option>', '<option key={d.id} value={d.id}>{tDyn("hrm.departments", d.name) || d.name}</option>');
pt = pt.replace('<td className="pt-emp-dept py-3.5 px-4 text-xs text-slate-400">{emp.department_name}</td>', '<td className="pt-emp-dept py-3.5 px-4 text-xs text-slate-400">{tDyn("hrm.departments", emp.department_name) || emp.department_name}</td>');

// ScorecardModal translation
pt = pt.replace('function ScorecardModal({ emp, onClose }) {', 'function ScorecardModal({ emp, onClose }) {\n  const { t, tDyn } = useLanguage();');
pt = pt.replace('<p className="pt-modal-role text-xs text-slate-400">{emp.position_title} · {emp.department_name}</p>', '<p className="pt-modal-role text-xs text-slate-400">{emp.position_title} · {tDyn("hrm.departments", emp.department_name) || emp.department_name}</p>');
pt = pt.replace('360° Performance Radar', '{t(\'hrm.performance.radarTitle\')}');
pt = pt.replace('Score Breakdown', '{t(\'hrm.performance.scoreBreakdown\')}');
pt = pt.replace('📋 Daily SOP Compliance', '📋 {t(\'hrm.performance.dailySopCompliance\')}');
pt = pt.replace('🎯 JD & KPI Goals', '🎯 {t(\'hrm.performance.kpiGoals\')}');
pt = pt.replace('🏅 Culture & Attendance', '🏅 {t(\'hrm.performance.cultureAttendance\')}');
pt = pt.replace('(Active)', '{t(\'hrm.performance.statusActive\')}');
pt = pt.replace('(Unassigned)', '{t(\'hrm.performance.statusUnassigned\')}');
pt = pt.replace('tasks completed', '{t(\'hrm.performance.tasksCompleted\')}');
pt = pt.replace('No SOP tasks assigned yet. Excluded from weight calculation.', '{t(\'hrm.performance.noSopTasks\')}');
pt = pt.replace('KPI record{emp.kpi_records_found !== 1 ? \'s\' : \'\'} this period', '{t(\'hrm.performance.kpiRecords\')}');
pt = pt.replace('No KPI targets set yet. Excluded from weight calculation.', '{t(\'hrm.performance.noKpiTargets\')}');
pt = pt.replace('Payroll Bonus Entitlement', '{t(\'hrm.performance.payrollBonusTitle\')}');
pt = pt.replace('% of target KPI bonus', '{t(\'hrm.performance.targetKpiBonus\')}');
pt = pt.replace('[\'Attendance\', emp.attendance_rate], [\'Punctuality\', emp.punctuality_rate], [\'Peer Rating\', emp.has_peer ? `${emp.peer_score}%` : \'N/A\']', '[t(\'hrm.performance.attendance\'), emp.attendance_rate], [t(\'hrm.performance.punctuality\'), emp.punctuality_rate], [t(\'hrm.performance.peerRating\'), emp.has_peer ? `${emp.peer_score}%` : t(\'hrm.performance.na\')]');

// RadarChart
pt = pt.replace('function RadarChart({ emp }) {', 'function RadarChart({ emp }) {\n  const { t } = useLanguage();');
pt = pt.replace('labels: [\'SOP Compliance\', \'JD / KPI Score\', \'Attendance\', \'Punctuality\', \'Peer Rating\']', 'labels: [t(\'hrm.performance.sopCompliance\'), t(\'hrm.performance.kpiGoals\'), t(\'hrm.performance.attendance\'), t(\'hrm.performance.punctuality\'), t(\'hrm.performance.peerRating\')]');

// SyncConfirmModal
pt = pt.replace('function SyncConfirmModal({ month, onConfirm, onCancel, loading }) {', 'function SyncConfirmModal({ month, onConfirm, onCancel, loading }) {\n  const { t } = useLanguage();');
pt = pt.replace('Sync Performance to Payroll', '{t(\'hrm.performance.syncTitle\')}');
pt = pt.replace('This will update <span className="pt-sync-highlight-warn text-amber-400 font-semibold">existing</span> payroll records for <span className="pt-sync-highlight text-white font-semibold">{month}</span> with the computed CPI scores and recalculate bonuses.', '{t(\'hrm.performance.syncDesc1\')}<span className="pt-sync-highlight-warn text-amber-400 font-semibold">{t(\'hrm.performance.syncDesc2\')}</span>{t(\'hrm.performance.syncDesc3\')}<span className="pt-sync-highlight text-white font-semibold">{month}</span>{t(\'hrm.performance.syncDesc4\')}');
pt = pt.replace('⚠️ Only existing payroll records will be updated. New records will NOT be created.', '{t(\'hrm.performance.syncAlert\')}');
pt = pt.replace('Cancel', '{t(\'hrm.performance.cancel\')}');
pt = pt.replace('{loading ? \'⏳ Syncing...\' : \'⚡ Confirm Sync\'}', '{loading ? t(\'hrm.performance.syncing\') : t(\'hrm.performance.confirmSync\')}');

// GradeBadge
pt = pt.replace('function GradeBadge({ grade }) {', 'function GradeBadge({ grade }) {\n  const { t } = useLanguage();');
pt = pt.replace('{grade === \'—\' ? \'No Data\' : `Grade ${grade}`}', '{grade === \'—\' ? t(\'hrm.performance.noData\') : `${t(\'hrm.performance.gradePrefix\')} ${grade}`}');

fs.writeFileSync(ptPath, pt, 'utf8');
console.log('Fixed JSX components');
