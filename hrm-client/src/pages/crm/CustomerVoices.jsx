import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { crmApi } from '../../api/crm';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CustomerVoices() {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('ALL'); // ALL, FEEDBACK, REQUEST, COMPLAIN
  const [activeOnly, setActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState({}); // { [customerId]: boolean }
  const [customerSubFilter, setCustomerSubFilter] = useState({}); // { [customerId]: 'ALL' | 'FEEDBACK' | 'REQUEST' | 'COMPLAIN' }
  const { user } = useAuth();

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getFeedbacks();
      setVoices(data || []);
    } catch (error) {
      console.error('[CustomerVoices]', error);
      toast.error('Failed to load customer voices');
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackDisplayInfo = (comment) => {
    let displayComment = comment || '';
    let type = 'FEEDBACK';
    let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

    if (displayComment.includes('[COMPLAIN]')) {
      type = 'COMPLAIN';
      badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    } else if (displayComment.includes('[REQUEST]')) {
      type = 'REQUEST';
      badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }

    displayComment = displayComment
      .replace(/\[GENERAL\]/g, '')
      .replace(/\[MENU\]/g, '')
      .replace(/\[FEEDBACK\]/g, '')
      .replace(/\[COMPLAIN\]/g, '')
      .replace(/\[REQUEST\]/g, '')
      .replace(/\[RESOLVED\]/g, '');

    if (comment && comment.includes('[GENERAL]')) {
      displayComment = displayComment.replace(/\[ဟင်းလျာ - .*?\]/g, '');
    }

    displayComment = displayComment.trim();

    return { type, displayComment, badgeColor };
  };

  // Group voices by Customer
  const groupedCustomers = useMemo(() => {
    const map = {};

    voices.forEach(v => {
      const custId = v.customer_id || v.customers?.id || 'unknown';
      const custName = v.customers?.full_name || 'Unknown Customer';
      const rawStatus = (v.customers?.status || v.customers?.customer_status || v.customers?.package_status || 'active').toLowerCase();
      const isActive = rawStatus !== 'inactive' && rawStatus !== 'archived' && rawStatus !== 'cancelled' && rawStatus !== 'expired';
      const phone = v.customers?.phone || v.customers?.phone_number || '';

      const { type, displayComment, badgeColor } = getFeedbackDisplayInfo(v.comment);
      const voiceItem = {
        ...v,
        type,
        displayComment,
        badgeColor,
      };

      if (!map[custId]) {
        map[custId] = {
          id: custId,
          name: custName,
          phone,
          status: rawStatus,
          isActive,
          voices: [],
          feedbackCount: 0,
          requestCount: 0,
          complainCount: 0,
          latestCreatedAt: v.created_at,
        };
      }

      map[custId].voices.push(voiceItem);

      if (type === 'FEEDBACK') map[custId].feedbackCount += 1;
      else if (type === 'REQUEST') map[custId].requestCount += 1;
      else if (type === 'COMPLAIN') map[custId].complainCount += 1;

      if (new Date(v.created_at) > new Date(map[custId].latestCreatedAt)) {
        map[custId].latestCreatedAt = v.created_at;
      }
    });

    // Convert map to array sorted by latest voice date
    return Object.values(map).sort((a, b) => new Date(b.latestCreatedAt) - new Date(a.latestCreatedAt));
  }, [voices]);

  // Filtered customer groups based on activeOnly, globalFilter, and searchQuery
  const filteredCustomerGroups = useMemo(() => {
    return groupedCustomers.filter(cust => {
      // 1. Active filter
      if (activeOnly && !cust.isActive) return false;

      // 2. Global category filter
      if (globalFilter !== 'ALL') {
        const matchesCategory = cust.voices.some(v => v.type === globalFilter);
        if (!matchesCategory) return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cust.name.toLowerCase().includes(q);
        const matchesPhone = cust.phone.toLowerCase().includes(q);
        const matchesContent = cust.voices.some(v => v.displayComment.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesContent) return false;
      }

      return true;
    });
  }, [groupedCustomers, activeOnly, globalFilter, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedCustomers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubFilterChange = (id, filterType) => {
    setCustomerSubFilter(prev => ({ ...prev, [id]: filterType }));
  };

  return (
    <Layout title="Customer Voices" subtitle="Centralized Customer-Centric View of Feedbacks, Requests, and Complaints">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center bg-surface-800 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {['ALL', 'FEEDBACK', 'REQUEST', 'COMPLAIN'].map(f => (
            <button
              key={f}
              onClick={() => setGlobalFilter(f)}
              className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                globalFilter === f
                  ? 'bg-surface-900 text-brand-green shadow border border-brand-green/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'ALL' ? 'ALL VOICES' : f}
            </button>
          ))}
        </div>

        {/* Search & Active Customers Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search customer name or comment..."
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

          {/* Active Customers Only Toggle */}
          <button
            onClick={() => setActiveOnly(!activeOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeOnly
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm'
                : 'bg-surface-800 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeOnly ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            Active Customers Only
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
            <span>Loading customer voices...</span>
          </div>
        ) : filteredCustomerGroups.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-surface-800 rounded-3xl border border-white/5 space-y-2">
            <p className="text-base font-bold text-slate-300">No customer voices found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or active customer toggle.</p>
          </div>
        ) : (
          filteredCustomerGroups.map(cust => {
            const isExpanded = !!expandedCustomers[cust.id];
            const activeSubFilter = customerSubFilter[cust.id] || 'ALL';

            // Filter customer voices based on global filter and internal sub-filter
            const displayVoices = cust.voices.filter(v => {
              if (globalFilter !== 'ALL' && v.type !== globalFilter) return false;
              if (activeSubFilter !== 'ALL' && v.type !== activeSubFilter) return false;
              return true;
            });

            return (
              <div
                key={cust.id}
                className="bg-surface-800 border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 hover:border-white/20"
              >
                {/* Header Card Row */}
                <div
                  onClick={() => toggleExpand(cust.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-surface-800 hover:bg-surface-700/50 transition-colors"
                >
                  {/* Left: Customer Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 text-sm flex-shrink-0 shadow-inner">
                      {cust.name[0]?.toUpperCase() || 'C'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/crm/customers/${cust.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-base text-white hover:text-brand-green transition-colors truncate"
                        >
                          {cust.name}
                        </Link>
                        {cust.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-400 border border-slate-600">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {cust.phone ? `📱 ${cust.phone}` : 'No phone listed'} • Total Voices: {cust.voices.length}
                      </p>
                    </div>
                  </div>

                  {/* Middle & Right: Summary Counters & Action */}
                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                    {/* Counter Badges */}
                    {cust.feedbackCount > 0 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        💬 {cust.feedbackCount} <span className="hidden md:inline">Feedback</span>
                      </span>
                    )}
                    {cust.requestCount > 0 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        📩 {cust.requestCount} <span className="hidden md:inline">Request</span>
                      </span>
                    )}
                    {cust.complainCount > 0 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        ⚠️ {cust.complainCount} <span className="hidden md:inline">Complain</span>
                      </span>
                    )}

                    {/* Latest Timestamp */}
                    <span className="text-[11px] text-slate-500 font-mono hidden lg:inline">
                      {new Date(cust.latestCreatedAt).toLocaleDateString()}
                    </span>

                    {/* Expand/Collapse Button */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                      <span>{isExpanded ? 'ခေါက်ရန်' : 'ဖြန့်ကြည့်ရန်'}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-green' : 'text-slate-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Voices Container */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/20 p-4 sm:p-6 space-y-4">
                    {/* Internal Sub-filter tabs */}
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Voices:</span>
                        {['ALL', 'FEEDBACK', 'REQUEST', 'COMPLAIN'].map(subFilter => (
                          <button
                            key={subFilter}
                            onClick={() => handleSubFilterChange(cust.id, subFilter)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              activeSubFilter === subFilter
                                ? 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {subFilter}
                          </button>
                        ))}
                      </div>

                      <span className="text-xs font-mono text-slate-500">
                        Showing {displayVoices.length} of {cust.voices.length}
                      </span>
                    </div>

                    {/* Voice Cards */}
                    <div className="space-y-3">
                      {displayVoices.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 text-xs italic bg-surface-900/50 rounded-xl border border-white/5">
                          No items match the selected sub-filter.
                        </div>
                      ) : (
                        displayVoices.map(voice => (
                          <div
                            key={voice.id}
                            className="p-4 rounded-xl border bg-surface-900/80 border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start justify-between gap-4"
                          >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                              voice.type === 'COMPLAIN' ? 'bg-rose-500' : voice.type === 'REQUEST' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}></div>

                            <div className="flex-1 pl-3">
                              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                <span className={`px-2.5 py-0.5 rounded-lg border font-black text-[10px] tracking-wider ${voice.badgeColor}`}>
                                  {voice.type}
                                </span>

                                {voice.rating > 0 && voice.rating !== null && (
                                  <span className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 text-amber-400 font-bold text-[11px]">
                                    {voice.rating}/5 ⭐
                                  </span>
                                )}

                                <span className="text-[11px] text-slate-500 font-mono">
                                  📅 {new Date(voice.created_at).toLocaleString()}
                                </span>
                              </div>

                              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                {voice.displayComment || <span className="text-slate-500 italic">No comments provided.</span>}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
}
