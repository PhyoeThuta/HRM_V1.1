const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// 1. Handovers Page Keys
const enHandovers = {
  title: "Handovers",
  subtitle: "Manage employee handovers and knowledge transfer",
  status: "Status",
  type: "Handover Type",
  employee: "Employee",
  all: "All Statuses",
  active: "Active",
  completed: "Completed",
  waived: "Waived",
  cancelled: "Cancelled",
  inProgress: "In Progress",
  pendingReview: "Pending Review",
  allTypes: "All Types",
  exitOffboarding: "Exit / Offboarding",
  leaveCoverage: "Leave Coverage",
  returnFromLeave: "Return From Leave",
  allEmployees: "All Employees",
  records: "records",
  items: "items",
  view: "View",
  noHandovers: "No handovers found matching filters.",
  modalTitle: "Handover Details",
  cols: {
    handover: "Handover",
    outgoing: "Outgoing",
    successor: "Successor",
    status: "Status",
    progress: "Progress",
    closed: "Closed"
  },
  kinds: {
    "Exit Handover": "Exit Handover",
    "Coverage Handover": "Coverage Handover",
    "Return Handover": "Return Handover"
  },
  types: {
    "exit": "Exit",
    "temporary_coverage": "Temporary Coverage",
    "return_from_leave": "Return From Leave"
  },
  checklistTitles: {
    "Role summary while on leave": "Role summary while on leave",
    "Shadowing / walkthrough completed": "Shadowing / walkthrough completed",
    "Active projects / deadlines during leave": "Active projects / deadlines during leave",
    "Pending approvals to watch": "Pending approvals to watch",
    "Key contacts to handle": "Key contacts to handle",
    "Systems / access acting person needs": "Systems / access acting person needs",
    "Notes for acting employee": "Notes for acting employee"
  },
  panel: {
    ...enJson.handovers?.panel,
    notAssigned: "Not assigned yet"
  }
};

const myHandovers = {
  title: "တာဝန်လွှဲပြောင်းခြင်းများ",
  subtitle: "ဝန်ထမ်း တာဝန်လွှဲပြောင်းခြင်းနှင့် အသိပညာလွှဲပြောင်းခြင်းများကို စီမံရန်",
  status: "အခြေအနေ",
  type: "လွှဲပြောင်းမှု အမျိုးအစား",
  employee: "ဝန်ထမ်း",
  all: "အခြေအနေအားလုံး",
  active: "လုပ်ဆောင်ဆဲ",
  completed: "ပြီးစီးသည်",
  waived: "ကင်းလွတ်ခွင့်ပေးသည်",
  cancelled: "ပယ်ဖျက်သည်",
  inProgress: "လုပ်ဆောင်နေသည်",
  pendingReview: "ပြန်လည်စစ်ဆေးရန် စောင့်ဆိုင်းနေသည်",
  allTypes: "အမျိုးအစားအားလုံး",
  exitOffboarding: "အလုပ်ထွက် / လုပ်ငန်းခွင်မှထွက်ခွာခြင်း",
  leaveCoverage: "ခွင့်ယူစဉ် ကိုယ်စားတာဝန်ယူခြင်း",
  returnFromLeave: "ခွင့်မှ ပြန်လည်ဝင်ရောက်ခြင်း",
  allEmployees: "ဝန်ထမ်းအားလုံး",
  records: "မှတ်တမ်းများ",
  items: "အချက်များ",
  view: "ကြည့်ရန်",
  noHandovers: "ရှာဖွေမှုနှင့် ကိုက်ညီသော တာဝန်လွှဲပြောင်းမှုများ မရှိပါ။",
  modalTitle: "တာဝန်လွှဲပြောင်းမှု အသေးစိတ်",
  cols: {
    handover: "လွှဲပြောင်းမှု",
    outgoing: "လွှဲပြောင်းပေးသူ",
    successor: "တာဝန်ယူမည့်သူ",
    status: "အခြေအနေ",
    progress: "ပြီးစီးမှု",
    closed: "ပိတ်သိမ်းသည့်ရက်"
  },
  kinds: {
    "Exit Handover": "အလုပ်ထွက် တာဝန်လွှဲပြောင်းခြင်း",
    "Coverage Handover": "ကိုယ်စားတာဝန်လွှဲပြောင်းခြင်း",
    "Return Handover": "ပြန်လည်ဝင်ရောက်ခြင်း တာဝန်လွှဲပြောင်းခြင်း"
  },
  types: {
    "exit": "အလုပ်ထွက်",
    "temporary_coverage": "ယာယီ ကိုယ်စားတာဝန်ယူခြင်း",
    "return_from_leave": "ခွင့်မှ ပြန်လည်ဝင်ရောက်ခြင်း"
  },
  checklistTitles: {
    "Role summary while on leave": "ခွင့်ယူစဉ်အတွင်း တာဝန်အကျဉ်းချုပ်",
    "Shadowing / walkthrough completed": "လက်တွေ့ သင်ကြားပြသမှု ပြီးစီးပါသည်",
    "Active projects / deadlines during leave": "ခွင့်ယူစဉ်အတွင်း လုပ်ဆောင်ရမည့် စီမံကိန်းများနှင့် နောက်ဆုံးရက်များ",
    "Pending approvals to watch": "စောင့်ကြည့်ရမည့် ခွင့်ပြုချက်များ",
    "Key contacts to handle": "ဆက်သွယ်ရမည့် အဓိကပုဂ္ဂိုလ်များ",
    "Systems / access acting person needs": "ကိုယ်စားတာဝန်ယူသူ လိုအပ်မည့် စနစ်များနှင့် ဝင်ရောက်ခွင့်များ",
    "Notes for acting employee": "ကိုယ်စားတာဝန်ယူမည့် ဝန်ထမ်းအတွက် မှတ်စုများ"
  },
  panel: {
    ...myJson.handovers?.panel,
    notAssigned: "တာဝန်ပေးထားခြင်း မရှိသေးပါ"
  }
};

