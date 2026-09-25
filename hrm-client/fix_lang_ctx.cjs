const fs = require('fs');
const path = require('path');

const lcPath = path.join(__dirname, 'src/context/LanguageContext.jsx');
let lc = fs.readFileSync(lcPath, 'utf8');

if (!lc.includes('const tDyn = useCallback')) {
  const tDynCode = `
  const tDyn = useCallback((prefix, val) => {
    if (!val) return val;
    const k = \`\${prefix}.\${val}\`;
    const r = t(k);
    return r === k ? val : r;
  }, [t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tDyn }}>`;
  
  lc = lc.replace('return (\n    <LanguageContext.Provider value={{ language, setLanguage, t }}>', tDynCode);
  fs.writeFileSync(lcPath, lc, 'utf8');
}

// Now replace in Offboarding.jsx
const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Remove local tDyns
offb = offb.replace(/const tDyn = [^;]+;/g, '');
offb = offb.replace(/const { t } = useLanguage\(\);/g, 'const { t, tDyn } = useLanguage();');

// Also fix Exit Interview hardcoded keys and add translations for them
const eiReplacements = [
  ['t(\'hrm.offboarding.ratings.poor\')', 't(\'hrm.offboarding.ratings.poor\')'],
  // ... wait, I'll just use a regex for all t() to t() to do nothing, but I need to add keys to json files.
];

fs.writeFileSync(offbPath, offb, 'utf8');

// Replace in HandoverPanel
const hpPath = path.join(__dirname, 'src/components/handover/HandoverPanel.jsx');
let hp = fs.readFileSync(hpPath, 'utf8');
hp = hp.replace(/const tDyn = [^;]+;/g, '');
hp = hp.replace(/const { t } = useLanguage\(\);/g, 'const { t, tDyn } = useLanguage();');
fs.writeFileSync(hpPath, hp, 'utf8');

// Replace in HandoverChecklistReadOnly
const hcPath = path.join(__dirname, 'src/components/handover/HandoverChecklistReadOnly.jsx');
let hc = fs.readFileSync(hcPath, 'utf8');
hc = hc.replace(/const tDyn = [^;]+;/g, '');
hc = hc.replace(/const { t } = useLanguage\(\);/g, 'const { t, tDyn } = useLanguage();');
fs.writeFileSync(hcPath, hc, 'utf8');

console.log('Language context and components updated.');
