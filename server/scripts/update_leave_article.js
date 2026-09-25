import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Leave Management Article...');

    const myMarkdown = `
# Leave Management (ခွင့်စီမံခန့်ခွဲခြင်း)

## 1. Leave Management Overview (ယေဘုယျအကြောင်းအရာ)
**Leave Management Module** သည် ဝန်ထမ်းများ၏ ခွင့်တိုင်ကြားမှုများ (Leave Requests)၊ ခွင့်လက်ကျန်များ (Leave Balances) နှင့် ခွင့်အမျိုးအစားများကို စနစ်တကျ မှတ်တမ်းတင်ပေးသော နေရာဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** ဝန်ထမ်းများ ခွင့်တင်ရာတွင် လွယ်ကူစေရန်၊ အထက်လူကြီးမှ Approve လုပ်ရန်၊ နှင့် ခွင့်လက်ကျန် (Balance) များကို အလိုအလျောက် တွက်ချက်ပေးရန် ဖြစ်ပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** ဝန်ထမ်းများက ခွင့်တင်ရန် အသုံးပြုပြီး၊ Admin နှင့် HR များက Approve/Reject လုပ်ရန် အသုံးပြုပါသည်။

---

## 2. Leave Management Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

Leave စာမျက်နှာတွင် အဓိက Tab (၃) ခု ရှိပါသည်-
1. **Leave Balances:** ဝန်ထမ်းတစ်ဦးချင်းစီ၏ ခွင့်ရက် ရပိုင်ခွင့် (Entitled)၊ သုံးပြီးသားရက် (Used) နှင့် ကျန်ရှိနေသော ခွင့်ရက် (Remaining) များကို ဇယားဖြင့် ပြသထားပါသည်။
2. **Leave Requests:** ခွင့်တင်ထားသော စာရင်းများ (အတည်ပြုရန် ကျန်ရှိနေသေးသူများ၊ အတည်ပြုပြီးသူများ) ကို ပြသထားပါသည်။
3. **Leave Types:** ခွင့်အမျိုးအစားများ (ဥပမာ - Casual Leave, Medical Leave) ကို ဖန်တီး/ပြင်ဆင် နိုင်သော နေရာဖြစ်ပါသည်။

---

## 3. Leave Types (ခွင့်အမျိုးအစားများ)

- \`Leave Types\` Tab တွင် "လစာရခွင့် (Paid)" သို့မဟုတ် "လစာမဲ့ခွင့် (Unpaid)" အဖြစ် သတ်မှတ်နိုင်ပါသည်။
- ခွင့်တစ်မျိုးစီအတွက် တစ်နှစ်စာ ရပိုင်ခွင့် (Default Days) နှင့် အကြောင်းအရာ (Description) များကို Admin မှ \`+ Add Type\` ကို နှိပ်၍ သတ်မှတ်ပေးနိုင်ပါသည်။

---

## 4. Leave Balance (ခွင့်လက်ကျန်)

- \`Leave Balances\` Tab တွင် Progress Bar လေးများ ပါဝင်ပြီး၊ ဝန်ထမ်းတစ်ဦးသည် ၎င်း၏ ခွင့်လက်ကျန်၏ ဘယ်လောက်ရာခိုင်နှုန်းကို သုံးစွဲထားပြီးပြီလဲ ဆိုသည်ကို အရောင် (အစိမ်း၊ အဝါ၊ အနီ) ဖြင့် အလွယ်တကူ မြင်တွေ့နိုင်ပါသည်။

---

## 5. Creating a Leave Request (ခွင့်တင်ခြင်း)

ခွင့်တင်ရန်-
1. \`Leave Requests\` Tab သို့သွားပါ။
2. \`+ New Request\` ခလုတ်ကို နှိပ်ပါ။
3. ဖောင် (Form) တွင် အချက်အလက်များ ဖြည့်စွက်ပြီး \`Submit\` ကို နှိပ်ပါ။

---

## 6. Leave Request Fields (ခွင့်ဖောင်တွင် ပါဝင်သောအချက်များ)

- **Employee:** ခွင့်ယူမည့် ဝန်ထမ်းအမည်။
- **Leave Type:** ခွင့်အမျိုးအစား (ဥပမာ - Medical Leave)။
- **Start Date & End Date:** ခွင့်စတင်မည့်ရက် နှင့် ပြီးဆုံးမည့်ရက် (စနစ်မှ ခွင့်ယူမည့် စုစုပေါင်း ရက်အရေအတွက်ကို အလိုအလျောက် တွက်ချက်ပြသပေးပါမည်)။
- **Reason:** ခွင့်ယူရသည့် အကြောင်းရင်း (အသေးစိတ် ရေးသားရန်)။
- *(မှတ်ချက်: ဆေးလက်မှတ် ကဲ့သို့သော Attachment များလည်း ထည့်သွင်းနိုင်ပါသည်)*။

---

## 7. Approval Workflow (ခွင့်ပြုခြင်း လုပ်ငန်းစဉ်)

- ခွင့်စတင် တင်လိုက်သည်နှင့် Status သည် **Pending** ဖြစ်နေပါမည်။
- Admin သို့မဟုတ် HR သည် ၎င်းကို Approve သို့မဟုတ် Reject ပြုလုပ်ပေးရပါမည်။

---

## 8. Approve / Reject Behavior (အတည်ပြုခြင်း နှင့် ပယ်ချခြင်း)

- **Reject (ပယ်ချခြင်း):** ဇယားရှိ Action ခလုတ် (သို့မဟုတ် အသေးစိတ် မျက်နှာပြင်) မှ \`Reject\` ကို နှိပ်လိုက်ပါက ခွင့်ပယ်ချခံရမည် ဖြစ်ပါသည်။
- **Approve (အတည်ပြုခြင်း):** \`Approve\` ခလုတ် (အမှန်ခြစ်ပုံ) ကို နှိပ်လိုက်ပါက **Signature Modal** ပွင့်လာပါမည်။ Admin သည် e-Signature (ဒီဂျစ်တယ် လက်မှတ်) ထိုးပြီးမှသာ အတည်ပြုနိုင်မည် ဖြစ်ပါသည်။ လက်မှတ်မထိုးဘဲ အတည်ပြု၍ မရပါ။

---

## 9. Leave Statuses (အခြေအနေများ)

- **Pending:** ခွင့်တင်ထားပြီး အတည်ပြုရန် စောင့်ဆိုင်းနေဆဲ။
- **Approved:** Admin မှ လက်မှတ်ထိုး အတည်ပြုပြီးသား ဖြစ်ခြင်း။
- **Rejected:** Admin မှ ပယ်ချလိုက်ခြင်း။

---

## 10. Leave Balance Deduction (ခွင့်လက်ကျန် နုတ်ယူခြင်း)

- Admin မှ \`Approve\` (အတည်ပြု) လိုက်မှသာလျှင်၊ ဝန်ထမ်း၏ \`Leave Balance\` ထဲမှ သုံးစွဲလိုက်သော ရက်အရေအတွက်ကို အလိုအလျောက် နှုတ်ယူသွားမည် ဖြစ်ပါသည်။ (Pending ဖြစ်နေစဉ်တွင် နှုတ်ယူမည် မဟုတ်ပါ)။

---

## 11. Multi-day Leave & Handover (ရက်ရှည်ခွင့်နှင့် တာဝန်လွှဲပြောင်းခြင်း)

- Leave Module တွင် **Handover Workflow** နှင့် တိုက်ရိုက် ချိတ်ဆက်ထားပါသည်။
- ဝန်ထမ်းတစ်ဦး ခွင့်ယူပါက၊ ခွင့်မသွားမီ ၎င်း၏ အလုပ်တာဝန်များကို အခြားတစ်ဦးထံသို့ လွှဲပြောင်းပေးခဲ့ရန် (Coverage Handover) လိုအပ်နိုင်ပါသည်။
- ထိုသို့လိုအပ်ပါက Admin မှ Action မီနူးမှတစ်ဆင့် \`Start Coverage Handover\` ကို နှိပ်၍ အစားထိုး တာဝန်ယူပေးမည့်သူ (Successor) ကို ရွေးချယ် သတ်မှတ်ပေးနိုင်ပါသည်။

---

## 12. Leave ↔ Handover Relationship

- **Coverage Handover:** ခွင့်သွားနေစဉ် အလုပ်တာဝန်များ လွှဲပြောင်းပေးခြင်း။
- **Return Handover:** ခွင့်မှ ပြန်လည်ရောက်ရှိလာသောအခါ အလုပ်တာဝန်များကို မူလဝန်ထမ်းထံသို့ ပြန်လည်လွှဲပြောင်းပေးခြင်း။
- *(မှတ်ချက်: Handover တစ်ခု Active ဖြစ်နေပါက၊ ထို Leave Request ကို Delete ဖျက်ပစ်၍ မရတော့ပါ။ ပိတ်ပင် (Block) ထားပါမည်)*။

---

## 13. Leave ↔ Attendance (ခွင့်နှင့် ရုံးတက်စာရင်း)

- Leave Module တွင် ခွင့်တင်ပြီး (Approved) ဖြစ်နေသော ရက်များအတွက် \`Attendance\` တွင် လာရောက် Check-in ဝင်ရန် မလိုအပ်ပါ။ စနစ်သည် ထိုနေ့ကို ခွင့်အဖြစ် သတ်မှတ်ထားမည် ဖြစ်ပါသည်။

---

## 14. Leave ↔ Payroll (ခွင့်နှင့် လစာ)

- **Paid Leave (လစာရခွင့်):** လစာထဲမှ ဖြတ်တောက်မည် မဟုတ်ပါ။
- **Unpaid Leave (လစာမဲ့ခွင့်):** \`Payroll\` Module တွင် လစာတွက်ချက်သောအခါ အလိုအလျောက် ဖြတ်တောက် တွက်ချက်သွားမည် ဖြစ်ပါသည်။

---

## 15. Leave ↔ Offboarding (အလုပ်ထွက်ခြင်း)

- အလုပ်ထွက်ခွင့် တင်ထားသူ (Offboarding) ဖြစ်ပါက ၎င်း၏ Leave Request တွင် **"In Offboarding"** ဟူသော အဝါရောင် သတိပေးချက် လာရောက် ပြသနေမည် ဖြစ်ပါသည်။

---

## 16. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

1. ဝန်ထမ်းမှ ခွင့်တင်ပါသည်။
2. HR မှ ဇယားထဲတွင် \`Pending\` ဝင်နေသည်ကို မြင်တွေ့ရမည်။
3. လိုအပ်ပါက HR သည် \`Start Coverage Handover\` ဖြင့် အစားထိုး တာဝန်ယူမည့်သူကို သတ်မှတ်ပါသည်။
4. အဆင်ပြေပါက \`Approve\` ခလုတ်ကို နှိပ်ပြီး၊ ဒစ်ဂျစ်တယ် လက်မှတ်ထိုး၍ အတည်ပြုပါသည်။
5. ခွင့်လက်ကျန်ထဲမှ အလိုအလျောက် နှုတ်ယူသွားပါသည်။

---

## 17. Real-World HR Scenarios

- **နေမကောင်း၍ ရုတ်တရက် ခွင့်တင်ခြင်း:** ဆေးခွင့် (Medical Leave) တင်လာပါက HR သည် ၎င်းကို ချက်ချင်း Approve လုပ်ပေးနိုင်ပါသည်။ Handover လုပ်ရန် အချိန်မရပါက Handover ကို မလုပ်ဘဲ ကျော်သွားနိုင်ပါသည်။

---

## 18. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: ခွင့်ကို ဖျက် (Delete) လို့ မရဘူး ဖြစ်နေတယ်။**
  ဖြေ: ထိုခွင့်အတွက် Handover တစ်ခုခု (တာဝန်လွှဲပြောင်းခြင်း) စတင်ထားပြီး ဖြစ်နေပါက ဖျက်ခွင့် မပြုတော့ပါ။ ဖျက်လိုပါက Admin သို့ တင်ပြပါ။
- **မေး: Approve နှိပ်လိုက်တာ ဘာမှ မဖြစ်ဘူး။**
  ဖြေ: e-Signature လက်မှတ်ကို Signature ပေါ်တွင် Mouse (သို့မဟုတ် လက်ချောင်း) ဖြင့် ဆွဲ၍ ထိုးပေးရန် လိုအပ်ပါသည်။ လက်မှတ်မပါဘဲ Confirm နှိပ်၍ မရပါ။

---

## 19. အရေးကြီး မှတ်သားရန် (Important Notes)

- **e-Signature:** အတည်ပြုချက်တိုင်းတွင် တာဝန်ယူမှု/တာဝန်ခံမှု ရှိစေရန် Digital Signature တောင်းခံထားခြင်း ဖြစ်ပါသည်။

---

## 20. Employee Lifecycle တွင် ပါဝင်မှု

Leave Management သည် Attendance ကဲ့သို့ပင် လုပ်ငန်းခွင် ဝင်ရောက်ပြီးနောက် (Daily Routine) နေ့စဉ် ကြုံတွေ့ရသော လုပ်ငန်းစဉ်တစ်ခု ဖြစ်ပါသည်။

---

## 21. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Handovers" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Handovers</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const enMarkdown = `
# Leave Management

