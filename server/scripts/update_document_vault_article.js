import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating and refining Document Vault Article...');

    const myMarkdown = `
# Document Vault (စာရွက်စာတမ်း သိမ်းဆည်းမှုစနစ်)

## 1. Document Vault Overview (ယေဘုယျအကြောင်းအရာ)
**Document Vault** သည် ဝန်ထမ်းရေးရာ ဆိုင်ရာ တရားဝင် စာရွက်စာတမ်းများ၊ ပေါ်လစီများ နှင့် အလုပ်ခန့်ထားမှု စာချုပ်များကို လုံခြုံစွာ ဒစ်ဂျစ်တယ်စနစ်ဖြင့် သိမ်းဆည်း၊ အတည်ပြု၊ ဖြန့်ဝေပေးသော နေရာဖြစ်ပါသည်။

## 2. Purpose of Document Vault (အသုံးပြုရခြင်း ရည်ရွယ်ချက်)
- စက္ကူအသုံးပြုမှုကို လျှော့ချရန်။
- တရားဝင် စာရွက်စာတမ်းများကို HR, Boss နှင့် ဝန်ထမ်းများအကြား လုံခြုံစွာ အပြန်အလှန် လက်မှတ်ရေးထိုး (E-Sign) ဖြန့်ဝေနိုင်ရန်။
- ဝန်ထမ်းတစ်ဦးချင်းစီ၏ ကိုယ်ပိုင် ဖိုင်တွဲ (Directory Folders) များဖြင့် စနစ်တကျ မှတ်တမ်းတင်ထားရန် ဖြစ်ပါသည်။

---

## 3. Document Vault Screen (စာမျက်နှာ ဖွဲ့စည်းပုံ)

စာမျက်နှာကို အဓိက အပိုင်း (၃) ပိုင်း ခွဲခြားထားပါသည်-
1. **Vault Repository:** အတည်ပြု သိမ်းဆည်းထားပြီးသော စာရွက်စာတမ်း အားလုံးကို တွေ့မြင်နိုင်သော နေရာ။
2. **Directory Folders:** ဝန်ထမ်း တစ်ဦးချင်းစီအတွက် သီးသန့် ခွဲခြားထားသော ကိုယ်ပိုင် ဖိုင်တွဲများ။
3. **Approval Pipeline:** HR မှ Boss ထံသို့ အတည်ပြုချက် တောင်းခံထားသော စာရွက်စာတမ်းများ၏ အဆင့်ဆင့် လုပ်ငန်းစဉ် (Workflow) ကို ခြေရာခံနိုင်သော နေရာ။

---

## 4. Document Categories / Types (စာရွက်စာတမ်း အမျိုးအစားများ)

အောက်ပါ ကဏ္ဍခွဲများ (Categories) ဖြင့် သိမ်းဆည်းနိုင်ပါသည်-
- Employee Handbooks (ဝန်ထမ်းလက်စွဲစာအုပ်များ)
- Company Policies (ကုမ္ပဏီ ပေါ်လစီများ)
- Disciplinary Records (စည်းကမ်းပိုင်းဆိုင်ရာ မှတ်တမ်းများ / သတိပေးစာများ)
- Commendations & Awards (ဂုဏ်ပြုလွှာများ)
- Employment Contracts (အလုပ်ခန့်ထားမှု စာချုပ်များ)
- SOPs & Guides (လုပ်ငန်းစဉ် လမ်းညွှန်များ)

---

## 5. Uploading Documents (စာရွက်စာတမ်း တင်ခြင်း)

Admin / HR များအနေဖြင့် စာရွက်စာတမ်းတင်ရန် နည်းလမ်း (၂) မျိုး ရှိပါသည်-
1. **Direct Upload (တိုက်ရိုက် တင်ခြင်း):** Approval မလိုအပ်သော သာမန် ပေါ်လစီများ၊ လက်စွဲစာအုပ်များကို \`Direct Upload\` နှိပ်၍ အလွယ်တကူ တင်နိုင်ပါသည်။
2. **Request Approval (အတည်ပြုချက် တောင်းခံခြင်း):** အရေးကြီးသော Promotion လစာတိုးစာများ၊ သတိပေးစာများ ကို \`Request Approval\` နှိပ်၍ Boss ထံသို့ အတည်ပြုချက်နှင့် e-signature (အီလက်ထရောနစ် လက်မှတ်) တောင်းခံရပါမည်။

---

## 6. Viewing Documents (စာရွက်စာတမ်း ကြည့်ရှုခြင်း)

- စာရွက်စာတမ်း ကတ် (Card) ပေါ်ရှိ **"View File ↗"** ကို နှိပ်၍ ဖွင့်ကြည့်နိုင်ပါသည်။ 
- ကုမ္ပဏီတစ်ခုလုံးနှင့် သက်ဆိုင်သော ဖိုင်များ (Company Wide) နှင့် သက်ဆိုင်ရာ ဝန်ထမ်းတစ်ဦးတည်းသာ ကြည့်ခွင့်ရှိသော ဖိုင်များ (Target Employee) ဟူ၍ ကွဲပြားစွာ ပြသပေးပါသည်။

---

## 7. Downloading Documents (ဒေါင်းလုဒ် ရယူခြင်း)

- View File ဖြင့် ဖွင့်လိုက်သော PDF ဖိုင်ကို Browser ပေါ်မှ တစ်ဆင့် တိုက်ရိုက် Print ထုတ်ခြင်း (သို့) Download ဆွဲခြင်းများ ပြုလုပ်နိုင်ပါသည်။

---

## 8. Editing / Updating Documents (ပြင်ဆင်ခြင်း)

- လက်ရှိစနစ်တွင် Upload လုပ်ပြီးသား ဖိုင်ကို တိုက်ရိုက် Edit လုပ်ခွင့် မရှိပါ။ မှားယွင်းစွာ တင်မိပါက ဖျက် (Delete) ပြီးမှသာ အသစ်ပြန်တင်ရပါမည်။

---

## 9. Employee Document Relationship (ဝန်ထမ်းများနှင့် ဆက်စပ်မှု)

စာရွက်စာတမ်းတစ်ခုကို တင်စဉ်တွင် ဝန်ထမ်းအမည်ကို ရွေးချယ် (Target) လိုက်ပါက၊ ထိုစာရွက်စာတမ်းသည် သက်ဆိုင်ရာ ဝန်ထမ်း၏ **Directory Folder** အတွင်းသို့ အလိုအလျောက် ရောက်ရှိသွားမည်ဖြစ်ပြီး၊ အခြားဝန်ထမ်းများ မြင်တွေ့နိုင်မည် မဟုတ်ပါ။

---

## 10. Storage Behavior (သိမ်းဆည်းမှု စနစ်)

- စာရွက်စာတမ်း ဖိုင် (PDF/Images) များကို Supabase Storage Bucket အတွင်းသို့ အလိုအလျောက် Upload လုပ်၍ Cloud တွင် သိမ်းဆည်းပါသည်။
- "Request Approval" တွင် File URL အလွတ်ထားခဲ့ပါက စနစ်မှ ရိုက်ထည့်ထားသော အချက်အလက်များ (New Salary, Position) ကို အခြေခံ၍ Dynamic PDF ကို အလိုအလျောက် ဖန်တီးပေးပါသည်။

---

## 11. Permissions / Access Control (ဝင်ရောက်ကြည့်ရှုခွင့်)

- **ဝန်ထမ်းများ (Employees):** မိမိအမည်ဖြင့် တင်ထားသော ဖိုင်များနှင့် ကုမ္ပဏီတစ်ခုလုံးအတွက် တင်ထားသော (Company Wide) ဖိုင်များကိုသာ မြင်ရပါမည်။
- **HR / Boss (Admins):** စာရွက်စာတမ်း အားလုံးကို မြင်တွေ့နိုင်ပြီး၊ Upload တင်ခြင်း၊ Delete ဖျက်ခြင်း၊ Approval ပေးခြင်း များကို လုပ်ဆောင်နိုင်ပါသည်။

---

## 12. Document Vault ↔ Employees

- \`Employees\` Module မှ ဝန်ထမ်းစာရင်းကို ရယူ၍ Employee Directory Folders များကို အလိုအလျောက် ဖန်တီးပေးပါသည်။

---

## 13. Document Vault ↔ Employee Lifecycle

- ဝန်ထမ်းဘဝ အစ (Onboarding) မှ အဆုံး (Offboarding) အထိ ထွက်ပေါ်လာသမျှသော တရားဝင် စာချုပ်များ၊ ရာထူးတိုးစာများ၊ သတိပေးစာများ အားလုံးကို ဤ Vault တွင် တစ်စုတစ်စည်းတည်း သိမ်းဆည်းရပါမည်။
- အရေးကြီး ဖိုင်များကို Approve လုပ်တိုင်း \`Employee Details\` ထဲရှိ **Career Timeline** တွင် အလိုအလျောက် သွားရောက် မှတ်တမ်းတင်ပေးပါသည်။

---

## 14. Document Vault ↔ Onboarding

- Onboarding အောင်မြင်စွာ ပြီးဆုံးသွားသောအခါ ဝန်ထမ်းသစ်များအတွက် အလုပ်ခန့်ထားမှု စာချုပ် (Employment Contract) များကို ဤနေရာမှ တစ်ဆင့် Approval တောင်း၍ ပေးပို့လေ့ရှိပါသည်။

---

## 15. Document Vault ↔ Offboarding

- ဝန်ထမ်းတစ်ဦး အလုပ်ထွက်ခွာချိန် (Offboarding) တွင် နောက်ဆုံး ရှင်းတမ်း၊ အလုပ်ထွက်ခွင့်ပြုကြောင်း တရားဝင် စာရွက်စာတမ်းများကို ဤ Vault တွင် ထည့်သွင်း သိမ်းဆည်းထားရပါမည်။

---

## 16. Practical Workflows (လက်တွေ့ အသုံးပြုမှု)

**ရာထူးတိုးစာ (Promotion Letter) ထုတ်ပေးခြင်း Workflow:**
1. HR သည် **Request Approval** ကို နှိပ်၍ Promotion Letter ရွေးချယ်ပြီး ဝန်ထမ်းအမည်၊ လစာသစ် (New Salary) နှင့် ရာထူးသစ် (New Position) ကို ဖြည့်ကာ Boss ထံ ပို့လိုက်ပါသည်။
2. Boss သည် Approval Pipeline သို့ ဝင်၍ ၎င်းကို စစ်ဆေးပြီး **Approve (E-Sign)** လုပ်ပါသည်။
3. နောက်ဆုံးအဆင့် အနေဖြင့် HR မှ ဝင်ရောက်၍ **Final HR Sign & Issue** ကို နှိပ်လိုက်သောအခါ၊ ထိုစာရွက်စာတမ်းသည် Vault သို့ ရောက်ရှိသွားပြီး သက်ဆိုင်ရာ ဝန်ထမ်းထံသို့ Notification ရောက်ရှိသွားပါမည်။

---

## 17. Real-World HR Scenarios (လက်တွေ့ အခြေအနေများ)

- **ကုမ္ပဏီ ပေါ်လစီ အသစ်ထွက်ခြင်း:** HR သည် "Company Policies" Category ဖြင့် ဖြန့်ဝေလိုသော PDF ကို Target "General/Company Wide" ရွေး၍ Direct Upload လုပ်လိုက်ပါက ဝန်ထမ်းအားလုံး မြင်တွေ့နိုင်ပါမည်။
- **သတိပေးစာ ထုတ်ခြင်း:** ဝန်ထမ်း တစ်ဦးအား Warning Letter ထုတ်ရန် Approval Pipeline မှ တစ်ဆင့် Boss ထံ အတည်ပြုချက် တောင်းခံခြင်း။

---

## 18. Common Questions / Troubleshooting

- **မေး: Request Approval တွင် PDF ဖိုင် တွဲမတင်ခဲ့ရင် ဘာဖြစ်မလဲ?**
  ဖြေ: တွဲမတင်ခဲ့ပါက (File URL အလွတ်ထားခဲ့ပါက) စနစ်မှ အလိုအလျောက် Dynamic PDF Template တစ်ခုကို ထုတ်ပေးမည် ဖြစ်ပါသည်။
- **မေး: မှားတင်မိတဲ့ စာရွက်ကို ဖျက်လို့ရလား?**
  ဖြေ: ရပါသည်။ Admin သည် Vault Repository ထဲရှိ စာရွက်စာတမ်း ကတ်ပေါ်မှ အမှိုက်ပုံး (Delete) ခလုတ်ကို နှိပ်၍ ဖျက်နိုင်ပါသည်။

---

## 19. Important Notes / Limitations

- စနစ်တွင် Document Versioning (စာရွက်စာတမ်း အဟောင်း/အသစ် သိမ်းဆည်းခြင်း) နှင့် Document Expiration (သက်တမ်းကုန်ဆုံးခြင်း) များ **မပါဝင်သေးပါ**။ 
- ဝန်ထမ်းများ အနေဖြင့် ဖိုင်များကို Vault ထဲသို့ တိုက်ရိုက် Upload တင်ခွင့် မရှိပါ။ (HR မှ သာ တင်ပေးရပါမည်)။

---

## 20. Employee Lifecycle Context

Document Vault သည် Employee Lifecycle ၏ အစမှ အဆုံးတိုင်အောင် တရားဝင် အထောက်အထားများကို တာဝန်ယူ သိမ်းဆည်းပေးသော မှတ်တမ်း တိုက် (Archive) ဖြစ်ပါသည်။

---

## 21. Related Modules (ဆက်စပ်သော အခန်းများ)

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
`;

    const enMarkdown = `
# Document Vault

## 1. Document Vault Overview
The **Document Vault** is a secure, centralized digital repository for all official HR documentation, company policies, and employment records.

## 2. Purpose of Document Vault
- To digitize and organize employee records, reducing paper waste.
- To facilitate a secure e-signature and approval workflow for sensitive documents between HR and the Executive (Boss).
- To provide employees with self-service access to their personal official documents and company-wide policies.

---

## 3. Document Vault Screen

The screen is divided into three primary tabs:
1. **Vault Repository:** The master list of all fully approved and published documents.
2. **Directory Folders:** An organized view grouping documents per individual employee.
3. **Approval Pipeline:** A workflow dashboard tracking documents pending Boss or HR signatures.

---

## 4. Document Categories / Types

Documents are organized into the following categories:
- Employee Handbooks
- Company Policies
- Disciplinary Records
- Commendations & Awards
- Employment Contracts
- SOPs & Guides
- General

---

## 5. Uploading Documents

Admins and HR have two methods for uploading documents:
1. **Direct Upload:** For general policies or standard operating procedures that do not require executive approval.
2. **Request Approval (Pipeline):** For sensitive documents (e.g., Promotion Letters, Warning Letters, Contracts). This triggers a multi-step e-signature workflow requiring Boss approval before it reaches the Vault.

---

## 6. Viewing Documents

- Click **"View File ↗"** on any document card to open it in a new tab.
- Documents clearly display whether they are **Company Wide** (visible to all) or targeted to a specific employee (visible only to HR, Boss, and that specific employee).

---

## 7. Downloading Documents

- By clicking "View File", the document opens in the browser's native PDF viewer, where it can be printed or downloaded to local storage.

---

## 8. Editing / Updating Documents

- Currently, published documents cannot be edited directly. If a mistake is made, the document must be deleted and re-uploaded.

---

## 9. Employee Document Relationship

When HR selects a specific "Target Employee" during upload, the document is permanently linked to that employee's profile. It will appear in their personal Directory Folder and their personal Employee Portal, hidden from their peers.

---

## 10. Storage Behavior

- Uploaded files are securely stored in a Supabase Storage Bucket.
- **Dynamic PDF Generation:** If HR uses the "Request Approval" form and leaves the File URL blank, the system automatically generates a formatted PDF combining the input fields (New Position, New Salary, Effective Date).

---

## 11. Permissions / Access Control

- **Employees:** Can only see "Company Wide" documents and documents explicitly targeted to their own \`employee_id\`.
- **HR / Boss (Admins):** Have global access to view, upload, approve, and delete all documents across the company.

---

## 12. Document Vault ↔ Employees

- The **Directory Folders** tab dynamically builds folders based on active personnel data from the \`Employees\` module.

---

## 13. Document Vault ↔ Employee Lifecycle

- The Vault acts as the system of record for major lifecycle events. 
- When an official document (like a Promotion or Commendation) is finalized in the pipeline, the system automatically writes a new entry into the employee's **Career Timeline** (visible in Employee Details).

---

## 14. Document Vault ↔ Onboarding

- Upon successful completion of the Onboarding module, HR typically uses the Approval Pipeline to issue and store the new hire's official Employment Contract.

---

## 15. Document Vault ↔ Offboarding

- During the Offboarding process, clearance certificates, final settlement documents, or termination letters are stored securely within the Vault for historical compliance.

---

## 16. Practical Workflows

**The Promotion Letter Approval Flow:**
1. **HR Initiated:** HR clicks "Request Approval", fills out the promotion details (New Salary, New Role), and submits.
2. **Boss E-Sign:** The Boss sees the request in the Approval Pipeline, reviews the details, and clicks "Approve & E-Sign".
3. **HR Final Seal:** HR reviews the signed document, clicks "Final HR Sign & Issue", which officially moves it into the Vault Repository and notifies the target employee.

---

## 17. Real-World HR Scenarios

- **Distributing a New Policy:** HR uploads a new "Leave Policy 2024" PDF using "Direct Upload" and selects the "General (Bulk)" target. Instantly, all employees can view it on their portals.

---

## 18. Common Questions / Troubleshooting

- **Q: What happens if the Boss rejects a document request?**
  A: The status changes to "Rejected by Boss", stopping the workflow. HR must review the rejection notes and submit a new request.
- **Q: How do I delete a document?**
  A: Admins can click the trash icon on the document card inside the Vault Repository. This removes the record.

---

## 19. Important Notes / Limitations

- Features such as automatic document expiration, version control history, and external link sharing are **not** currently implemented.
- Employees cannot upload their own documents (e.g., ID cards) directly to the Vault; this must be managed by HR.

---

## 20. Employee Lifecycle Context

The Document Vault provides the legal and historical foundation across the entire employee journey, securely storing the paperwork generated during onboarding, active tenure, and eventual offboarding.

---

## 21. Related Modules

- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Offboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Offboarding</a>
`;

    const myHtml = marked.parse(myMarkdown);
    const enHtml = marked.parse(enMarkdown);

    // Update in Database
    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('id, title, published_content, draft_content')
      .eq('title', 'Document Vault')
      .single();

    if (error || !article) {
      console.log('Document Vault article not found in Database!');
      return;
    }

    const payload = JSON.stringify({ my: myHtml, en: enHtml });

    await supabaseAdmin.from('hrm_manual_articles').update({
      draft_content: payload,
      published_content: payload,
      status: 'published'
    }).eq('id', article.id);

    console.log('Successfully updated Document Vault article with structured Burmese and English JSON!');

  } catch (err) {
    console.error('Error:', err);
  }
}

run();
