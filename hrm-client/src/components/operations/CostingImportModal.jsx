import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function CostingImportModal({ isOpen, onClose, onSuccess }) {
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
      const res = await api.post('/operations/import-costing', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Success! Created ${res.data.menusCreated} menus, ${res.data.itemsCreated} ingredients, ${res.data.recipesCreated} recipes.`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to import Costing Excel');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📥</span> Import Costing Excel
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">✕</button>
        </div>
        
        <form onSubmit={handleUpload} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Select Costing Excel File (.xlsx)</label>
            <input 
              type="file" 
              ref={fileInputRef}
              accept=".xlsx,.xls"
              className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-primary"
            />
            <p className="text-xs text-slate-400 mt-2">
              Note: The file must follow the standard Costing format with Title rows containing menu names and ingredients below them.
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
              className="px-6 py-3 bg-brand-primary hover:brightness-110 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isUploading ? 'Importing...' : 'Upload & Import'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
