const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

// 1. Peer Voting
enJson.peervoting = {
  title: "Peer Voting",
  subtitle: "Evaluate your peers",
  submitVote: "Submit Vote",
  cols: {
    voter: "Voter",
    votedFor: "Voted For",
    score: "Score",
    comments: "Comments",
    date: "Date"
  },
  noVotes: "No peer votes recorded yet.",
  form: {
    title: "360-Degree Feedback",
    subtitle: "Evaluate your peers",
    selectColleague: "Select Colleague",
    chooseColleague: "Choose a colleague to evaluate...",
    attendance: "Attendance (Present & reliable)",
    punctuality: "Punctuality (On time)",
    sops: "SOP Adherence (Follows procedures)",
    peer: "Peer Collaboration (Teamwork)",
    initiative: "Initiative (Proactive)",
    needsImprovement: "Needs Improvement",
    excellent: "Excellent",
    constructiveComments: "Constructive Comments (Optional)",
    commentsPlaceholder: "What are they doing well? What could be improved?",
    submitEvaluation: "Submit Evaluation",
    submitting: "Submitting..."
  },
  toast: {
    success: "Thank you for voting!",
    error: "Failed to submit vote"
  }
};

myJson.peervoting = {
  title: "ရွယ်တူမဲပေးခြင်း",
  subtitle: "လုပ်ဖော်ကိုင်ဖက်များကို အကဲဖြတ်ရန်",
  submitVote: "မဲပေးမည်",
  cols: {
    voter: "မဲပေးသူ",
    votedFor: "မဲပေးခံရသူ",
    score: "ရမှတ်",
    comments: "မှတ်ချက်များ",
    date: "ရက်စွဲ"
  },
  noVotes: "မဲပေးထားသော မှတ်တမ်း မရှိသေးပါ။",
  form: {
    title: "360-Degree အကဲဖြတ်မှု",
    subtitle: "လုပ်ဖော်ကိုင်ဖက်များကို အကဲဖြတ်ရန်",
    selectColleague: "လုပ်ဖော်ကိုင်ဖက် ရွေးချယ်ပါ",
    chooseColleague: "အကဲဖြတ်မည့် လုပ်ဖော်ကိုင်ဖက်ကို ရွေးချယ်ပါ...",
    attendance: "ရုံးတက်မှန်ကန်မှု (ယုံကြည်စိတ်ချရမှု)",
    punctuality: "အချိန်မီမှု (အချိန်တိကျမှု)",
    sops: "လုပ်ငန်းစဉ် လိုက်နာမှု (SOPs)",
    peer: "ပူးပေါင်းဆောင်ရွက်မှု (အဖွဲ့အစည်းစိတ်ဓာတ်)",
    initiative: "ဦးဆောင်မှု (တက်ကြွမှု)",
    needsImprovement: "တိုးတက်ရန် လိုအပ်သည်",
    excellent: "အလွန်ကောင်းသည်",
    constructiveComments: "အပြုသဘောဆောင်သော မှတ်ချက်များ (ရွေးချယ်နိုင်သည်)",
    commentsPlaceholder: "မည်သည့်အရာများကို ကောင်းမွန်စွာ လုပ်ဆောင်နေသနည်း။ မည်သည့်အရာများကို တိုးတက်ရန် လိုအပ်သနည်း။",
    submitEvaluation: "အကဲဖြတ်ချက် တင်သွင်းမည်",
    submitting: "တင်သွင်းနေသည်..."
  },
  toast: {
    success: "မဲပေးခြင်းအတွက် ကျေးဇူးတင်ပါသည်။",
    error: "မဲပေးခြင်း မအောင်မြင်ပါ။"
  }
};

