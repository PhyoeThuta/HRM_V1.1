import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isBoss } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [customer, setCustomer] = useState(null);
  
  // Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [deletePackageId, setDeletePackageId] = useState(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [photoForm, setPhotoForm] = useState({ type: 'Before', url: '' });
  const [packageForm, setPackageForm] = useState({ 
    name: '1 Month Boss Diet', 
    duration: '30 Days', 
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days but editable
    meal_count: 60, 
    meal_type: 'LUNCH, DINNER' 
  });
  const [metricsForm, setMetricsForm] = useState({
    current_weight: '',
    goal_weight: '',
    height: '',
    medical_condition: '',
    allergies: ''
  });

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await crmApi.getCustomer(id);
        setCustomer(data);
        // Pre-fill metrics form from DB health data
        if (data.health) {
          setMetricsForm({
            current_weight: data.health.current_weight || '',
            goal_weight: data.health.goal_weight || '',
            height: data.health.height || '',
            medical_condition: data.health.medical_condition || '',
            allergies: data.health.allergies || ''
          });
        }
      } catch (e) {
        toast.error('Failed to load customer profile');
        console.error(e);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleAssignPackage = async (e) => {
    e.preventDefault();
    try {
      if (editingPackageId) {
        const updatedPkg = await crmApi.updateAssignedPackage(editingPackageId, packageForm);
        setCustomer(prev => ({
          ...prev,
          packages_list: (prev.packages_list || []).map(p => p.id === editingPackageId ? updatedPkg : p)
        }));
        toast.success('Package updated successfully!');
      } else {
        const newPkg = await crmApi.assignPackage(id, packageForm);
        setCustomer(prev => ({ ...prev, packages_list: [newPkg, ...(prev.packages_list || [])] }));
        toast.success('Package successfully assigned!');
      }
      setShowPackageModal(false);
      setEditingPackageId(null);
    } catch (err) {
      toast.error('Failed to save package');
      console.error(err);
    }
  };

  const openAddPackage = () => {
    setEditingPackageId(null);
    setPackageForm({
      name: '1 Month Boss Diet', 
      duration: '30 Days', 
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      meal_count: 60, 
      meal_type: 'LUNCH, DINNER'
    });
    setShowPackageModal(true);
  };

  const openEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      name: pkg.name,
      duration: pkg.duration,
      expires_at: pkg.expires_at,
      meal_count: pkg.meal_count,
      meal_type: pkg.meal_type
    });
    setShowPackageModal(true);
  };

  const confirmDeletePackage = async () => {
    if (!deletePackageId) return;
    try {
      await crmApi.deleteAssignedPackage(deletePackageId);
      setCustomer(prev => ({
        ...prev,
        packages_list: (prev.packages_list || []).filter(p => p.id !== deletePackageId)
      }));
      setDeletePackageId(null);
      toast.success('Package deleted successfully');
    } catch (err) {
      toast.error('Failed to delete package');
      console.error(err);
    }
  };

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    try {
      await crmApi.updateHealth(id, metricsForm);
      setCustomer(prev => ({ ...prev, health: { ...prev.health, ...metricsForm } }));
      setShowMetricsModal(false);
      toast.success('Health & Metrics updated successfully!');
    } catch (err) {
      toast.error('Failed to update metrics');
      console.error(err);
    }
  };

  const calculateBMI = () => {
    // Basic calculation if height is cm and weight is lb or kg. Assuming height cm, weight kg for BMI.
    // If user inputs lbs, we should ideally convert, but for simplicity let's just do standard metric BMI if possible.
    // Let's assume height is in cm (e.g. 170) and weight is in lbs (e.g. 150).
    const weightVal = parseFloat(metricsForm.current_weight) || parseFloat(customer?.health?.current_weight);
    const heightCm = parseFloat(metricsForm.height) || parseFloat(customer?.health?.height);
    
    if (weightVal && heightCm) {
      // If value already in kg (from backend), don't convert. If lbs, convert.
      const isLbs = (metricsForm.current_weight || customer?.health?.current_weight || '').toString().toLowerCase().includes('lb');
      const weightKg = isLbs ? weightVal * 0.453592 : weightVal;
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  const getBMIStatus = (bmi) => {
    if (bmi === 'N/A') return 'Unknown';
    const val = parseFloat(bmi);
    if (val < 18.5) return 'Underweight';
    if (val < 25) return 'Normal weight';
    if (val < 30) return 'Overweight';
    return 'Obese';
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!photoForm.url && !selectedFile) {
      toast.error('Please select a file or enter an image URL');
      return;
    }
    setIsUploading(true);
    try {
      let newPhoto;
      if (selectedFile) {
        newPhoto = await crmApi.uploadPhoto(id, selectedFile, photoForm.type);
      } else {
        newPhoto = await crmApi.addPhotoByUrl(id, photoForm.url, photoForm.type);
      }
      setCustomer(prev => ({ ...prev, gallery: [newPhoto, ...(prev.gallery || [])] }));
      setShowGalleryModal(false);
      setPhotoForm({ type: 'Before', url: '' });
      setSelectedFile(null);
      toast.success('Photo added to gallery!');
    } catch (err) {
      toast.error('Failed to upload photo');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    setSelectedFile(file);
    setPhotoForm(prev => ({ ...prev, url: '' })); // clear URL if file chosen
  };

  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;
    try {
      await crmApi.deletePhoto(photoToDelete);
      setCustomer(prev => ({ ...prev, gallery: (prev.gallery || []).filter(p => p.id !== photoToDelete) }));
      setPhotoToDelete(null);
      toast.success('Photo deleted from gallery.');
    } catch (err) {
      toast.error('Failed to delete photo');
      console.error(err);
    }
  };

  if (!customer) return <Layout title="Loading..."><div className="p-8 text-center text-slate-400">Loading profile...</div></Layout>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Health & Metrics' },
    { id: 'gallery', label: 'Progress Gallery' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'packages', label: 'Packages & Meals' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <Layout title="Customer Profile" subtitle={`Details for ${customer.full_name}`}>
      
      {/* Assign Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent">
              <h3 className="font-black text-white text-lg">{editingPackageId ? 'Edit Diet Package' : 'Assign Diet Package'}</h3>
              <button onClick={() => { setShowPackageModal(false); setEditingPackageId(null); }} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAssignPackage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Package Name</label>
                <select value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                  <option>1 Month Boss Diet</option>
                  <option>Weekly Keto Plan</option>
                  <option>14 Days Detox</option>
                  <option>2 Days Daily Plan</option>
                  <option>1 Day Trial Plan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Duration (Text)</label>
                  <input type="text" value={packageForm.duration} onChange={e => setPackageForm({...packageForm, duration: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Exact Expiry Date</label>
                  <input required type="date" value={packageForm.expires_at} onChange={e => setPackageForm({...packageForm, expires_at: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green [color-scheme:dark]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Total Meals</label>
                  <input type="number" value={packageForm.meal_count} onChange={e => setPackageForm({...packageForm, meal_count: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Meal Type Timetable</label>
                <select value={packageForm.meal_type} onChange={e => setPackageForm({...packageForm, meal_type: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green">
                  <option>LUNCH, DINNER</option>
                  <option>LUNCH ONLY</option>
                  <option>DINNER ONLY</option>
                  <option>BREAKFAST, LUNCH, DINNER</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowPackageModal(false); setEditingPackageId(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  {editingPackageId ? 'Update Package' : 'Assign Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metrics Modal */}
      {showMetricsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent">
              <h3 className="font-black text-white text-lg">Update Health Metrics</h3>
              <button onClick={() => setShowMetricsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdateMetrics} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Current Weight (lbs/kg)</label>
                  <input type="text" value={metricsForm.current_weight} onChange={e => setMetricsForm({...metricsForm, current_weight: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 150 lbs" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Target Weight (lbs/kg)</label>
                  <input type="text" value={metricsForm.goal_weight} onChange={e => setMetricsForm({...metricsForm, goal_weight: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 130 lbs" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Height (cm)</label>
                <input type="number" value={metricsForm.height} onChange={e => setMetricsForm({...metricsForm, height: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 165" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Medical Conditions</label>
                <input type="text" value={metricsForm.medical_condition} onChange={e => setMetricsForm({...metricsForm, medical_condition: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. Diabetes, None" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Food Allergies</label>
                <input type="text" value={metricsForm.allergies} onChange={e => setMetricsForm({...metricsForm, allergies: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. Peanut, None" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowMetricsModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">Save Metrics</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent">
              <h3 className="font-black text-white text-lg">Add Progress Photo</h3>
              <button onClick={() => setShowGalleryModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddPhoto} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Photo Type</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${photoForm.type === 'Before' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                    <input type="radio" name="photoType" value="Before" checked={photoForm.type === 'Before'} onChange={() => setPhotoForm({...photoForm, type: 'Before'})} className="hidden" />
                    <span>📅</span> Before
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${photoForm.type === 'After' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                    <input type="radio" name="photoType" value="After" checked={photoForm.type === 'After'} onChange={() => setPhotoForm({...photoForm, type: 'After'})} className="hidden" />
                    <span>🌟</span> After
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Upload Photo</label>
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${selectedFile ? 'border-brand-green bg-brand-green/5' : 'bg-surface-900 border-white/10 hover:border-brand-green/50 hover:bg-white/5'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {selectedFile ? (
                        <>
                          <span className="text-3xl mb-2">✅</span>
                          <p className="text-sm text-brand-green font-bold">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Click to change</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-3 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-slate-400"><span className="font-bold text-brand-green">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-slate-500">PNG, JPG or GIF (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-bold uppercase">Or paste link</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Image URL</label>
                <input required={!photoForm.url && !selectedFile} disabled={!!selectedFile} type="url" value={photoForm.url} onChange={e => setPhotoForm({...photoForm, url: e.target.value})} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green disabled:opacity-40" placeholder="https://example.com/photo.jpg" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowGalleryModal(false); setSelectedFile(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-60 flex items-center gap-2">
                  {isUploading ? <><span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin"/> Uploading...</> : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="font-black text-white text-xl mb-2">Delete Photo?</h3>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to delete this photo? This action cannot be undone.</p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setPhotoToDelete(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDeletePhoto} className="flex-1 px-5 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors border border-rose-500/50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Package Confirmation Modal */}
      {deletePackageId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="font-black text-white text-xl mb-2">Delete Package?</h3>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to remove this assigned package? This action cannot be undone.</p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeletePackageId(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDeletePackage} className="flex-1 px-5 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors border border-rose-500/50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('/crm/customers')} className="text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Customers
        </button>
        {user?.role !== 'marketing_junior' && (
          <div className="flex gap-3">
            <button className="bg-surface-800 hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Edit Customer
            </button>
            <button className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Header Card */}
      <div className="rounded-3xl p-8 bg-surface-800 border border-white/5 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-green/10 to-transparent rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] flex-shrink-0">
          {customer.full_name.charAt(0)}
        </div>
        <div className="text-center md:text-left z-10 flex-1">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <div>
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">{customer.full_name}</h1>
                <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold">{customer.customer_code}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Facebook: {customer.facebook_name || 'N/A'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">📞</span> {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">✉️</span> {customer.email || 'N/A'}
                </div>
              </div>
            </div>
            
            {/* Quick Chat Button */}
            <div className="mt-6 md:mt-0">
              <a 
                href={`https://m.me/${customer.facebook_name ? encodeURIComponent(customer.facebook_name) : ''}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#0084ff] hover:bg-[#006bd6] text-white px-6 py-3 rounded-2xl font-black shadow-[0_0_20px_rgba(0,132,255,0.3)] hover:scale-105 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.9 1.48 5.485 3.79 7.152v3.315c0 .413.433.682.8.5.877-.433 2.502-1.282 3.86-2.072 1.135.313 2.327.485 3.55.485 5.523 0 10-4.145 10-9.26S17.523 2 12 2zm1.18 11.16l-2.45-2.618-4.78 2.618 5.25-5.568 2.45 2.618 4.78-2.618-5.25 5.568z"/></svg>
                Messenger Chat
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 bg-surface-800 p-1.5 rounded-2xl border border-white/5 w-max shadow-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl p-8 bg-surface-800 border border-white/5 min-h-[400px] shadow-xl">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age</p>
              <p className="text-xl text-white font-black">{customer.age} Years</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</p>
              <p className="text-xl text-white font-black">{customer.gender}</p>
            </div>
            <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Address</p>
              <p className="text-lg text-white font-medium leading-relaxed">{customer.address}</p>
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-amber-500">Food Restrictions / Allergies</p>
              <p className="text-white font-medium text-lg leading-relaxed">{customer.lifestyle?.food_restriction || 'None'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-blue-400">Activity Level</p>
              <p className="text-white font-medium text-lg">{customer.lifestyle?.activity_level || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner md:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-purple-400">Fasting Willingness</p>
              <p className="text-white font-medium text-lg">{customer.lifestyle?.fasting_willingness || 'N/A'}</p>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-black text-white">Body Metrics & Health</h3>
              {user?.role !== 'marketing_junior' && (
                <button onClick={() => setShowMetricsModal(true)} className="bg-brand-green/20 text-brand-green hover:bg-brand-green/30 border border-brand-green/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                  <span>✏️</span> Edit Metrics
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center relative overflow-hidden group">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 relative z-10">Current Weight</p>
                <p className="text-3xl text-white font-black relative z-10">{customer.health?.current_weight || 'N/A'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden group">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 relative z-10">Target Weight</p>
                <p className="text-3xl text-white font-black relative z-10">{customer.health?.goal_weight || 'N/A'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Height</p>
                <p className="text-3xl text-white font-black">{customer.health?.height || 'N/A'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center relative">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">BMI Status</p>
                <p className="text-3xl text-white font-black mb-1">{calculateBMI()}</p>
                {calculateBMI() !== 'N/A' && (
                  <span className="text-xs font-bold bg-black/30 px-2 py-1 rounded text-amber-200">{getBMIStatus(calculateBMI())}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 relative overflow-hidden">
                <p className="text-xs text-rose-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>⚠️</span> Medical Conditions</p>
                <p className="text-white font-medium text-lg relative z-10">{customer.health?.medical_condition || 'None reported'}</p>
              </div>
              <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 relative overflow-hidden">
                <p className="text-xs text-orange-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>🥜</span> Food Allergies</p>
                <p className="text-white font-medium text-lg relative z-10">{customer.health?.allergies || customer.lifestyle?.food_restriction || 'None reported'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-white">Visual Progress Gallery</h3>
              {user?.role !== 'marketing_junior' && (
                <button onClick={() => setShowGalleryModal(true)} className="bg-brand-green text-black px-4 py-2 rounded-xl text-sm font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-2">
                  <span>+</span> Add Photo
                </button>
              )}
            </div>
            
            {(!customer.gallery || customer.gallery.length === 0) ? (
              <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <div className="text-4xl mb-4 text-slate-600">📸</div>
                <h4 className="text-white font-bold mb-2">No Photos Yet</h4>
                <p className="text-slate-400 text-sm">Upload Before & After photos to track progress visually.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {customer.gallery.map(photo => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-surface-900 aspect-[3/4]">
                    <img src={photo.url} alt={photo.type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-2 ${photo.type === 'Before' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {photo.type.toUpperCase()}
                        </span>
                        <p className="text-white text-sm font-medium">{photo.date}</p>
                      </div>
                      {user?.role !== 'marketing_junior' && (
                        <button onClick={() => setPhotoToDelete(photo.id)} className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500/40 hover:text-white transition-colors border border-rose-500/30">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="space-y-4">
            {(!customer.packages_list || customer.packages_list.length === 0) && (
              <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <div className="text-4xl mb-4">🍱</div>
                <h4 className="text-white font-bold mb-2">No Active Packages</h4>
                <p className="text-slate-400 text-sm mb-6">This customer does not have any diet plans assigned yet.</p>
                {user?.role !== 'marketing_junior' && (
                  <button onClick={openAddPackage} className="px-6 py-3 bg-brand-green text-black font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform">
                    Assign First Package
                  </button>
                )}
              </div>
            )}
            
            {customer.packages_list && customer.packages_list.map(pkg => (
              <div key={pkg.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-green/30 transition-colors">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg">Duration: {pkg.duration}</span>
                    <span className="text-slate-400 bg-white/5 px-3 py-1 rounded-lg flex items-center gap-1"><span>⏳</span> Expires: {pkg.expires_at}</span>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                  <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black mb-3 shadow-[0_0_10px_rgba(16,185,129,0.1)]">ACTIVE PLAN</span>
                  <p className="text-sm font-bold text-slate-300 bg-surface-900 px-4 py-2 rounded-xl border border-white/5">
                    {pkg.meal_count} Meals <span className="text-brand-green">({pkg.meal_type})</span>
                  </p>
                  {user?.role !== 'marketing_junior' && (
                    <div className="flex gap-2 justify-end md:justify-center mt-3">
                      <button onClick={() => openEditPackage(pkg)} className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">Edit</button>
                      <button onClick={() => setDeletePackageId(pkg.id)} className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(customer.packages_list && customer.packages_list.length > 0 && user?.role !== 'marketing_junior') && (
              <button onClick={openAddPackage} className="w-full py-4 mt-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/30 transition-colors font-bold text-sm bg-white/[0.01]">
                + Assign Another Package
              </button>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {(!customer.feedbacks || customer.feedbacks.length === 0) && (
              <div className="p-10 text-center text-slate-400">No feedback recorded for this customer yet.</div>
            )}
            {customer.feedbacks && customer.feedbacks.map(fb => (
              <div key={fb.id} className={`p-6 rounded-3xl border ${fb.ai_flagged ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/[0.02] border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs text-slate-400 uppercase font-black tracking-wider bg-white/5 px-3 py-1 rounded-lg">{fb.type.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-slate-500">{fb.date}</span>
                </div>
                <p className="text-white text-base leading-relaxed">{fb.text}</p>
                {fb.ai_flagged && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-black text-rose-400 bg-rose-500/10 w-max px-3 py-1.5 rounded-lg border border-rose-500/20">
                    <span className="animate-pulse">⚠️</span> AI Flagged for Review
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
