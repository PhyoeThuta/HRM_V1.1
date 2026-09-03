import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import OpsNavBar from './OpsNavBar';
import api from '../../api/client';
import { format, parseISO } from 'date-fns';

export default function MonthlyPlan() {
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['menu-plans'],
    queryFn: () => api.get('/operations/menu-plans').then(res => { console.log('QUERY SUCCESS:', res.data); return res.data; }).catch(err => { console.error('QUERY ERROR:', err); throw err; })
  });

  return (
    <Layout title="Operations Hub" subtitle="View Monthly Menu Plan">
      <OpsNavBar />
      
      <div className="bg-surface-800 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-surface-900/50">
          <h2 className="text-xl font-bold text-emerald-400">Monthly Menu Plan</h2>
          <p className="text-sm text-slate-400 mt-1">Uploaded from Costing Excel</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-900/30 text-xs uppercase tracking-widest text-slate-400 border-b border-white/5">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Main Dish 1</th>
                <th className="px-6 py-4 font-bold">Main Dish 2</th>
                <th className="px-6 py-4 font-bold">Side Dish 1</th>
                <th className="px-6 py-4 font-bold">Side Dish 2</th>
                <th className="px-6 py-4 font-bold">Soup</th>
                <th className="px-6 py-4 font-bold">Dessert</th>
                <th className="px-6 py-4 font-bold">Rice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-slate-500">Loading plan...</td></tr>
              ) : error ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-rose-500">Error: {error.message}</td></tr>
              ) : plans?.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-slate-500">No menu plans uploaded yet. Go to Menus & Recipes to upload.</td></tr>
              ) : plans?.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                    {p.date ? format(parseISO(p.date), 'dd MMM yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 text-emerald-300 font-bold">{p.main_dish_1 || '-'}</td>
                  <td className="px-6 py-4 text-amber-300 font-bold">{p.main_dish_2 || '-'}</td>
                  <td className="px-6 py-4 text-indigo-300">{p.side_dish_1 || '-'}</td>
                  <td className="px-6 py-4 text-indigo-300">{p.side_dish_2 || '-'}</td>
                  <td className="px-6 py-4 text-rose-300">{p.soup || '-'}</td>
                  <td className="px-6 py-4 text-fuchsia-300">{p.dessert || '-'}</td>
                  <td className="px-6 py-4">
                    {p.has_rice ? (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-bold uppercase tracking-wider">
                        {p.has_rice}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
