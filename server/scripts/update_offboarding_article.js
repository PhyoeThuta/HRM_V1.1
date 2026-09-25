import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Offboarding Article...');

    const myMarkdown = `
# Offboarding (အလုပ်ထွက်ခွာခြင်း လုပ်ငန်းစဉ်)

## 1. Offboarding Overview (ယေဘုယျအကြောင်းအရာ)
**Offboarding** သည် ဝန်ထမ်းတစ်ဦး အလုပ်မှ ထွက်ခွာတော့မည့် အချိန်တွင် ပြုလုပ်ရသော လုပ်ငန်းစဉ်များကို စနစ်တကျ မှတ်တမ်းတင် ခြေရာခံနိုင်သော နေရာဖြစ်ပါသည်။ ပစ္စည်းများ ပြန်အပ်ခြင်း၊ အလုပ်လွှဲပြောင်းခြင်း နှင့် နောက်ဆုံး လစာရှင်းတမ်း ထုတ်ပေးခြင်း တို့ကို ဤနေရာမှ တစ်ဆင့် လုပ်ဆောင်ရပါသည်။

## 2. Purpose of Offboarding (အသုံးပြုရခြင်း ရည်ရွယ်ချက်)
- အလုပ်ထွက်ခွာမည့် ဝန်ထမ်းထံမှ ကုမ္ပဏီပိုင် ပစ္စည်းများ၊ လျှို့ဝှက်ချက်များကို လုံခြုံစွာ ပြန်လည်ရယူနိုင်ရန်။
- အလုပ်လွှဲပြောင်းခြင်း (Handover) ကို မဖြစ်မနေ လုပ်ဆောင်စေရန်။
- နောက်ဆုံး လစာနှင့် ခံစားခွင့်များ ရှင်းလင်းပေးခြင်းကို အမှားအယွင်းမရှိ မှတ်တမ်းတင်ရန်။

---

## 3. Offboarding Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

စာမျက်နှာတွင်-
1. **Summary Cards:** လက်ရှိ ထွက်ခွာမည့်သူ အရေအတွက်၊ Payroll Hold လုပ်ထားသူ အရေအတွက်၊ Settlement ရှင်းပြီးသူ အရေအတွက်။
2. **Initiate Form:** Offboarding အသစ် စတင်ရန် ဖောင် (Form)။
3. **Employee Cards:** ထွက်ခွာမည့် ဝန်ထမ်း တစ်ဦးချင်းစီ၏ Offboarding အခြေအနေ (Progress % တပါတည်း) ကို ပြသထားသော ကတ်များ။

---

## 4. Starting an Offboarding Process (လုပ်ငန်းစဉ် စတင်ခြင်း)

Offboarding စတင်ရန်-
1. **"Initiate"** ဖောင်တွင် ဝန်ထမ်းအမည် ကို ရွေးချယ်ပါ။
2. အလုပ်ထွက်ခွာရသည့် အကြောင်းရင်း (Termination Reason), ထွက်ခွာမည့် ပုံစံ (Exit Type), နုတ်ထွက်စာတင်သည့်ရက် (Resignation Date) နှင့် နောက်ဆုံး အလုပ်ဆင်းမည့်ရက် (Last Working Date) တို့ကို ဖြည့်စွက်ပါ။
3. **"Start Offboarding"** ကို နှိပ်လိုက်ပါက ထိုဝန်ထမ်းအတွက် Offboarding Record သစ် တစ်ခု ပေါ်လာပါမည်။

---

## 5. Exit Survey (ထွက်ခွာမှု အင်တာဗျူး)

- ဝန်ထမ်းကတ် ပေါ်ရှိ **"Exit Interview"** ကို နှိပ်၍ HR မှ လူကိုယ်တိုင် အင်တာဗျူး ပြုလုပ်ပြီး အချက်အလက်များ ဖြည့်သွင်းနိုင်ပါသည်။
- သို့မဟုတ် ဝန်ထမ်းမှ သူ၏ ကိုယ်ပိုင် Employee Portal (Dashboard) မှ တစ်ဆင့် **Exit Survey** ကို ကိုယ်တိုင် ဝင်ရောက် ဖြေဆိုနိုင်ပါသည်။
- (အချက်အလက်များတွင် Job Satisfaction, Management Rating စသည့် အမှတ်ပေးစနစ် နှင့် အခြား အကြံပြုချက်များ ပါဝင်ပါသည်)။

---

## 6. Asset Return & Clearance (ပစ္စည်းများ ပြန်အပ်ခြင်း)

ဝန်ထမ်းကတ် ပေါ်ရှိ **"Details →"** ကို နှိပ်လိုက်ပါက Clearance Tasks များကို မြင်ရပါမည်-
- **Asset Clearance:** Laptop ပြန်အပ်ခြင်း၊ Access Card ပြန်အပ်ခြင်း၊ NDA (လျှို့ဝှက်ချက် ထိန်းသိမ်းမှု စာချုပ်) လက်မှတ်ထိုးခြင်း စသည်တို့ကို Switch (ခလုတ်) အပိတ်/အဖွင့် လုပ်၍ အတည်ပြုပေးရပါမည်။
- **Category Tasks:** IT, Finance, HR စသည့် ဌာနအလိုက် ရှင်းလင်းရမည့် အချက်များကို Checklist အနေဖြင့် အမှန်ခြစ် ပေးရပါမည်။

---

## 7. Knowledge Transfer & 8. Handover (အလုပ်လွှဲပြောင်းခြင်း)

- Offboarding Detail အတွင်းရှိ **"Handover"** Tab ကို နှိပ်၍ အလုပ်လွှဲပြောင်းခြင်း လုပ်ငန်းစဉ်များကို ခြေရာခံနိုင်ပါသည်။
- Handover မှ အလုပ်လွှဲပြောင်းမှု ရာခိုင်နှုန်း (100%) မပြည့်သေးသရွေ့ (သို့မဟုတ် Waive ဟု သတ်မှတ်မထားသရွေ့) နောက်ဆုံး လစာရှင်းတမ်း ထုတ်ပေးခြင်းကို စနစ်မှ **ပိတ်ပင်ထားပါမည် (Blocked)**။

---

## 9. Offboarding Checklist (လုပ်ငန်းစဉ် စစ်ဆေးချက်)

- Offboarding စတင်လိုက်သည်နှင့် စနစ်မှ အလိုအလျောက် Task အခု (၁၀) ခု (ဥပမာ - Revoke System Access, Final Payroll Calculation, စသည်ဖြင့်) ကို ဖန်တီးပေးပါသည်။ ထို Task များကို ပြီးစီးကြောင်း (Completed) တစ်ခုချင်းစီ အမှန်ခြစ် ရပါမည်။

---

## 10. Completion Status (ပြီးစီးမှု အခြေအနေ)

- အထက်ပါ Clearance များနှင့် Task များအားလုံး (100%) ပြီးစီးပြီး၊ Handover ပါ အောင်မြင်စွာ လွှဲပြောင်းပြီးမှသာ **"Release Final Settlement"** (နောက်ဆုံးလစာ ထုတ်ပေးခြင်း) ခလုတ် ပွင့်လာမည် ဖြစ်ပါသည်။

---

## 11. Employee Exit / Soft Delete Behavior (အလုပ်ထွက်ခြင်းနှင့် စနစ်မှ ပယ်ဖျက်ခြင်း)

**အရေးကြီးချက်:** Offboarding လုပ်ငန်းစဉ် ပြီးဆုံး၍ "Release Final Settlement" နှိပ်လိုက်ရုံဖြင့် ဝန်ထမ်းကို စနစ်ထဲမှ အလိုအလျောက် ဖျက်ပစ်ခြင်း (Auto Soft-Delete) သို့မဟုတ် လော့ဂ်အင် ဝင်ခွင့် (Login Access) ကို အလိုအလျောက် ပိတ်ပင်ခြင်း **မလုပ်ဆောင်ပါ**။
- Offboarding သည် မှတ်တမ်းတင် ခြေရာခံရန်အတွက်သာ ဖြစ်ပါသည်။
- အလုပ်ထွက်သွားသော ဝန်ထမ်းအား စနစ်ထဲသို့ ဝင်ခွင့်ပိတ်ရန် သို့မဟုတ် Inactive ပြောင်းရန်အတွက် HR သည် \`Employee Details\` စာမျက်နှာသို့ သွားရောက်၍ Status ကို **"Offboarded" / "Inactive"** သို့ လူကိုယ်တိုင် (Manually) ပြောင်းလဲပေးရပါမည်။ 

---

## 12. What Happens After Offboarding

Offboarding အောင်မြင်စွာ ပြီးဆုံးသွားပါက:
1. လစာနှင့် ခံစားခွင့် အားလုံး ရှင်းလင်းပြီးကြောင်း (Settlement Released) မှတ်တမ်းတင် ထားရှိမည်။
2. အင်တာဗျူး ရလဒ်များနှင့် Handover မှတ်တမ်းများ အားလုံး Vault သို့မဟုတ် Database တွင် သမိုင်းကြောင်း အဖြစ် ကျန်ရှိနေမည်။

---

## 13. Offboarding ↔ Employees 
Offboarding စတင်ရန် \`Employees\` စာရင်းထဲမှ အမည်ကို ရွေးချယ်ရပါသည်။ ပြီးဆုံးသွားပါက Employee Status ကို ကိုယ်တိုင် Update ပြုလုပ်ပေးရပါမည်။

## 14. Offboarding ↔ Handovers
Offboarding လုပ်ငန်းစဉ်သည် Handovers မပြီးမချင်း ရှေ့ဆက်၍ မရအောင် အလိုအလျောက် ချိတ်ဆက် (Link) ထားပါသည်။

## 15. Offboarding ↔ Document Vault
နောက်ဆုံး ထွက်ခွာခွင့်ပြုကြောင်း စာရွက်စာတမ်း (သို့) NDA များကို \`Document Vault\` သို့ တင်၍ မှတ်တမ်း ထားရှိနိုင်ပါသည်။

## 16. Offboarding ↔ Attendance / 17. Leave / 18. Payroll
Offboarding ကာလ (Notice Period) အတွင်း၌ ဝန်ထမ်းသည် Attendance နှင့် Leave များကို ပုံမှန်အတိုင်း သုံးစွဲနေနိုင်ပါသည်။ သို့သော် \`Payroll\` အတွက် နောက်ဆုံး လစာကိုမူ Offboarding Settlement ပြီးမှသာ ထုတ်ပေးလေ့ ရှိပါသည်။

## 19. Offboarding ↔ Org Chart
ဝန်ထမ်းသည် ထွက်ခွာသွား၍ Employee Status "Inactive" ဖြစ်သွားပါက \`Org Chart\` မှ အလိုအလျောက် ပျောက်ကွယ်သွားမည် ဖြစ်ပါသည်။

---

## 20. Practical Workflows (လက်တွေ့ အသုံးပြုမှု)

1. ဝန်ထမ်း နုတ်ထွက်စာ တင်လာသည်။
2. HR သည် **Initiate Offboarding** တွင် ဖြည့်သွင်း၍ စတင်လိုက်သည်။
3. ချက်ချင်းပင် ဝန်ထမ်း၏ Portal သို့ Handover လုပ်ရန် သတိပေးချက် (Notification) ရောက်သွားသည်။
4. HR သည် Asset Clearance (Laptop, Access Card) များကို ပြန်လည် သိမ်းဆည်းတိုင်း အမှန်ခြစ်ပေးသည်။
5. ဝန်ထမ်းမှ Handover 100% ပြီးစီးကြောင်း Manager မှ အတည်ပြုလိုက်သည်။
6. HR သည် Exit Interview ကို ခေါ်ယူ မေးမြန်း၍ ရလဒ်ကို ဖြည့်သွင်းသည်။
7. အရာအားလုံး ပြည့်စုံသွားသောအခါ HR က **"Release Final Settlement"** ကို နှိပ်၍ ငွေစာရင်းရှင်းပေးလိုက်သည်။
8. နောက်ဆုံး အနေဖြင့် \`Employee Details\` သို့ သွား၍ ထိုဝန်ထမ်းကို "Offboarded" ဟု သတ်မှတ်ပေးလိုက်သည်။

---

## 21. Real-World HR Scenarios (လက်တွေ့ အခြေအနေများ)

- **ဝန်ထမ်းက ရုတ်တရက် အလုပ်ထွက်ပြေးခြင်း (Absconding):** Handover ကို ပြုလုပ်နိုင်တော့မည် မဟုတ်သဖြင့် HR မှ Detail ထဲသို့ ဝင်၍ Handover ကို "Waive" (ကင်းလွတ်ခွင့်) လုပ်ပေးလိုက်မှသာ Final Settlement ခလုတ်ကို နှိပ်၍ ရပါမည်။

---

## 22. Common Questions / Troubleshooting

- **မေး: "Release Final Settlement" နှိပ်လို့မရဘူး (မီးခိုးရောင် ဖြစ်နေတယ်)။ ဘာလို့လဲ?**
  ဖြေ: Task Checklist များထဲတွင် အမှန်ခြစ်ရန် ကျန်နေသေး၍ ဖြစ်စေ၊ သို့မဟုတ် Handover လုပ်ငန်းစဉ် မပြီးဆုံးသေး၍ ဖြစ်စေ ခလုတ်ကို ပိတ်ထားခြင်း ဖြစ်ပါသည်။

---

## 23. Important Notes / Limitations

- အခွန်ကင်းရှင်းကြောင်း (Tax Clearance) စာရွက်စာတမ်း ထုတ်ပေးခြင်းများ စနစ်အတွင်း အလိုအလျောက် **မပါဝင်သေးပါ**။ 

---

## 24. Complete Employee Lifecycle Context

Offboarding သည် ဝန်ထမ်းဘဝ (Employee Lifecycle) ၏ နောက်ဆုံးအဆင့် ဖြစ်ပါသည်။ ဤအဆင့်ကို စနစ်တကျ လုပ်ဆောင်ခြင်းဖြင့် ကုမ္ပဏီ၏ အချက်အလက် လုံခြုံရေးကို ကာကွယ်နိုင်ပြီး၊ နောက်တက်လာမည့် ဝန်ထမ်းသစ်များအတွက် လုပ်ငန်း အခက်အခဲ မရှိစေရန် ကူညီပေးပါသည်။

---

## 25. Related Modules (ဆက်စပ်သော အခန်းများ)

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Handovers" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Handovers</a>
- <a href="#" data-article-title="Document Vault" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Document Vault</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
`;

    const enMarkdown = `
# Offboarding

## 1. Offboarding Overview
The **Offboarding** module provides a structured, trackable checklist to ensure that when an employee leaves the company, all company assets are returned, knowledge is successfully transferred, and the exit interview is recorded before the final payroll is settled.

## 2. Purpose of Offboarding
- To protect company data and physical assets by ensuring items like laptops and access cards are officially checked in.
- To mandate proper knowledge transfer (Handovers) to prevent operational bottlenecks.
- To gather constructive feedback via Exit Interviews.
- To safely lock the final payroll settlement until all offboarding requirements are 100% satisfied.

---

## 3. Offboarding Screen

The main screen features:
1. **Summary Cards:** Total Cases, Hold Final Payroll, and Settlement Released.
2. **Initiate Form:** The panel to start a new offboarding process.
3. **Employee Cards:** Individual cards for each departing employee showing their progress percentage, current settlement status, and quick-action buttons.

---

## 4. Starting an Offboarding Process

To initiate an offboarding:
1. Select the employee from the dropdown list.
2. Select the **Termination Reason** (e.g., Resignation, Contract End).
3. Select the **Exit Type** (e.g., Voluntary, Involuntary).
4. Enter the **Resignation Date** and **Last Working Date**.
5. Click **"Start Offboarding"**. This instantly generates a tracking card and creates default clearance tasks.

---

## 5. Exit Survey (Exit Interview)

- HR can conduct an in-person interview by clicking **"Exit Interview"** on the employee's card and filling out the form manually.
- Alternatively, the employee can log into their own Employee Portal and submit the **Exit Survey** themselves.
- The survey captures 1-5 star ratings on Job Satisfaction, Management, Work Environment, Compensation, and open text feedback for Highlights and Improvements.

---

## 6. Asset Return & Clearance

Clicking **"Details →"** on an employee's card reveals the Clearance panel:
- **Quick Clearance Toggles:** HR must manually toggle switches to confirm the return of the Laptop, Access Card, and the signing of the Exit NDA.
- **Categorized Tasks:** A checklist of 10 standard items divided by department (IT, Finance, HR) that must be checked off as completed.

---

## 7. Knowledge Transfer & 8. Handover

- The offboarding module is deeply integrated with the \`Handovers\` module.
- Inside the Offboarding Details, the **"Handover"** tab allows you to monitor the employee's exact progress in handing over their projects to a successor.
- **Critical Logic:** The final settlement is completely blocked if the linked Handover is not 100% completed (or manually "Waived" by an Admin).

---

## 9. Offboarding Checklist

Upon initiation, the system automatically spawns a 10-point checklist (e.g., "Revoke System Access", "Clear Outstanding Expenses"). HR must manually click the circles next to each task to mark them as Completed.

---

## 10. Completion Status

- The system strictly enforces a **100% completion requirement**.
- The **"Release Final Settlement"** button remains grayed out and unclickable until every checklist item is checked, asset toggles are green, and the Handover is complete.

---

## 11. Employee Exit / Soft Delete Behavior

**IMPORTANT NOTE:** Clicking "Release Final Settlement" does **not** automatically soft-delete the employee or revoke their system login access. 
- The Offboarding module strictly manages the *process* of leaving.
- To physically lock the employee out of the system and remove them from active payroll/directories, HR must manually navigate to the **Employee Details** module, click Edit, and change the employee's status to **"Offboarded"** or **"Inactive"**.

---

## 12. What Happens After Offboarding

Once finalized:
1. The settlement status is permanently marked as "Released".
2. The Exit Interview and Handover logs remain permanently in the database for historical compliance and audit purposes.

---

## 13. Offboarding ↔ Employees 
You must select an active employee from the \`Employees\` database to start. You must return to \`Employees\` to manually set their status to Inactive after the settlement is released.

## 14. Offboarding ↔ Handovers
The system enforces a hard dependency: Offboarding cannot be completed if the linked Handover is still pending.

## 15. Offboarding ↔ Document Vault
HR should upload the final clearance certificates or signed Exit NDAs into the employee's \`Document Vault\` folder for legal safekeeping.

## 16. Offboarding ↔ Attendance / 17. Leave / 18. Payroll
During the notice period, the employee continues to use Attendance and Leave normally. However, \`Payroll & KPI\` requires HR to hold the final month's paycheck until this Offboarding process flashes green.

## 19. Offboarding ↔ Org Chart
Once HR manually updates the employee's status to Inactive in the Employee Details module, they will automatically vanish from the \`Org Chart\`.

---

## 20. Practical Workflows

1. Employee submits a resignation letter.
2. HR initiates Offboarding.
3. The employee immediately receives a notification on their portal to begin their Handover checklist.
4. Over the next 30 days, HR checks off Asset Returns as the employee hands over their laptop and keys.
5. The employee's manager approves the 100% completed Handover.
6. HR conducts the Exit Interview and saves the ratings.
7. With all tasks done, HR clicks **"Release Final Settlement"** to authorize Finance to pay out the final check.
8. HR goes to Employee Details and changes the status to "Offboarded", instantly locking the employee out of the system.

---

## 21. Real-World HR Scenarios

- **The employee abandons the job (Absconding):** Since the employee will never complete their Handover, HR must navigate to the Handover tab and officially "Waive" the requirement, providing a written reason. Only then will the system unblock the "Release Final Settlement" button.

---

## 22. Common Questions / Troubleshooting

- **Q: Why can't I click Release Final Settlement?**
  A: Look for any un-checked items in the Task list, ensure the 4 clearance toggles are green, and verify the Handover tab shows 100% completion (or waived).

---

## 23. Important Notes / Limitations

- Automated tax clearance calculations and automated revocation of Microsoft 365/Google Workspace emails are **not** implemented in this software.

---

## 24. Complete Employee Lifecycle Context

Offboarding represents the absolute end of the employee lifecycle. Handling it through this module ensures a clean, legal, and secure break between the company and the individual, protecting company IP and maintaining positive alumni relations.

---

## 25. Related Modules

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Handovers" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Handovers</a>
- <a href="#" data-article-title="Document Vault" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Document Vault</a>
- <a href="#" data-article-title="Org Chart" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Org Chart</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Offboarding')
      .single();

    if (error || !article) {
      console.log('Offboarding article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Offboarding article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
