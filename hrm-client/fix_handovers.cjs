const fs = require('fs');
const path = require('path');

// --- HandoverPanel.jsx ---
const panelPath = path.join(__dirname, 'src/components/handover/HandoverPanel.jsx');
let panel = fs.readFileSync(panelPath, 'utf8');

panel = panel.replace(
  'const { t } = useLanguage();',
  'const { t } = useLanguage();\n  const tDyn = (prefix, val) => { if (!val) return val; const k = `${prefix}.${val}`; const r = t(k); return r === k ? val : r; };'
);

panel = panel.replace(
  '{handover.status?.replace(/_/g, \' \')}',
  '{tDyn("hrm.offboarding.statusEnum", handover.status) || handover.status?.replace(/_/g, \' \')}'
);

fs.writeFileSync(panelPath, panel, 'utf8');


// --- HandoverChecklistReadOnly.jsx ---
const checkPath = path.join(__dirname, 'src/components/handover/HandoverChecklistReadOnly.jsx');
let check = fs.readFileSync(checkPath, 'utf8');

check = check.replace(
  'const { t } = useLanguage();',
  'const { t } = useLanguage();\n  const tDyn = (prefix, val) => { if (!val) return val; const k = `${prefix}.${val}`; const r = t(k); return r === k ? val : r; };'
);

check = check.replace(
  '{t(`hrm.handovers.categories.${cat}`) || CAT_LABELS[cat] || cat}',
  '{tDyn("hrm.handovers.categories", cat) || CAT_LABELS[cat] || cat}'
);

check = check.replace(
  '{item.status}',
  '{tDyn("hrm.offboarding.statusEnum", item.status) || item.status}'
);

fs.writeFileSync(checkPath, check, 'utf8');
console.log('Handovers updated!');