// 2. Onboarding
enJson.onboarding = {
  title: "Onboarding",
  subtitle: "Track new hires and initial task progress",
  preBoarding: "Pre-boarding",
  inProgress: "In Progress",
  completed: "Completed",
  newHiresAlert: "New Hires waiting to start onboarding!",
  noDate: "No Date",
  start: "Start",
  noActiveProcesses: "No active onboarding processes.",
  startDate: "Start Date",
  tasks: "Tasks",
  viewTasks: "View Tasks",
  loading: "Loading..."
};

myJson.onboarding = {
  title: "အလုပ်ဝင်ခြင်း",
  subtitle: "ဝန်ထမ်းသစ်များနှင့် ကနဦးလုပ်ငန်းစဉ် တိုးတက်မှုကို စောင့်ကြည့်ရန်",
  preBoarding: "အလုပ်မဝင်မီ (Pre-boarding)",
  inProgress: "လုပ်ဆောင်ဆဲ",
  completed: "ပြီးစီး",
  newHiresAlert: "အလုပ်ဝင်ခြင်းလုပ်ငန်းစဉ် စတင်ရန် စောင့်ဆိုင်းနေသော ဝန်ထမ်းသစ်များ!",
  noDate: "ရက်စွဲမရှိပါ",
  start: "စတင်မည်",
  noActiveProcesses: "လက်ရှိလုပ်ဆောင်နေသော အလုပ်ဝင်ခြင်းလုပ်ငန်းစဉ် မရှိပါ။",
  startDate: "စတင်မည့် ရက်စွဲ",
  tasks: "လုပ်ငန်းများ",
  viewTasks: "လုပ်ငန်းများ ကြည့်ရန်",
  loading: "လုပ်ဆောင်နေသည်..."
};

// 3. Onboarding Detail
enJson.onboardingDetail = {
  loading: "Loading...",
  fetching: "Fetching onboarding details",
  notFoundTitle: "Not Found",
  notFoundSubtitle: "Onboarding record not found",
  notFoundText: "The onboarding record you are looking for does not exist.",
  onboarding: "Onboarding",
  subtitle: "Track task progress for this employee",
  back: "Back to Onboarding",
  done: "Done",
  noDueDate: "No due date",
  due: "Due",
  owner: "Owner",
  category: {
    preBoarding: "Pre-boarding",
    documentation: "Documentation",
    itSetup: "IT Setup",
    introduction: "Introduction"
  },
  tasks: {
    welcomeEmail: "Send Welcome Email",
    employeeHandbook: "Share Employee Handbook",
    contractSignature: "Collect Contract Signature",
    emailAccount: "Setup Company Email Account",
    systemAccounts: "Create System & App Accounts",
    accessCard: "Issue Access Card & Keys"
  }
};

myJson.onboardingDetail = {
  loading: "လုပ်ဆောင်နေသည်...",
  fetching: "အလုပ်ဝင်ခြင်း အချက်အလက်များ ရယူနေသည်",
  notFoundTitle: "မတွေ့ရှိပါ",
  notFoundSubtitle: "အလုပ်ဝင်ခြင်း မှတ်တမ်း မတွေ့ရှိပါ",
  notFoundText: "သင်ရှာဖွေနေသော အလုပ်ဝင်ခြင်း မှတ်တမ်း မရှိပါ။",
  onboarding: "အလုပ်ဝင်ခြင်း",
  subtitle: "ဤဝန်ထမ်း၏ လုပ်ငန်းတိုးတက်မှုကို စောင့်ကြည့်ရန်",
  back: "အလုပ်ဝင်ခြင်းသို့ ပြန်သွားရန်",
  done: "ပြီးစီး",
  noDueDate: "နောက်ဆုံးရက် မရှိပါ",
  due: "နောက်ဆုံးရက်",
  owner: "တာဝန်ခံ",
  category: {
    preBoarding: "အလုပ်မဝင်မီ (Pre-boarding)",
    documentation: "စာရွက်စာတမ်းများ",
    itSetup: "IT ပြင်ဆင်မှု",
    introduction: "မိတ်ဆက်ခြင်း"
  },
  tasks: {
    welcomeEmail: "ကြိုဆိုကြောင်း အီးမေးလ် ပေးပို့ရန်",
    employeeHandbook: "ဝန်ထမ်းလက်စွဲစာအုပ် မျှဝေရန်",
    contractSignature: "အလုပ်ခန့်ထားမှု စာချုပ် လက်မှတ်ရယူရန်",
    emailAccount: "ကုမ္ပဏီ အီးမေးလ် အကောင့် ဖန်တီးရန်",
    systemAccounts: "စနစ်နှင့် အက်ပ် အကောင့်များ ဖန်တီးရန်",
    accessCard: "ဝင်ပေါက်ကတ်နှင့် သော့များ ထုတ်ပေးရန်"
  }
};

