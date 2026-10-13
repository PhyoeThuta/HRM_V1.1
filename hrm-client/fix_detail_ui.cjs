const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Replace the back button
offb = offb.replace(
  '<button onClick={onBack} className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">← {t(\'hrm.offboarding.allOffboarding\')}</button>',
  '<button onClick={onBack} className="text-sm text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">← {t(\'hrm.offboarding.allOffboarding\')}</button>' // it's already there, just verify
);

// Replace the conduct exit interview button
// Current:
//         <button
//           onClick={() => onShowEI(ob)}
//           className="text-sm font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-xl transition-colors"
//         >
//           📋 Conduct Exit Interview →
//         </button>
offb = offb.replace(
  '📋 Conduct Exit Interview →',
  '📋 {t(\'hrm.offboarding.conductExitInterview\')} →'
);
offb = offb.replace(
  'className="text-sm font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-xl transition-colors"',
  'className="text-sm font-semibold text-white bg-[#6e7d14] hover:bg-[#5a6610] px-3 py-1.5 rounded-xl transition-colors shadow-sm"'
);

fs.writeFileSync(offbPath, offb, 'utf8');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

enJson.offboarding.allOffboarding = "All Offboarding";
myJson.offboarding.allOffboarding = "အလုပ်ထွက်ခြင်းများ";

enJson.offboarding.conductExitInterview = "Conduct Exit Interview";
myJson.offboarding.conductExitInterview = "အလုပ်ထွက် အင်တာဗျူး ပြုလုပ်ရန်";

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

console.log('Fixed back button and exit interview button');
