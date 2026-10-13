import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '../hrm-client/src/locales/en/hrm.json');
const myPath = path.join(__dirname, '../hrm-client/src/locales/my/hrm.json');

const updateJson = (p, lang) => {
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  
  if (lang === 'en') {
    data.positions.noStaffAssigned = 'No staff currently assigned to this position.';
  } else {
    data.positions.noStaffAssigned = 'ဤရာထူးအတွက် လက်ရှိဝန်ထမ်း သတ်မှတ်ထားခြင်း မရှိပါ။';
  }

  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

updateJson(enPath, 'en');
updateJson(myPath, 'my');

console.log('Translations updated.');
