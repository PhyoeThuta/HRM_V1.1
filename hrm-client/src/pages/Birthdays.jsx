import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Birthdays() {
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { data, isLoading } = useQuery({ queryKey: ['birthdays'], queryFn: () => api.get('/birthdays').then(r => r.data) });

  const birthdays = data?.birthdays || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric' });
  };

  const filteredBirthdays = birthdays.filter(b => b.birth_month === selectedMonth);
  const selectedMonthName = MONTHS[selectedMonth - 1];

  return (
    <Layout title="Upcoming Birthdays" subtitle="Celebrate with your colleagues">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Month Tabs */}
      <div className="mb-10">
        <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar snap-x">
          {MONTHS.map((month, index) => (
            <button
              key={index}
              onClick={() => setSelectedMonth(index + 1)}
              className={`snap-center px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ease-out ${
                selectedMonth === index + 1
                  ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105'
                  : 'bg-[#1e2235] text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-12">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium tracking-wider animate-pulse">Loading Birthdays...</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{selectedMonthName} Babies</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            {filteredBirthdays.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBirthdays.map((b, i) => (
                  <div key={i} className="rounded-3xl p-6 text-center relative overflow-hidden group backdrop-blur-xl bg-[#1a1e2f] border border-white/5 hover:border-pink-500/30 transition-all duration-500 cursor-default shadow-xl">
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-500/0 via-pink-500/0 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Top edge glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Avatar Initials */}
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.2)] mb-5 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-500">
                      <span className="text-4xl font-black text-white tracking-tighter drop-shadow-md">{getInitials(b.Full_name)}</span>
                    </div>
                    
                    {/* Info */}
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10 group-hover:text-pink-300 transition-colors line-clamp-1">{b.Full_name}</h3>
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/20 border border-white/5 group-hover:bg-pink-500/10 group-hover:border-pink-500/20 transition-all duration-300">
                      <span className="text-sm font-semibold text-amber-400 relative z-10">{selectedMonthName} {formatDate(b.date_of_birth)}</span>
                      <span className="text-sm animate-bounce inline-block" style={{ animationDuration: '2s' }}>🎉</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#1a1e2f]/50 rounded-3xl border border-white/5 border-dashed">
                <div className="text-6xl mb-6 opacity-30 grayscale filter">🎈</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Birthdays This Month</h3>
                <p className="text-slate-400 max-w-sm">Looks like there are no upcoming celebrations scheduled for {selectedMonthName}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
