import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';

export default function MyProfile() {
  const { data, isLoading } = useQuery({ 
    queryKey: ['portal_data'], 
    queryFn: () => api.get('/portal').then(r => r.data) 
  });

  const emp = data?.emp || {};

  return (
    <Layout title="My Profile" subtitle="Your corporate identity and details">
      {isLoading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Identity Card */}
          <div className="md:col-span-1 rounded-2xl p-8 flex flex-col items-center text-center" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-xl border-4 border-[#121421]">
              {(emp.Full_name || 'U')[0]}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{emp.Full_name || 'Unknown Employee'}</h2>
            <p className="text-sm text-indigo-400 font-mono mb-6">{emp.employee_id || 'N/A'}</p>
            
            <div className="w-full space-y-3">
              <div className="bg-[#1e2235] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Department</p>
                <p className="text-sm text-white font-medium">{emp.dept_name || '—'}</p>
              </div>
              <div className="bg-[#1e2235] p-3 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Position</p>
                <p className="text-sm text-white font-medium">{emp.pos_title || '—'}</p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2 rounded-2xl p-8" style={{ background: '#161929', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><span>👤</span> Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Email Address</p>
                <p className="text-sm text-slate-300">{emp.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Phone Number</p>
                <p className="text-sm text-slate-300">{emp.phone_number || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Date of Birth</p>
                <p className="text-sm text-slate-300 font-mono">{emp.date_of_birth || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Gender</p>
                <p className="text-sm text-slate-300">{emp.gender || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Home Address</p>
                <p className="text-sm text-slate-300 leading-relaxed">{emp.address || '—'}</p>
              </div>
            </div>

            <hr className="my-8 border-white/5" />

            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><span>🏢</span> Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Date of Joining</p>
                <p className="text-sm text-slate-300 font-mono">{emp.date_of_joining || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">Employment Status</p>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${emp.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' : 'text-slate-400 bg-slate-400/10 border-slate-500/20'}`}>
                  {emp.status || 'Unknown'}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}
    </Layout>
  );
}
