const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Replace hardcoded clearanceItems2 in Main List View
offb = offb.replace(
  `          const clearanceItems2 = [
            { field: 'laptop_returned', label: 'Laptop Returned', icon: '💻' },
            { field: 'access_card_returned', label: 'Access Card', icon: '🪪' },
            { field: 'nda_signed', label: 'NDA Signed', icon: '📝' },
            { field: 'knowledge_transfer', label: 'Knowledge Transfer', icon: '🔄' },
          ];`,
  `          const clearanceItems2 = [
            { field: 'laptop_returned', label: t('hrm.offboarding.laptopReturned'), icon: '💻' },
            { field: 'access_card_returned', label: t('hrm.offboarding.accessCard'), icon: '🪪' },
            { field: 'nda_signed', label: t('hrm.offboarding.ndaSigned'), icon: '📝' },
            { field: 'knowledge_transfer', label: tDyn('hrm.offboarding.owners', 'Knowledge Transfer'), icon: '🔄' },
          ];`
);

// Replace hardcoded Knowledge Transfer in Detail View
offb = offb.replace(
  `{ field: 'knowledge_transfer', label: 'Knowledge Transfer', icon: '🔄' }`,
  `{ field: 'knowledge_transfer', label: tDyn('hrm.offboarding.owners', 'Knowledge Transfer'), icon: '🔄' }`
);

// Hardcoded text in Offboarding component buttons etc
offb = offb.replace(
  `✓ Release Final Settlement`,
  `✓ {t('hrm.offboarding.releaseFinalSettlement')}`
);
offb = offb.replace(
  `{pct === 100 && !handoverBlocking ? '✓ Release Final Settlement' : handoverBlocking ? t('hrm.offboarding.handoverIncomplete') : t('hrm.offboarding.holdFinalPayroll')}`,
  `{pct === 100 && !handoverBlocking ? '✓ ' + t('hrm.offboarding.releaseFinalSettlement') : handoverBlocking ? t('hrm.offboarding.handoverIncomplete') : t('hrm.offboarding.holdFinalPayroll')}`
);
offb = offb.replace(
  `Exit Interview`,
  `{t('hrm.offboarding.exitInterview')}`
);

fs.writeFileSync(offbPath, offb, 'utf8');

// Update locales for clearance and others
const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

enJson.offboarding.laptopReturned = "Laptop Returned";
myJson.offboarding.laptopReturned = "လက်ပ်တော့ ပြန်အပ်ပြီး";

enJson.offboarding.accessCard = "Access Card";
myJson.offboarding.accessCard = "ဝင်ပေါက်ကတ်";

enJson.offboarding.ndaSigned = "NDA Signed";
myJson.offboarding.ndaSigned = "NDA လက်မှတ်ထိုးပြီး";

enJson.offboarding.releaseFinalSettlement = "Release Final Settlement";
myJson.offboarding.releaseFinalSettlement = "နောက်ဆုံးစာရင်းရှင်းလင်းမှု ထုတ်ပေးရန်";

enJson.offboarding.holdFinalPayroll = "Hold Final Payroll";
myJson.offboarding.holdFinalPayroll = "နောက်ဆုံးလစာကို ထိန်းသိမ်းထားရန်";

enJson.offboarding.holdPayroll = "Hold Payroll";
myJson.offboarding.holdPayroll = "လစာကို ထိန်းသိမ်းထားရန်";

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

console.log('Offboarding UI text fully translated!');
