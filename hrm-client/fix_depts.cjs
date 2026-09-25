const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// We need to keep the exact string matches for tDyn in OrgChart/PerformanceTracker,
// AND add the UI keys + names object for Departments.jsx

const enDepts = {
  // Preserve tDyn keys
  "Logistics & Delivery": "Logistics & Delivery",
  "Customer Service": "Customer Service",
  "Human Resources": "Human Resources",
  "IT": "IT",
  "Operation": "Operation",
  "Sales & Marketing": "Sales & Marketing",
  
  // Restore UI keys
  "title": "Departments",
  "subtitle": "Manage company departments and organization units",
  "count": "Departments",
  "newBtn": "New Department",
  "noDesc": "No description available.",
  "employees": "Employees",
  "modalEditTitle": "Edit Department",
  "modalNewTitle": "Create Department",
  "formName": "Department Name",
  "formDesc": "Description",
  
  // Departments.jsx names mapping
  "names": {
    "logistics&delivery": "Logistics & Delivery",
    "customerservice": "Customer Service",
    "humanresources": "Human Resources",
    "it": "IT",
    "operation": "Operation",
    "sales&marketing": "Sales & Marketing",
    "administration": "Administration",
    "finance&accounts": "Finance & Accounts",
    "kitchen": "Kitchen"
  }
};

const myDepts = {
  // Preserve tDyn keys
  "Logistics & Delivery": "ထောက်ပံ့ပို့ဆောင်ရေးနှင့် ပို့ဆောင်ရေး",
  "Customer Service": "ဖောက်သည်ဝန်ဆောင်မှု",
  "Human Resources": "လူသားအရင်းအမြစ်",
  "IT": "သတင်းအချက်အလက်နည်းပညာ",
  "Operation": "လုပ်ငန်းလည်ပတ်ရေး",
  "Sales & Marketing": "အရောင်းနှင့် ဈေးကွက်ချဲ့ထွင်ရေး",
  
  // Restore UI keys
  "title": "ဌာနများ",
  "subtitle": "ကုမ္ပဏီဌာနများနှင့် အဖွဲ့အစည်းယူနစ်များကို စီမံရန်",
  "count": "ဌာနများ",
  "newBtn": "ဌာနအသစ်",
  "noDesc": "အသေးစိတ်ဖော်ပြချက် မရှိပါ။",
  "employees": "ဝန်ထမ်းများ",
  "modalEditTitle": "ဌာနကို ပြင်ဆင်ရန်",
  "modalNewTitle": "ဌာနအသစ် ဖန်တီးရန်",
  "formName": "ဌာနအမည်",
  "formDesc": "အသေးစိတ်ဖော်ပြချက်",
  
  // Departments.jsx names mapping
  "names": {
    "logistics&delivery": "ထောက်ပံ့ပို့ဆောင်ရေးနှင့် ပို့ဆောင်ရေး",
    "customerservice": "ဖောက်သည်ဝန်ဆောင်မှု",
    "humanresources": "လူသားအရင်းအမြစ်",
    "it": "သတင်းအချက်အလက်နည်းပညာ",
    "operation": "လုပ်ငန်းလည်ပတ်ရေး",
    "sales&marketing": "အရောင်းနှင့် ဈေးကွက်ချဲ့ထွင်ရေး",
    "administration": "အုပ်ချုပ်ရေး",
    "finance&accounts": "ဘဏ္ဍာရေးနှင့် စာရင်းကိုင်",
    "kitchen": "မီးဖိုချောင်"
  }
};

enJson.departments = { ...enJson.departments, ...enDepts };
myJson.departments = { ...myJson.departments, ...myDepts };

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2), 'utf8');
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2), 'utf8');

console.log("Restored departments UI translations.");
