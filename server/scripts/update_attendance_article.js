import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Attendance Article...');

    const myMarkdown = `
# Attendance (ရုံးတက်/ဆင်း စီမံခန့်ခွဲခြင်း)

## 1. Attendance Overview (ယေဘုယျအကြောင်းအရာ)
**Attendance Module** သည် ဝန်ထမ်းများ၏ ရုံးတက်ချိန်၊ ရုံးဆင်းချိန်၊ နောက်ကျမှု၊ စောပြန်မှု နှင့် အချိန်ပို (Overtime) များကို မှတ်တမ်းတင် တွက်ချက်ပေးသော အဓိက စနစ်ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** ဝန်ထမ်းများ၏ နေ့စဉ် အလုပ်လုပ်ချိန် (Work Hours) များကို အတိအကျ သိရှိရန်နှင့် လစာ (Payroll) တွက်ချက်ရာတွင် အခြေခံ အချက်အလက်များ ထောက်ပံ့ပေးရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** ဝန်ထမ်းအားလုံးက Check-in/Check-out ပြုလုပ်ကြပြီး၊ HR နှင့် Admin များက စောင့်ကြည့် ထိန်းချုပ် (Manage) ပါသည်။

---

## 2. Attendance Dashboard & Stats

Attendance စာမျက်နှာကို ဖွင့်လိုက်သည်နှင့် အပေါ်ဆုံးတွင် နေ့စဉ် အခြေအနေ (Stats) ကို ပြသထားသော ကတ်များကို တွေ့ရပါမည်-
- **Total Records:** စုစုပေါင်း မှတ်တမ်း အရေအတွက်။
- **Present Today:** ယနေ့ ရုံးတက်သူ အရေအတွက်။
- **Late Arrivals:** ယနေ့ နောက်ကျမှ ရောက်လာသူ အရေအတွက်။
- **Still In Office:** Check-in ဝင်ထားသော်လည်း Check-out ပြန်မလုပ်ရသေးသော ရုံးတွင်းရှိသူ အရေအတွက်။

အောက်ဘက်တွင် လုပ်ဆောင်ချက်များကို Tab များဖြင့် ခွဲခြားထားပါသည် (ဥပမာ - Manual Entry, Records, Photo Check-In, QR Code, Biometric, အစရှိသဖြင့်)။

---

## 3. Check-in / Check-out Methods (မှတ်တမ်းတင်နည်းလမ်း ၄ မျိုး)

BBD HRM တွင် အောက်ပါနည်းလမ်း (၄) မျိုးဖြင့် ရုံးတက်/ဆင်း ပြုလုပ်နိုင်ရန် ထည့်သွင်း (Implement) ထားပါသည်-

1. **Photo Check-In (ဓာတ်ပုံရိုက်၍ မှတ်တမ်းတင်ခြင်း):**
   - 📸 ကင်မရာပွင့်လာပြီး မိမိပုံကို ရိုက် (Capture) ပါ။ ဝန်ထမ်းအမည်ကို ရွေးပြီး Submit လုပ်ပါ။ ပထမအကြိမ်နှိပ်ပါက Check-in အဖြစ် မှတ်သားပြီး၊ နောက်တစ်ကြိမ်နှိပ်ပါက Check-out အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးပါသည်။
2. **QR Code (QR စကင်ဖတ်ခြင်း):**
   - HR မှ ဝန်ထမ်းတစ်ဦးချင်းစီအတွက် QR Code ကို Generate လုပ်ပေးနိုင်ပြီး၊ ၎င်းကို အသုံးပြု၍ ရုံးတက်/ဆင်း ပြုလုပ်နိုင်ပါသည်။
3. **Biometric (လက်ဗွေ / မျက်နှာဖတ် စက်များ):**
   - ရုံးတွင် လက်ဗွေစက် (ZKTeco ကဲ့သို့) များ တပ်ဆင်ထားပါက၊ စက်၏ IP နှင့် Port ကို \`Biometric\` Tab တွင် ထည့်သွင်း (Register) နိုင်ပါသည်။ ထို့နောက် ဝန်ထမ်းအမည်နှင့် စက်ထဲရှိ ID (Biometric ID) ကို တွဲဖက် (Map) ပေးထားခြင်းဖြင့် စက်မှ အချက်အလက်များ စနစ်ထဲသို့ တိုက်ရိုက် ဝင်ရောက်လာပါမည်။
4. **Manual Entry (HR မှ ကိုယ်တိုင်သွင်းပေးခြင်း):**
   - စက်ပျက်နေခြင်း သို့မဟုတ် မေ့သွားခြင်းများ ရှိပါက HR က \`Manual Entry\` Tab မှတစ်ဆင့် ဝန်ထမ်းအမည်၊ တက်ချိန်၊ ဆင်းချိန် နှင့် အချိန်ပိုများကို ကိုယ်တိုင် (Manual) ရိုက်ထည့်ပေးနိုင်ပါသည်။

---

## 4. Attendance Records (မှတ်တမ်းများ ကြည့်ရှုခြင်း)

\`Records\` Tab တွင် ဝန်ထမ်းအားလုံး၏ နေ့စဉ် မှတ်တမ်းများကို ဇယား (Table) ဖြင့် ပြသထားပါသည်။
- **Search & Filter:** ဝန်ထမ်းအမည်၊ ရက်စွဲ၊ သို့မဟုတ် အခြေအနေ (Late / On time) ဖြင့် စစ်ထုတ် ရှာဖွေနိုင်ပါသည်။
- **Export:** ဇယားမှ အချက်အလက်များကို CSV ဖိုင်ဖြင့် ဒေါင်းလုဒ်ရယူနိုင်ပါသည်။ (Export ခလုတ်ကို နှိပ်ပါ)။
- **ပါဝင်သော အချက်အလက်များ:** အမည်၊ ရိုက်ထားသော ဓာတ်ပုံ၊ Check In အချိန်၊ Check Out အချိန်၊ အသုံးပြုခဲ့သော နည်းလမ်း (QR, Bio, Photo, Manual)၊ လုပ်ကိုင်ခဲ့သော နာရီပေါင်း၊ Overtime နာရီ၊ နှင့် နောက်ကျ/မကျ (Status) တို့ကို အတိအကျ ပြသထားပါသည်။

---

## 5. Attendance Status (Late / Early)

မှတ်တမ်း ဇယားတွင် Status ကို အရောင်များဖြင့် အလွယ်တကူ သိရှိနိုင်ပါသည်-
- **On time (အစိမ်းရောင်):** အချိန်မီ ရောက်ရှိသူ။
- **Late (အဝါရောင်):** နောက်ကျမှ ရောက်ရှိသူ။
- **Early Leave (အနီရောင်):** ရုံးဆင်းချိန်ထက် စောပြန်သူ။
*(မှတ်ချက်: Manual သွင်းရာတွင် နောက်ကျကြောင်း (Mark Late) ကို HR မှ Checkbox ခြစ်၍ သတ်မှတ်ပေးနိုင်ပါသည်)*။

---

## 6. Editing & Corrections (ပြင်ဆင်ခြင်းနှင့် ဖျက်ခြင်း)

- **Check-out ကျန်ခဲ့လျှင်:** ဇယားတွင် Check-out မလုပ်ရသေးသူများအတွက် အဝါရောင် \`Checkout\` ခလုတ်လေး ပေါ်နေပါမည်။ HR မှ ထိုခလုတ်ကို နှိပ်၍ လက်ရှိအချိန်ဖြင့် အလွယ်တကူ Check-out လုပ်ပေးနိုင်ပါသည်။
- **ဖျက်ပစ်ခြင်း:** မှားယွင်းသွင်းမိသော မှတ်တမ်းများကို ဇယား၏ ညာဘက်ဆုံးရှိ \`Delete\` ခလုတ်ကို နှိပ်၍ ဖျက်ပစ် (Hard Delete) နိုင်ပါသည်။ (Admin သာ လုပ်နိုင်ပါသည်)။

---

## 7. Attendance ↔ Employee (ဝန်ထမ်းနှင့် ဆက်စပ်မှု)

- ရုံးတက်/ဆင်း မှတ်တမ်းများကို \`Employees\` Module တွင် စာရင်းသွင်းထားသော ဝန်ထမ်းအမည်များဖြင့် တိုက်ရိုက် ချိတ်ဆက်ထားပါသည်။ ဝန်ထမ်းအသစ် မရှိဘဲ Attendance သွင်း၍ မရနိုင်ပါ။

---

## 8. Attendance ↔ Leave Management (ခွင့်နှင့် ဆက်စပ်မှု)

- ဝန်ထမ်းတစ်ဦးသည် ခွင့် (Leave) ယူထားပါက ထိုနေ့အတွက် Attendance တက်မည် မဟုတ်ပါ။ HR သည် Leave Module ကို စစ်ဆေးခြင်းဖြင့် ရုံးမတက်သူသည် ခွင့်ယူထားခြင်းလော၊ ခွင့်မဲ့ပျက်ကွက်လော (Absent) ဆိုသည်ကို သိရှိနိုင်ပါသည်။ (လက်ရှိတွင် စနစ်နှစ်ခုသည် မျက်နှာပြင်တစ်ခုတည်းတွင် အလိုအလျောက် ပေါင်းစပ်ပြသခြင်း မရှိသေးပါ)။

---

## 9. Attendance ↔ Payroll & KPI (လစာနှင့် ဆက်စပ်မှု)

- Attendance Records များထဲရှိ "အလုပ်လုပ်ခဲ့သော နာရီပေါင်း (Work Hours)" နှင့် "အချိန်ပို (Overtime)" များသည် \`Payroll\` Module တွင် လစာတွက်ချက်ရာ၌ အလွန်အရေးပါသော အခြေခံ အချက်အလက်များ ဖြစ်ပါသည်။ နောက်ကျ (Late) သော အရေအတွက်ကိုလည်း Performance စစ်ဆေးရာတွင် အသုံးပြုပါသည်။

---

## 10. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**လက်ဗွေစက် အသစ်ချိတ်ဆက်နည်း:**
1. \`Biometric\` Tab သို့ သွားပါ။
2. \`Register Device\` အောက်တွင် စက်အမည်၊ IP Address နှင့် Port ကို ထည့်၍ Save လုပ်ပါ။
3. ထို့နောက် \`Map Employee to Device\` နေရာတွင် ဝန်ထမ်းအမည်ကို ရွေးချယ်ပြီး စက်ထဲရှိ ၎င်း၏ ID (Biometric ID) ကို ရိုက်ထည့်၍ မှတ်သား (Save) ပေးပါ။ ထိုသို့ လုပ်ပြီးပါက လက်ဗွေစက်မှ ဒေတာများ ဝင်ရောက်လာပါမည်။

---

## 11. အဖြစ်များသော အခြေအနေများ (Real-World Scenarios)

- **ဖုန်း သို့မဟုတ် စက်ပျက်သွားခြင်း:** ဝန်ထမ်းသည် QR ဖတ်၍မရခြင်း သို့မဟုတ် လက်ဗွေစက် ပျက်နေခြင်း ဖြစ်ပါက HR က \`Photo Check-In\` သို့မဟုတ် \`Manual Entry\` ဖြင့် ထိုနေ့အတွက် ရုံးတက်စာရင်းကို အစားထိုး သွင်းပေးရပါမည်။

---

## 12. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: Check-out နှိပ်ဖို့ မေ့သွားရင် ဘာဖြစ်မလဲ?**
  ဖြေ: Dashboard တွင် "Still In Office" အနေဖြင့် ဆက်လက် ပေါ်နေမည်ဖြစ်ပြီး ထိုနေ့အတွက် အလုပ်လုပ်ချိန် (Work Hours) တွက်ချက်နိုင်မည် မဟုတ်ပါ။ HR က Records ထဲသို့ ဝင်၍ Checkout နှိပ်ပေးရပါမည်။
- **မေး: Export ထုတ်တဲ့အခါ နာမည်တွေ မပါလာဘူး ဘာလို့လဲ?**
  ဖြေ: CSV ထုတ်သည့်အခါ Date Filter များ သတ်မှတ်ထားခြင်း ရှိ/မရှိ ပြန်စစ်ဆေးပါ။ ဇယားတွင် ပေါ်နေသော အချက်အလက်များကိုသာ Export ထုတ်ပေးမည် ဖြစ်ပါသည်။

---

## 13. အရေးကြီး မှတ်သားရန် (Limitations & Precautions)

- **Photo & QR Timezones:** စနစ်သည် အချိန် (Time) ကို မှတ်သားရာတွင် ဒေသစံတော်ချိန် (Local Time) နှင့် UTC ကို အခြေအနေအလိုက် အလိုအလျောက် ပြောင်းလဲ တွက်ချက်ထားပါသည်။ Export ဖိုင်များ ထုတ်သည့်အခါ နာရီဝက် သို့မဟုတ် တိကျမှု ကွာဟခြင်းများ ရှိပါက HR အနေဖြင့် သေချာစွာ ပြန်လည်စစ်ဆေးပါ။
- **Delete Record:** Attendance ကို ဖျက်လိုက်ပါက ပြန်လည် ရယူနိုင်မည် မဟုတ်ပါ။

---

## 14. Employee Lifecycle တွင် ပါဝင်မှု

Onboarding ပြီးစီး၍ လုပ်ငန်းခွင် စတင်ဝင်ရောက်သည်နှင့် **Attendance (ရုံးတက်/ဆင်း)** သည် ဝန်ထမ်းတစ်ဦးအတွက် နေ့စဉ် လုပ်ဆောင်ရမည့် (Daily Routine) လုပ်ငန်းစဉ် ဖြစ်လာပါသည်။ ၎င်းမှ ထွက်ပေါ်လာသော ရလဒ်များကို Payroll (လစာ) တွင် အဆုံးသတ် အသုံးပြုရပါသည်။

---

## 15. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const enMarkdown = `
# Attendance

