const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// assetClearance, pending, owner
enJson.offboarding.assetClearance = "Asset Clearance";
myJson.offboarding.assetClearance = "ပစ္စည်းပစ္စယ ရှင်းလင်းရေး";

enJson.offboarding.pending = "Pending";
myJson.offboarding.pending = "ဆိုင်းငံ့ထားသည်";

enJson.offboarding.owner = "Owner";
myJson.offboarding.owner = "တာဝန်ယူသူ";

enJson.offboarding.noTasks = "No tasks found. The offboarding task list will appear here.";
myJson.offboarding.noTasks = "တာဝန်များ မရှိပါ။ လုပ်ငန်းလွှဲပြောင်းမှု တာဝန်စာရင်း ဤနေရာတွင် ပေါ်လာပါမည်။";

// Update tasksNames
if (!enJson.offboarding.tasksNames) enJson.offboarding.tasksNames = {};
if (!myJson.offboarding.tasksNames) myJson.offboarding.tasksNames = {};

const enTasks = {
  "Return Laptop & Equipment": "Return Laptop & Equipment",
  "Revoke All System Access": "Revoke All System Access",
  "Complete Knowledge Transfer Doc": "Complete Knowledge Transfer Doc"
};

const myTasks = {
  "Return Laptop & Equipment": "လက်ပ်တော့နှင့် ပစ္စည်းများ ပြန်လည်အပ်နှံရန်",
  "Revoke All System Access": "စနစ်ဝင်ရောက်ခွင့် အားလုံးကို ရုပ်သိမ်းရန်",
  "Complete Knowledge Transfer Doc": "အသိပညာလွှဲပြောင်းမှု စာရွက်စာတမ်းကို ပြီးစီးအောင်လုပ်ရန်"
};

Object.assign(enJson.offboarding.tasksNames, enTasks);
Object.assign(myJson.offboarding.tasksNames, myTasks);

// Update owners
if (!enJson.offboarding.owners) enJson.offboarding.owners = {};
if (!myJson.offboarding.owners) myJson.offboarding.owners = {};

const enOwners = {
  "Manager": "Manager"
};
const myOwners = {
  "Manager": "မန်နေဂျာ"
};
Object.assign(enJson.offboarding.owners, enOwners);
Object.assign(myJson.offboarding.owners, myOwners);

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

// Update Offboarding.jsx for noTasks
const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');
offb = offb.replace(
  'No tasks found. The offboarding task list will appear here.',
  `{t('hrm.offboarding.noTasks')}`
);
fs.writeFileSync(offbPath, offb, 'utf8');

console.log('Final missing locales added.');
