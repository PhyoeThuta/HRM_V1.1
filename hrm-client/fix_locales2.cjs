const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// Adding offboarding reasons, exitTypes, owner, task names, and missing handover things
if (!enJson.offboarding) enJson.offboarding = {};
if (!myJson.offboarding) myJson.offboarding = {};

// Reasons
enJson.offboarding.reasons = {
  resignation: "Resignation",
  termination: "Termination",
  retirement: "Retirement",
  contractEnd: "Contract End"
};
myJson.offboarding.reasons = {
  resignation: "နုတ်ထွက်ခြင်း",
  termination: "ထုတ်ပယ်ခြင်း",
  retirement: "အငြိမ်းစားယူခြင်း",
  contractEnd: "စာချုပ်သက်တမ်းကုန်ဆုံးခြင်း"
};

// Exit Types
enJson.offboarding.exitTypes = {
  voluntary: "Voluntary",
  involuntary: "Involuntary",
  mutual: "Mutual Agreement",
  retirement: "Retirement"
};
myJson.offboarding.exitTypes = {
  voluntary: "မိမိသဘောဆန္ဒအရ",
  involuntary: "အလုပ်ရှင်ဆန္ဒအရ",
  mutual: "နှစ်ဦးသဘောတူ",
  retirement: "အငြိမ်းစား"
};

// Owners (Categories / Departments)
enJson.offboarding.owners = {
  Facilities: "Facilities",
  Legal: "Legal",
  "Knowledge Transfer": "Knowledge Transfer",
  Finance: "Finance",
  HR: "HR",
  IT: "IT"
};
myJson.offboarding.owners = {
  Facilities: "အဆောက်အဦနှင့် ပြုပြင်ထိန်းသိမ်းရေး",
  Legal: "ဥပဒေရေးရာ",
  "Knowledge Transfer": "လုပ်ငန်း အသိပညာ လွှဲပြောင်းခြင်း",
  Finance: "ဘဏ္ဍာရေး",
  HR: "လူ့စွမ်းအားအရင်းအမြစ်",
  IT: "သတင်းအချက်အလက်နည်းပညာ"
};

// Offboarding Task Names
enJson.offboarding.tasksNames = {
  "Return Access Card & Keys": "Return Access Card & Keys",
  "Sign NDA Exit Confirmation": "Sign NDA Exit Confirmation",
  "Complete Knowledge Transfer": "Complete Knowledge Transfer",
  "Handover Projects & Tasks": "Handover Projects & Tasks",
  "Clear Outstanding Expenses": "Clear Outstanding Expenses",
  "Final Payroll Calculation": "Final Payroll Calculation",
  "Return Company Documents": "Return Company Documents",
  "Schedule Exit Interview": "Schedule Exit Interview"
};
myJson.offboarding.tasksNames = {
  "Return Access Card & Keys": "ဝင်ပေါက်ကတ်နှင့် သော့များ ပြန်လည်အပ်နှံရန်",
  "Sign NDA Exit Confirmation": "NDA သဘောတူညီချက် လက်မှတ်ရေးထိုးရန်",
  "Complete Knowledge Transfer": "လုပ်ငန်း အသိပညာ လွှဲပြောင်းမှုကို အပြီးသတ်ရန်",
  "Handover Projects & Tasks": "စီမံကိန်းများနှင့် တာဝန်များ လွှဲပြောင်းရန်",
  "Clear Outstanding Expenses": "ကျန်ရှိနေသော အသုံးစရိတ်များကို ရှင်းလင်းရန်",
  "Final Payroll Calculation": "နောက်ဆုံးလစာ တွက်ချက်ရန်",
  "Return Company Documents": "ကုမ္ပဏီ စာရွက်စာတမ်းများ ပြန်လည်အပ်နှံရန်",
  "Schedule Exit Interview": "အလုပ်ထွက် အင်တာဗျူး အချိန်သတ်မှတ်ရန်"
};

// Statuses
enJson.offboarding.statusEnum = {
  pending: "Pending",
  completed: "Completed",
  in_progress: "In Progress",
  done: "Done",
  not_applicable: "Not Applicable",
  draft: "Draft",
  pending_successor: "Pending Successor",
  pending_review: "Pending Review",
  waived: "Waived",
  cancelled: "Cancelled"
};
myJson.offboarding.statusEnum = {
  pending: "ဆိုင်းငံ့ထားသည်",
  completed: "ပြီးစီးသည်",
  in_progress: "လုပ်ဆောင်ဆဲ",
  done: "ပြီးစီးသည်",
  not_applicable: "သက်ဆိုင်မှုမရှိပါ",
  draft: "မူကြမ်း",
  pending_successor: "တာဝန်ယူမည့်သူ စောင့်ဆိုင်းနေသည်",
  pending_review: "ပြန်လည်စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  waived: "ကင်းလွတ်ခွင့်ပေးသည်",
  cancelled: "ပယ်ဖျက်သည်"
};

// Handovers section
if (!enJson.handovers) enJson.handovers = {};
if (!myJson.handovers) myJson.handovers = {};

