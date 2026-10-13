import { supabaseAdmin } from '../lib/supabase.js';
import { marked } from 'marked';

async function run() {
  try {
    console.log('Translating HRM Overview...');

    const { data: article, error } = await supabaseAdmin
      .from('hrm_manual_articles')
      .select('*')
      .eq('title', 'HRM Overview')
      .single();

    if (error || !article) {
      console.log('HRM Overview article not found.');
      return;
    }

    const englishMarkdown = `
# HRM Overview

## 1. What is HRM?
HRM (Human Resource Management) is a system that systematically records and handles employee information, workplace requirements, and management processes.
The BBD HRM System is built to easily and quickly manage all necessary HR processes in one place, from the time an individual employee joins the company (Onboarding) to the time they leave (Offboarding).

---

## 2. What is the BBD HRM System used for?
The BBD HRM System is used to interconnect and perform the following main HR processes:
- **Employee Information:** To save the personal details and employment history of employees.
- **Departments & Positions:** To define the company's departments and position hierarchies.
- **Recruitment & Onboarding:** To organize requirements from recruiting new employees to their first day of work.
- **Attendance & Leave:** To manage daily attendance records and leave requests.
- **Handovers:** To transfer work responsibilities when taking long leave or resigning.
- **Performance & SOPs:** To record the completion of Daily SOPs and assign KPI scores.
- **Payroll & KPI:** To accurately calculate salaries based on Attendance, Leave, and KPI scores.
- **Document Vault & Birthdays:** To securely store important documents and remind about special dates like birthdays.
- **Offboarding:** To perform necessary checks when an employee leaves the company.

---

## 3. Main HRM Modules

| Module | Purpose | When it is used | Related Modules |
|---|---|---|---|
| **Dashboard** | To view a summary of important HR information | When quickly checking daily attendance, leave, and birthdays | Employees, Attendance, Leave |
| **Employees** | To manage employee records | When hiring, updating information, or offboarding | Departments, Positions |
| **Employee Details** | To view specific details of an individual employee | When checking an employee's Attendance, Leave, or Payroll history | Attendance, Leave, Payroll |
| **Departments** | To manage company departments | When creating a new department or changing a name | Employees |
| **Positions** | To define job titles and their Levels | When assigning new job titles | Employees, Daily SOPs |
| **Recruitment** | To manage job applicants | When conducting interviews and hiring after a job posting | Employees |
| **Onboarding** | To prepare for a new employee's start date | Before or on the first day of work | Employees |
| **Attendance** | To record check-in and check-out times | Daily when arriving at and leaving work | Payroll, Employee Details |
| **Leave Management** | To manage leave requests and approvals | When unable to work or wanting to take time off | Attendance, Payroll, Handovers |
| **Handovers** | To transfer ongoing tasks to someone else | When taking long leave or resigning | Leave Management, Offboarding |
| **Daily SOPs** | To define daily operational procedures | To record task completion during daily work hours | Positions, Employees |
| **Performance Tracker** | To evaluate performance using KPI scores | During monthly or annual reviews | Payroll |
| **Peer Voting** | To vote for colleagues | When selecting Employee of the Month | Employees |
| **Payroll & KPI** | To calculate salaries | During payroll processing at the end of the month | Employees, Attendance, Leave, Performance |
| **Document Vault** | To store HR documents | When sending or saving proof documents | Employees |
| **Birthdays** | To show upcoming birthdays | When planning monthly birthday celebrations | Employees |
| **Org Chart** | To visualize the organizational structure | When changing or viewing reporting lines | Employees |
| **Offboarding** | The process for employees who are leaving | When an employee submits a resignation letter | Employees, Handovers |

---

## 4. Employee Lifecycle

In the BBD HRM System, the step-by-step lifecycle of an employee flows as follows:

1. **Recruitment:** Applicants are evaluated through interviews in the Recruitment Module and marked as Hired.
2. **Employee Creation:** The hired individual is registered as a new employee via the Employees Module and granted System Login access.
3. **Department / Position:** The employee is assigned to the relevant Department and Position.
4. **Onboarding:** Necessary preparations (like Laptops, ID Cards) are handled by relevant departments via the Onboarding Module before the first day.
5. **Attendance & Leave:** The employee performs daily Check-in/out in Attendance and requests time off via Leave Management if needed.
6. **Daily SOP:** Depending on the employee's Position, Daily SOP Tasks automatically appear at the beginning of each month, requiring daily completion tracking.
7. **Performance:** The Manager enters the employee's monthly KPI scores in the Performance Tracker.
8. **Payroll & KPI:** HR automatically calculates the salary in the Payroll Module based on late records from Attendance, unpaid leaves from Leave Management, and KPI scores from Performance.
9. **Offboarding & Handover:** If the employee resigns, Exit Surveys and asset returns are processed via Offboarding, and remaining tasks are transferred via Handover.
10. **Soft Delete:** Once everything is completed, HR performs a Soft Delete on the employee, revoking their System Login.

---

## 5. How are HRM Modules connected?

The strength of the HRM System is that modules are automatically interconnected. Important connections include:

- **Employee → Department / Position:** As soon as an employee is created, their department and position must be assigned, and they automatically appear on the Org Chart.
- **Employee → Attendance / Leave:** The employee's daily attendance records and leave requests are automatically aggregated in their Employee Details.
- **Leave > 2 days → Handover:** If a leave request is for 3 days or more, the system requires filling out a Handover Form first, which must be accepted by the Receiver before it goes to the Manager for approval.
- **Employee Position → Daily SOP assignment:** On the 1st of every month, the System automatically assigns SOPs relevant to the employee's Position.
- **Attendance + Leave + Performance → Payroll:** Payroll does not operate in isolation; it pulls data from Attendance (late times), Leave (unpaid leaves), and Performance (KPI Bonus) to accurately calculate Net Pay.
- **Offboarding → Handover → Soft Delete:** The Soft Delete process is only completed after checking remaining tasks (Handover) and asset returns during resignation.

---

## 6. Who uses HRM?

The following main roles use BBD HRM:

- **Boss / Admin:** Can view all data across the system, grant permissions, approve Payroll, and perform necessary configurations (e.g., adding a new Department).
- **HR Manager:** Primarily handles hiring, managing Onboarding/Offboarding, maintaining HR documents, checking daily Attendance and Leave, and generating Payroll.
- **Manager:** Approves Leave Requests for their subordinates, oversees the completion of Daily SOPs, and assigns KPI performance scores.
- **Employee:** Performs daily Check-in/out, requests Leave, accepts/transfers Handovers, completes personal Daily SOP Tasks, and votes for colleagues via Peer Voting.

---

## 7. Basic Workflow for using HRM

For beginners, the basic steps are:

1. Manage Candidates in **Recruitment**.
2. If Hired, create the employee record in the **Employees** Module.
3. Precisely assign their **Department / Position**.
4. Complete **Onboarding** tasks before their first day.
5. Start recording **Attendance** as soon as they start working.
6. If the employee wants time off, submit and manage a request in **Leave Management**.
7. Assign and complete daily **Daily SOP** tasks.
8. Grade with **Performance / KPI tracking** near the end of the month.
9. Calculate **Payroll** at the end of the month.
10. Properly conclude with **Offboarding** when the employee resigns.

*(Note - This is the most comprehensive workflow; depending on the individual employee's situation, only some modules may be used.)*

---

## 8. Where should a beginner start learning HRM?

It is recommended to read this User Manual in the following order:

- **First:** Read and understand this \`HRM Overview\`.
- **Second:** Learn the basic structures like \`Employees\`, \`Departments\`, and \`Positions\`.
- **Third:** Read about the \`Recruitment\` and \`Onboarding\` processes.
- **Fourth:** Read about \`Attendance\` and \`Leave Management\` used daily.
- **Fifth:** Learn about the \`Performance Tracker\` and \`Payroll & KPI\` done every month.
- **Finally:** Read about \`Offboarding\` used when an employee leaves, and the comprehensive \`Complete Employee Lifecycle\`.

---

## 9. Important Notes

- **Data Connection:** HRM modules are interconnected. An employee's information is used across all other processes.
- **Handover Requirement:** Leave requests above the documented threshold (3 days or more) require Handovers.
- **Payroll Calculation:** Payroll uses the documented attendance/KPI-related information.
- **Soft Delete:** Employee Soft Delete affects the employee's active status/login behavior as documented. (Login access is revoked, but old data is retained).

---

## 10. Related Articles

- <a href="#" data-article-title="Dashboard" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Dashboard</a>
- <a href="#" data-article-title="Employees" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employees</a>
- <a href="#" data-article-title="Employee Details" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Employee Details</a>
- <a href="#" data-article-title="Recruitment" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Recruitment</a>
- <a href="#" data-article-title="Onboarding" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Onboarding</a>
- <a href="#" data-article-title="Attendance" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Attendance</a>
- <a href="#" data-article-title="Leave Management" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Leave Management</a>
- <a href="#" data-article-title="Complete Employee Lifecycle" class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium no-underline">Complete Employee Lifecycle</a>
`;

    const englishHtml = marked.parse(englishMarkdown);

    // Process published_content
    let currentPublishedObj = { my: article.published_content };
    if (article.published_content) {
      try {
        const parsed = JSON.parse(article.published_content);
        if (parsed.my || parsed.en) currentPublishedObj = parsed;
      } catch(e) {}
    }
    currentPublishedObj.en = englishHtml;

    // Process draft_content
    let currentDraftObj = { my: article.draft_content || article.published_content };
    if (article.draft_content) {
      try {
        const parsed = JSON.parse(article.draft_content);
        if (parsed.my || parsed.en) currentDraftObj = parsed;
      } catch(e) {}
    }
    currentDraftObj.en = englishHtml;

    await supabaseAdmin.from('hrm_manual_articles').update({
      published_content: JSON.stringify(currentPublishedObj),
      draft_content: JSON.stringify(currentDraftObj)
    }).eq('id', article.id);

    console.log('Successfully updated HRM Overview with English translation as JSON!');

  } catch (err) {
    console.error(err);
  }
}
run();
