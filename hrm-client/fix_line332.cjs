const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

offb = offb.replace(
  `{pct === 100 && !handoverBlocking ? '✓ {t(\\'hrm.offboarding.releaseFinalSettlement\\')}' : handoverBlocking ? t('hrm.offboarding.handoverIncomplete') : t('hrm.offboarding.holdFinalPayroll')}`,
  `{pct === 100 && !handoverBlocking ? '✓ ' + t('hrm.offboarding.releaseFinalSettlement') : handoverBlocking ? t('hrm.offboarding.handoverIncomplete') : t('hrm.offboarding.holdFinalPayroll')}`
);

fs.writeFileSync(offbPath, offb, 'utf8');
console.log('Fixed line 332');
