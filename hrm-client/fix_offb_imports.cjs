const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Ensure ExitInterviewPage has it
offb = offb.replace(
  'function ExitInterviewPage({ ob, onClose }) {\n  const { t } = useLanguage();',
  'function ExitInterviewPage({ ob, onClose }) {\n  const { t, tDyn } = useLanguage();'
);

fs.writeFileSync(offbPath, offb, 'utf8');
console.log('Offboarding imports fixed.');
