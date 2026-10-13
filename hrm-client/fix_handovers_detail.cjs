const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

if (!enJson.handovers.checklistTitles) enJson.handovers.checklistTitles = {};
if (!myJson.handovers.checklistTitles) myJson.handovers.checklistTitles = {};

const enTasks = {
  "Role summary": "Role summary",
  "Daily & weekly responsibilities": "Daily & weekly responsibilities",
  "Training / shadowing given to successor": "Training / shadowing given to successor",
  "Common issues & how to solve them": "Common issues & how to solve them",
  "Open projects & tasks": "Open projects & tasks",
  "Pending approvals you own": "Pending approvals you own",
  "Outstanding expenses or company assets in your care": "Outstanding expenses or company assets in your care",
  "Key internal contacts": "Key internal contacts",
  "Key external contacts (clients/vendors)": "Key external contacts (clients/vendors)",
  "Important file & folder locations": "Important file & folder locations",
  "Handover document upload": "Handover document upload",
  "Systems & tools used": "Systems & tools used"
};

const myTasks = {
  "Role summary": "ရာထူးတာဝန် အကျဉ်းချုပ်",
  "Daily & weekly responsibilities": "နေ့စဉ်နှင့် အပတ်စဉ် တာဝန်များ",
  "Training / shadowing given to successor": "တာဝန်ယူမည့်သူအား သင်ကြားပြသမှု",
  "Common issues & how to solve them": "အဖြစ်များသော ပြဿနာများနှင့် ဖြေရှင်းနည်းများ",
  "Open projects & tasks": "လုပ်ဆောင်ဆဲ စီမံကိန်းများနှင့် တာဝန်များ",
  "Pending approvals you own": "ခွင့်ပြုရန် ကျန်ရှိနေသော ကိစ္စရပ်များ",
  "Outstanding expenses or company assets in your care": "ပေးရန်ကျန်သော အသုံးစရိတ် သို့မဟုတ် ကုမ္ပဏီပိုင်ပစ္စည်းများ",
  "Key internal contacts": "ဆက်သွယ်ရမည့် အတွင်းပိုင်း ဝန်ထမ်းများ",
  "Key external contacts (clients/vendors)": "ဆက်သွယ်ရမည့် ပြင်ပပုဂ္ဂိုလ်များ (ဖောက်သည်များ/ကုန်သည်များ)",
  "Important file & folder locations": "အရေးကြီးသော ဖိုင်နှင့် ဖိုဒါ တည်နေရာများ",
  "Handover document upload": "တာဝန်လွှဲပြောင်းမှု စာရွက်စာတမ်း တင်ရန်",
  "Systems & tools used": "အသုံးပြုသော စနစ်များနှင့် ကိရိယာများ"
};

Object.assign(enJson.handovers.checklistTitles, enTasks);
Object.assign(myJson.handovers.checklistTitles, myTasks);

if (!enJson.handovers.kinds) enJson.handovers.kinds = {};
if (!myJson.handovers.kinds) myJson.handovers.kinds = {};

enJson.handovers.kinds["Exit handover"] = "Exit handover";
myJson.handovers.kinds["Exit handover"] = "အလုပ်ထွက် တာဝန်လွှဲပြောင်းခြင်း";

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2), 'utf8');

const panelPath = path.join(__dirname, 'src/components/handover/HandoverPanel.jsx');
let panel = fs.readFileSync(panelPath, 'utf8');
panel = panel.replace(
  "const title = handover.handover_label || t('hrm.handovers.panel.defaultTitle') || 'Employee Handover';",
  "const title = tDyn('hrm.handovers.kinds', handover.handover_label || handover.handover_kind) || t('hrm.handovers.panel.defaultTitle') || 'Employee Handover';"
);
fs.writeFileSync(panelPath, panel, 'utf8');

console.log('Added detail locales and fixed HandoverPanel title');
