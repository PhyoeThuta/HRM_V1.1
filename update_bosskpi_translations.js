const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'hrm-client', 'src', 'locales', 'en', 'hrm.json');
const myPath = path.join(__dirname, 'hrm-client', 'src', 'locales', 'my', 'hrm.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const my = JSON.parse(fs.readFileSync(myPath, 'utf8'));

const enBossKpi = {
  title: 'KPI Assignments (Boss)',
  subtitle: 'Manage top-level KPIs for employees',
  assignNew: 'Assign New KPI',
  loading: 'Loading...',
  cols: {
    title: 'Title',
    assignedTo: 'Assigned To',
    dueDate: 'Due Date',
    status: 'Status',
    actions: 'Actions'
  },
  companyWide: 'Company Wide',
  none: 'None',
  statusAssigned: 'Assigned',
  statusInProgress: 'In Progress',
  statusCompleted: 'Completed',
  statusCancelled: 'Cancelled',
  remove: 'Remove',
  noKpis: 'No KPIs assigned yet.',
  modal: {
    title: 'Assign New KPI',
    titleLabel: 'KPI Title',
    descLabel: 'Description',
    assignRole: 'Assign to Role',
    specificEmp: 'Specific Employee',
    roleHr: 'HR Manager',
    roleFinance: 'Finance',
    roleAll: 'All Employees',
    assignEmp: 'Assign to Employee',
    cancel: 'Cancel',
    assignBtn: 'Assign KPI'
  }
};

const myBossKpi = {
  title: 'KPI သတ်မှတ်ချက်များ (သူဌေး)',
  subtitle: 'ဝန်ထမ်းများအတွက် အဓိက KPI များကို စီမံရန်',
  assignNew: 'KPI အသစ် သတ်မှတ်ရန်',
  loading: 'အချက်အလက်များ ရယူနေပါသည်...',
  cols: {
    title: 'ခေါင်းစဉ်',
    assignedTo: 'တာဝန်ပေးအပ်ခံရသူ',
    dueDate: 'နောက်ဆုံးထားရမည့်ရက်',
    status: 'အခြေအနေ',
    actions: 'လုပ်ဆောင်ချက်များ'
  },
  companyWide: 'ကုမ္ပဏီတစ်ခုလုံး',
  none: 'မရှိပါ',
  statusAssigned: 'တာဝန်ပေးထားဆဲ',
  statusInProgress: 'လုပ်ဆောင်ဆဲ',
  statusCompleted: 'ပြီးစီးပြီ',
  statusCancelled: 'ပယ်ဖျက်လိုက်သည်',
  remove: 'ဖယ်ရှားရန်',
  noKpis: 'KPI သတ်မှတ်ထားခြင်း မရှိသေးပါ။',
  modal: {
    title: 'KPI အသစ် သတ်မှတ်ရန်',
    titleLabel: 'KPI ခေါင်းစဉ်',
    descLabel: 'အကြောင်းအရာ',
    assignRole: 'ရာထူးဖြင့် သတ်မှတ်ရန်',
    specificEmp: 'သီးသန့်ဝန်ထမ်း',
    roleHr: 'HR မန်နေဂျာ',
    roleFinance: 'ဘဏ္ဍာရေး',
    roleAll: 'ဝန်ထမ်းအားလုံး',
    assignEmp: 'ဝန်ထမ်းသို့ သတ်မှတ်ရန်',
    cancel: 'ပယ်ဖျက်မည်',
    assignBtn: 'KPI သတ်မှတ်မည်'
  }
};

en.bosskpi = { ...en.bosskpi, ...enBossKpi };
my.bosskpi = { ...my.bosskpi, ...myBossKpi };

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(myPath, JSON.stringify(my, null, 2));
console.log('Successfully added bosskpi to en and my hrm.json');