## 1. Attendance Overview
The **Attendance Module** is the core system used to track employee clock-ins, clock-outs, lateness, early departures, and overtime. 
- **Purpose:** It provides the exact hours worked by each employee, which is essential for accurate Payroll calculation and performance monitoring.
- **Who uses it?** All employees use the system to clock in/out, while HR and Admins monitor, correct, and export the data.

---

## 2. Attendance Dashboard & Stats

Upon opening the Attendance page, the top row displays real-time daily metric cards:
- **Total Records:** The total number of attendance records logged.
- **Present Today:** Number of employees who successfully checked in today.
- **Late Arrivals:** Number of employees marked as late.
- **Still In Office:** Employees who have checked in but not yet checked out.

Below the metrics, actions and data are organized into distinct Tabs (Manual Entry, Records, Photo, QR, Biometric, etc.).

---

## 3. Check-in / Check-out Methods

The BBD HRM system actively supports four distinct implemented methods for tracking time:

1. **Photo Check-In:**
   - Employees or HR can use a webcam/tablet. The system captures a photo, the user selects their name, and clicks submit. The system automatically registers a "Check-in" if there is no active session, or a "Check-out" if the employee is already checked in.
2. **QR Code:**
   - Admins can generate a secure QR token for an employee, which can then be scanned by a dedicated device.
