const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// 1. Departments mapping
const enDepts = {
  "Logistics & Delivery": "Logistics & Delivery",
  "Customer Service": "Customer Service",
  "Human Resources": "Human Resources",
  "IT": "IT",
  "Operation": "Operation",
  "Sales & Marketing": "Sales & Marketing"
};
const myDepts = {
  "Logistics & Delivery": "ထောက်ပံ့ပို့ဆောင်ရေးနှင့် ပို့ဆောင်ရေး",
  "Customer Service": "ဖောက်သည်ဝန်ဆောင်မှု",
  "Human Resources": "လူသားအရင်းအမြစ်",
  "IT": "သတင်းအချက်အလက်နည်းပညာ",
  "Operation": "လုပ်ငန်းလည်ပတ်ရေး",
  "Sales & Marketing": "အရောင်းနှင့် ဈေးကွက်ချဲ့ထွင်ရေး"
};

enJson.departments = enDepts;
myJson.departments = myDepts;

// 2. OrgChart
const enOrg = {
  title: "Organization Chart",
  subtitle: "Visual hierarchy and reporting lines",
  searchPlaceholder: "Search employees...",
  allDepartments: "All Departments",
  employees: "Employees",
  departments: "Departments",
  clickCard: "Click card to view details.",
  reassignManager: "Admins can reassign managers.",
  loadFailed: "Failed to load org chart.",
  noEmployees: "No employees found in this view.",
  executiveRoot: "Executive Root",
  directReports: "direct reports",
  noManagerRoot: "— No Manager (Root Level) —",
  position: "Position",
  drawerDepartment: "Department",
  level: "Level",
  email: "Email",
  hireDate: "Hire Date",
  directReportsDrawer: "Direct Reports",
  levelBadge: "Level",
  reassignTitle: "Reassign Direct Manager",
  saving: "Saving...",
  confirmReassignment: "Confirm Reassignment",
  changesSaved: "Changes are saved immediately to database",
  viewFullProfile: "View Full Profile →"
};

const myOrg = {
  title: "အဖွဲ့အစည်း ဖွဲ့စည်းပုံ",
  subtitle: "အဆင့်ဆင့် အုပ်ချုပ်မှုနှင့် တာဝန်ခံမှုများကို ကြည့်ရှုရန်",
  searchPlaceholder: "ဝန်ထမ်းများကို ရှာဖွေရန်...",
  allDepartments: "ဌာနအားလုံး",
  employees: "ဝန်ထမ်းများ",
  departments: "ဌာနများ",
  clickCard: "အသေးစိတ်ကြည့်ရန် ကတ်ကိုနှိပ်ပါ။",
  reassignManager: "စီမံခန့်ခွဲသူများ အကြီးအကဲ ပြောင်းလဲသတ်မှတ်နိုင်သည်။",
  loadFailed: "အဖွဲ့အစည်း ဖွဲ့စည်းပုံကို ခေါ်ယူ၍မရပါ။",
  noEmployees: "ဤမြင်ကွင်းတွင် ဝန်ထမ်း မတွေ့ရှိပါ။",
  executiveRoot: "အမြင့်ဆုံး အကြီးအကဲ",
  directReports: "လက်အောက်ဝန်ထမ်းများ",
  noManagerRoot: "— အကြီးအကဲ မရှိပါ (အမြင့်ဆုံးအဆင့်) —",
  position: "ရာထူး",
  drawerDepartment: "ဌာန",
  level: "အဆင့်",
  email: "အီးမေးလ်",
  hireDate: "အလုပ်ဝင်သည့်ရက်",
  directReportsDrawer: "လက်အောက်ဝန်ထမ်းများ",
  levelBadge: "အဆင့်",
  reassignTitle: "အကြီးအကဲ ပြောင်းလဲသတ်မှတ်ရန်",
  saving: "သိမ်းဆည်းနေပါသည်...",
  confirmReassignment: "ပြောင်းလဲမှုကို အတည်ပြုပါ",
  changesSaved: "ပြောင်းလဲမှုများကို ဒေတာဘေ့စ်တွင် ချက်ချင်းသိမ်းဆည်းပါမည်",
  viewFullProfile: "ပရိုဖိုင် အပြည့်အစုံ ကြည့်ရန် →"
};

