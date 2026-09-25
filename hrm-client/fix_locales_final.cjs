const fs = require('fs');
const path = require('path');

// 1. Fix LanguageContext tDyn to avoid double prefixing and do smart fallbacks
const lcPath = path.join(__dirname, 'src/context/LanguageContext.jsx');
let lc = fs.readFileSync(lcPath, 'utf8');

const newTDyn = `  const tDyn = useCallback((prefix, val) => {
    if (!val) return val;
    if (typeof val === 'string' && val.startsWith('hrm.')) {
      const r = t(val);
      return r === val ? val : r;
    }
    const k = \`\${prefix}.\${val}\`;
    const r = t(k);
    if (r !== k) return r;
    
    if (typeof val === 'string') {
      const camelVal = val.replace(/(?:^\\w|[A-Z]|\\b\\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\\s+/g, '');
      const k2 = \`\${prefix}.\${camelVal}\`;
      const r2 = t(k2);
      if (r2 !== k2) return r2;
      
      const k3 = \`\${prefix}.\${val.toLowerCase()}\`;
      const r3 = t(k3);
      if (r3 !== k3) return r3;
    }
    
    return val;
  }, [t]);`;

lc = lc.replace(/const tDyn = useCallback\(\(prefix, val\) => \{[\s\S]*?\}, \[t\]\);/, newTDyn);
fs.writeFileSync(lcPath, lc, 'utf8');

// 2. Fix Offboarding.jsx missing tDyn wrappers and text
const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let offb = fs.readFileSync(offbPath, 'utf8');

// Line 307
offb = offb.replace(
  `{ob.exit_type && <><span>·</span><span>{t('hrm.offboarding.exit')}: {ob.exit_type}</span></>}`,
  `{ob.exit_type && <><span>·</span><span>{t('hrm.offboarding.exit')}: {tDyn('hrm.offboarding.exitTypes', ob.exit_type)}</span></>}`
);

// Line 606 & 607
offb = offb.replace(
  `{o.reason && <><span>·</span><span>{o.reason}</span></>}`,
  `{o.reason && <><span>·</span><span>{tDyn('hrm.offboarding.reasons', o.reason)}</span></>}`
);

fs.writeFileSync(offbPath, offb, 'utf8');

// 3. Add missing translations
const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

const enNew = {
  clearanceTasks: "Clearance Tasks",
  exit: "Exit Type",
  resignation: "Resignation Date",
  lastDay: "Last Working Day",
  last: "Last Working Day",
  handoverIncomplete: "Handover Incomplete",
  details: "Details"
};

const myNew = {
  clearanceTasks: "ရှင်းလင်းရေး တာဝန်များ",
  exit: "အလုပ်ထွက် အမျိုးအစား",
  resignation: "နုတ်ထွက်စာတင်သည့်ရက်",
  lastDay: "နောက်ဆုံး လုပ်ငန်းခွင်ရက်",
  last: "နောက်ဆုံး လုပ်ငန်းခွင်ရက်",
  handoverIncomplete: "တာဝန်လွှဲပြောင်းမှု မပြီးပြည့်စုံသေးပါ",
  details: "အသေးစိတ်များ"
};

Object.assign(enJson.offboarding, enNew);
Object.assign(myJson.offboarding, myNew);

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

console.log('Fixed tDyn and missing keys');
