import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function WeeklyFeedbacks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, DAILY, WEEKLY

  const { data: rawFeedbacks = [], isLoading } = useQuery({
    queryKey: ['crm_weekly_feedbacks'],
    queryFn: () => api.get('/crm/weekly-feedbacks').then(res => res.data)
  });

  // Calculate ML Metrics & Analytics
  const analytics = useMemo(() => {
    let totalRatingsSum = 0;
    let totalRatedItems = 0;
    const dishScores = {}; // { dishName: { sum: number, count: number } }

    rawFeedbacks.forEach(item => {
      // 1. Process daily feedback items
      if (item.feedback_type === 'DAILY') {
        const dish = item.dish_name_en || item.dish_name_mm || 'Unknown Dish';
        const rating = Number(item.rating) || 0;
        if (rating > 0) {
          totalRatingsSum += rating;
          totalRatedItems += 1;
          if (!dishScores[dish]) dishScores[dish] = { sum: 0, count: 0 };
          dishScores[dish].sum += rating;
          dishScores[dish].count += 1;
        }
      }
      // 2. Process weekly feedback items
      else if (item.ratings_json) {
        Object.entries(item.ratings_json).forEach(([key, rating]) => {
          const numRating = Number(rating) || 0;
          if (numRating > 0) {
            totalRatingsSum += numRating;
            totalRatedItems += 1;
            const dishName = key.replace(/_[0-9]+/g, '').replace(/_/g, ' ').toUpperCase();
            if (!dishScores[dishName]) dishScores[dishName] = { sum: 0, count: 0 };
            dishScores[dishName].sum += numRating;
            dishScores[dishName].count += 1;
          }
        });
      }
    });

    const avgRating = totalRatedItems > 0 ? (totalRatingsSum / totalRatedItems).toFixed(1) : '0.0';

    // Top rated dishes (count >= 1, sorted by avg)
    const topDishes = Object.entries(dishScores)
      .map(([name, stat]) => ({ name, avg: (stat.sum / stat.count).toFixed(1), count: stat.count }))
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 3);

    return {
      totalSubmissions: rawFeedbacks.length,
      avgRating,
      topDishes,
    };
  }, [rawFeedbacks]);

  // Filter feedbacks
  const filteredFeedbacks = useMemo(() => {
    return rawFeedbacks.filter(item => {
      if (filterType === 'DAILY' && item.feedback_type !== 'DAILY') return false;
      if (filterType === 'WEEKLY' && item.feedback_type !== 'WEEKLY') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const custName = (item.customers?.full_name || '').toLowerCase();
        const dishName = (item.dish_name_en || item.dish_name_mm || item.best_pick || '').toLowerCase();
        const comment = (item.comment || '').toLowerCase();
        if (!custName.includes(q) && !dishName.includes(q) && !comment.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [rawFeedbacks, filterType, searchQuery]);

  // Export Dataset for Machine Learning (ML)
  const handleExportMLDataset = () => {
    if (rawFeedbacks.length === 0) {
      return toast.error('No feedback data available to export.');
    }

    const dataset = rawFeedbacks.map(fb => ({
      dataset_id: fb.id,
      feedback_type: fb.feedback_type,
      customer_id: fb.customer_id,
      customer_name: fb.customers?.full_name || 'Anonymous',
      date: fb.date || fb.created_at,
      meal_type: fb.meal_type || 'GENERAL',
      dish_name_en: fb.dish_name_en || fb.best_pick || null,
      dish_name_mm: fb.dish_name_mm || null,
      rating: fb.rating || null,
      comment: fb.comment || null,
      best_pick: fb.best_pick || null,
      worst_pick: fb.worst_pick || null,
      created_at: fb.created_at,
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataset, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `bbd_menu_feedback_ml_dataset_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success('ML Dataset exported successfully (JSON format)! 🤖📊');
  };

  return (
    <Layout title="Daily Menu Feedback & Taste Analytics" subtitle="Customer dish ratings, taste adjustments, and ML dataset analytics">
      {/* Back link */}
      <div className="mb-6 flex justify-between items-center">
        <Link to="/crm/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
          ← Back to CRM Dashboard
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={`/daily-feedback/demo-customer-01?date=${new Date().toISOString().split('T')[0]}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-all border border-amber-500/30 flex items-center gap-2"
          >
            <span>📝 Test Daily Feedback Form</span>
          </a>

          {/* ML Export Button */}
          <button
            onClick={handleExportMLDataset}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 border border-indigo-400/30"
          >
            <span>🤖 Export ML Dataset (JSON)</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-surface-800 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
            📊
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-black text-white">{analytics.totalSubmissions}</p>
          </div>
        </div>

        <div className="bg-surface-800 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
            ⭐
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Dish Rating</p>
            <p className="text-2xl font-black text-amber-400">{analytics.avgRating} <span className="text-sm font-medium text-slate-500">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-surface-800 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold">
            🏆
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Rated Dish</p>
            <p className="text-base font-bold text-white truncate">
              {analytics.topDishes[0]?.name || 'No data yet'}
            </p>
            {analytics.topDishes[0] && (
              <p className="text-[11px] text-emerald-400 font-semibold">{analytics.topDishes[0].avg} ⭐ rating average</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex bg-surface-800 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {['ALL', 'DAILY', 'WEEKLY'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterType === t
                  ? 'bg-surface-900 text-brand-green shadow border border-brand-green/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'ALL' ? 'ALL FEEDBACKS' : t === 'DAILY' ? 'DAILY MEAL FEEDBACKS' : 'WEEKLY REVIEWS'}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search customer, dish name, or comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-slate-500 hover:text-white text-xs">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            <span>Loading daily menu feedbacks...</span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-surface-800 rounded-3xl border border-white/5 space-y-2">
            <p className="text-base font-bold text-slate-300">No feedbacks found</p>
            <p className="text-xs text-slate-500">Try clearing search or changing category filter.</p>
          </div>
        ) : (
          filteredFeedbacks.map(fb => (
            <div key={fb.id} className="bg-surface-800 rounded-2xl p-5 border border-white/10 shadow-lg relative overflow-hidden space-y-3">
              {/* Type Accent Strip */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${fb.feedback_type === 'DAILY' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>

              <div className="pl-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                    fb.feedback_type === 'DAILY' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {fb.feedback_type === 'DAILY' ? 'DAILY MEAL' : 'WEEKLY REVIEW'}
                  </span>
                  
                  <Link to={`/crm/customers/${fb.customer_id}`} className="font-bold text-white hover:text-brand-green transition-colors text-sm">
                    {fb.customers?.full_name || 'Anonymous Customer'}
                  </Link>

                  {fb.customers?.phone && (
                    <span className="text-xs text-slate-500 font-mono hidden md:inline">
                      📱 {fb.customers.phone}
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  📅 {new Date(fb.date || fb.created_at).toLocaleString()}
                </span>
              </div>

              {/* Feedback Item Details */}
              <div className="pl-3">
                {fb.feedback_type === 'DAILY' ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${fb.meal_type === 'LUNCH' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                          {fb.meal_type || 'MEAL'}
                        </span>
                        <h4 className="text-base font-bold text-white">{fb.dish_name_en}</h4>
                        {fb.dish_name_mm && <span className="text-xs text-slate-400">({fb.dish_name_mm})</span>}
                      </div>

                      {fb.comment && (
                        <p className="text-xs text-slate-300 bg-surface-900/60 p-3 rounded-xl border border-white/5 font-medium mt-2">
                          "{fb.comment}"
                        </p>
                      )}
                    </div>

                    {/* Rating Badge */}
                    {fb.rating > 0 && (
                      <div className="flex items-center gap-1.5 bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-400 font-black text-sm flex-shrink-0 self-start md:self-center">
                        <span>{fb.rating}/5</span>
                        <span>⭐</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Weekly Review Details */
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-bold text-emerald-400">{fb.week_name || 'Weekly Review'}</h4>
                      <div className="flex gap-4 text-xs">
                        {fb.best_pick && <div><span className="text-slate-400">Best Pick:</span> <span className="text-emerald-300 font-bold">{fb.best_pick}</span></div>}
                        {fb.worst_pick && <div><span className="text-slate-400">Worst Pick:</span> <span className="text-rose-300 font-bold">{fb.worst_pick}</span></div>}
                      </div>
                    </div>

                    {fb.ratings_json && Object.keys(fb.ratings_json).length > 0 && (
                      <div className="bg-surface-900/60 rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 gap-3 border border-white/5">
                        {Object.entries(fb.ratings_json).map(([key, rating]) => (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 truncate">{key.replace(/_/g, ' ')}</span>
                            <span className="font-bold text-amber-400">{rating}/5 ⭐</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {fb.comment && (
                      <p className="text-xs text-slate-300 bg-surface-900/60 p-3 rounded-xl border border-white/5 italic">
                        "{fb.comment}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
