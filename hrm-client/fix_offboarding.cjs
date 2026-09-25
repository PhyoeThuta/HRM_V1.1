const fs = require('fs');
const path = require('path');

const offbPath = path.join(__dirname, 'src/pages/Offboarding.jsx');
let content = fs.readFileSync(offbPath, 'utf8');

// 1. Add tDyn to OffboardingDetail
content = content.replace(
  'const { t } = useLanguage();\n  const qc = useQueryClient();',
  'const { t } = useLanguage();\n  const tDyn = (prefix, val) => { if (!val) return val; const k = `${prefix}.${val}`; const r = t(k); return r === k ? val : r; };\n  const qc = useQueryClient();'
);

// 2. Add tDyn to Offboarding main component
content = content.replace(
  'export default function Offboarding() {\n  const { t } = useLanguage();',
  'export default function Offboarding() {\n  const { t } = useLanguage();\n  const tDyn = (prefix, val) => { if (!val) return val; const k = `${prefix}.${val}`; const r = t(k); return r === k ? val : r; };'
);

// 3. Update category title in OffboardingDetail
content = content.replace(
  '<h3 className="offb-cat-title text-sm font-bold text-white">{cat}</h3>',
  '<h3 className="offb-cat-title text-sm font-bold text-white">{tDyn("hrm.offboarding.owners", cat)}</h3>'
);

// 4. Update task name in OffboardingDetail
content = content.replace(
  '<p className={`offb-task-title text-sm font-medium ${isDone ? \'text-emerald-400 line-through\' : \'text-white\'}`}>{task.task_name}</p>',
  '<p className={`offb-task-title text-sm font-medium ${isDone ? \'text-emerald-400 line-through\' : \'text-white\'}`}>{tDyn("hrm.offboarding.tasksNames", task.task_name)}</p>'
);

// 5. Update task owner in OffboardingDetail
content = content.replace(
  '<p className="offb-task-meta text-xs text-slate-500">{t(\'hrm.offboarding.owner\')}: {task.responsible || task.assigned_to_role || \'HR\'}</p>',
  '<p className="offb-task-meta text-xs text-slate-500">{t(\'hrm.offboarding.owner\')}: {tDyn("hrm.offboarding.owners", task.responsible || task.assigned_to_role || "HR")}</p>'
);

// 6. Update dropdowns in Offboarding
content = content.replace(
  '{[t(\'hrm.offboarding.reasons.resignation\'), t(\'hrm.offboarding.reasons.termination\'), t(\'hrm.offboarding.reasons.retirement\'), t(\'hrm.offboarding.reasons.contractEnd\')].map(r => <option key={r} value={r}>{r}</option>)}',
  '{[{val:"Resignation", key:"resignation"}, {val:"Termination", key:"termination"}, {val:"Retirement", key:"retirement"}, {val:"Contract End", key:"contractEnd"}].map(r => <option key={r.val} value={r.val}>{t(`hrm.offboarding.reasons.${r.key}`)}</option>)}'
);

content = content.replace(
  '{[t(\'hrm.offboarding.exitTypes.voluntary\'), t(\'hrm.offboarding.exitTypes.involuntary\'), t(\'hrm.offboarding.exitTypes.mutual\'), t(\'hrm.offboarding.exitTypes.retirement\')].map(r => <option key={r} value={r}>{r}</option>)}',
  '{[{val:"Voluntary", key:"voluntary"}, {val:"Involuntary", key:"involuntary"}, {val:"Mutual Agreement", key:"mutual"}, {val:"Retirement", key:"retirement"}].map(r => <option key={r.val} value={r.val}>{t(`hrm.offboarding.exitTypes.${r.key}`)}</option>)}'
);

fs.writeFileSync(offbPath, content, 'utf8');
console.log('Offboarding updated!');
