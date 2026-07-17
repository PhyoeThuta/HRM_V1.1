import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Birthdays() {
  const { data, isLoading } = useQuery({ queryKey: ['birthdays'], queryFn: () => api.get('/birthdays').then(r => r.data) });

  const birthdays = data?.birthdays || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric' });
  };

  const groupedBirthdays = MONTHS.map((monthName, index) => {
    const monthNum = index + 1;
    return {
      monthName,
      people: birthdays.filter(b => b.birth_month === monthNum)
    };
  });

  return (
    <Layout title="Upcoming Birthdays" subtitle="Celebrate with your colleagues">
      <div className="space-y-10 pb-10">
        {isLoading ? (
          <div className="py-10 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block" /></div>
        ) : (
          groupedBirthdays.map(group => (
            <div key={group.monthName}>
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">{group.monthName}</h2>
              {group.people.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {group.people.map((b, i) => (
                    <div key={i} className="rounded-2xl p-5 text-center relative overflow-hidden group" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-colors" />
                      <div className="text-4xl mb-3 relative z-10">🎂</div>
                      <h3 className="text-lg font-bold text-white mb-1 relative z-10">{b.Full_name}</h3>
                      <p className="text-sm font-semibold text-pink-400 relative z-10">{group.monthName} {formatDate(b.date_of_birth)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">No birthdays in {group.monthName}</p>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