// 4. Offboarding
enJson.offboarding = {
  title: "Offboarding Management",
  subtitle: "Structured employee exits, asset retrieval, and final settlements",
  totalCases: "Total Cases",
  holdFinalPayroll: "Hold Final Payroll",
  settlementReleased: "Settlement Released",
  initiate: "Initiate Offboarding",
  employee: "Employee",
  selectEmployee: "— Select Employee —",
  terminationReason: "Termination Reason",
  exitType: "Exit Type",
  resignationDate: "Resignation Date",
  lastWorkingDate: "Last Working Date",
  selectHr: "Select HR/Admin name",
  interviewDate: "Interview Date",
  interviewer: "Interviewer",
  reasonForLeaving: "Reason for leaving",
  reasonPlaceholder: "Why is the employee leaving?",
  ratingsTitle: "Experience Ratings",
  jobSatisfaction: "Job Satisfaction",
  jobSatisfactionDesc: "How satisfied were they with their overall job role?",
  managementRating: "Management",
  managementDesc: "How would they rate the management and leadership?",
  workEnvironment: "Work Environment",
  environmentDesc: "How was the culture and work environment?",
  compensationBenefits: "Compensation",
  compensationDesc: "How satisfied were they with compensation and benefits?",
  careerGrowth: "Career Growth",
  careerDesc: "Were there sufficient opportunities for growth?",
  ratings: {
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    great: "Great",
    excellent: "Excellent",
    oneIsPoor: "1 = Poor",
    fiveIsExcellent: "5 = Excellent"
  },
  future: {
    title: "Future Relationship",
    return: "Would you consider returning to work here in the future?",
    recommend: "Would you recommend the company to a friend?",
    yes: "Yes",
    no: "No",
    maybe: "Maybe"
  },
  feedback: {
    title: "Qualitative Feedback",
    highlights: "Best parts of working here (Highlights)",
    highlightsPlh: "What did they enjoy most?",
    improvements: "Areas for improvement",
    improvementsPlh: "What could we do better?",
    additional: "Additional Comments",
    additionalPlh: "Any other remarks..."
  },
  details: "View Details",
  exitInterview: "Exit Interview",
  holdPayroll: "Hold Payroll",
  knowledgeTransfer: "Knowledge Transfer",
  nda: "Non-Disclosure Agreement (NDA)",
  accessCard: "Access Card & Keys",
  laptopReturned: "Laptop & Devices Returned",
  startOffboarding: "Start Offboarding",
  backToOffboarding: "Back to Offboarding",
  interviewDetails: "Interview Details",
  saveInterview: "Save Exit Interview",
  tabs: {
    tasks: "Clearance Tasks",
    interview: "Exit Interview",
    settlement: "Final Settlement"
  },
  emptyActive: "No active offboarding cases.",
  emptyHistory: "No offboarding history.",
  noPendingHandovers: "No pending handovers required.",
  activeCases: "Active Cases",
  history: "History",
  cancelOffboarding: "Cancel Offboarding",
  confirmCancelTitle: "Cancel Offboarding?",
  confirmCancelDesc: "Are you sure you want to cancel the offboarding process for",
  cancelProcess: "Cancel Process",
  cancel: "Cancel",
  save: "Save",
  status: {
    inProgress: "In Progress",
    completed: "Completed"
  },
  finalSettlement: {
    title: "Final Settlement",
    desc: "Process the final payment and release the employee.",
    gross: "Gross Salary Due",
    leave: "Leave Encashment",
    severance: "Severance Pay",
    deductions: "Deductions (Unreturned Assets)",
    net: "Net Final Payment",
    release: "Release Settlement",
    waive: "Waive / Skip Handovers",
    cannotReleaseTitle: "Cannot Release Final Settlement",
    cannotReleaseDesc: "Employee still has active/pending handovers. They must complete all handovers before final settlement can be released.",
    confirmReleaseTitle: "Release Final Settlement?",
    confirmReleaseDesc: "This will finalize the offboarding process and mark the employee as completely offboarded. This action cannot be undone.",
    releaseConfirmBtn: "Yes, Release Settlement",
    completedInfo: "Final settlement was released on"
  },
  tasksSection: {
    checklist: "Clearance Checklist",
    checklistDesc: "Ensure all company assets are returned and access is revoked.",
    markAs: "Mark as"
  }
};