3. **Biometric (Fingerprint/Face):**
   - External hardware (like ZKTeco) can be registered under the \`Biometric\` tab using its IP address and Port. HR then maps the system's Employee ID to the device's internal Biometric ID to sync logs automatically.
4. **Manual Entry:**
   - If a device fails or an employee forgets to clock in, HR can manually log the entry, explicitly setting the Start Time, End Time, Overtime, and manually checking a box if the employee was late.

---

## 4. Attendance Records

The \`Records\` Tab displays the master list of all attendance logs.
- **Search & Filter:** You can filter logs by Employee Name, specific Date, or Status (Late/On-time).
- **Export:** Click the Export button to download the currently filtered view as a CSV spreadsheet.
- **Visible Data:** The table explicitly shows the Employee name/avatar, Check-in photo (if applicable), precise Check-In/Out times, Method used, Total Hours calculated, Overtime, Status (Late/On Time), and Admin Actions.

---

## 5. Attendance Status

Statuses are color-coded in the Records table for quick visibility:
- **On time (Green):** Employee arrived within normal hours.
- **Late (Amber):** Employee arrived after the grace period.
- **Early Leave (Red):** Employee clocked out before the shift ended.

---

## 6. Editing & Corrections

- **Missing Check-outs:** If an employee forgets to check out, their row will display a yellow \`Checkout\` button. HR can click this to force a check-out at the current time.
- **Deletions:** Admins can click \`Delete\` to permanently remove a false or duplicate attendance record.

---

## 7. Relationship with Employees

- Attendance logs are strictly bound to the \`Employees\` database. You cannot clock in someone who does not have an active Employee profile in the system.

---

## 8. Relationship with Leave Management

- When an employee is absent, HR cross-references the Attendance Records with the **Leave Management** module to determine if the absence was authorized (Paid/Unpaid Leave) or unauthorized.

---

## 9. Relationship with Payroll & KPI

- The "Total Hours" and "Overtime Hours" generated in the Attendance Records are the fundamental data points used by the **Payroll** module to calculate wages. Frequent lateness recorded here also impacts the **Performance Tracker** evaluations.

---

## 10. Practical Workflows

**How to set up a new Biometric scanner:**
1. Go to the \`Biometric\` tab.
2. Under \`Register Device\`, enter the Device Name, local IP Address, and Port (default 4370), then Save.
3. Under \`Map Employee to Device\`, select the employee from the dropdown and type their corresponding ID number from the biometric machine. Save the mapping to begin receiving their punch logs.

---

## 11. Real-World HR Scenarios

- **Device Failure:** If the fingerprint scanner breaks, HR instructs all staff to use the \`Photo Check-In\` tab via a reception tablet for the day to ensure no data is lost.

---

## 12. Common Questions / Troubleshooting

- **Q: What happens if someone never checks out?**
  A: They remain "Still In Office" and the system cannot calculate their total work hours for that day. HR must manually force a checkout via the Records tab.
- **Q: Why is my CSV export empty?**
  A: Check your Date filter. By default, it may be set to "Today". Change it to "All Dates" before exporting if you want historical data.

---

## 13. Important Notes

- **Deletions are Permanent:** Deleting an attendance record is a hard delete and cannot be undone.
- **Timezone Handling:** Photo and QR check-ins process times in UTC, while Biometric and Manual entries use Local Time. The system attempts to format these cleanly in the Records table, but HR should double-check CSV exports for accuracy.

---

## 14. Employee Lifecycle Context

Once Onboarding is complete, **Attendance** becomes the core daily operational phase of the Employee Lifecycle, repeating every day until Offboarding.

---

## 15. Related Modules

- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Performance Tracker" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Performance Tracker</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Attendance')
      .single();

    if (error || !article) {
      console.log('Attendance article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Attendance article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