if (!enJson.handovers.categories) enJson.handovers.categories = {};
enJson.handovers.categories = {
  knowledge_transfer: "Knowledge Transfer",
  pending_work: "Active Work",
  clients_contacts: "Contacts",
  documents: "Documents",
  systems_access: "Systems & Access",
  other: "Other"
};
if (!myJson.handovers.categories) myJson.handovers.categories = {};
myJson.handovers.categories = {
  knowledge_transfer: "လုပ်ငန်း အသိပညာ လွှဲပြောင်းခြင်း",
  pending_work: "လက်ရှိ လုပ်ဆောင်ဆဲ အလုပ်များ",
  clients_contacts: "ဆက်သွယ်ရန်များ",
  documents: "စာရွက်စာတမ်းများ",
  systems_access: "စနစ်များ နှင့် ဝင်ရောက်ခွင့်",
  other: "အခြား"
};

if (!enJson.handovers.checklist) enJson.handovers.checklist = {};
enJson.handovers.checklist = {
  ...enJson.handovers.checklist,
  successorAck: "Successor Acknowledged",
  markedAs: "Marked as",
  viewAttachment: "View Attachment",
  noItems: "No checklist items found."
};
if (!myJson.handovers.checklist) myJson.handovers.checklist = {};
myJson.handovers.checklist = {
  ...myJson.handovers.checklist,
  successorAck: "တာဝန်ယူမည့်သူ အတည်ပြုပြီး",
  markedAs: "အခြေအနေ -",
  viewAttachment: "ပူးတွဲဖိုင် ကြည့်ရန်",
  noItems: "လုပ်ငန်းစဉ် အချက်အလက်များ မရှိပါ။"
};

// Panel translations
enJson.handovers.panel = {
  defaultTitle: "Employee Handover",
  outgoing: "Outgoing",
  successor: "Successor",
  leave: "Leave",
  deadline: "Deadline",
  checklistComplete: "Checklist Complete",
  waitingOutgoing: "Waiting for outgoing employee to submit handover",
  noCompletedItems: "No completed items for successor to acknowledge",
  successorAck: "Successor Acknowledgement",
  readyForHR: "Ready for HR Approval",
  mustAck: "Successor must acknowledge items",
  assignSuccessor: "Assign Successor",
  selectSuccessor: "Select Successor",
  saveSuccessor: "Save Successor",
  approveHandover: "Approve Handover",
  waitingSuccessor: "Waiting for Successor",
  waitingOutgoingSubmit: "Waiting for Outgoing to Submit",
  waiveHandover: "Waive Handover",
  waiveDesc: "Waiving will skip this handover requirement.",
  waiveReason: "Reason for waiving...",
  confirmWaive: "Confirm Waive",
  closed: "Closed on",
  waived: "Waived"
};

myJson.handovers.panel = {
  defaultTitle: "ဝန်ထမ်း တာဝန်လွှဲပြောင်းခြင်း",
  outgoing: "လွှဲပြောင်းပေးမည့်သူ",
  successor: "တာဝန်ယူမည့်သူ",
  leave: "ခွင့်",
  deadline: "နောက်ဆုံးရက်",
  checklistComplete: "လွှဲပြောင်းမှု ရာခိုင်နှုန်း",
  waitingOutgoing: "လွှဲပြောင်းပေးမည့်သူ၏ တင်သွင်းမှုကို စောင့်ဆိုင်းနေပါသည်",
  noCompletedItems: "အတည်ပြုရန် ပြီးစီးသော အချက်များ မရှိသေးပါ",
  successorAck: "တာဝန်ယူမည့်သူ အတည်ပြုချက်",
  readyForHR: "HR အတည်ပြုချက်အတွက် အဆင်သင့်ဖြစ်ပါပြီ",
  mustAck: "တာဝန်ယူမည့်သူ အတည်ပြုရန် လိုအပ်သည်",
  assignSuccessor: "တာဝန်ယူမည့်သူ သတ်မှတ်ရန်",
  selectSuccessor: "တာဝန်ယူမည့်သူ ရွေးချယ်ပါ",
  saveSuccessor: "တာဝန်ယူမည့်သူ သိမ်းဆည်းရန်",
  approveHandover: "လွှဲပြောင်းမှုကို အတည်ပြုရန်",
  waitingSuccessor: "တာဝန်ယူမည့်သူကို စောင့်ဆိုင်းနေပါသည်",
  waitingOutgoingSubmit: "လွှဲပြောင်းပေးမည့်သူ တင်သွင်းရန် စောင့်ဆိုင်းနေပါသည်",
  waiveHandover: "ကင်းလွတ်ခွင့်ပေးမည်",
  waiveDesc: "ကင်းလွတ်ခွင့်ပေးပါက ဤတာဝန်လွှဲပြောင်းမှုကို ကျော်သွားမည်ဖြစ်သည်။",
  waiveReason: "ကင်းလွတ်ခွင့်ပေးရသည့် အကြောင်းရင်း...",
  confirmWaive: "ကင်းလွတ်ခွင့်ပြုမည်",
  closed: "ပိတ်သိမ်းသည့်ရက် -",
  waived: "ကင်းလွတ်ခွင့်ပေးသည်"
};

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));
console.log('Locales updated successfully.');
