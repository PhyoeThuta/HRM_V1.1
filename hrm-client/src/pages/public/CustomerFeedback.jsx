import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CustomerFeedback() {
  const { customer_id } = useParams();
  const [ratings, setRatings] = useState({ 
    taste: 0, 
    delivery: 0, 
    progress: 0,
    packaging: 0,
    portion: 0,
    service: 0,
    variety: 0
  });
  const [hoverRatings, setHoverRatings] = useState({ 
    taste: 0, 
    delivery: 0, 
    progress: 0,
    packaging: 0,
    portion: 0,
    service: 0,
    variety: 0
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const setRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const setHoverRating = (category, value) => {
    setHoverRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(ratings).some(val => val === 0)) {
      toast.error('Please complete all star ratings / အမှတ်အပြည့်ပေးပါ');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const averageRating = Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length);
      
      const formattedComment = `
အရသာ (Taste): ${ratings.taste}/5
အစားအသောက် ပမာဏ (Portion Size): ${ratings.portion}/5
ထုပ်ပိုးမှု နှင့် သန့်ရှင်းရေး (Packaging & Hygiene): ${ratings.packaging}/5
ဟင်းလျာ အမျိုးအစား စုံလင်မှု (Menu Variety): ${ratings.variety}/5
Delivery အချိန်မှန် မမှန် (Delivery Timing): ${ratings.delivery}/5
ဝန်ဆောင်မှု (Customer Service): ${ratings.service}/5
တိုးတက်မှု (Progress): ${ratings.progress}/5

${comment ? `မှတ်ချက် (Comment):\n${comment}` : ''}
      `.trim();

      const res = await fetch('/api/public/crm/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id, rating: averageRating, comment: formattedComment })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
      
      setIsSuccess(true);
      toast.success('Feedback submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to submit. Please try again.');
      console.error('[Public Feedback]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRow = ({ title, myanTitle, category }) => (
    <div className="flex flex-col items-center mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
      <label className="block text-sm font-bold text-slate-300 mb-1 text-center">
        {myanTitle} <span className="text-slate-500 font-normal">({title})</span>
      </label>
      <div className="flex gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(category, star)}
            onMouseLeave={() => setHoverRating(category, 0)}
            onClick={() => setRating(category, star)}
          >
            <svg 
              className={`w-10 h-10 transition-colors ${star <= (hoverRatings[category] || ratings[category]) ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-slate-600'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="bg-surface-800 p-8 rounded-3xl border border-white/10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black mb-2">Thank You! / ကျေးဇူးတင်ပါတယ်</h2>
          <p className="text-slate-400 mb-6">Your feedback helps us improve and serve you better.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-brand-green to-emerald-400 bg-clip-text text-transparent">Busy Boss Diet</h1>
          <p className="text-slate-400 mt-2">How was your experience with us? <br/> ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအပေါ် အကဲဖြတ်ပေးပါ။</p>
        </div>

        <div className="bg-surface-800 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <StarRow myanTitle="အရသာ" title="Taste" category="taste" />
            <StarRow myanTitle="အစားအသောက် ပမာဏ" title="Portion Size" category="portion" />
            <StarRow myanTitle="ထုပ်ပိုးမှု နှင့် သန့်ရှင်းရေး" title="Packaging & Hygiene" category="packaging" />
            <StarRow myanTitle="ဟင်းလျာ အမျိုးအစား စုံလင်မှု" title="Menu Variety" category="variety" />
            <StarRow myanTitle="Delivery အချိန်မှန် မမှန်" title="Delivery Timing" category="delivery" />
            <StarRow myanTitle="ဝန်ဆောင်မှု နှင့် ဆက်ဆံရေး" title="Customer Service" category="service" />
            <StarRow myanTitle="တိုးတက်မှု" title="Progress" category="progress" />

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Any Comments or Suggestions? (အကြံပြုချက်များ)</label>
              <textarea 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                rows="3" 
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                placeholder="Tell us what you liked or how we can improve..."
              ></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2">
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
