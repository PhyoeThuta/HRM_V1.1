const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

const lines = offb.split('\n');
const lineIndex = lines.findIndex(line => line.includes('releaseFinalSettlement') && line.includes('handoverIncomplete') && line.includes('holdFinalPayroll'));

if (lineIndex !== -1) {
  lines[lineIndex] = "                {pct === 100 && !handoverBlocking ? '✓ ' + t('hrm.offboarding.releaseFinalSettlement') : handoverBlocking ? t('hrm.offboarding.handoverIncomplete') : t('hrm.offboarding.holdFinalPayroll')}";
  fs.writeFileSync(offbPath, lines.join('\n'), 'utf8');
  console.log('Fixed line ' + (lineIndex + 1));
} else {
  console.log('Line not found!');
}