if (!enJson.handovers) enJson.handovers = {};
if (!myJson.handovers) myJson.handovers = {};

Object.assign(enJson.handovers, enHandovers);
Object.assign(myJson.handovers, myHandovers);

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

// 2. Update Handovers.jsx
const handoversPath = path.join(__dirname, 'src/pages/Handovers.jsx');
let handoversSrc = fs.readFileSync(handoversPath, 'utf8');

// Add tDyn to Handovers.jsx if missing
if (!handoversSrc.includes('tDyn =')) {
  handoversSrc = handoversSrc.replace('const { t } = useLanguage();', 'const { t, tDyn } = useLanguage();');
}

// Replace h.handover_label || h.handover_kind
handoversSrc = handoversSrc.replace(
  '<p className="ho-cell-primary text-white font-medium">{h.handover_label || h.handover_kind}</p>',
  '<p className="ho-cell-primary text-white font-medium">{tDyn("hrm.handovers.kinds", h.handover_label || h.handover_kind)}</p>'
);

// Replace h.trigger_type
handoversSrc = handoversSrc.replace(
  '<p className="ho-cell-secondary text-[10px] text-slate-500 capitalize">{h.trigger_type?.replace(/_/g, \' \')}</p>',
  '<p className="ho-cell-secondary text-[10px] text-slate-500 capitalize">{tDyn("hrm.handovers.types", h.trigger_type) || h.trigger_type?.replace(/_/g, \' \')}</p>'
);

// Replace h.status
handoversSrc = handoversSrc.replace(
  '{h.status?.replace(/_/g, \' \')}',
  '{tDyn("hrm.offboarding.statusEnum", h.status) || h.status?.replace(/_/g, \' \')}'
);

fs.writeFileSync(handoversPath, handoversSrc, 'utf8');

// 3. Update HandoverPanel.jsx
const panelPath = path.join(__dirname, 'src/components/handover/HandoverPanel.jsx');
let panelSrc = fs.readFileSync(panelPath, 'utf8');

panelSrc = panelSrc.replace(
  '<span className="handover-panel-meta-val text-white font-semibold">{handover.successor_name || \'Not assigned yet\'}</span>',
  '<span className="handover-panel-meta-val text-white font-semibold">{handover.successor_name || t(\'hrm.handovers.panel.notAssigned\')}</span>'
);

fs.writeFileSync(panelPath, panelSrc, 'utf8');

// 4. Update HandoverChecklistReadOnly.jsx
const checklistPath = path.join(__dirname, 'src/components/handover/HandoverChecklistReadOnly.jsx');
let checklistSrc = fs.readFileSync(checklistPath, 'utf8');

checklistSrc = checklistSrc.replace(
  '{item.title}',
  '{tDyn("hrm.handovers.checklistTitles", item.title) || item.title}'
);

checklistSrc = checklistSrc.replace(
  '<p className="handover-panel-item-notes text-xs text-slate-500 italic mt-1">{t(\'hrm.handovers.checklist.markedAs\')} {item.status?.replace(/_/g, \' \')}</p>',
  '<p className="handover-panel-item-notes text-xs text-slate-500 italic mt-1">{t(\'hrm.handovers.checklist.markedAs\')} {tDyn("hrm.offboarding.statusEnum", item.status) || item.status?.replace(/_/g, \' \')}</p>'
);

fs.writeFileSync(checklistPath, checklistSrc, 'utf8');

console.log('Fixed handovers localization');
