import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    console.log('Updating HRM Overview article...');

    const markdownContent = `
# HRM Overview

## 1. HRM ဆိုတာဘာလဲ?
HRM (Human Resource Management) ဆိုတာ ဝန်ထမ်းများ၏ အချက်အလက်များ၊ လုပ်ငန်းခွင်ဆိုင်ရာ လိုအပ်ချက်များနှင့် စီမံခန့်ခွဲမှု လုပ်ငန်းစဉ်များကို စနစ်တကျ မှတ်တမ်းတင် ဖြေရှင်းပေးသော စနစ်တစ်ခု ဖြစ်ပါတယ်။
BBD HRM System သည် ကုမ္ပဏီအတွင်းရှိ ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အလုပ်ဝင်ရောက်ချိန် (Onboarding) မှစ၍ အလုပ်ထွက်ခွာချိန် (Offboarding) အထိ လိုအပ်သော HR လုပ်ငန်းစဉ် အားလုံးကို နေရာတစ်ခုတည်းတွင် လွယ်ကူလျင်မြန်စွာ စီမံခန့်ခွဲနိုင်ရန် တည်ဆောက်ထားခြင်း ဖြစ်ပါတယ်။

---

## 2. BBD HRM System က ဘာတွေအတွက် အသုံးပြုသလဲ?
BBD HRM System သည် အောက်ပါ အဓိက HR လုပ်ငန်းစဉ်များကို ချိတ်ဆက်လုပ်ဆောင်ပေးရန်အတွက် အသုံးပြုပါသည်-
- **ဝန်ထမ်း အချက်အလက်များ (Employee Information):** ဝန်ထမ်းများ၏ ကိုယ်ရေးအချက်အလက်များနှင့် အလုပ်အကိုင် ရာဇဝင်များကို သိမ်းဆည်းရန်။
- **ဖွဲ့စည်းပုံ (Departments & Positions):** ကုမ္ပဏီ၏ ဌာနများနှင့် ရာထူးအဆင့်ဆင့်ကို သတ်မှတ်ရန်။
- **အလုပ်ခန့်ထားမှု (Recruitment & Onboarding):** ဝန်ထမ်းသစ် ရှာဖွေခြင်းမှစ၍ ရုံးစတက်သည့် ပထမဆုံးနေ့ လိုအပ်ချက်များအထိ စီစဉ်ပေးရန်။
- **ရုံးတက်/ရုံးဆင်း နှင့် ခွင့် (Attendance & Leave):** နေ့စဉ် ရုံးတက်ရောက်မှု မှတ်တမ်းများနှင့် ခွင့်တောင်းခံမှုများကို စီမံရန်။
- **လုပ်ငန်းလွှဲပြောင်းခြင်း (Handovers):** ခွင့်ရက်ရှည် ယူချိန် သို့မဟုတ် အလုပ်ထွက်ချိန်များတွင် အလုပ်တာဝန်များ လွှဲပြောင်းရန်။
- **စွမ်းဆောင်ရည် အကဲဖြတ်ခြင်း (Performance & SOPs):** နေ့စဉ် လုပ်ငန်းစဉ်များ (Daily SOPs) ပြီးစီးမှုနှင့် KPI အမှတ်ပေးခြင်းများကို ပြုလုပ်ရန်။
- **လစာတွက်ချက်ခြင်း (Payroll & KPI):** Attendance, Leave နှင့် KPI အမှတ်များအပေါ် အခြေခံ၍ လစာကို တိကျစွာ တွက်ချက်ရန်။
- **စာရွက်စာတမ်း နှင့် မှတ်တမ်းများ (Document Vault & Birthdays):** အရေးကြီး စာရွက်စာတမ်းများ သိမ်းဆည်းခြင်းနှင့် မွေးနေ့ကဲ့သို့သော အထူးရက်များကို သတိပေးရန်။
- **အလုပ်ထွက်ခွာခြင်း (Offboarding):** ဝန်ထမ်း အလုပ်ထွက်ချိန်တွင် လိုအပ်သော စစ်ဆေးမှုများ ပြုလုပ်ရန်။

---

## 3. HRM ရဲ့ အဓိက Modules များ

| Module | Purpose (ရည်ရွယ်ချက်) | When it is used (အသုံးပြုချိန်) | Related Modules (ဆက်စပ်မှု) |
|---|---|---|---|
| **Dashboard** | အရေးကြီး HR အချက်အလက်များကို အနှစ်ချုပ်ကြည့်ရန် | နေ့စဉ် ရုံးတက်/ဆင်း၊ ခွင့်နှင့် မွေးနေ့များကို အမြန်ကြည့်လိုချိန် | Employees, Attendance, Leave |
| **Employees** | ဝန်ထမ်းများ၏ အချက်အလက်များ စီမံရန် | ဝန်ထမ်းသစ် ခန့်ချိန်၊ အချက်အလက် ပြင်ချိန်၊ အလုပ်ထွက်ချိန် | Departments, Positions |
| **Employee Details** | ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အသေးစိတ်ကို ကြည့်ရန် | ဝန်ထမ်းတစ်ဦး၏ Attendance, Leave, Payroll ရာဇဝင်များကို စစ်ဆေးလိုချိန် | Attendance, Leave, Payroll |
| **Departments** | ကုမ္ပဏီ၏ ဌာနအသီးသီးကို စီမံရန် | ဌာနအသစ် ဖွဲ့စည်းချိန် (သို့) အမည်ပြောင်းချိန် | Employees |
| **Positions** | ရာထူးများနှင့် ၎င်းတို့၏ Level များကို သတ်မှတ်ရန် | ရာထူးအမည်သစ် သတ်မှတ်ချိန် | Employees, Daily SOPs |
| **Recruitment** | အလုပ်လျှောက်ထားသူများကို စီမံရန် | အလုပ်ခေါ်စာ ခေါ်ပြီးနောက် Interview နှင့် ခန့်အပ်ခြင်း ပြုလုပ်ချိန် | Employees |
| **Onboarding** | ဝန်ထမ်းသစ် အလုပ်စတင်ချိန် ပြင်ဆင်မှုများ လုပ်ရန် | ဝန်ထမ်းသစ် စတင်အလုပ်ဆင်းသည့်နေ့ (သို့) မတိုင်မီ | Employees |
| **Attendance** | ရုံးတက်၊ ရုံးဆင်း အချိန်များကို မှတ်တမ်းတင်ရန် | နေ့စဉ် ရုံးရောက်ချိန် နှင့် ရုံးပြန်ချိန် | Payroll, Employee Details |
| **Leave Management** | ခွင့်တောင်းခံခြင်းနှင့် ခွင့်ပြုခြင်း စီမံရန် | အလုပ်မဆင်းနိုင်သည့်အခါ (သို့) ခွင့်ယူလိုသည့်အခါ | Attendance, Payroll, Handovers |
| **Handovers** | မိမိ၏ လုပ်လက်စ အလုပ်များကို အခြားသူထံ လွှဲပြောင်းရန် | ခွင့်ရက်ရှည်ယူချိန် (သို့) အလုပ်မှ ထွက်ချိန် | Leave Management, Offboarding |
| **Daily SOPs** | နေ့စဉ် လုပ်ဆောင်ရမည့် လုပ်ငန်းစဉ်များ သတ်မှတ်ရန် | နေ့စဉ် ရုံးချိန်အတွင်း လုပ်ငန်းပြီးစီးမှု မှတ်သားရန် | Positions, Employees |
| **Performance Tracker** | စွမ်းဆောင်ရည်ကို KPI အမှတ်ဖြင့် အကဲဖြတ်ရန် | လစဉ် (သို့) နှစ်စဉ် Review အချိန် | Payroll |
| **Peer Voting** | လုပ်ဖော်ကိုင်ဖက် အချင်းချင်း မဲပေးရွေးချယ်ရန် | လစဉ် Employee of the Month ရွေးချယ်ချိန် | Employees |
| **Payroll & KPI** | လစာ တွက်ချက်ပေးရန် | လကုန်ရက် လစာရှင်းချိန် | Employees, Attendance, Leave, Performance |
| **Document Vault** | ဝန်ထမ်းရေးရာ စာရွက်စာတမ်းများ သိမ်းဆည်းရန် | အထောက်အထားများ ပေးပို့/သိမ်းဆည်း လိုချိန် | Employees |
| **Birthdays** | ကျရောက်မည့် မွေးနေ့များကို ပြသရန် | လစဉ် မွေးနေ့ပွဲများ စီစဉ်ရန် | Employees |
| **Org Chart** | ဖွဲ့စည်းပုံကို ပုံကြမ်းဖြင့် ပြသရန် | Reporting line များကို ပြောင်းလဲ/ကြည့်ရှုလိုချိန် | Employees |
| **Offboarding** | အလုပ်ထွက်သွားမည့်သူများအတွက် လုပ်ငန်းစဉ် | ဝန်ထမ်းမှ အလုပ်ထွက်စာ (Resignation) တင်သည့်အခါ | Employees, Handovers |

---

## 4. Employee Lifecycle

BBD HRM System တွင် ဝန်ထမ်းတစ်ဦး၏ လုပ်ငန်းစဉ် အဆင့်ဆင့် (Lifecycle) သည် အောက်ပါအတိုင်း ချိတ်ဆက် စီးဆင်းသွားပါသည်-

1. **Recruitment (အလုပ်ခေါ်ယူခြင်း):** Recruitment Module တွင် လျှောက်ထားသူများကို Interview အဆင့်ဆင့် စစ်ဆေးပြီး Hired (ခန့်အပ်မည်) ဟု သတ်မှတ်သည်။
2. **Employee Creation (ဝန်ထမ်းမှတ်တမ်း ဖန်တီးခြင်း):** Hired ဖြစ်လာသူကို Employees Module မှတဆင့် ဝန်ထမ်းအသစ်အဖြစ် စာရင်းသွင်းပြီး စနစ်အတွင်းသို့ Login ဝင်ခွင့် ပြုသည်။
3. **Department / Position (ရာထူးသတ်မှတ်ခြင်း):** ဝန်ထမ်းကို သက်ဆိုင်ရာ Department နှင့် Position ထဲသို့ ထည့်သွင်းသတ်မှတ်ပေးသည်။
4. **Onboarding (ကြိုဆိုပြင်ဆင်ခြင်း):** Onboarding Module တွင် ရုံးမဆင်းမီ လိုအပ်သော (Laptop, ID Card အစရှိသည့်) Task များကို သက်ဆိုင်ရာ ဌာနများမှ ပြင်ဆင်ပေးသည်။
5. **Attendance & Leave (ရုံးတက်/ဆင်း နှင့် ခွင့်):** ဝန်ထမ်းသည် နေ့စဉ် Attendance တွင် Check-in/out ပြုလုပ်ပြီး လိုအပ်ပါက Leave Management မှတဆင့် ခွင့်တိုင်ကြားသည်။
6. **Daily SOP (နေ့စဉ် လုပ်ငန်းစဉ်များ):** ဝန်ထမ်း၏ Position အပေါ် မူတည်၍ လဆန်းတိုင်းတွင် Daily SOP Task များ အလိုအလျောက် ရောက်ရှိလာပြီး နေ့စဉ် ပြီးစီးကြောင်း မှတ်သားရသည်။
7. **Performance (စွမ်းဆောင်ရည် အကဲဖြတ်ခြင်း):** Manager မှ Performance Tracker တွင် ဝန်ထမ်း၏ လစဉ် KPI အမှတ်များကို ဖြည့်သွင်းပေးသည်။
8. **Payroll & KPI (လစာ တွက်ချက်ခြင်း):** Attendance မှ နောက်ကျချိန်များ၊ Leave မှ လစာမဲ့ခွင့်များနှင့် Performance မှ KPI အမှတ်များကို အခြေခံ၍ HR မှ Payroll Module တွင် လစာကို အလိုအလျောက် တွက်ချက်ပေးသည်။
9. **Offboarding & Handover (အလုပ်ထွက်ခွာခြင်း နှင့် လွှဲပြောင်းခြင်း):** ဝန်ထမ်း အလုပ်ထွက်စာတင်ပါက Offboarding Module မှတဆင့် Exit Survey, ပစ္စည်းပြန်အပ်ခြင်းများကို ပြုလုပ်ရပြီး လက်ကျန်အလုပ်များကို Handover ဖြင့် လွှဲပြောင်းပေးရသည်။
10. **Soft Delete (အကောင့်ပိတ်သိမ်းခြင်း):** အားလုံးပြီးစီးပါက HR မှ ဝန်ထမ်းအား Soft Delete ပြုလုပ်ပြီး System Login ကို ပိတ်သိမ်းလိုက်သည်။

---

## 5. HRM Modules တွေ ဘယ်လိုချိတ်ဆက်ထားသလဲ?

HRM System ၏ အားသာချက်မှာ Module တစ်ခုနှင့်တစ်ခု အလိုအလျောက် ချိတ်ဆက် အလုပ်လုပ်ခြင်း ဖြစ်ပါတယ်။ အရေးကြီးသော ချိတ်ဆက်မှုများမှာ-

- **Employee → Department / Position:** ဝန်ထမ်းတစ်ဦးကို ဖန်တီးလိုက်သည်နှင့် ၎င်း၏ ဌာနနှင့် ရာထူးကို သတ်မှတ်ရပြီး Org Chart တွင် အလိုအလျောက် ပေါ်လာပါသည်။
- **Employee → Attendance / Leave:** ဝန်ထမ်း၏ နေ့စဉ် ရုံးတက်မှတ်တမ်းနှင့် ခွင့်တောင်းခံမှုများသည် ၎င်း၏ Employee Details တွင် အလိုအလျောက် စုစည်းပြသနေပါမည်။
- **Leave > 2 days → Handover:** ခွင့်တောင်းခံမှုသည် ၃ ရက်နှင့်အထက် ဖြစ်ပါက Manager ထံ မရောက်မီ Handover Form အရင် ဖြည့်ခိုင်းပြီး Receiver လက်ခံမှုကို စောင့်ရပါသည်။
- **Employee Position → Daily SOP assignment:** လဆန်း ၁ ရက်နေ့ ရောက်တိုင်း ဝန်ထမ်း၏ Position နှင့် သက်ဆိုင်သော SOP များကို System မှ အလိုအလျောက် Assign ချပေးပါသည်။
- **Attendance + Leave + Performance → Payroll:** Payroll (လစာတွက်ချက်ခြင်း) သည် သီးခြား အလုပ်လုပ်ခြင်းမဟုတ်ဘဲ Attendance (နောက်ကျချိန်), Leave (ခွင့်မဲ့) နှင့် Performance (KPI Bonus) တို့မှ အချက်အလက်များကို ဆွဲယူ၍ Net Pay ကို အတိအကျ တွက်ထုတ်ပေးပါသည်။
- **Offboarding → Handover → Soft Delete:** အလုပ်ထွက်ချိန်တွင် လက်ကျန် အလုပ်များ (Handover) နှင့် ပစ္စည်းပြန်အပ်မှု များကို စစ်ဆေးပြီးမှသာ Soft Delete လုပ်ငန်းစဉ် ပြီးမြောက်ပါသည်။

---

## 6. HRM ကို ဘယ်သူတွေ အသုံးပြုသလဲ?

BBD HRM တွင် အောက်ပါ အဓိက Role များဖြင့် အသုံးပြုကြပါသည်-

- **Boss / Admin:** System တစ်ခုလုံးရှိ Data များကို ကြည့်ရှုနိုင်ခြင်း၊ ခွင့်ပြုချက်များပေးခြင်း၊ လစာ (Payroll) ကို အတည်ပြုခြင်းနှင့် လိုအပ်သော Configuration (ဥပမာ - Department အသစ်ထည့်ခြင်း) များ ပြုလုပ်သည်။
- **HR Manager:** ဝန်ထမ်းသစ် ခေါ်ယူခြင်း၊ Onboarding / Offboarding စီမံခြင်း၊ ဝန်ထမ်းရေးရာ စာရွက်စာတမ်းများ ထိန်းသိမ်းခြင်း၊ နေ့စဉ် Attendance နှင့် Leave များကို စစ်ဆေးခြင်းနှင့် လစာ တွက်ချက်မှုများ (Generate Payroll) ကို အဓိက တာဝန်ယူ လုပ်ဆောင်သည်။
- **Manager:** မိမိလက်အောက်ရှိ ဝန်ထမ်းများ၏ ခွင့်တောင်းခံမှုများ (Leave Requests) ကို အတည်ပြုပေးခြင်း၊ Daily SOP များ ပြီးစီးမှုကို ကြီးကြပ်ခြင်းနှင့် KPI စွမ်းဆောင်ရည် အမှတ်များ ပေးခြင်း ပြုလုပ်သည်။
- **Employee:** နေ့စဉ် ရုံးတက်/ဆင်း (Check-in/out) ပြုလုပ်ခြင်း၊ ခွင့် (Leave) တောင်းခံခြင်း၊ Handover များ လက်ခံ/လွှဲပြောင်းခြင်း၊ မိမိ၏ Daily SOP Task များကို Done လုပ်ခြင်းနှင့် လုပ်ဖော်ကိုင်ဖက်များကို Peer Voting ဖြင့် မဲပေးခြင်း ပြုလုပ်သည်။

---

## 7. HRM အသုံးပြုရာမှာ အခြေခံ Workflow

စနစ်ကို စတင်အသုံးပြုမည့် သူများအတွက် အခြေခံ အဆင့်ဆင့်မှာ-

1. **Recruitment** တွင် Candidate များကို စီမံပါ။
2. **Hired** ဖြစ်လာပါက **Employees** Module တွင် ဝန်ထမ်းမှတ်တမ်း ဖန်တီးပါ။
3. ၎င်းကို **Department / Position** အတိအကျ သတ်မှတ်ပေးပါ။
4. ရုံးမဆင်းမီ **Onboarding** Task များ ပြုလုပ်ပါ။
5. ရုံးစတက်သည်နှင့် **Attendance** စတင် မှတ်တမ်းတင်ပါ။
6. ဝန်ထမ်းမှ ခွင့်ယူလိုပါက **Leave Management** တွင် Request တင်ပြီး စီမံပါ။
7. နေ့စဉ် **Daily SOP** assignments များ ပြုလုပ်စေပါ။
8. လကုန်ခါနီးတွင် **Performance / KPI tracking** ဖြင့် အမှတ်ပေးပါ။
9. လကုန်ပါက **Payroll** တွက်ချက်ပါ။
10. အလုပ်ထွက်ချိန်တွင် **Offboarding** ဖြင့် စနစ်တကျ အဆုံးသတ်ပါ။

*(မှတ်ချက် - ဤသည်မှာ အပြည့်စုံဆုံး Workflow ဖြစ်ပြီး ဝန်ထမ်းတစ်ဦးချင်းစီ၏ အခြေအနေပေါ်မူတည်၍ အချို့ Module များသာ အသုံးပြုမည် ဖြစ်ပါသည်။)*

---

## 8. HRM ကို စတင်လေ့လာမယ့်သူ ဘယ်ကနေစမလဲ?

ဤ User Manual ကို အောက်ပါ အစီအစဉ်အတိုင်း ဖတ်ရှုရန် အကြံပြုပါသည်-

- **ပထမဆုံး:** ယခုဖတ်ရှုနေသော \`HRM Overview\` ကို နားလည်အောင် ဖတ်ပါ။
- **ဒုတိယ:** \`Employees\`, \`Departments\`, \`Positions\` စသည့် အခြေခံ ဖွဲ့စည်းပုံများကို လေ့လာပါ။
- **တတိယ:** \`Recruitment\` နှင့် \`Onboarding\` လုပ်ငန်းစဉ်များကို ဖတ်ရှုပါ။
- **စတုတ္ထ:** နေ့စဉ် အသုံးပြုမည့် \`Attendance\` နှင့် \`Leave Management\` အကြောင်းကို ဖတ်ပါ။
- **ပဉ္စမ:** လကုန်တိုင်း ပြုလုပ်မည့် \`Performance Tracker\` နှင့် \`Payroll & KPI\` ကို လေ့လာပါ။
- **နောက်ဆုံး:** ဝန်ထမ်းအလုပ်ထွက်ချိန် အသုံးပြုမည့် \`Offboarding\` နှင့် ခြုံငုံပြသထားသော \`Complete Employee Lifecycle\` ကို ဖတ်ရှုပါ။

---

## 9. အရေးကြီးသောအချက်များ

- **Data ချိတ်ဆက်မှု:** HRM modules are interconnected. ဝန်ထမ်းတစ်ဦး၏ အချက်အလက်များကို အခြားသော Process အားလုံးတွင် အသုံးပြုပါသည်။
- **Handover လိုအပ်ချက်:** Leave requests above the documented threshold (၃ ရက်နှင့်အထက်) require Handovers.
- **လစာ တွက်ချက်ခြင်း:** Payroll uses the documented attendance/KPI-related information.
- **Soft Delete:** Employee Soft Delete affects the employee's active status/login behavior as documented. (Login ဝင်ခွင့်ကို ပိတ်သိမ်းသော်လည်း Data ဟောင်းများကို သိမ်းဆည်းထားပါသည်)

---

## 10. ဆက်လက်ဖတ်ရှုရန်

- <a href="#" data-article-title="Dashboard" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Dashboard</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const htmlContent = marked.parse(markdownContent);
    
    // The current title in DB is 'HRM Overview'
    const { data: existingArticle, error: findError } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id')
      .eq('title', 'HRM Overview')
      .single();

    if (findError || !existingArticle) {
      console.log('Could not find existing article "HRM Overview". Checking "Welcome to BBD HRM User Manual" just in case...');
      const { data: fallback, error: fallError } = await supabaseAdmin
        .from('hrm_manual_articles')
        .select('id')
        .eq('title', 'Welcome to BBD HRM User Manual')
        .single();
        
      if (fallback) {
        console.log('Found fallback. Updating...');
        await supabaseAdmin.from('hrm_manual_articles').update({
          title: 'HRM Overview',
          draft_content: htmlContent,
          published_content: htmlContent,
          status: 'published'
        }).eq('id', fallback.id);
        console.log('Successfully updated HRM Overview via fallback.');
      } else {
        console.log('No article found at all! Aborting to prevent duplicates.');
      }
    } else {
      console.log('Found HRM Overview. Updating content...');
      await supabaseAdmin.from('hrm_manual_articles').update({
        draft_content: htmlContent,
        published_content: htmlContent,
        status: 'published'
      }).eq('id', existingArticle.id);
      console.log('Successfully updated HRM Overview.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
