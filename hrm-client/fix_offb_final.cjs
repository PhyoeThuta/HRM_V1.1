const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Fix clearanceItems2
offb = offb.replace(
  /const clearanceItems2 = \[\s*\{\s*field:\s*'laptop_returned',\s*label:\s*'Laptop Returned',\s*icon:\s*'💻'\s*\},\s*\{\s*field:\s*'access_card_returned',\s*label:\s*'Access Card',\s*icon:\s*'🪪'\s*\},\s*\{\s*field:\s*'nda_signed',\s*label:\s*'NDA Signed',\s*icon:\s*'📝'\s*\},\s*\{\s*field:\s*'knowledge_transfer',\s*label:\s*'Knowledge Transfer',\s*icon:\s*'🔄'\s*\}\s*\];/,
  `const clearanceItems2 = [
            { field: 'laptop_returned', label: t('hrm.offboarding.laptopReturned'), icon: '💻' },
            { field: 'access_card_returned', label: t('hrm.offboarding.accessCard'), icon: '🪪' },
            { field: 'nda_signed', label: t('hrm.offboarding.ndaSigned'), icon: '📝' },
            { field: 'knowledge_transfer', label: tDyn('hrm.offboarding.owners', 'Knowledge Transfer'), icon: '🔄' },
          ];`
);

// Start Offboarding
offb = offb.replace(
  `{addMutation.isPending ? 'Starting...' : '🚪 Start Offboarding'}`,
  `{addMutation.isPending ? 'Starting...' : '🚪 ' + t('hrm.offboarding.startOffboarding')}`
);

// ✓ Confirmed
offb = offb.replace(
  `{checked && <p className="text-[10px] text-emerald-400/70 mt-0.5">✓ Confirmed</p>}`,
  `{checked && <p className="text-[10px] text-emerald-400/70 mt-0.5">✓ {t('hrm.offboarding.confirmed')}</p>}`
);

// tasks string
offb = offb.replace(
  `{tasksDone}/{tasksTotal} tasks`,
  `{tasksDone}/{tasksTotal} {t('hrm.offboarding.tasks')}`
);

// No tasks found
offb = offb.replace(
  `No offboarding records yet.`,
  `{t('hrm.offboarding.noRecords')}`
);

fs.writeFileSync(offbPath, offb, 'utf8');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

enJson.offboarding.startOffboarding = "Start Offboarding";
myJson.offboarding.startOffboarding = "လုပ်ငန်းလွှဲပြောင်းမှုကို စတင်မည်";

enJson.offboarding.confirmed = "Confirmed";
myJson.offboarding.confirmed = "အတည်ပြုပြီး";

enJson.offboarding.noRecords = "No offboarding records yet.";
myJson.offboarding.noRecords = "တာဝန်လွှဲပြောင်းမှု မှတ်တမ်းများ မရှိသေးပါ။";

enJson.offboarding.tasks = "tasks";
myJson.offboarding.tasks = "တာဝန်များ";

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

console.log('Final Offboarding fixes applied.');