enJson.orgChart = enOrg;
myJson.orgChart = myOrg;

// 3. Performance
const enPerf = {
  title: "Performance Tracker",
  subtitle: "Track KPI, SOP compliance, and behavior scores",
  allDepartments: "All Departments",
  syncToPayroll: "Sync to Payroll",
  searchPlaceholder: "Search employee...",
  avgCpi: "Average CPI",
  sopCompliance: "SOP Compliance",
  topAchievers: "Top Achievers",
  performanceRisk: "Performance Risk",
  dailySopAvg: "Daily SOP Average",
  gradeAPlus: "Grade A / A+",
  gradeCD: "Grade D / C-D",
  deptComparison: "Department Comparison",
  cpiTrend: "CPI Trend",
  ledgerTitle: "Performance Ledger",
  employeesCount: "employees",
  loadFailed: "Failed to load performance data.",
  noDeptData: "No department data available.",
  noTrendData: "No trend data available.",
  noEmployees: "No employees found.",
  view360: "View 360°",
  radarTitle: "360° Performance Radar",
  scoreBreakdown: "Score Breakdown",
  dailySopCompliance: "Daily SOP Compliance",
  kpiGoals: "JD & KPI Goals",
  cultureAttendance: "Culture & Attendance",
  statusActive: "(Active)",
  statusUnassigned: "(Unassigned)",
  tasksCompleted: "tasks completed",
  noSopTasks: "No SOP tasks assigned yet. Excluded from weight calculation.",
  kpiRecords: "KPI records this period",
  noKpiTargets: "No KPI targets set yet. Excluded from weight calculation.",
  payrollBonusTitle: "Payroll Bonus Entitlement",
  targetKpiBonus: "% of target KPI bonus",
  attendance: "Attendance",
  punctuality: "Punctuality",
  peerRating: "Peer Rating",
  na: "N/A",
  noData: "No Data",
  gradePrefix: "Grade",
  syncTitle: "Sync Performance to Payroll",
  syncDesc1: "This will update ",
  syncDesc2: "existing",
  syncDesc3: " payroll records for ",
  syncDesc4: " with the computed CPI scores and recalculate bonuses.",
  syncAlert: "⚠️ Only existing payroll records will be updated. New records will NOT be created.",
  cancel: "Cancel",
  syncing: "⏳ Syncing...",
  confirmSync: "⚡ Confirm Sync",
  cols: {
    employee: "Employee",
    dept: "Department",
    sop: "SOP",
    kpi: "KPI",
    culture: "Culture",
    cpi: "CPI",
    grade: "Grade",
    bonus: "Bonus",
    scorecard: "Scorecard"
  }
};

