import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerFeedback() {
  const { customer_id } = useParams();
  const [searchParams] = useSearchParams();
  
  const [category, setCategory] = useState('GENERAL'); // GENERAL or MENU
  const [type, setType] = useState('REQUEST'); // REQUEST or COMPLAIN
  
  const [texts, setTexts] = useState({
    GENERAL_REQUEST: '',
    GENERAL_COMPLAIN: '',
    MENU_REQUEST: '',
    MENU_COMPLAIN: ''
  });
  
  const [menuNames, setMenuNames] = useState({
    MENU_REQUEST: '',
    MENU_COMPLAIN: ''
  });
  
  const activeKey = `${category}_${type}`;
  const textContent = texts[activeKey];
  const setTextContent = (val) => setTexts(prev => ({ ...prev, [activeKey]: val }));
  
  const menuName = menuNames[activeKey];
  const setMenuName = (val) => setMenuNames(prev => ({ ...prev, [activeKey]: val }));
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const qType = searchParams.get('type');
    if (qType) {
      if (qType.toLowerCase() === 'complain') setType('COMPLAIN');
      if (qType.toLowerCase() === 'request') setType('REQUEST');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payloads = [];
    const keys = ['GENERAL_REQUEST', 'GENERAL_COMPLAIN', 'MENU_REQUEST', 'MENU_COMPLAIN'];
    
    for (const key of keys) {
      if (texts[key].trim()) {
        const [c, t] = key.split('_');
        if (c === 'MENU' && !menuNames[key].trim()) {
           return toast.error(`Please enter the menu name for your ${t.toLowerCase()} / ဟင်းလျာအမည် ထည့်ပေးပါ`);
        }
        
        const m = menuNames[key];
        const menuStr = c === 'MENU' ? ` [ဟင်းလျာ - ${m}] ` : ' ';
        const comment = `[${c}][${t}]${menuStr}\n${texts[key].trim()}`;
        
        payloads.push(comment);
      }
    }
    
    if (payloads.length === 0) {
      return toast.error('Please enter your message / စာရေးထည့်ပေးပါ');
    }
    
    setIsSubmitting(true);
    try {
      const promises = payloads.map(comment => 
        fetch('/api/public/crm/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id, rating: null, comment })
        }).then(async r => { if (!r.ok) throw new Error((await r.json()).error) })
      );

      await Promise.all(promises);
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="feedback-page-override min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
          <div className="w-20 h-20 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
            ✓
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Thank You!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">ကျေးဇူးတင်ပါသည်။<br/>အချက်အလက်များ လက်ခံရရှိပါပြီ။</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page-override min-h-screen bg-[#f8f9fa] py-12 px-4 font-sans selection:bg-brand-green selection:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-block mb-2">
            <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
              Feedback Form
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Customer Voice</h1>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            We value your feedback. Please let us know your requests or complaints.
          </p>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 space-y-10">
          
          {/* Category Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-6 h-px bg-slate-200"></span>
              Category <span className="text-slate-300 font-normal ml-1 capitalize">(အမျိုးအစား)</span>
            </label>
            <div className="flex gap-3 p-1.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              {['GENERAL', 'MENU'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    category === cat 
                      ? 'bg-white text-brand-green shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-slate-100/50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  {cat === 'GENERAL' ? 'General (အထွေထွေ)' : 'Menu (ဟင်းလျာ)'}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Name Input if MENU is selected */}
          {category === 'MENU' && (
            <div className="space-y-4 animate-slide-in">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-6 h-px bg-slate-200"></span>
                Menu Name <span className="text-slate-300 font-normal ml-1 capitalize">(ဟင်းလျာအမည်)</span>
              </label>
              <input 
                type="text" 
                value={menuName}
                onChange={e => setMenuName(e.target.value)}
                placeholder="e.g. ဝက်သားချဉ်စပ်"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:outline-none focus:border-brand-green/50 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>
          )}

          {/* Type Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-6 h-px bg-slate-200"></span>
              Type <span className="text-slate-300 font-normal ml-1 capitalize">(ပေးပို့မည့် အကြောင်းအရာ)</span>
            </label>
            <div className="flex gap-3 p-1.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <button
                type="button"
                onClick={() => setType('REQUEST')}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  type === 'REQUEST' 
                    ? 'bg-white text-brand-orange shadow-[0_2px_10px_rgba(255,119,0,0.15)] border border-brand-orange/10' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                Request (အကြံပြုတောင်းဆိုချက်)
              </button>
              <button
                type="button"
                onClick={() => setType('COMPLAIN')}
                className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  type === 'COMPLAIN' 
                    ? 'bg-white text-rose-500 shadow-[0_2px_10px_rgba(244,63,94,0.15)] border border-rose-500/10' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                Complain (တိုင်ကြားချက်)
              </button>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-6 h-px bg-slate-200"></span>
              Message <span className="text-slate-300 font-normal ml-1 capitalize">(အသေးစိတ်ရေးသားရန်)</span>
            </label>
            <textarea 
              rows="6"
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="အသေးစိတ်ကို ဤနေရာတွင် ရေးသားပေးပါ..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-5 py-4 text-slate-700 font-medium focus:outline-none focus:border-brand-green/50 focus:bg-white transition-all placeholder:text-slate-300 resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-[0_8px_20px_rgba(163,184,31,0.3)] transition-all flex items-center justify-center gap-2 ${
                isSubmitting 
                  ? 'bg-slate-300 opacity-70 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-brand-green to-[#8ea11b] hover:shadow-[0_12px_25px_rgba(163,184,31,0.4)] hover:-translate-y-1 active:translate-y-0'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
