import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Recruitment Article...');

    const myMarkdown = `
# Recruitment (ဝန်ထမ်းခေါ်ယူခြင်း)

## 1. Recruitment Overview (ယေဘုယျအကြောင်းအရာ)
**Recruitment Module** သည် BBD HRM တွင် လစ်လပ်နေသော ရာထူးများအတွက် လူသစ်ခေါ်ယူခြင်း၊ အင်တာဗျူးခေါ်ခြင်း နှင့် နောက်ဆုံး အလုပ်ခန့်အပ်ခြင်း (Hiring) လုပ်ငန်းစဉ် အားလုံးကို အစအဆုံး စီမံခန့်ခွဲပေးသော Kanban-style စနစ်တစ်ခု ဖြစ်ပါသည်။
- **ဘာအတွက် အသုံးပြုသလဲ?** အလုပ်လျှောက်ထားသူ (Candidates) များ၏ အချက်အလက်များ၊ AI ဖြင့် ရမှတ်ပေးထားမှုများနှင့် အင်တာဗျူး အဆင့်ဆင့်ကို စနစ်တကျ မှတ်တမ်းတင်ရန် အသုံးပြုပါသည်။
- **ဘယ်သူတွေ အသုံးပြုသလဲ?** HR Manager များနှင့် Admin များသာ အသုံးပြုနိုင်ပါသည်။
- **Employee Creation နှင့် ဆက်စပ်မှု:** အလုပ်ခန့်ရန် (Hired) သတ်မှတ်လိုက်သော Candidate များကို ဝန်ထမ်း (Employee) အဖြစ်သို့ ကလစ်တစ်ချက်တည်းဖြင့် ပြောင်းလဲ (Convert) ပေးနိုင်ပါသည်။

---

## 2. Recruitment Dashboard & List

Recruitment စာမျက်နှာကို အဓိက အပိုင်းသုံးပိုင်း (Tabs) ဖြင့် ခွဲခြားထားပါသည်-
1. **Active Pipeline (အလုပ်ခေါ်ယူဆဲ):** လက်ရှိ အင်တာဗျူးနေဆဲ လူများ (Kanban Board ဖြင့် ပြသသည်)။
2. **Hired (ခန့်အပ်ပြီး):** အလုပ်ခန့်ရန် သေချာသွားသော လူများစာရင်း။
3. **Talent Pool (အရန်စာရင်း):** အလုပ်မရခဲ့သော်လည်း နောင်တစ်ချိန်အတွက် ဖယ်ချန်ထားသော လူများစာရင်း။ (Search Bar ဖြင့် အလွယ်တကူ ပြန်ရှာနိုင်ပါသည်)။

**Dashboard ကိန်းဂဏန်းများ (Top Stats):**
- Total Candidates, In Pipeline, Shortlisted (Interview & Offer ရောက်နေသူများ), Hired နှင့် Talent Pool အရေအတွက်ကို အမြန်ကြည့်ရှုနိုင်ပါသည်။

---

## 3. Creating a Candidate (လျှောက်ထားသူ အသစ်သွင်းခြင်း)

လူသစ်တစ်ဦး အလုပ်လာလျှောက်ပါက အောက်ပါအတိုင်း စာရင်းသွင်းနိုင်ပါသည်-

1. အပေါ်ညာဘက်ထောင့်ရှိ \`+ Add Candidate\` ကို နှိပ်ပါ။
2. **Name (မဖြစ်မနေ):** လျှောက်ထားသူ၏ အမည်ကို ထည့်ပါ။
3. **Applying For:** မည်သည့်ရာထူး (Position) အတွက် လျှောက်သလဲဆိုတာ ရွေးချယ်ပါ။
4. **Email / Phone:** ဆက်သွယ်ရန် လိပ်စာနှင့် ဖုန်းနံပါတ် ထည့်ပါ။
5. \`Save\` ကို နှိပ်လိုက်သည်နှင့် ထိုသူသည် Pipeline ၏ ပထမဆုံးအဆင့်ဖြစ်သော **Applied** ကော်လံထဲသို့ ရောက်ရှိသွားပါမည်။

---

## 4. Candidate Details (လျှောက်ထားသူ အသေးစိတ်)

Kanban Board ရှိ Candidate ၏ ကတ် (Card) ကို ကလစ်နှိပ်လိုက်ပါက အသေးစိတ် Modal တစ်ခု ပွင့်လာပါမည်။ ထိုအထဲတွင် Tab ၃ ခု ပါဝင်ပါသည်-
- **⭐ AI Evaluation:** AI မှ စစ်ဆေးပေးထားသော ကိုက်ညီမှု ရမှတ် (AI Match Score X/10) နှင့် မြန်မာလို အကျဉ်းချုပ် သုံးသပ်ချက်။
- **📝 Form Data:** လျှောက်ထားသူ ဖြည့်စွက်ထားသော အချက်အလက်များ။
- **📄 Original Resume:** တင်ထားသော ကိုယ်ရေးရာဇဝင် (CV) အပြည့်အစုံ။

---

## 5. Recruitment Status / Pipeline (အဆင့်ဆင့် ရွှေ့ပြောင်းခြင်း)

Kanban Board တွင် ကော်လံ (၄) ခု ရှိပြီး လျှောက်ထားသူများကို ၎င်း၏ ကတ်ပေါ်ရှိ Dropdown မှတစ်ဆင့် နောက်တစ်ဆင့်သို့ ပြောင်းလဲ (Update Stage) လုပ်ပေးရပါမည်။

- **Applied:** စတင်လျှောက်ထားသူများ (AI Score အလိုက် အလိုအလျောက် စီစဉ်ပေးထားသည်)။
- **Screening:** ပဏာမ စိစစ်နေဆဲ အဆင့်။
- **Interview:** အင်တာဗျူး ခေါ်ယူထားသော အဆင့်။
- **Offer:** အလုပ်ခန့်ရန် ကမ်းလှမ်းထားသော အဆင့်။
- **Hired:** လုံးဝ အလုပ်ခန့်အပ်ရန် သဘောတူညီပြီးသော အဆင့် (ဤအဆင့်သို့ ရောက်ပါက "Add to Employees" ခလုတ် ပေါ်လာပါမည်)။
- **Move to Talent Pool (Rejected):** အလုပ်မခန့်ဖြစ်သော သူများကို Talent Pool ထဲသို့ ရွှေ့ပစ်ရန်။

---

## 6. Interview Scheduling (အင်တာဗျူး ခေါ်ယူခြင်း)

Candidate Card ပေါ်ရှိ \`✉ Schedule & Send Offer\` ကို နှိပ်၍ အင်တာဗျူး ချိန်းဆိုနိုင်ပါသည်။
- **ဖြည့်ရမည့် အချက်များ:** Date (ရက်စွဲ)၊ Time (အချိန်) နှင့် Meeting Link / Location (နေရာ သို့မဟုတ် Zoom Link)။
- **သက်ရောက်မှု:** ဖြည့်စွက်ပြီး \`Send Offer\` ကို နှိပ်လိုက်ပါက စနစ်မှ အင်တာဗျူး အချက်အလက်များကို မှတ်တမ်းတင်ပေးသွားမည် ဖြစ်ပါသည်။ (မှတ်ချက် - Email အလိုအလျောက် ပို့ပေးခြင်း မရှိသေးပါက ကိုယ်တိုင် ဆက်သွယ်ရပါမည်)။

---

## 7. Recruitment → Employee Creation (ဝန်ထမ်းအဖြစ် ပြောင်းလဲခြင်း)

လျှောက်ထားသူအား **Hired** အဆင့်သို့ ရွှေ့လိုက်ပါက ကတ်ပေါ်တွင် \`✨ Add to Employees\` ခလုတ် အသစ်တစ်ခု ပေါ်လာပါမည်။
- **လုပ်ဆောင်ပုံ:** ထိုခလုတ်ကို နှိပ်ပြီး Confirm (အတည်ပြု) လိုက်ပါက၊ ဤ Candidate ၏ အမည်၊ ဖုန်း၊ အီးမေးလ်၊ ရာထူး အစရှိသည်တို့သည် \`Employees\` Module ထဲသို့ တိုက်ရိုက် ရောက်ရှိသွားပြီး **ဝန်ထမ်းသစ် တစ်ဦး (Employee Record)** အလိုအလျောက် ဖန်တီးပြီးသား ဖြစ်သွားပါမည်။

---

## 8. ဌာန၊ ရာထူးများနှင့် ဆက်စပ်မှု (Departments & Positions)

- **Positions:** \`+ Add Candidate\` ဖြင့် လူသစ်သွင်းရာတွင် \`Positions\` Module တွင် ကြိုတင်ဖန်တီးထားသော ရာထူးများကိုသာ ရွေးချယ်နိုင်ပါသည်။ Recruitment စာမျက်နှာမှနေ၍လည်း \`+ Position\` ခလုတ်ကို နှိပ်ကာ ရာထူးအသစ်ကို အမြန်ဖန်တီးနိုင်ပါသည်။
- **Departments:** Position ဖန်တီးရာတွင် Department ကိုပါ တစ်ပါတည်း ရွေးချယ်ပေးရသဖြင့်၊ ထိုလူကို Employee အဖြစ် Convert လုပ်လိုက်ချိန်တွင် ဌာနနှင့် ရာထူး နှစ်ခုစလုံး မှန်ကန်စွာ ချိတ်ဆက်ပြီးသား ဖြစ်သွားပါမည်။

---

## 9. Recruitment ↔ Onboarding (အလုပ်စတင်ခြင်းနှင့် ဆက်စပ်မှု)

- လျှောက်ထားသူကို Employee အဖြစ် Convert လုပ်လိုက်သည်နှင့် ၎င်းသည် HRM စနစ်၏ တရားဝင် ဝန်ထမ်း ဖြစ်သွားပါသည်။ 
- ထိုအခါ HR အနေဖြင့် \`Onboarding\` Module သို့သွား၍ ဤဝန်ထမ်းသစ်အတွက် ကုမ္ပဏီနှင့် မိတ်ဆက်ပေးမည့် Onboarding Task များ (ဥပမာ - Uniform ထုတ်ပေးရန်၊ Email Account ဖွင့်ပေးရန်) ကို စတင် သတ်မှတ်ပေးရမည် ဖြစ်ပါသည်။

---

## 10. လက်တွေ့ အသုံးပြုမှု (Practical Workflows)

**လူအများအပြားကို Talent Pool သို့ တစ်ခါတည်း ရွှေ့နည်း (Bulk Move):**
1. အပေါ်ဘက်ရှိ \`Move to Pool\` (သို့မဟုတ် ကော်လံထိပ်ရှိ Move to Pool) ခလုတ်ကို နှိပ်ပါ။
2. မည်သည့်ရာထူး (Position) နှင့် မည်သည့်အဆင့် (Stage - e.g., Applied) က လူတွေကို ရွှေ့ချင်သလဲ ဆိုတာ Filter ရွေးပါ။
3. အရေအတွက် ဘယ်နှစ်ယောက် ပါဝင်သလဲ ဆိုတာ စနစ်က ပြပေးပါမည်။
4. \`Move to Talent Pool\` ကိုနှိပ်လိုက်ပါက အားလုံး တစ်ပြိုင်နက်တည်း ရွှေ့သွားပါမည်။

**Talent Pool မှ လူဟောင်းကို ပြန်ခေါ်နည်း (Reconsider):**
1. \`Talent Pool\` Tab သို့သွားပါ။
2. လိုချင်သောသူကို Search Bar ဖြင့် ရှာပါ။
3. ကတ်ပေါ်ရှိ Dropdown တွင် ခန့်ချင်သော ရာထူးအသစ်ကို ရွေးပြီး \`★ Reconsider\` ကို နှိပ်ပါ။ သူသည် Active Pipeline ထဲသို့ ပြန်ရောက်သွားပါမည်။

---

## 11. အဖြစ်များသော အခြေအနေများ (Real-World Scenarios)

- **အင်တာဗျူး ရွေးချယ်ခြင်း:** လျှောက်လွှာ (၁၀) စောင် ဝင်လာပါက HR သည် \`Applied\` ကော်လံထဲတွင် AI Match Score အများဆုံး ရသူများကို အရင်ဆုံး ကလစ်နှိပ်၍ ၎င်းတို့၏ CV နှင့် AI သုံးသပ်ချက်ကို ဖတ်ရှုပါသည်။ သဘောကျပါက အင်တာဗျူးခေါ်ရန် \`Screening\` သို့မဟုတ် \`Interview\` ကော်လံသို့ Update Stage ဖြင့် ရွှေ့ပြောင်းပါသည်။
- **အလုပ်မခန့်ဖြစ်သောအခါ:** Interview ပြီးသော်လည်း မရွေးချယ်ဖြစ်ပါက \`Rejected (Talent Pool)\` သို့ ရွှေ့လိုက်ပါ။ နောက် ၆ လ အကြာတွင် အခြားရာထူး လစ်လပ်ပါက ၎င်းအား Talent Pool ထဲမှ ပြန်လည် ဆက်သွယ် (Contact) နိုင်ပါသည်။

---

## 12. အမေးများသော မေးခွန်းများ (FAQ & Troubleshooting)

- **မေး: \`✨ Add to Employees\` ကိုနှိပ်လိုက်ပေမယ့် Employees ထဲမှာ သွားမပေါ်ဘူး ဖြစ်နေတယ်။**
  ဖြေ: ကွန်နက်ရှင် နှေးကွေးပါက စက္ကန့်အနည်းငယ် ကြာတတ်ပါသည်။ Employees စာမျက်နှာကို Refresh တစ်ကြိမ် လုပ်ကြည့်ပါ။
- **မေး: ရာထူးနေရာ (Applying For) ရွေးချယ်စရာ မပေါ်ဘူး။**
  ဖြေ: \`Positions\` Module ထဲတွင် ဖွင့်ထားသော ရာထူးများ မရှိသေး၍ ဖြစ်ပါသည်။ \`+ Position\` ကိုနှိပ်၍ ရာထူးအရင် သတ်မှတ်ပေးပါ။

---

## 13. အရေးကြီး မှတ်သားရန်

- **AI Score အပေါ် မှီခိုလွန်းခြင်း:** AI Match Score သည် စာသားများကို ဖတ်၍ ခန့်မှန်းပေးခြင်းသာ ဖြစ်သဖြင့်၊ အမှတ်နည်းသော်လည်း လက်တွေ့တွင် တော်သောသူများ ရှိနိုင်ပါသည်။ ထို့ကြောင့် Resume အပြည့်အစုံကို ဖတ်ရှုရန် အကြံပြုပါသည်။
- **Delete Candidate:** Talent Pool ထဲမှ 🗑 Delete Candidate ကို နှိပ်လိုက်ပါက ဒေတာအားလုံး အပြီးတိုင် (Hard Delete) ပျက်သွားမည် ဖြစ်သောကြောင့် အလွန်သတိထားပါ။

---

## 14. Employee Lifecycle တွင် ပါဝင်မှု

**Recruitment** သည် ဝန်ထမ်းဘဝ၏ ပထမဆုံး အစပျိုးရာ နေရာဖြစ်ပါသည်-

Recruitment (CV လက်ခံခြင်း) ➔ Interview (အင်တာဗျူးခြင်း) ➔ Hired (အလုပ်ခန့်ခြင်း) ➔ **Employee Creation (ဝန်ထမ်းစာရင်းသို့ အလိုအလျောက် ရောက်ရှိခြင်း)** ➔ Department & Position (ရာထူးသတ်မှတ်ပြီးဖြစ်ခြင်း) ➔ Onboarding (အလုပ်စတင်ခြင်း) ... အစရှိသဖြင့် ဆက်လက် စီးဆင်းသွားပါသည်။ 

ဤနေရာတွင် \`✨ Add to Employees\` ကိုနှိပ်ခြင်းသည် **Automated (အလိုအလျောက် လုပ်ဆောင်ပေးသော)** အဆင့်တစ်ခု ဖြစ်ပါသည်။

---

## 15. ဆက်လက်ဖတ်ရှုရန် (Related Modules)

- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const enMarkdown = `
# Recruitment

