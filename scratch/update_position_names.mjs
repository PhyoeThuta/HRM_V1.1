import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.join(__dirname, '../hrm-client/src/locales/en/hrm.json');
const myPath = path.join(__dirname, '../hrm-client/src/locales/my/hrm.json');

const updateJson = (p, lang) => {
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  
  if (!data.positions.names) data.positions.names = {};

  const titles = [
    'Video Content Creator',
    'Head Chef',
    'Assistant Chef',
    'Sales Admin',
    'Accountant',
    'Commis',
    'House Keeper',
    'House Keeping Supervisor',
    'Kitchen Helper',
    'Marketing Manager',
    'Corporate Officer',
    'Executive Assistant',
    'Operation Supervisor',
    'Marketing Supervisor',
    'IT Officer',
    'Content Creator',
    'Project Manager'
  ];

  const myTranslations = {
    videocontentcreator: 'ဗီဒီယို ဖန်တီးသူ',
    headchef: 'စားဖိုမှူးချုပ်',
    assistantchef: 'လက်ထောက်စားဖိုမှူး',
    salesadmin: 'အရောင်းစီမံခန့်ခွဲသူ',
    accountant: 'စာရင်းကိုင်',
    commis: 'စားဖိုမှူးလက်ထောက်',
    housekeeper: 'သန့်ရှင်းရေး',
    housekeepingsupervisor: 'သန့်ရှင်းရေး ကြီးကြပ်ရေးမှူး',
    kitchenhelper: 'မီးဖိုချောင်အကူ',
    marketingmanager: 'စျေးကွက်ရှာဖွေရေး မန်နေဂျာ',
    corporateofficer: 'ကော်ပိုရိတ်အရာရှိ',
    executiveassistant: 'အမှုဆောင်လက်ထောက်',
    operationsupervisor: 'လုပ်ငန်းဆောင်ရွက်မှု ကြီးကြပ်ရေးမှူး',
    marketingsupervisor: 'စျေးကွက်ရှာဖွေရေး ကြီးကြပ်ရေးမှူး',
    itofficer: 'IT အရာရှိ',
    contentcreator: 'အကြောင်းအရာ ဖန်တီးသူ',
    projectmanager: 'စီမံကိန်း မန်နေဂျာ'
  };

  titles.forEach(title => {
    const key = title.toLowerCase().replace(/\s+/g, '');
    if (lang === 'en') {
      data.positions.names[key] = title;
    } else {
      data.positions.names[key] = myTranslations[key] || title;
    }
  });

  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

updateJson(enPath, 'en');
updateJson(myPath, 'my');

console.log('Position names translations injected.');
