import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create a custom axios instance for public APIs without intercepting for auth
const publicApi = axios.create({
  baseURL: '/api/public',
});

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    candidate_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume: null
  });

  const { data: jobs, isLoading } = useQuery({ 
    queryKey: ['public-jobs'], 
    queryFn: () => publicApi.get('/jobs').then(r => r.data.jobs) 
  });

  const applyMutation = useMutation({
    mutationFn: (body) => publicApi.post('/apply', body).then(r => r.data),
    onSuccess: () => {
      toast.success('Application submitted successfully! We will be in touch.');
      setSelectedJob(null);
      setFormData({ candidate_name: '', email: '', phone: '', cover_letter: '' });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to submit application')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('position_id', selectedJob.id);
    fd.append('candidate_name', formData.candidate_name);
    fd.append('email', formData.email);
    fd.append('phone', formData.phone);
    fd.append('cover_letter', formData.cover_letter);
    if (formData.resume) {
      fd.append('resume', formData.resume);
    }
    
    applyMutation.mutate(fd);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-300 font-sans">
      <header className="bg-[rgb(var(--color-surface-850))] border-b border-white/10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">C</div>
          <span className="text-xl font-bold text-white tracking-tight">Busy Boss Diet Careers</span>
        </div>
        <a href="/login" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">Employee Login</a>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Join Our Team</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We're always looking for talented individuals to join us. Explore our open positions and find the perfect role for your skills and passion.
          </p>
        </div>

        {selectedJob ? (
          <div className="bg-[rgb(var(--color-surface-800))] p-8 rounded-2xl border border-white/5 relative">
            <button 
              onClick={() => setSelectedJob(null)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
            <h2 className="text-2xl font-bold text-white mb-2">Apply for {selectedJob.title}</h2>
            <p className="text-indigo-400 mb-8">{selectedJob.department_name}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Full Name *</label>
                  <input required type="text" value={formData.candidate_name} onChange={e => setFormData({...formData, candidate_name: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Upload Resume (PDF/Word)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={e => setFormData({...formData, resume: e.target.files[0]})} 
                  className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-400 hover:file:bg-indigo-500/30" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Cover Letter / Notes</label>
                <textarea rows="5" value={formData.cover_letter} onChange={e => setFormData({...formData, cover_letter: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5" placeholder="Tell us why you're a great fit..."></textarea>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setSelectedJob(null)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={applyMutation.isPending} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? <p>Loading jobs...</p> : jobs?.length === 0 ? (
              <p className="col-span-full text-center py-12 text-slate-500 text-lg">No open positions at the moment. Please check back later!</p>
            ) : (
              jobs?.map(job => (
                <div key={job.id} className="bg-[rgb(var(--color-surface-800))] p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-colors flex flex-col h-full">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full">{job.department_name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{job.description || 'Join our dynamic team and help us build amazing things.'}</p>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors"
                  >
                    Apply Now →
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
