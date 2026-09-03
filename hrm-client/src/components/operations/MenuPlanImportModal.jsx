import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function MenuPlanImportModal({ isOpen, onClose, onSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return toast.error('Please select an Excel file');

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await api.post('/operations/import-menu-plan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Success! Imported ${res.data.count} days of menu plans.`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to import Menu Plan Excel');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up">
        <div className="p-6 border-b border-emerald-500/30 flex justify-between items-center bg-emerald-900/20">
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span>📅</span> Import Monthly Menu Plan
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">✕</button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Select Menu Plan Excel File (.xlsx)</label>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".xlsx,.xls"
              className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Note: The file must follow the Daily Menu Schedule format (Date, Main Dish, Side Dish, Dessert, Soup, Rice).
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 bg-surface-700 hover:bg-surface-600 text-slate-300 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isUploading ? 'Importing...' : 'Upload & Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
