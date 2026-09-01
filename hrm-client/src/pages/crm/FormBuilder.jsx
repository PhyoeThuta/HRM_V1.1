import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { toast } from 'react-hot-toast';

export default function FormBuilder() {
  const [schema, setSchema] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New field state
  const [newField, setNewField] = useState({ id: '', type: 'text', label: '', required: false, options: '' });

  useEffect(() => {
    fetchFormSettings();
  }, []);

  const fetchFormSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/crm/settings/form', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchema(data.schema || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load form settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/crm/settings/form', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema })
      });
      if (res.ok) {
        toast.success('Form settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const addField = () => {
    if (!newField.id || !newField.label) {
      toast.error('Field ID and Label are required');
      return;
    }
    // Prevent duplicate IDs
    if (schema.find(f => f.id === newField.id)) {
      toast.error('Field ID must be unique');
      return;
    }

    const fieldToAdd = { ...newField };
    if (fieldToAdd.type === 'dropdown') {
      fieldToAdd.options = fieldToAdd.options.split(',').map(o => o.trim()).filter(Boolean);
    } else {
      delete fieldToAdd.options;
    }

    setSchema([...schema, fieldToAdd]);
    setNewField({ id: '', type: 'text', label: '', required: false, options: '' });
  };

  const removeField = (id) => {
    setSchema(schema.filter(f => f.id !== id));
  };

  const moveField = (index, direction) => {
    const newSchema = [...schema];
    if (direction === 'up' && index > 0) {
      [newSchema[index - 1], newSchema[index]] = [newSchema[index], newSchema[index - 1]];
    } else if (direction === 'down' && index < newSchema.length - 1) {
      [newSchema[index + 1], newSchema[index]] = [newSchema[index], newSchema[index + 1]];
    }
    setSchema(newSchema);
  };

  return (
    <Layout title="Dynamic Form Builder">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">Form Builder</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Design the Customer Enrollment Form.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-brand-green hover:bg-emerald-500 text-black font-black rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Form Schema'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Preview / Active Fields */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Active Fields</h2>
              {schema.length === 0 && <p className="text-slate-500">No fields added yet.</p>}
              
              {schema.map((field, index) => (
                <div key={field.id} className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 dark:text-white">{field.label}</span>
                      {field.required && <span className="text-xs bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full font-bold">Required</span>}
                      <span className="text-xs bg-slate-200 dark:bg-surface-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{field.type}</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">ID: {field.id}</div>
                    {field.type === 'dropdown' && (
                      <div className="text-xs text-slate-400 mt-1">Options: {field.options?.join(', ')}</div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-2 hover:bg-slate-100 dark:hover:bg-surface-900 rounded-lg disabled:opacity-30">
                      ↑
                    </button>
                    <button onClick={() => moveField(index, 'down')} disabled={index === schema.length - 1} className="p-2 hover:bg-slate-100 dark:hover:bg-surface-900 rounded-lg disabled:opacity-30">
                      ↓
                    </button>
                    <button onClick={() => removeField(field.id)} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Field Sidebar */}
            <div className="bg-slate-50 dark:bg-surface-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add New Field</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Field ID</label>
                  <input 
                    type="text" 
                    value={newField.id} 
                    onChange={e => setNewField({...newField, id: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    placeholder="e.g. first_name"
                    className="w-full bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-1">Unique identifier (no spaces)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Label</label>
                  <input 
                    type="text" 
                    value={newField.label} 
                    onChange={e => setNewField({...newField, label: e.target.value})}
                    placeholder="e.g. First Name"
                    className="w-full bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Input Type</label>
                  <select 
                    value={newField.type} 
                    onChange={e => setNewField({...newField, type: e.target.value})}
                    className="w-full bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none transition-colors"
                  >
                    <option value="text">Text (Short)</option>
                    <option value="textarea">Textarea (Long)</option>
                    <option value="number">Number</option>
                    <option value="dropdown">Dropdown (Select)</option>
                    <option value="checkbox">Checkbox (Boolean)</option>
                  </select>
                </div>

                {newField.type === 'dropdown' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Options (Comma separated)</label>
                    <input 
                      type="text" 
                      value={newField.options} 
                      onChange={e => setNewField({...newField, options: e.target.value})}
                      placeholder="Low, Medium, High"
                      className="w-full bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="required"
                    checked={newField.required} 
                    onChange={e => setNewField({...newField, required: e.target.checked})}
                    className="w-4 h-4 text-brand-green bg-surface-800 border-white/10 rounded focus:ring-brand-green focus:ring-offset-surface-900"
                  />
                  <label htmlFor="required" className="text-sm font-medium text-slate-700 dark:text-slate-300">Required Field</label>
                </div>

                <button 
                  onClick={addField}
                  className="w-full py-3 mt-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-colors"
                >
                  + Add Field
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
