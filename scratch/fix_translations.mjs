import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../hrm-client/src');
const enHrmPath = path.join(srcDir, 'locales/en/hrm.json');
const myHrmPath = path.join(srcDir, 'locales/my/hrm.json');
const enCommonPath = path.join(srcDir, 'locales/en/common.json');
const myCommonPath = path.join(srcDir, 'locales/my/common.json');

const updateJson = (p, updates) => {
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  for (const [keyPath, value] of Object.entries(updates)) {
    const parts = keyPath.split('.');
    let current = data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

updateJson(enHrmPath, {
  'editEmployee.title': 'Edit Employee',
  'editEmployee.loading': 'Loading...',
  'editEmployee.subtitle': 'Update profile for',
  'editEmployee.employee': 'Employee',
  'editEmployee.empId': 'Employee ID',
  'editEmployee.fullName': 'Full Name',
  'editEmployee.email': 'Email Address',
  'editEmployee.phone': 'Phone Number',
  'editEmployee.department': 'Department',
  'editEmployee.selectDept': '-- Select Department --',
  'editEmployee.position': 'Position',
  'editEmployee.selectPosition': '-- Select Position --',
  'editEmployee.manager': 'Manager/Boss',
  'editEmployee.none': '-- None --',
  'editEmployee.hireDate': 'Hire Date',
  'editEmployee.dob': 'Date of Birth',
  'editEmployee.salary': 'Base Salary',
  'editEmployee.employmentType': 'Employment Type',
  'editEmployee.status': 'Account Status',
  'editEmployee.nationalId': 'National ID / NRC',
  'editEmployee.address': 'Home Address',
  'editEmployee.cancel': 'Cancel',
  'editEmployee.saving': 'Saving...',
  'editEmployee.saveChanges': 'Save Changes',
  'documents.documentsCount': 'Documents Count',
  'documents.verifiedSigned': 'Verified & Signed',
  'documents.viewFile': 'View File',
  'documents.noDocumentsFound': 'No Documents Found',
  'documents.noDocumentsDesc': 'This employee has no documents uploaded yet.',
  'documents.perEmployeeVault': 'Per Employee Vault',
  'documents.perEmployeeDesc': 'Manage documents per employee',
  'documents.position': 'Position',
  'documents.department': 'Department',
  'documents.openFolder': 'Open Folder',
  'documents.pendingBossApproval': 'Pending Boss Approval',
  'documents.readyHrSign': 'Ready for HR Sign',
  'documents.totalPipeline': 'Total Pipeline',
  'documents.target': 'Target',
  'leave.modal.offboardingActive': 'Offboarding Active',
  'leave.modal.employee': 'Employee',
  'leave.modal.status': 'Status',
  'leave.modal.submitted': 'Submitted',
  'leave.modal.attachment': 'Attachment',
  'leave.modal.viewDocument': 'View Document',
  'leave.modal.handovers': 'Handovers',
  'leave.modal.coverage': 'Coverage',
  'leave.modal.return': 'Return',
  'leave.modal.hrSignature': 'HR Signature',
  'leave.modal.capturedOnApproval': 'Captured on approval',
  'leave.modal.hrApprovalSignature': 'HR Approval Signature',
  'leave.modal.noSignatureOnFile': 'No signature on file',
  'leave.modal.naRejected': 'N/A (Rejected)',
  'leave.modal.requiredWhenApproving': 'Required when approving',
  'handovers.toast.succAssigned': 'Handover assigned successfully',
  'handovers.toast.succError': 'Error assigning handover',
  'handovers.toast.approved': 'Handover approved',
  'handovers.toast.approveError': 'Error approving handover',
  'handovers.toast.waived': 'Handover waived',
  'handovers.toast.waiveInfo': 'Handover waived successfully',
  'handovers.toast.waiveError': 'Error waiving handover',
  'leave.wfLeave': 'Leave Process',
  'leave.wfCoverage': 'Coverage Process',
  'leave.wfReturn': 'Return Process',
  'offboarding.allCleared': 'All items cleared'
});

updateJson(myHrmPath, {
  'editEmployee.title': 'ဝန်ထမ်း ပြင်ဆင်ရန်',
  'editEmployee.loading': 'ဖွင့်နေပါသည်...',
  'editEmployee.subtitle': 'အချက်အလက် ပြင်ဆင်ရန် -',
  'editEmployee.employee': 'ဝန်ထမ်း',
  'editEmployee.empId': 'ဝန်ထမ်း နံပါတ်',
  'editEmployee.fullName': 'အမည်အပြည့်အစုံ',
  'editEmployee.email': 'အီးမေးလ်',
  'editEmployee.phone': 'ဖုန်းနံပါတ်',
  'editEmployee.department': 'ဌာန',
  'editEmployee.selectDept': '-- ဌာန ရွေးချယ်ပါ --',
  'editEmployee.position': 'ရာထူး',
  'editEmployee.selectPosition': '-- ရာထူး ရွေးချယ်ပါ --',
  'editEmployee.manager': 'မန်နေဂျာ',
  'editEmployee.none': '-- မရှိပါ --',
  'editEmployee.hireDate': 'အလုပ်စဝင်သည့်နေ့',
  'editEmployee.dob': 'မွေးသက္ကရာဇ်',
  'editEmployee.salary': 'လစာ',
  'editEmployee.employmentType': 'အလုပ်အမျိုးအစား',
  'editEmployee.status': 'အခြေအနေ',
  'editEmployee.nationalId': 'မှတ်ပုံတင်အမှတ်',
  'editEmployee.address': 'နေရပ်လိပ်စာ',
  'editEmployee.cancel': 'မလုပ်တော့ပါ',
  'editEmployee.saving': 'သိမ်းဆည်းနေသည်...',
  'editEmployee.saveChanges': 'ပြောင်းလဲမှုများကို သိမ်းမည်',
  'documents.documentsCount': 'စာရွက်စာတမ်း အရေအတွက်',
  'documents.verifiedSigned': 'စစ်ဆေးပြီး / လက်မှတ်ထိုးပြီး',
  'documents.viewFile': 'ဖိုင်ကြည့်ရန်',
  'documents.noDocumentsFound': 'စာရွက်စာတမ်း မရှိပါ',
  'documents.noDocumentsDesc': 'ဤဝန်ထမ်းအတွက် စာရွက်စာတမ်း တင်ထားခြင်း မရှိသေးပါ။',
  'documents.perEmployeeVault': 'ဝန်ထမ်းအလိုက် မှတ်တမ်း',
  'documents.perEmployeeDesc': 'ဝန်ထမ်းတစ်ဦးချင်းစီ၏ စာရွက်စာတမ်းများကို စီမံပါ။',
  'documents.position': 'ရာထူး',
  'documents.department': 'ဌာန',
  'documents.openFolder': 'ဖိုဒါဖွင့်ရန်',
  'documents.pendingBossApproval': 'Boss ခွင့်ပြုချက်စောင့်နေသည်',
  'documents.readyHrSign': 'HR လက်မှတ်ထိုးရန်အဆင်သင့်',
  'documents.totalPipeline': 'စုစုပေါင်း',
  'documents.target': 'ပစ်မှတ်',
  'leave.modal.offboardingActive': 'အလုပ်ထွက်ခြင်း လုပ်ဆောင်နေဆဲ',
  'leave.modal.employee': 'ဝန်ထမ်း',
  'leave.modal.status': 'အခြေအနေ',
  'leave.modal.submitted': 'တင်ပြပြီး',
  'leave.modal.attachment': 'ပူးတွဲဖိုင်',
  'leave.modal.viewDocument': 'စာရွက်စာတမ်း ကြည့်ရန်',
  'leave.modal.handovers': 'တာဝန်လွှဲပြောင်းမှုများ',
  'leave.modal.coverage': 'တာဝန်ယူပေးမည့်သူ',
  'leave.modal.return': 'ပြန်လည်ဝင်ရောက်မည့်ရက်',
  'leave.modal.hrSignature': 'HR လက်မှတ်',
  'leave.modal.capturedOnApproval': 'ခွင့်ပြုချိန်တွင် မှတ်တမ်းတင်ထားသည်',
  'leave.modal.hrApprovalSignature': 'HR ခွင့်ပြုချက် လက်မှတ်',
  'leave.modal.noSignatureOnFile': 'လက်မှတ်မရှိပါ',
  'leave.modal.naRejected': 'ပယ်ချထားပါသည်',
  'leave.modal.requiredWhenApproving': 'ခွင့်ပြုရန် လိုအပ်သည်',
  'handovers.toast.succAssigned': 'တာဝန်လွှဲပြောင်းမှု အောင်မြင်သည်',
  'handovers.toast.succError': 'တာဝန်လွှဲပြောင်းရာတွင် အမှားအယွင်းဖြစ်နေပါသည်',
  'handovers.toast.approved': 'ခွင့်ပြုပြီးပါပြီ',
  'handovers.toast.approveError': 'ခွင့်ပြုရာတွင် အမှားအယွင်းဖြစ်နေပါသည်',
  'handovers.toast.waived': 'ကင်းလွတ်ခွင့်ပြုပါသည်',
  'handovers.toast.waiveInfo': 'ကင်းလွတ်ခွင့်ပြုခြင်း အောင်မြင်သည်',
  'handovers.toast.waiveError': 'ကင်းလွတ်ခွင့်ပြုရာတွင် အမှားအယွင်းဖြစ်နေပါသည်',
  'leave.wfLeave': 'ခွင့်ယူခြင်း လုပ်ငန်းစဉ်',
  'leave.wfCoverage': 'တာဝန်ယူခြင်း လုပ်ငန်းစဉ်',
  'leave.wfReturn': 'ပြန်လည်ဝင်ရောက်ခြင်း လုပ်ငန်းစဉ်',
  'offboarding.allCleared': 'အားလုံး ရှင်းလင်းပြီး'
});

updateJson(enCommonPath, {
  'actions.approve': 'Approve',
  'actions.reject': 'Reject'
});

updateJson(myCommonPath, {
  'actions.approve': 'ခွင့်ပြုသည်',
  'actions.reject': 'ပယ်ချသည်'
});

console.log('JSON files updated successfully!');
