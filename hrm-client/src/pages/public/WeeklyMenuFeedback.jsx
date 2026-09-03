import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// Native JS Date helpers
const format = (date, fmt) => {
  const d = new Date(date);
  if (fmt === 'dd MMM') return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  if (fmt === 'yyyyMMdd') return d.toISOString().split('T')[0].replace(/-/g, '');
  if (fmt === 'yyyy-MM-dd') return d.toISOString().split('T')[0];
  if (fmt === 'EEEE (dd MMM)') return d.toLocaleDateString('en-GB', { weekday: 'long' }) + ' (' + d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ')';
  return d.toISOString();
};

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const addDays = (d, days) => {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
};

export default function WeeklyMenuFeedback() {
  const { customer_id } = useParams();
  
  // Calculate weeks for the dropdown
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  
  const [menuPlans, setMenuPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ratings state: { [date_mealKey]: 1-5 }
  // mealKey = 'main1', 'main2', 'side1', 'side2', 'soup', 'dessert'
  const [ratings, setRatings] = useState({});
  const [bestPick, setBestPick] = useState('');
  const [worstPick, setWorstPick] = useState('');
  const [comment, setComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Generate current week, previous week, and next 2 weeks
    const today = new Date();
    const currentStart = getMonday(today); // Monday
    
    const wks = [];
    for (let i = -1; i <= 2; i++) {
      const start = addDays(currentStart, i * 7);
      const end = addDays(start, 4); // Mon to Fri (or Mon to Sun = 6) - BBD usually 5 days? Let's use 6 for Mon-Sun
      const endSun = addDays(start, 6);
      
      const label = `W${i === 0 ? ' (Current)' : ''} - ${format(start, 'dd MMM')} to ${format(endSun, 'dd MMM')}`;
      wks.push({
        id: `week_${format(start, 'yyyyMMdd')}`,
        label,
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(endSun, 'yyyy-MM-dd')
      });
    }
    setWeeks(wks);
    setSelectedWeek(wks[1]); // Default to current week
  }, []);

  useEffect(() => {
    if (!selectedWeek) return;
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/menu-plans?startDate=${selectedWeek.startDate}&endDate=${selectedWeek.endDate}`);
        if (res.ok) {
          const data = await res.json();
          setMenuPlans(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [selectedWeek]);

  const handleRating = (date, mealKey, val) => {
    setRatings(prev => ({ ...prev, [`${date}_${mealKey}`]: val }));
  };

  const getRating = (date, mealKey) => ratings[`${date}_${mealKey}`] || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(ratings).length === 0) {
      return toast.error('Please rate at least one item / အနည်းဆုံး တစ်ခုကို အမှတ်ပေးပါ');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/public/crm/menu-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id,
          week_name: selectedWeek.label,
          ratings_json: ratings,
          best_pick: bestPick,
          worst_pick: worstPick,
          comment
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit feedback');
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Error submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-xl border border-[#1A4331]/20">
          <div className="w-20 h-20 bg-[#1A4331] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-[#1A4331]/30">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-[#1A4331] mb-2">Thank You!</h2>
          <p className="text-slate-600 font-medium">Weekly Menu Feedback ဖြေဆိုပေးမှုအတွက် ကျေးဇူးတင်ပါသည်။</p>
        </div>
      </div>
    );
  }

  const renderRatingBoxes = (date, mealKey) => {
    const current = getRating(date, mealKey);
    return (
      <div className="flex gap-1.5 mt-2">
        {[1, 2, 3, 4, 5].map(val => (
          <button
            key={val}
            type="button"
            onClick={() => handleRating(date, mealKey, val)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm
              ${current === val 
                ? 'bg-[#1A4331] text-white ring-2 ring-[#1A4331] ring-offset-1' 
                : 'bg-[#F4F1EA] text-slate-500 hover:bg-[#1A4331]/20 border border-slate-200'}`}
          >
            {val}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-sans pb-20">
      {/* Header */}
      <header className="bg-[#1A4331] text-white pt-8 pb-16 px-4 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Weekly Menu Feedback</h1>
          <p className="text-[#F4F1EA]/80 font-medium text-sm">Please rate the dishes for this week</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Week Selector */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-100">
            <label className="block text-xs font-bold text-[#1A4331] uppercase tracking-wider mb-3">
              Select Week
            </label>
            <div className="relative">
              <select 
                value={selectedWeek?.id || ''}
                onChange={e => setSelectedWeek(weeks.find(w => w.id === e.target.value))}
                className="w-full appearance-none bg-[#7A1F1F] text-white font-bold rounded-xl px-5 py-4 focus:outline-none shadow-md shadow-[#7A1F1F]/20 cursor-pointer"
              >
                {weeks.map(w => (
                  <option key={w.id} value={w.id}>{w.label}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* Menu Plans */}
          {isLoading ? (
            <div className="text-center py-10 text-slate-500 font-medium animate-pulse">Loading menus...</div>
          ) : menuPlans.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-xl shadow-black/5 border border-slate-100">
              <span className="text-4xl mb-3 block">🍽️</span>
              <p className="text-slate-500 font-medium">No menu plan found for this week.</p>
            </div>
          ) : (
            menuPlans.map(plan => {
              const dayName = format(plan.date, 'EEEE (dd MMM)');
              return (
                <div key={plan.id} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/5 border border-slate-100 animate-fade-in-up">
                  <div className="bg-[#1A4331]/5 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-[#1A4331] text-lg">{dayName}</h3>
                    {plan.has_rice && <span className="bg-[#1A4331]/10 text-[#1A4331] text-xs font-extrabold px-3 py-1 rounded-full">{plan.has_rice}</span>}
                  </div>
                  <div className="p-6 space-y-6">
                    
                    {/* Main Dishes */}
                    {(plan.main_dish_1 || plan.main_dish_2) && (
                      <div className="space-y-4">
                        <div className="inline-block bg-[#F4F1EA] text-[#1A4331] text-xs font-bold px-3 py-1 rounded-lg">MAIN DISHES</div>
                        {plan.main_dish_1 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <span className="font-semibold text-slate-700">{plan.main_dish_1}</span>
                            {renderRatingBoxes(plan.date, 'main1')}
                          </div>
                        )}
                        {plan.main_dish_2 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <span className="font-semibold text-slate-700">{plan.main_dish_2}</span>
                            {renderRatingBoxes(plan.date, 'main2')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Side Dishes */}
                    {(plan.side_dish_1 || plan.side_dish_2) && (
                      <div className="space-y-4">
                        <div className="inline-block bg-[#F4F1EA] text-[#1A4331] text-xs font-bold px-3 py-1 rounded-lg">SIDE DISHES</div>
                        {plan.side_dish_1 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <span className="font-semibold text-slate-700">{plan.side_dish_1}</span>
                            {renderRatingBoxes(plan.date, 'side1')}
                          </div>
                        )}
                        {plan.side_dish_2 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <span className="font-semibold text-slate-700">{plan.side_dish_2}</span>
                            {renderRatingBoxes(plan.date, 'side2')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Soup & Dessert */}
                    {(plan.soup || plan.dessert) && (
                      <div className="space-y-4">
                        {plan.soup && (
                          <div>
                            <div className="inline-block bg-[#F4F1EA] text-[#1A4331] text-xs font-bold px-3 py-1 rounded-lg mb-2">SOUP</div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <span className="font-semibold text-slate-700">{plan.soup}</span>
                              {renderRatingBoxes(plan.date, 'soup')}
                            </div>
                          </div>
                        )}
                        {plan.dessert && (
                          <div className="pt-2">
                            <div className="inline-block bg-[#F4F1EA] text-[#1A4331] text-xs font-bold px-3 py-1 rounded-lg mb-2">DESSERT</div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                              <span className="font-semibold text-slate-700">{plan.dessert}</span>
                              {renderRatingBoxes(plan.date, 'dessert')}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}

          {/* Overall Comments */}
          {menuPlans.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-100 space-y-6">
              <h3 className="font-bold text-[#1A4331] text-lg border-b border-slate-100 pb-4">Overall Feedback</h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Best Pick (အကြိုက်ဆုံး ဟင်းလျာ)</label>
                <input 
                  type="text" 
                  value={bestPick} onChange={e => setBestPick(e.target.value)}
                  placeholder="e.g. ဝက်သားချဉ်စပ်"
                  className="w-full bg-[#F4F1EA] border border-transparent rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A4331] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Worst Pick (အဆိုးဆုံး ဟင်းလျာ)</label>
                <input 
                  type="text" 
                  value={worstPick} onChange={e => setWorstPick(e.target.value)}
                  placeholder="e.g. မုန်လာဥရည်"
                  className="w-full bg-[#F4F1EA] border border-transparent rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A4331] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Comments</label>
                <textarea 
                  rows="3"
                  value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="အခြား အကြံပြုလိုသည်များ..."
                  className="w-full bg-[#F4F1EA] border border-transparent rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A4331] transition-colors"
                />
              </div>
            </div>
          )}

          {menuPlans.length > 0 && (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all ${
                isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#7A1F1F] hover:bg-[#5C1616] hover:scale-[1.02] shadow-[#7A1F1F]/30'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Weekly Feedback'}
            </button>
          )}

        </form>
      </div>
    </div>
  );
}
