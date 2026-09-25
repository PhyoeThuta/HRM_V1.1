const fs = require('fs');
const files = [
  'src/components/layout/Sidebar.jsx',
  'src/components/layout/TopBar.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/Departments.jsx',
  'src/pages/Positions.jsx',
  'src/pages/Employees.jsx',
  'src/pages/Attendance.jsx',
  'src/pages/Leave.jsx',
  'src/pages/Payroll.jsx',
  'src/pages/PerformanceTracker.jsx',
  'src/pages/OrgChart.jsx',
  'src/pages/Recruitment.jsx',
  'src/pages/SOPs.jsx',
  'src/pages/Birthdays.jsx',
  'src/pages/Documents.jsx',
  'src/pages/Handovers.jsx',
  'src/pages/Offboarding.jsx',
  'src/pages/Onboarding.jsx',
  'src/pages/OnboardingDetail.jsx',
  'src/pages/EditEmployee.jsx',
  'src/pages/EmployeeProfile.jsx',
  'src/pages/BossKPI.jsx',
  'src/pages/UserAccounts.jsx',
  'src/components/attendance/RostersTab.jsx',
  'src/components/attendance/ShiftApprovalsTab.jsx',
  'src/components/attendance/WeeklyRosterPlanner.jsx',
  'src/components/common/ConfirmDeleteModal.jsx',
  'src/components/handover/HandoverChecklistReadOnly.jsx',
  'src/components/handover/HandoverPanel.jsx',
  'src/components/leave/LeaveHandoverWorkflow.jsx',
  'src/components/leave/LeaveRequestActionsMenu.jsx',
  'src/components/leave/LeaveRequestDetailModal.jsx',
  'src/components/sop/SopReportTab.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  let insideComponent = false;
  lines.forEach((line, i) => {
    if (line.match(/export default function/) || line.match(/function [A-Z]/) || line.match(/const [A-Z].* = /)) {
      insideComponent = true;
    }
    if (!insideComponent && (line.includes("t('") || line.includes('t("'))) {
      if (!line.includes('import')) {
        console.log('Top-level t() in', f, 'line', i+1, ':', line.trim());
      }
    }
  });
});
