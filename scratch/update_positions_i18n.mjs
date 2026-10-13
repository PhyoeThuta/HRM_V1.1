import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '../hrm-client/src/locales/en/hrm.json');
const myPath = path.join(__dirname, '../hrm-client/src/locales/my/hrm.json');

const updateJson = (p, updates) => {
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  
  if (!data.positions.toast) data.positions.toast = {};
  
  for (const [key, val] of Object.entries(updates.toast)) {
    data.positions.toast[key] = val;
  }
  
  data.positions.composeFbAnnouncement = updates.composeFbAnnouncement;
  data.positions.publishCareerPage = updates.publishCareerPage;

  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

updateJson(enPath, {
  toast: {
    addSuccess: "Position added successfully",
    addError: "Failed to add position",
    editSuccess: "Position updated successfully",
    editError: "Failed to update position",
    deleteSuccess: "Position deleted successfully",
    deleteError: "Failed to delete position"
  },
  composeFbAnnouncement: "Compose Facebook announcement (image + text)",
  publishCareerPage: "Publish to Career Page"
});

updateJson(myPath, {
  toast: {
    addSuccess: "ရာထူး အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်",
    addError: "ရာထူး အသစ်ထည့်သွင်းခြင်း မအောင်မြင်ပါ",
    editSuccess: "ရာထူး ပြင်ဆင်ခြင်း အောင်မြင်ပါသည်",
    editError: "ရာထူး ပြင်ဆင်ခြင်း မအောင်မြင်ပါ",
    deleteSuccess: "ရာထူး ဖျက်သိမ်းခြင်း အောင်မြင်ပါသည်",
    deleteError: "ရာထူး ဖျက်သိမ်းခြင်း မအောင်မြင်ပါ"
  },
  composeFbAnnouncement: "Facebook ကြေငြာချက် ရေးသားရန် (ပုံ + စာ)",
  publishCareerPage: "အလုပ်အကိုင်စာမျက်နှာသို့ လွှင့်တင်ရန်"
});

console.log('Position translations injected.');