const myPerf = {
  title: "စွမ်းဆောင်ရည် ခြေရာခံ",
  subtitle: "KPI၊ SOP လိုက်နာမှုနှင့် အပြုအမူ အမှတ်များကို ခြေရာခံရန်",
  allDepartments: "ဌာနအားလုံး",
  syncToPayroll: "လစာစာရင်းသို့ ပေါင်းကူးရန်",
  searchPlaceholder: "ဝန်ထမ်းကို ရှာဖွေရန်...",
  avgCpi: "ပျမ်းမျှ CPI",
  sopCompliance: "SOP လိုက်နာမှု",
  topAchievers: "စွမ်းဆောင်ရည် အကောင်းဆုံးသူများ",
  performanceRisk: "စွမ်းဆောင်ရည် ကျဆင်းနိုင်ခြေ",
  dailySopAvg: "နေ့စဉ် SOP ပျမ်းမျှ",
  gradeAPlus: "အဆင့် A / A+",
  gradeCD: "အဆင့် D / C-D",
  deptComparison: "ဌာနအလိုက် နှိုင်းယှဉ်ချက်",
  cpiTrend: "CPI အပြောင်းအလဲ",
  ledgerTitle: "စွမ်းဆောင်ရည် မှတ်တမ်း",
  employeesCount: "ဝန်ထမ်း",
  loadFailed: "စွမ်းဆောင်ရည် ဒေတာကို ခေါ်ယူ၍မရပါ။",
  noDeptData: "ဌာနဆိုင်ရာ ဒေတာ မရှိပါ။",
  noTrendData: "အပြောင်းအလဲ ဒေတာ မရှိပါ။",
  noEmployees: "ဝန်ထမ်း မတွေ့ရှိပါ။",
  view360: "360° ကြည့်ရန်",
  radarTitle: "360° စွမ်းဆောင်ရည် ရေဒါ",
  scoreBreakdown: "အမှတ်ခွဲခြမ်းစိတ်ဖြာချက်",
  dailySopCompliance: "နေ့စဉ် SOP လိုက်နာမှု",
  kpiGoals: "JD နှင့် KPI ရည်မှန်းချက်များ",
  cultureAttendance: "ရုံးတွင်းယဉ်ကျေးမှုနှင့် ရုံးတက်မှန်ကန်မှု",
  statusActive: "(အသက်ဝင်နေသည်)",
  statusUnassigned: "(တာဝန်မပေးရသေးပါ)",
  tasksCompleted: "ပြီးစီးသော တာဝန်များ",
  noSopTasks: "SOP တာဝန်များ သတ်မှတ်ထားခြင်း မရှိသေးပါ။ အမှတ်တွက်ချက်ရာတွင် ထည့်သွင်းမည်မဟုတ်ပါ။",
  kpiRecords: "ယခုကာလအတွက် KPI မှတ်တမ်းများ",
  noKpiTargets: "KPI ရည်မှန်းချက်များ သတ်မှတ်ထားခြင်း မရှိသေးပါ။ အမှတ်တွက်ချက်ရာတွင် ထည့်သွင်းမည်မဟုတ်ပါ။",
  payrollBonusTitle: "လစာ ဆုကြေးငွေ ရပိုင်ခွင့်",
  targetKpiBonus: "% KPI ဆုကြေးငွေ ရည်မှန်းချက်၏",
  attendance: "ရုံးတက်မှန်ကန်မှု",
  punctuality: "အချိန်မှန်ကန်မှု",
  peerRating: "လုပ်ဖော်ကိုင်ဖက် အကဲဖြတ်မှု",
  na: "မရှိပါ",
  noData: "ဒေတာ မရှိပါ",
  gradePrefix: "အဆင့်",
  syncTitle: "စွမ်းဆောင်ရည်ကို လစာစာရင်းသို့ ပေါင်းကူးရန်",
  syncDesc1: "၎င်းသည် ",
  syncDesc2: "ရှိပြီးသား",
  syncDesc3: " လစာမှတ်တမ်းများကို ",
  syncDesc4: " အတွက် တွက်ချက်ထားသော CPI အမှတ်များနှင့် အပ်ဒိတ်လုပ်ပြီး ဆုကြေးများကို ပြန်လည်တွက်ချက်ပါမည်။",
  syncAlert: "⚠️ ရှိပြီးသား လစာမှတ်တမ်းများကိုသာ အပ်ဒိတ်လုပ်ပါမည်။ မှတ်တမ်းအသစ်များ ဖန်တီးမည်မဟုတ်ပါ။",
  cancel: "ပယ်ဖျက်မည်",
  syncing: "⏳ ပေါင်းကူးနေပါသည်...",
  confirmSync: "⚡ အတည်ပြုပါမည်",
  cols: {
    employee: "ဝန်ထမ်း",
    dept: "ဌာန",
    sop: "SOP",
    kpi: "KPI",
    culture: "ယဉ်ကျေးမှု",
    cpi: "CPI",
    grade: "အဆင့်",
    bonus: "ဆုကြေး",
    scorecard: "အမှတ်စာရင်း"
  }
};

enJson.performance = enPerf;
myJson.performance = myPerf;

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2), 'utf8');
console.log('Updated loc dictionaries');
