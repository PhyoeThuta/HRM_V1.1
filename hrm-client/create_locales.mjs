import fs from 'fs';
import path from 'path';

const basePath = 'c:/Users/Phyoe/Desktop/hrm_react/hrm-client/src/locales';

const locales = ['en', 'my'];
const modules = ['common', 'auth', 'hrm', 'crm', 'operations', 'portal', 'public', 'validation'];

const initialData = {
  en: {
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      search: "Search",
      loading: "Loading...",
      noRecords: "No records found"
    },
    auth: {
      login: "Login",
      username: "Username",
      password: "Password",
      signIn: "Sign In",
      emailOrUsername: "Email or Username",
      title: "BBD Enterprise",
      subtitle: "Enterprise Resource Management"
    }
  },
  my: {
    common: {
      save: "သိမ်းမည်",
      cancel: "ပယ်ဖျက်မည်",
      delete: "ဖျက်မည်",
      edit: "ပြင်မည်",
      close: "ပိတ်မည်",
      search: "ရှာဖွေမည်",
      loading: "လုပ်ဆောင်နေပါသည်...",
      noRecords: "မှတ်တမ်းမရှိပါ"
    },
    auth: {
      login: "အကောင့်ဝင်ရန်",
      username: "အသုံးပြုသူအမည်",
      password: "စကားဝှက်",
      signIn: "အကောင့်ဝင်မည်",
      emailOrUsername: "အီးမေးလ် သို့မဟုတ် အသုံးပြုသူအမည်",
      title: "BBD Enterprise",
      subtitle: "လုပ်ငန်းစီမံခန့်ခွဲမှုစနစ်"
    }
  }
};

for (const locale of locales) {
  const dirPath = path.join(basePath, locale);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  for (const mod of modules) {
    const filePath = path.join(dirPath, `${mod}.json`);
    const data = initialData[locale]?.[mod] || {};
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}
console.log('Locales structure created successfully.');
