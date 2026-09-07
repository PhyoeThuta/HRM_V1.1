import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api/client';

export default function DailyFeedback() {
  const { customer_id } = useParams();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  
  // Array of { menu_id, dish_name_en, dish_name_mm, meal_type, rating, comment }
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!customer_id || !date) {
      setError('Invalid Link. Missing customer ID or date.');
      setLoading(false);
      return;
    }

    api.get(`/daily-feedback/${customer_id}?date=${date}`)
      .then(res => {
        if (res.data.alreadySubmitted) {
          setError('You have already submitted feedback for this date. Thank you! 🙏');
          setLoading(false);
          return;
        }

        setData(res.data);
        
        // Initialize feedback array
        const initialFeedbacks = [];
        res.data.menus?.forEach(dm => {
          dm.menu_types?.forEach(mt => {
            if (mt.menus) {
              initialFeedbacks.push({
                menu_id: mt.menus.id,
                dish_name_en: mt.menus.name_en,
                dish_name_mm: mt.menus.name_mm,
                meal_type: dm.meal_type,
                rating: 0,
                comment: ''
              });
            }
          });
        });
        setFeedbacks(initialFeedbacks);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load menu details.');
        setLoading(false);
      });
  }, [customer_id, date]);

  const updateFeedback = (index, field, value) => {
    const updated = [...feedbacks];
    updated[index][field] = value;
    setFeedbacks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one rating was given
    const hasRated = feedbacks.some(f => f.rating > 0);
    if (!hasRated) {
      return toast.error('Please provide at least one rating before submitting.');
    }

    setIsSubmitting(true);
    try {
      await api.post('/daily-feedback', {
        customer_id,
        date,
        feedbacks: feedbacks.filter(f => f.rating > 0) // only submit rated items
      });
      toast.success('Feedback submitted successfully!');
      setTimeout(() => {
        window.location.reload(); // Reload will show the "already submitted" message
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit feedback.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ℹ️
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Notice</h2>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Daily Menu Feedback</h1>
          <p className="text-slate-500 font-medium">How was your meal on {new Date(date).toLocaleDateString()}?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {feedbacks.map((fb, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-1 rounded-md mb-2 inline-block ${fb.meal_type === 'LUNCH' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {fb.meal_type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{fb.dish_name_en}</h3>
                  {fb.dish_name_mm && <p className="text-sm text-slate-500">{fb.dish_name_mm}</p>}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-bold text-slate-700 mb-2">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateFeedback(index, 'rating', star)}
                      className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${fb.rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Comments (Optional)</label>
                <textarea
                  value={fb.comment}
                  onChange={(e) => updateFeedback(index, 'comment', e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-20"
                ></textarea>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          Your feedback helps us continuously improve our quality and service.
        </p>
      </div>
    </div>
  );
}