## 1. Leave Management Overview
The **Leave Management Module** acts as the central hub for handling all employee time-off requests, configuring leave policies, and tracking leave balances automatically.
- **Purpose:** To simplify the process of requesting time off, ensure supervisors properly authorize absences, and automatically track how many leave days an employee has left.
- **Who uses it?** Employees use it to submit requests. Admins and HR use it to approve, reject, and monitor balances.

---

## 2. Leave Management Screen

The interface is divided into three functional tabs:
1. **Leave Balances:** A clear, table-based overview of every employee's total entitlement, used days, and remaining days.
2. **Leave Requests:** The operational queue showing all pending, approved, and rejected leave applications.
3. **Leave Types:** The configuration area where Admins define the rules for different kinds of leave.

---

## 3. Leave Types

- Under the \`Leave Types\` tab, Admins can create custom policies (e.g., Annual Leave, Sick Leave, Maternity Leave).
- **Configuration:** Each type must specify whether it is "Paid" or "Unpaid", and the "Default Days" granted per year.

---

## 4. Leave Balance

- The \`Leave Balances\` tab uses visual Progress Bars (Green → Amber → Red) to instantly show HR how close an employee is to exhausting their leave allowance.

---

## 5. Creating a Leave Request

To submit a request:
1. Navigate to the \`Leave Requests\` tab.
2. Click the \`+ New Request\` button.
3. Fill in the required fields and click \`Submit\`.

---

## 6. Leave Request Fields

- **Employee:** The person requesting leave.
- **Leave Type:** Selected from the pre-configured Leave Types.
- **Start Date & End Date:** The duration of the absence. (The system calculates the total days automatically).
- **Reason:** A text field for explaining the absence.
- *(Note: Users can also upload document links, such as a Medical Certificate, which will appear as an "Attachment" link).*

---

## 7. Leave Approval Workflow

- By default, all newly submitted requests enter the **Pending** state.
- The request remains in the queue until an authorized Admin or HR manager acts upon it.

---

## 8. Approve / Reject Behavior

- **Reject:** Clicking \`Reject\` immediately denies the request and updates its status to Rejected. No balances are deducted.
- **Approve (Requires Signature):** Clicking the \`Approve\` button will launch a **Signature Modal**. The manager *must* draw their signature on the digital canvas to authorize the leave. It cannot be approved without a signature.

---

## 9. Leave Statuses

- **Pending:** Awaiting manager action.
- **Approved:** Authorized and digitally signed.
- **Rejected:** Denied by the manager.

---

## 10. Leave Balance Deduction

- The system is designed to protect balances. Leave days are **only deducted** from the employee's \`Leave Balance\` *after* the request transitions to the **Approved** status. Pending requests do not prematurely deduct days.

---

## 11. Multi-day Leave & Handover Requirement

- The system integrates deeply with the **Handover** module to ensure business continuity.
- If an employee is going on a long leave, HR can click the \`Start Coverage Handover\` action. This prompts HR to assign a "Successor" (a colleague who will cover their duties while they are away).

---

## 12. Relationship with Handovers

- **Coverage Handover:** Passing tasks to a successor before leaving.
- **Return Handover:** Retrieving tasks from the successor upon returning from leave.
- *(Crucial Limitation: If a Handover process has been initiated for a leave request, that leave request is securely locked. The system will block you from deleting the leave request to prevent orphaned data).*

---

## 13. Relationship with Attendance

- **Attendance Check-ins:** If an employee's leave is "Approved", their absence is authorized. They are not expected to clock in via the \`Attendance\` module for those dates.

---

## 14. Relationship with Payroll

- **Paid Leave:** Does not negatively impact the monthly salary calculation.
- **Unpaid Leave:** The \`Payroll\` module detects unpaid leave days and will deduct the proportional amount from the employee's final wage automatically.

---

## 15. Relationship with Offboarding

- If an employee who has submitted a resignation (Offboarding) requests leave, the system intelligently flags their request with an **"In Offboarding"** warning badge. This alerts HR to review the request carefully before approving.

---

## 16. Practical Workflows

1. Employee submits a 3-day Annual Leave request.
2. HR sees it as \`Pending\` in the Requests table.
3. Because it's 3 days, HR clicks \`Start Coverage Handover\` and assigns John to cover the duties.
4. HR then clicks \`Approve\`, signs the digital canvas, and confirms.
5. The employee's Annual Leave balance drops by 3 days automatically.

---

## 17. Real-World HR Scenarios

- **Sudden Sick Leave:** An employee falls ill and calls in. HR manually logs the Sick Leave request on their behalf. Since it's urgent, HR bypasses the Handover process and simply clicks \`Approve\` and signs it to ensure their Attendance and Payroll are correct.

---

## 18. Common Questions / Troubleshooting

- **Q: Why can't I delete a leave request? The delete button throws an error.**
  A: The system blocks deletion if a Handover process is currently active for that request.
- **Q: I clicked Approve, but nothing saved.**
  A: You must draw your signature on the white canvas in the modal before clicking Confirm.

---

## 19. Important Notes

- **Digital Signatures:** The mandatory signature feature ensures strict accountability for who authorized the absence.

---

## 20. Employee Lifecycle Context

Leave Management works in tandem with Attendance as part of the daily operational lifecycle of an employee.

---

## 21. Related Modules

- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Handovers" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Handovers</a>
- <a href="#" data-article-title="Payroll & KPI" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Payroll & KPI</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Leave Management')
      .single();

    if (error || !article) {
      console.log('Leave Management article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Leave Management article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
