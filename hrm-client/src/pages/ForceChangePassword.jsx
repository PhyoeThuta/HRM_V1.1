import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function ForceChangePassword() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If user doesn't need to change password, redirect to portal
  if (!user?.must_change_password) {
    navigate('/portal', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      
      toast.success("Password changed successfully!");
      // Update local context to remove the flag
      updateUser({ must_change_password: false });
      
      // Redirect to dashboard
      navigate('/portal', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgb(var(--color-surface-850))] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-rose-500/20">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Change Password Required</h1>
          <p className="text-sm text-slate-400">
            For security reasons, you must change your default password before accessing the system.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">Current Password</label>
            <input 
              type="password" 
              required
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter your current default password"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-[rgb(var(--color-surface-800))] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Retype new password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
          >
            {loading ? 'Updating...' : 'Update Password & Continue 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
