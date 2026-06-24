import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PeerVotingForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nominee_id: '',
    attendance: 3,
    punctuality: 3,
    sops: 3,
    peer: 3,
    initiative: 3,
    comment: ''
  });

  const { data: colleagues, isLoading } = useQuery({ 
    queryKey: ['colleagues'], 
    queryFn: () => api.get('/employees').then(r => r.data) 
  });

  const voteMutation = useMutation({
    mutationFn: (body) => api.post('/peer-voting/submit', body),
    onSuccess: () => {
      alert('Thank you for voting!');
      navigate('/portal');
    },
    onError: (err) => alert(err.response?.data?.error || 'Failed to submit vote')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    voteMutation.mutate(formData);
  };

  const Slider = ({ label, name }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-semibold text-white">{label}</label>
        <span className="text-indigo-400 font-bold">{formData[name]} / 5</span>
      </div>
      <input 
        type="range" min="1" max="5" step="1" 
        value={formData[name]}
        onChange={e => setFormData({ ...formData, [name]: parseInt(e.target.value) })}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>Needs Improvement</span>
        <span>Excellent</span>
      </div>
    </div>
  );

  return (
    <Layout title="360-Degree Feedback" subtitle="Evaluate your peers">
      <div className="max-w-2xl mx-auto rounded-2xl p-6 md:p-8" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-8">
            <label className="form-label">Select Colleague</label>
            <select 
              required
              value={formData.nominee_id}
              onChange={e => setFormData({ ...formData, nominee_id: e.target.value })}
              className="form-input"
            >
              <option value="">Choose a colleague to evaluate...</option>
              {!isLoading && colleagues?.filter(c => c.id !== user.employee_id).map(c => (
                <option key={c.id} value={c.id}>{c.Full_name} ({c.employee_id})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Slider label="Attendance (Present & reliable)" name="attendance" />
            <Slider label="Punctuality (On time)" name="punctuality" />
            <Slider label="SOP Adherence (Follows procedures)" name="sops" />
            <Slider label="Peer Collaboration (Teamwork)" name="peer" />
            <Slider label="Initiative (Proactive)" name="initiative" />
          </div>

          <div className="mb-8">
            <label className="form-label">Constructive Comments (Optional)</label>
            <textarea 
              value={formData.comment}
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
              rows="3" 
              className="form-input"
              placeholder="What are they doing well? What could be improved?"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={voteMutation.isLoading}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
          >
            {voteMutation.isLoading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
