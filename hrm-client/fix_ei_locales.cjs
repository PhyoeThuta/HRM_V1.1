const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/locales/en/hrm.json');
const myPath = path.join(__dirname, 'src/locales/my/hrm.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const myJson = JSON.parse(fs.readFileSync(myPath, 'utf8'));

if (!enJson.offboarding.ratings) enJson.offboarding.ratings = {};
if (!myJson.offboarding.ratings) myJson.offboarding.ratings = {};

const enEI = {
  poor: "Poor",
  fair: "Fair",
  good: "Good",
  great: "Great",
  excellent: "Excellent",
  oneIsPoor: "1 is Poor",
  fiveIsExcellent: "5 is Excellent"
};

const myEI = {
  poor: "ညံ့သည်",
  fair: "သင့်တင့်သည်",
  good: "ကောင်းသည်",
  great: "အလွန်ကောင်းသည်",
  excellent: "အထူးကောင်းမွန်သည်",
  oneIsPoor: "၁ = ညံ့သည်",
  fiveIsExcellent: "၅ = အထူးကောင်းမွန်သည်"
};

Object.assign(enJson.offboarding.ratings, enEI);
Object.assign(myJson.offboarding.ratings, myEI);

const enOffbExtra = {
  backToOffboarding: "Back to Offboarding",
  exitInterview: "Exit Interview",
  interviewDetails: "Interview Details",
  interviewer: "Interviewer",
  selectHr: "Select HR Representative...",
  interviewDate: "Interview Date",
  primaryReason: "Primary Reason for Leaving",
  mainReasonPlaceholder: "Please elaborate on the main reason...",
  finalQuestions: "Final Questions",
  considerReturning: "Would you consider returning in the future?",
  boomerangHint: "Boomerang employee potential",
  recommend: "Would you recommend this company as a good place to work?",
  npsHint: "Employee Net Promoter Score",
  openFeedback: "Open Feedback",
  highlightsTitle: "What did you enjoy most about working here?",
  highlightsPlaceholder: "Share some positive highlights...",
  improvementsTitle: "What could we improve?",
  improvementsPlaceholder: "Share constructive feedback...",
  commentsTitle: "Any other comments?",
  commentsPlaceholder: "Additional thoughts..."
};

const myOffbExtra = {
  backToOffboarding: "လုပ်ငန်းလွှဲပြောင်းမှုသို့ ပြန်သွားရန်",
  exitInterview: "အလုပ်ထွက် အင်တာဗျူး",
  interviewDetails: "အင်တာဗျူး အသေးစိတ်",
  interviewer: "အင်တာဗျူးသူ",
  selectHr: "HR ကိုယ်စားလှယ်ကို ရွေးချယ်ပါ...",
  interviewDate: "အင်တာဗျူးရက်စွဲ",
  primaryReason: "အလုပ်ထွက်ရသည့် အဓိကအကြောင်းရင်း",
  mainReasonPlaceholder: "အဓိကအကြောင်းရင်းကို အသေးစိတ်ဖော်ပြပေးပါ...",
  finalQuestions: "နောက်ဆုံး မေးခွန်းများ",
  considerReturning: "အနာဂတ်တွင် ပြန်လည်ဝင်ရောက်လုပ်ကိုင်ရန် စဉ်းစားမည်လား?",
  boomerangHint: "ပြန်လည်ဝင်ရောက်နိုင်ခြေ",
  recommend: "ဤကုမ္ပဏီကို အလုပ်လုပ်ရန် ကောင်းသောနေရာတစ်ခုအဖြစ် အကြံပြုမည်လား?",
  npsHint: "ဝန်ထမ်းများ၏ ထောက်ခံမှု အမှတ်အဆင့်",
  openFeedback: "အကြံပြုစာ",
  highlightsTitle: "ဤနေရာတွင် အလုပ်လုပ်ရသည်ကို အနှစ်သက်ဆုံးအရာက အဘယ်နည်း?",
  highlightsPlaceholder: "အပြုသဘောဆောင်သော အမှတ်တရများကို ဝေမျှပေးပါ...",
  improvementsTitle: "ကျွန်ုပ်တို့ ဘာတွေ တိုးတက်အောင် လုပ်နိုင်မလဲ?",
  improvementsPlaceholder: "အပြုသဘောဆောင်သော အကြံပြုချက်များကို ဝေမျှပေးပါ...",
  commentsTitle: "အခြားမှတ်ချက်များ ရှိပါသလား?",
  commentsPlaceholder: "ထပ်ဆောင်း အမြင်များ..."
};

Object.assign(enJson.offboarding, enOffbExtra);
Object.assign(myJson.offboarding, myOffbExtra);

fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
fs.writeFileSync(myPath, JSON.stringify(myJson, null, 2));
console.log('Exit interview locales added.');
