import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '../../api/crm';
import Layout from '../../components/layout/Layout';
import toast from 'react-hot-toast';

export default function LevelSettings() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  const [formData, setFormData] = useState({
    level_name: '',
    required_purchases: 1,
    color: 'blue'
  });

  const { data: levelSettings, isLoading } = useQuery({
    queryKey: ['levelSettings'],
    queryFn: crmApi.getLevelSettings,
  });

  const saveMutation = useMutation({
    mutationFn: crmApi.saveLevelSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levelSettings'] });
      toast.success('Level setting saved successfully');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to save setting');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: crmApi.deleteLevelSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levelSettings'] });
      toast.success('Level setting deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete setting');
    }
  });

  const openModal = (setting = null) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData({
        level_name: setting.level_name,
        required_purchases: setting.required_purchases,
        color: setting.color || 'blue'
      });
    } else {
      setEditingSetting(null);
      setFormData({ level_name: '', required_purchases: 1, color: 'blue' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSetting(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.level_name) {
      return toast.error('Level name is required');
    }
    saveMutation.mutate({
      id: editingSetting?.id,
      ...formData
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this level setting?')) {
      deleteMutation.mutate(id);
    }
  };

  const colors = [
    { name: 'Blue', value: 'blue', classes: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Green', value: 'green', classes: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { name: 'Purple', value: 'purple', classes: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { name: 'Amber', value: 'amber', classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { name: 'Rose', value: 'rose', classes: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    { name: 'Slate', value: 'slate', classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
  ];

  if (isLoading) return <Layout><div className="p-8 text-slate-400">Loading settings...</div></Layout>;

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Level Settings</h1>
            <p className="text-sm text-slate-400 mt-1">Configure automatic level upgrades based on purchase counts.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-xl hover:bg-brand-green hover:text-black transition-all flex items-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Level
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelSettings?.map((setting) => {
            const colorObj = colors.find(c => c.value === setting.color) || colors[0];
            return (
              <div key={setting.id} className="p-5 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm relative group">
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(setting)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(setting.id)} className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${colorObj.classes}`}>
                    {setting.level_name}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Target to Unlock</p>
                  <p className="text-2xl font-bold text-white">{setting.required_purchases} <span className="text-sm font-medium text-slate-400">packages</span></p>
                </div>
              </div>
            );
          })}
          {(!levelSettings || levelSettings.length === 0) && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              No level settings configured. Add your first level to start classifying customers!
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f1120] border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingSetting ? 'Edit Level' : 'Add New Level'}
              </h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Level Name</label>
                <input
                  type="text"
                  required
                  value={formData.level_name}
                  onChange={(e) => setFormData({ ...formData, level_name: e.target.value })}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                  placeholder="e.g., Level 1, VIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Required Purchases</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.required_purchases}
                  onChange={(e) => setFormData({ ...formData, required_purchases: e.target.value })}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50"
                />
                <p className="text-xs text-slate-500 mt-1">Number of total packages a customer must buy to reach this level.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Badge Color</label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c.value })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === c.value ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: 
                          c.value === 'blue' ? '#3b82f6' : 
                          c.value === 'green' ? '#22c55e' : 
                          c.value === 'purple' ? '#a855f7' : 
                          c.value === 'amber' ? '#f59e0b' : 
                          c.value === 'rose' ? '#f43f5e' : '#64748b'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isLoading}
                  className="px-6 py-2 bg-brand-green text-black text-sm font-semibold rounded-xl hover:bg-[#b5cc22] transition-colors disabled:opacity-50"
                >
                  {saveMutation.isLoading ? 'Saving...' : 'Save Setting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