## 1. Recruitment Overview
The **Recruitment Module** is a comprehensive Kanban-style applicant tracking system (ATS) within BBD HRM. It handles everything from receiving new candidates to tracking interview stages, and finalizing the hiring process.
- **Purpose:** To systematically organize job applicants, evaluate them using AI-generated match scores, and visually track their progress through the interview pipeline.
- **Who uses it?** Exclusively managed by HR Managers and Admins.
- **Employee Creation Link:** Once a candidate is marked as "Hired", HR can use a single-click "Convert" button to instantly create a full Employee Profile for them in the system, carrying over all their essential data.

---

## 2. Recruitment Dashboard & List

The main interface is divided into three primary Tabs:
1. **Active Pipeline:** The Kanban board showing active applicants moving through the interview stages.
2. **Hired:** A list of candidates who have successfully secured a job.
3. **Talent Pool:** An archive of rejected or paused candidates who can be reconsidered later. (Includes a Search Bar).

**Top Stats Dashboard:**
- Displays quick numerical summaries of Total Candidates, those In Pipeline, Shortlisted (Interview/Offer stages), Hired, and those stored in the Talent Pool.

---

## 3. Creating a Candidate

If you receive a manual application, you can enter it into the system:

1. Click \`+ Add Candidate\` in the top right.
2. **Name (Required):** The applicant's full name.
3. **Applying For:** Select the Job Position they are applying for from the dropdown.
4. **Email / Phone:** Contact details.
5. Click \`Save\`. The candidate will instantly appear in the **Applied** column of the Kanban board.

---

## 4. Candidate Details

Clicking anywhere on a candidate's Kanban Card opens their Detailed Profile Modal, featuring three tabs:
- **⭐ AI Evaluation:** Shows their AI Match Score (out of 10) and a brief AI-generated summary of their strengths and weaknesses.
- **📝 Form Data:** The raw data they filled out during their application.
- **📄 Original Resume:** A text view of the original CV they submitted.

---

## 5. Recruitment Status / Pipeline

The Kanban Board contains 4 active columns. Candidates are moved between columns by selecting a new stage from the dropdown on their card and clicking "Update Stage".

- **Applied:** New arrivals. Cards are automatically sorted with the highest AI Match Score at the top.
- **Screening:** Candidates being reviewed by HR.
- **Interview:** Candidates who have been called for an interview.
- **Offer:** Candidates who have been given a job offer.
- **Hired:** Candidates who accepted the offer. (Moving a candidate here reveals the magical "Add to Employees" button).
- **Move to Talent Pool (Rejected):** Removes them from the pipeline and archives them in the Talent Pool tab.

---

## 6. Interview Scheduling

You can schedule interviews directly from the Candidate Card by clicking \`✉ Schedule & Send Offer\`.
- **Inputs:** You will need to provide the Date, Time, and a Meeting Link / Location (e.g., a Zoom link or Office address).
- **System Behavior:** Clicking 'Send Offer' saves this scheduling data. *(Note: If automatic email dispatch is not fully configured, HR must still manually inform the candidate of these details).*

---

## 7. Recruitment → Employee Creation

When a candidate is successfully moved to the **Hired** stage, a bright \`✨ Add to Employees\` button appears on their card.
- **The Workflow:** Clicking this button and confirming the prompt will extract the candidate's Name, Email, Phone, and assigned Position, and automatically inject it into the \`Employees\` Database. 
- **Result:** You do not need to manually type their data again; they instantly become an official Employee in the HRM system.

---

## 8. Relationships with Departments & Positions

- **Positions:** You cannot apply for a job that doesn't exist. The \`Applying For\` dropdown relies entirely on the roles created in the \`Positions\` module. (A shortcut \`+ Position\` button is provided to add roles quickly).
- **Departments:** Because every Position is strictly tied to a Department, when you "Convert" a hired candidate into an Employee, they automatically inherit the correct Department and Position on the Org Chart.

---

## 9. Recruitment ↔ Onboarding

- Once the candidate is converted into an Employee, the Recruitment phase officially ends.
- The HR Admin must then navigate to the \`Onboarding\` Module to assign first-day tasks (like IT setup, uniform distribution, or orientation checklists) for this newly created employee.

---

## 10. Practical Workflows

**How to Bulk Move candidates to the Talent Pool:**
1. Click the \`Move to Pool\` button at the top of the screen (or the small text button on top of a specific Kanban column).
2. Use the filters in the modal to select a specific Position (e.g., Junior Dev) and/or a specific Pipeline Stage (e.g., Applied).
3. The system will calculate how many candidates match. Click \`Move to Talent Pool\` to bulk archive them instantly.

**How to Reconsider an old candidate:**
1. Go to the \`Talent Pool\` Tab.
2. Use the Search Bar to find their name.
3. On their card, select a new Position from the dropdown, and click \`★ Reconsider\`. They will be instantly moved back into the 'Applied' column of the active pipeline.

---

## 11. Real-World HR Scenarios

- **Shortlisting:** HR receives 50 applications. Instead of reading all 50 CVs, HR looks at the \`Applied\` column, which is automatically sorted by AI Match Score. HR reviews the top 10 candidates by reading their '⭐ AI Evaluation' tab, and moves the best 5 to the \`Screening\` column.
- **Archiving:** After hiring the best candidate for the 'Marketing Manager' role, HR uses the Bulk Move tool to push all remaining candidates in that specific role to the Talent Pool, clearing up the board.

---

## 12. Common Questions / Troubleshooting

- **Q: I clicked 'Add to Employees' but they aren't showing up on the Employees page?**
  A: It may take a brief moment for the database to sync. Simply refresh the Employees page.
- **Q: The 'Applying For' dropdown is completely empty.**
  A: This means there are no active Positions created in the system yet. Click \`+ Position\` to create the job role first.

---

## 13. Important Notes

- **AI is a Guide, not a Rule:** The AI Match Score is based purely on textual analysis. A candidate with a low score might still be excellent in practice. Always review the 'Original Resume' tab for borderline cases.
- **Hard Deletes:** Clicking \`🗑 Delete Candidate\` inside the Talent Pool will permanently erase all their data and CV from the database. Use this only for spam or accidental test entries.

---

## 14. Employee Lifecycle Context

The Recruitment module handles the very first phase of the Employee Lifecycle:

Recruitment (Receiving CVs) ➔ Interview (Screening) ➔ Hired ➔ **Employee Creation (Automated via 'Convert' button)** ➔ Department & Position (Inherited) ➔ Onboarding (First day tasks) ➔ ...

The system intentionally automates the bridge between 'Hired' and 'Employee Creation' to eliminate duplicate data entry for HR.

---

## 15. Related Modules

- <a href="#" data-article-title="Positions" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Positions</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Departments" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Departments</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Recruitment')
      .single();

    if (error || !article) {
      console.log('Recruitment article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Recruitment article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