myJson.offboarding = {
  title: "အလုပ်ထွက်ခြင်း စီမံခန့်ခွဲမှု",
  subtitle: "ဝန်ထမ်းအလုပ်ထွက်ခြင်း၊ ပစ္စည်းများပြန်လည်လက်ခံခြင်းနှင့် နောက်ဆုံးစာရင်းရှင်းလင်းခြင်း",
  totalCases: "စုစုပေါင်း",
  holdFinalPayroll: "လစာ ဆိုင်းငံ့ထားသူ",
  settlementReleased: "စာရင်းရှင်းလင်းပြီး",
  initiate: "အလုပ်ထွက်ခြင်း စတင်ရန်",
  employee: "ဝန်ထမ်း",
  selectEmployee: "— ဝန်ထမ်း ရွေးချယ်ပါ —",
  terminationReason: "အလုပ်ထွက်ရသည့် အကြောင်းပြချက်",
  exitType: "အလုပ်ထွက်သည့် အမျိုးအစား",
  resignationDate: "နှုတ်ထွက်စာတင်သည့် ရက်စွဲ",
  lastWorkingDate: "နောက်ဆုံးအလုပ်လုပ်မည့် ရက်စွဲ",
  selectHr: "HR/Admin အမည်ကို ရွေးချယ်ပါ",
  interviewDate: "အင်တာဗျူး ရက်စွဲ",
  interviewer: "အင်တာဗျူးသူ",
  reasonForLeaving: "အလုပ်ထွက်ရသည့် အကြောင်းရင်း",
  reasonPlaceholder: "ဝန်ထမ်းသည် အဘယ်ကြောင့် အလုပ်ထွက်ရသနည်း?",
  ratingsTitle: "အတွေ့အကြုံ အဆင့်သတ်မှတ်ချက်များ",
  jobSatisfaction: "အလုပ်အပေါ် ကျေနပ်မှု",
  jobSatisfactionDesc: "သူတို့၏ လုပ်ငန်းတာဝန်အပေါ် မည်မျှကျေနပ်မှု ရှိသနည်း။",
  managementRating: "စီမံခန့်ခွဲမှု",
  managementDesc: "စီမံခန့်ခွဲမှုနှင့် ခေါင်းဆောင်မှုအား မည်သို့အဆင့်သတ်မှတ်မည်နည်း။",
  workEnvironment: "လုပ်ငန်းခွင် အခြေအနေ",
  environmentDesc: "လုပ်ငန်းခွင် ယဉ်ကျေးမှုနှင့် ပတ်ဝန်းကျင် မည်သို့ရှိသနည်း။",
  compensationBenefits: "လစာနှင့် ခံစားခွင့်များ",
  compensationDesc: "လစာနှင့် ခံစားခွင့်များအပေါ် မည်မျှကျေနပ်မှု ရှိသနည်း။",
  careerGrowth: "သက်မွေးဝမ်းကျောင်း တိုးတက်မှု",
  careerDesc: "တိုးတက်မှုအတွက် လုံလောက်သော အခွင့်အလမ်းများ ရှိပါသလား။",
  ratings: {
    poor: "ညံ့သည်",
    fair: "အသင့်အတင့်",
    good: "ကောင်းသည်",
    great: "အလွန်ကောင်းသည်",
    excellent: "အထူးကောင်းမွန်သည်",
    oneIsPoor: "၁ = ညံ့သည်",
    fiveIsExcellent: "၅ = အထူးကောင်းမွန်သည်"
  },
  future: {
    title: "အနာဂတ် ဆက်ဆံရေး",
    return: "နောင်တစ်ချိန်တွင် ဤနေရာ၌ ပြန်လည်အလုပ်လုပ်ရန် စဉ်းစားမည်လား?",
    recommend: "ကုမ္ပဏီကို မိတ်ဆွေတစ်ဦးအား အကြံပြုမည်လား?",
    yes: "ဟုတ်ကဲ့",
    no: "ဟင့်အင်း",
    maybe: "စဉ်းစားမည်"
  },
  feedback: {
    title: "အရည်အသွေးပိုင်းဆိုင်ရာ အကြံပြုချက်",
    highlights: "ဤနေရာတွင် အလုပ်လုပ်ရခြင်း၏ အကောင်းဆုံးအပိုင်းများ (ထူးခြားချက်များ)",
    highlightsPlh: "သူတို့ ဘာကိုအနှစ်သက်ဆုံးလဲ?",
    improvements: "တိုးတက်ရန် လိုအပ်သော အပိုင်းများ",
    improvementsPlh: "ငါတို့ ဘာကို ပိုကောင်းအောင် လုပ်နိုင်မလဲ?",
    additional: "အခြား မှတ်ချက်များ",
    additionalPlh: "အခြား ပြောဆိုလိုသည်များ..."
  },
  details: "အသေးစိတ်ကြည့်ရန်",
  exitInterview: "အလုပ်ထွက် အင်တာဗျူး",
  holdPayroll: "လစာ ဆိုင်းငံ့မည်",
  knowledgeTransfer: "လုပ်ငန်း အသိပညာ လွှဲပြောင်းခြင်း",
  nda: "လျှို့ဝှက်ချက် ထိန်းသိမ်းရေး သဘောတူစာချုပ် (NDA)",
  accessCard: "ဝင်ပေါက်ကတ်နှင့် သော့များ",
  laptopReturned: "လက်ပ်တော့ပ်နှင့် စက်ပစ္စည်းများ ပြန်လည်အပ်နှံခြင်း",
  startOffboarding: "အလုပ်ထွက်ခြင်း စတင်မည်",
  backToOffboarding: "အလုပ်ထွက်ခြင်း စာမျက်နှာသို့ ပြန်သွားရန်",
  interviewDetails: "အင်တာဗျူး အသေးစိတ်",
  saveInterview: "အင်တာဗျူး မှတ်တမ်း သိမ်းမည်",
  tabs: {
    tasks: "ရှင်းလင်းရေး လုပ်ငန်းများ",
    interview: "အလုပ်ထွက် အင်တာဗျူး",
    settlement: "နောက်ဆုံး စာရင်းရှင်းလင်းခြင်း"
  },
  emptyActive: "လက်ရှိ အလုပ်ထွက်မည့်သူ မရှိပါ။",
  emptyHistory: "အလုပ်ထွက် မှတ်တမ်း မရှိပါ။",
  noPendingHandovers: "ဆိုင်းငံ့ထားသော လွှဲပြောင်းမှု မရှိပါ။",
  activeCases: "လက်ရှိ လုပ်ဆောင်ဆဲ",
  history: "မှတ်တမ်း",
  cancelOffboarding: "အလုပ်ထွက်ခြင်းကို ပယ်ဖျက်မည်",
  confirmCancelTitle: "အလုပ်ထွက်ခြင်းကို ပယ်ဖျက်မည်လား?",
  confirmCancelDesc: "အောက်ပါဝန်ထမ်း၏ အလုပ်ထွက်ခြင်း လုပ်ငန်းစဉ်ကို ပယ်ဖျက်ရန် သေချာပါသလား -",
  cancelProcess: "လုပ်ငန်းစဉ်ကို ပယ်ဖျက်မည်",
  cancel: "ပယ်ဖျက်မည်",
  save: "သိမ်းဆည်းမည်",
  status: {
    inProgress: "လုပ်ဆောင်ဆဲ",
    completed: "ပြီးစီး"
  },
  finalSettlement: {
    title: "နောက်ဆုံး စာရင်းရှင်းလင်းခြင်း",
    desc: "နောက်ဆုံး ငွေပေးချေမှုကို လုပ်ဆောင်ပြီး ဝန်ထမ်းအား ထွက်ခွာခွင့်ပြုပါ။",
    gross: "ရရန်ရှိသော စုစုပေါင်းလစာ",
    leave: "ခွင့်ရက်အတွက် ငွေကြေး",
    severance: "နစ်နာကြေး",
    deductions: "ဖြတ်တောက်ငွေများ (ပြန်မအပ်သော ပစ္စည်းများအတွက်)",
    net: "အသားတင် ပေးချေရမည့်ငွေ",
    release: "စာရင်းရှင်းလင်းပြီး ထွက်ခွာခွင့်ပြုမည်",
    waive: "တာဝန်လွှဲပြောင်းမှုများကို ကင်းလွတ်ခွင့်ပေးမည်",
    cannotReleaseTitle: "စာရင်းရှင်းလင်းမှု ပြုလုပ်၍မရပါ",
    cannotReleaseDesc: "ဝန်ထမ်းတွင် ဆိုင်းငံ့နေသော/လုပ်ဆောင်ဆဲ တာဝန်လွှဲပြောင်းမှုများ ရှိနေသေးသည်။ နောက်ဆုံး စာရင်းရှင်းလင်းမှု မပြုလုပ်မီ လွှဲပြောင်းမှုအားလုံးကို ပြီးစီးအောင် ဆောင်ရွက်ရပါမည်။",
    confirmReleaseTitle: "စာရင်းရှင်းလင်းပြီး ထွက်ခွာခွင့်ပြုမည်လား?",
    confirmReleaseDesc: "ဤသို့ပြုလုပ်ခြင်းဖြင့် အလုပ်ထွက်ခြင်း လုပ်ငန်းစဉ် ပြီးဆုံးမည်ဖြစ်ပြီး ဝန်ထမ်းသည် စနစ်ထဲမှ ထွက်ခွာသွားပြီဟု သတ်မှတ်မည်ဖြစ်သည်။ ဤလုပ်ဆောင်ချက်ကို ပြန်လည်ပြင်ဆင်၍မရပါ။",
    releaseConfirmBtn: "ဟုတ်ကဲ့၊ ထွက်ခွာခွင့်ပြုမည်",
    completedInfo: "နောက်ဆုံး စာရင်းရှင်းလင်းမှု ပြုလုပ်ခဲ့သော နေ့စွဲ -"
  },
  tasksSection: {
    checklist: "ရှင်းလင်းရေး စစ်ဆေးရန်စာရင်း",
    checklistDesc: "ကုမ္ပဏီပိုင် ပစ္စည်းများအားလုံး ပြန်လည်ရရှိပြီး ဝင်ရောက်ခွင့်များကို ပိတ်သိမ်းပြီးဖြစ်ကြောင်း သေချာပါစေ။",
    markAs: "အခြေအနေ သတ်မှတ်ရန်"
  }
};

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));

console.log('Locales updated!');
