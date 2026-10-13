const fs = require('fs');
function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#161929\]/g, 'bg-surface-800');
  content = content.replace(/bg-\[#1e2235\]/g, 'bg-surface-800');
  content = content.replace(/w-full bg-white\/5 border border-white\/10 rounded-xl px-4 py-2\.5 text-sm text-white focus:border-(indigo|emerald)-500 outline-none/g, 'form-input focus:border-$1-500');
  content = content.replace(/className="bg-\[#1e2235\] text-white" /g, '');
  fs.writeFileSync(file, content);
}
fixFile('hrm-client/src/pages/payroll/RewardsMgmt.jsx');
fixFile('hrm-client/src/pages/portal/MyRewards.jsx');
console.log('Fixed');
