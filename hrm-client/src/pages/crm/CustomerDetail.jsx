import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';
import AssignPackageForm from '../../components/crm/AssignPackageForm';
import CustomerPackagesList from '../../components/crm/CustomerPackagesList';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isBoss } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [customer, setCustomer] = useState(null);
  const [linkedInquiries, setLinkedInquiries] = useState([]);
  const [unlinkedInquiries, setUnlinkedInquiries] = useState([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [inquiryToUnlink, setInquiryToUnlink] = useState(null);

  // Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [renewPackageId, setRenewPackageId] = useState(null);
  const [deleteFeedbackId, setDeleteFeedbackId] = useState(null);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);

  // Avatar State
  const avatarInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingAvatar(true);
      await crmApi.uploadAvatar(id, file);
      
      setAvatarError(false);
      toast.success("Profile picture updated!");
      
      setCustomer(prev => ({ ...prev, _avatar_updated: Date.now() }));
    } catch (err) {
      toast.error("Failed to upload picture");
      console.error(err);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Edit Customer Modal State
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    full_name: '',
    facebook_name: '',
    age: '',
    gender: 'female',
    email: '',
    phone: '',
    address: '',
    delivery_address: '',
    delivery_notes: ''
  });



  const [photoForm, setPhotoForm] = useState({ type: 'Before', url: '' });
  const [packageForm, setPackageForm] = useState({
    name: '1 Month Boss Diet',
    duration: '30 Days',
    start_date: '',
    expires_at: '',
    meal_count: 60,
    meal_type: 'LUNCH, DINNER',
    payment_status: 'Unpaid',
    status: 'Active',
    amount: 5000
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
    let isMounted = true;
    setAvatarError(false);
    const fetchCustomerAndInquiries = async () => {
      try {
        const [data, inquiriesData, packagesData] = await Promise.all([
          crmApi.getCustomer(id),
          crmApi.getCustomerInquiries(id),
          crmApi.getPackages()
        ]);
        if (!isMounted) return;
        setCustomer(data);
        setLinkedInquiries(inquiriesData);
        setAvailablePackages(packagesData);
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
        if (!isMounted) return;
        toast.error('Failed to load customer profile');
        console.error(e);
      }
    };
    fetchCustomerAndInquiries();
    return () => { isMounted = false; };
  }, [id]);

  const openLinkModal = async () => {
    try {
      const data = await crmApi.getInquiries(true); // unlinked only
      setUnlinkedInquiries(data);
      setShowLinkModal(true);
    } catch (err) {
      toast.error('Failed to fetch unlinked inquiries');
    }
  };

  const handleLinkInquiry = async (inquiryId) => {
    setIsLinking(true);
    try {
      await crmApi.linkInquiryToCustomer(inquiryId, id);
      toast.success('Inquiry linked successfully');
      setShowLinkModal(false);
      const updatedInquiries = await crmApi.getCustomerInquiries(id);
      setLinkedInquiries(updatedInquiries);
    } catch (e) {
      toast.error('Failed to link inquiry');
      console.error(e);
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkInquiry = async () => {
    if (!inquiryToUnlink) return;
    try {
      await crmApi.linkInquiryToCustomer(inquiryToUnlink, null);
      toast.success("Inquiry unlinked successfully");
      const updatedInquiries = await crmApi.getCustomerInquiries(id);
      setLinkedInquiries(updatedInquiries);
    } catch (e) {
      toast.error("Failed to unlink inquiry");
      console.error(e);
    } finally {
      setInquiryToUnlink(null);
    }
  };

  const openEditCustomer = () => {
    setCustomerForm({
      full_name: customer?.full_name || '',
      facebook_name: customer?.facebook_name || '',
      age: customer?.age || '',
      gender: customer?.gender || 'female',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      delivery_address: customer?.delivery_address || '',
      delivery_notes: customer?.delivery_notes || ''
    });
    setShowEditCustomerModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await crmApi.updateCustomer(id, customerForm);
      toast.success('Customer updated successfully');
      setShowEditCustomerModal(false);
      // Reload customer
      const updatedCustomer = await crmApi.getCustomer(id);
      setCustomer(updatedCustomer);
    } catch (e) {
      toast.error('Failed to update customer');
      console.error(e);
    }
  };
  const openAddPackage = () => {
    setEditingPackageId(null);
    const defaultPkg = availablePackages.length > 0 ? availablePackages[0] : null;
    
    setPackageForm({
      name: defaultPkg ? defaultPkg.name : '1 Month Boss Diet',
      duration: defaultPkg ? (defaultPkg.duration || '30 Days') : '30 Days',
      start_date: '',
      expires_at: '',
      meal_count: 60,
      meal_type: defaultPkg ? (defaultPkg.meal_type || 'LUNCH, DINNER') : 'LUNCH, DINNER',
      payment_status: 'Unpaid',
      status: 'Active',
      amount: defaultPkg ? (parseInt(defaultPkg.price) || 5000) : 5000
    });
    setShowPackageModal(true);
  };

  const openEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      name: pkg.name || '',
      duration: pkg.duration || '',
      start_date: pkg.start_date || '',
      expires_at: pkg.expires_at || '',
      meal_count: pkg.meal_count || 60,
      meal_type: pkg.meal_type || 'LUNCH, DINNER',
      payment_status: pkg.payment_status || 'Unpaid',
      status: pkg.status || 'Active',
      amount: pkg.amount || 0
    });
    setShowPackageModal(true);
  };

  const openRenewPackage = (pkg) => {
    setEditingPackageId(null);
    setPackageForm({
      name: pkg.name || '1 Month Boss Diet',
      duration: pkg.duration || '30 Days',
      start_date: new Date().toISOString().split('T')[0],
      expires_at: '',
      meal_count: pkg.meal_count || 60,
      meal_type: pkg.meal_type || 'LUNCH, DINNER',
      payment_status: 'Paid',
      status: 'Active',
      amount: pkg.amount || 5000
    });
    setShowPackageModal(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!deleteFeedbackId) return;
    try {
      await crmApi.deleteFeedback(deleteFeedbackId);
      setCustomer(prev => ({
        ...prev,
        feedbacks: (prev.feedbacks || []).filter(f => f.id !== deleteFeedbackId)
      }));
      setDeleteFeedbackId(null);
      toast.success('Feedback deleted successfully');
    } catch (err) {
      toast.error('Failed to delete feedback');
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
    { id: 'communications', label: 'Communications' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <Layout title="Customer Profile" subtitle={`Details for ${customer.full_name}`}>
      {/* Assign Package Modal Extracted */}
      <AssignPackageForm
        customerId={id}
        isOpen={showPackageModal}
        onClose={() => { setShowPackageModal(false); setEditingPackageId(null); }}
        onSuccess={(pkg, isEdit) => {
          if (isEdit) {
            setCustomer(prev => ({
              ...prev,
              packages_list: (prev.packages_list || []).map(p => p.id === pkg.id ? pkg : p)
            }));
          } else {
            setCustomer(prev => ({ ...prev, packages_list: [pkg, ...(prev.packages_list || [])] }));
          }
        }}
        editingPackageId={editingPackageId}
        initialData={editingPackageId ? packageForm : null}
        availablePackages={availablePackages}
      />

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
                  <input type="text" value={metricsForm.current_weight} onChange={e => setMetricsForm({ ...metricsForm, current_weight: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 150 lbs" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Target Weight (lbs/kg)</label>
                  <input type="text" value={metricsForm.goal_weight} onChange={e => setMetricsForm({ ...metricsForm, goal_weight: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 130 lbs" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Height (cm)</label>
                <input type="number" value={metricsForm.height} onChange={e => setMetricsForm({ ...metricsForm, height: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. 165" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Medical Conditions</label>
                <input type="text" value={metricsForm.medical_condition} onChange={e => setMetricsForm({ ...metricsForm, medical_condition: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. Diabetes, None" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Food Allergies</label>
                <input type="text" value={metricsForm.allergies} onChange={e => setMetricsForm({ ...metricsForm, allergies: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green" placeholder="e.g. Peanut, None" />
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
                    <input type="radio" name="photoType" value="Before" checked={photoForm.type === 'Before'} onChange={() => setPhotoForm({ ...photoForm, type: 'Before' })} className="hidden" />
                    <span>📅</span> Before
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${photoForm.type === 'After' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                    <input type="radio" name="photoType" value="After" checked={photoForm.type === 'After'} onChange={() => setPhotoForm({ ...photoForm, type: 'After' })} className="hidden" />
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
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
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
                <input required={!photoForm.url && !selectedFile} disabled={!!selectedFile} type="url" value={photoForm.url} onChange={e => setPhotoForm({ ...photoForm, url: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green disabled:opacity-40" placeholder="https://example.com/photo.jpg" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowGalleryModal(false); setSelectedFile(null); }} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2.5 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-60 flex items-center gap-2">
                  {isUploading ? <><span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> Uploading...</> : 'Add Photo'}
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

      {/* Delete Feedback Confirmation Modal */}
      {deleteFeedbackId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="font-black text-white text-xl mb-2">Delete Feedback?</h3>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to remove this feedback? This action cannot be undone.</p>

              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteFeedbackId(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDeleteFeedback} className="flex-1 px-5 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors border border-rose-500/50">
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
          <div className="flex flex-wrap justify-end gap-3">
            <button 
              onClick={() => {
                window.print();
              }} 
              className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <span>📄</span> Export PDF Summary
            </button>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/monthly-review/${id}`;
                navigator.clipboard.writeText(link);
                toast.success('Monthly Review Link copied for Boss Customer!');
              }} 
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <span>🏆</span> Copy 1-Month Review Link
            </button>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/welcome/${id}`;
                navigator.clipboard.writeText(link);
                toast.success('Public Welcome Link copied for Customer!');
              }} 
              className="bg-brand-green/20 hover:bg-brand-green/30 border border-brand-green/30 text-brand-green px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <span>🎁</span> Copy Customer Welcome Link
            </button>
            <button onClick={openEditCustomer} className="bg-surface-800 hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
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
        <div className="relative w-24 h-24 flex-shrink-0 group">
          <input 
            type="file" 
            ref={avatarInputRef} 
            onChange={handleAvatarUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] relative">
            {!avatarError ? (
              <img 
                src={`https://kcswzfrwpvioaaizfpnk.supabase.co/storage/v1/object/public/avatars/${customer.id}?t=${customer._avatar_updated || 1}`}
                alt={customer.full_name}
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
                {customer.full_name.charAt(0)}
              </div>
            )}
            
            <div 
              onClick={() => avatarInputRef.current?.click()}
              className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 ${uploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {uploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-xl">📷</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1">Upload</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-center md:text-left z-10 flex-1">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <div>
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">{customer.full_name}</h1>
                <span className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-bold">{customer.customer_code}</span>
                {customer.level ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${customer.level.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]' :
                      customer.level.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' :
                        customer.level.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                          customer.level.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                            customer.level.color === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]' :
                              'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                    {customer.level.level_name}
                    <span className="ml-1.5 opacity-60 normal-case tracking-normal">({customer.total_spend?.toLocaleString() || 0} THB)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5 text-slate-400 border-white/10">
                    No Level <span className="ml-1.5 opacity-60 normal-case tracking-normal">({customer.total_spend?.toLocaleString() || 0} THB)</span>
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-4">Facebook: {customer.facebook_name || 'N/A'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">📞</span> {customer.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">✉️</span> {customer.email || 'N/A'}
                </div>
                  <div>
                    <p className="text-slate-500 font-bold mb-1">Total Spent</p>
                    <p className="font-black text-white">{customer.total_spend?.toLocaleString() || 0} THB</p>
                  </div>
              </div>
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
            className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all ${activeTab === tab.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-3xl p-8 bg-surface-800 border border-white/5 min-h-[400px] shadow-xl print:bg-white print:text-black">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Section 1: Personal Profile & Address */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>👤</span> Basic Profile & Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age & Gender</p>
                  <p className="text-lg text-white font-bold">{customer.age ? `${customer.age} Years` : 'N/A'} • {customer.gender || 'N/A'}</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Phone</p>
                  <p className="text-lg text-white font-bold">{customer.phone || 'N/A'}</p>
                </div>

                <div className="md:col-span-2 p-5 rounded-2xl bg-brand-green/5 border border-brand-green/20">
                  <p className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1 flex items-center gap-1.5"><span>🚚</span> Special Delivery Notes</p>
                  <p className="text-white font-medium">{customer.delivery_notes || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Health & Lifestyle Snapshot */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>🩺</span> Health Metrics & Lifestyle Snapshot
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                  <p className="text-xs font-bold text-indigo-300 uppercase mb-1">Weight</p>
                  <p className="text-xl font-black text-white">{customer.health?.current_weight || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-xs font-bold text-emerald-300 uppercase mb-1">Goal Weight</p>
                  <p className="text-xl font-black text-white">{customer.health?.goal_weight || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Height / BMI</p>
                  <p className="text-xl font-black text-white">{customer.health?.height || 'N/A'} <span className="text-xs text-amber-400">({calculateBMI()})</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <p className="text-xs font-bold text-purple-300 uppercase mb-1">Activity</p>
                  <p className="text-base font-bold text-white">{customer.lifestyle?.activity_level || 'N/A'}</p>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs font-bold text-rose-300 uppercase mb-1">Medical Conditions</p>
                  <p className="text-white font-medium">{customer.health?.medical_condition || 'None'}</p>
                </div>
                <div className="col-span-2 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs font-bold text-orange-300 uppercase mb-1">Allergies / Restrictions</p>
                  <p className="text-white font-medium">{customer.health?.allergies || customer.lifestyle?.food_restriction || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle Profile */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>🏃</span> Lifestyle & Fasting Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs font-bold text-blue-300 uppercase mb-1">Activity Level</p>
                  <p className="text-white font-bold">{customer.lifestyle?.activity_level || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs font-bold text-purple-300 uppercase mb-1">Fasting Willingness</p>
                  <p className="text-white font-bold">{customer.lifestyle?.fasting_willingness || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-300 uppercase mb-1">Food Restrictions</p>
                  <p className="text-white font-bold">{customer.lifestyle?.food_restriction || 'None'}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Package & Meal History */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>🍱</span> Package & Meal Subscription History
              </h3>
              {(!customer.packages_list || customer.packages_list.length === 0) ? (
                <p className="text-slate-400 text-sm">No packages recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {customer.packages_list.map((pkg) => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-white">{pkg.name} ({pkg.meal_count} Meals)</p>
                        <p className="text-xs text-slate-400">Start: {pkg.start_date || 'N/A'} • Expires: {pkg.expires_at || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-green/10 text-brand-green border border-brand-green/20">
                          {pkg.status || 'Active'}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{pkg.amount ? `${pkg.amount.toLocaleString()} THB` : 'Paid'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 5: All Customer Feedbacks */}
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>⭐</span> Customer Ratings & Feedbacks
              </h3>
              {(!customer.feedbacks || customer.feedbacks.length === 0) ? (
                <p className="text-slate-400 text-sm">No customer feedbacks recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {customer.feedbacks.map((fb) => (
                    <div key={fb.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-start text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber-400 font-bold">{"⭐".repeat(fb.rating || 5)}</span>
                          <span className="text-xs text-slate-400">({fb.rating || 5}/5)</span>
                        </div>
                        <p className="text-white font-medium">{fb.comment || 'No comment provided'}</p>
                        <p className="text-xs text-slate-500 mt-1">{fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lifestyle' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-blue-400">Activity Level</p>
              <p className="text-white font-medium text-lg">{customer.lifestyle?.activity_level || 'N/A'}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
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
                <p className="text-white font-medium text-lg relative z-10">{(!customer.health?.medical_condition || customer.health?.medical_condition === 'None') ? 'None reported' : customer.health?.medical_condition}</p>
              </div>
              <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 relative overflow-hidden">
                <p className="text-xs text-orange-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>🥜</span> Food Allergies</p>
                <p className="text-white font-medium text-lg relative z-10">{((!customer.health?.allergies || customer.health?.allergies === 'None') && (!customer.lifestyle?.food_restriction || customer.lifestyle?.food_restriction === 'None')) ? 'None reported' : (customer.health?.allergies !== 'None' && customer.health?.allergies ? customer.health.allergies : customer.lifestyle?.food_restriction)}</p>
              </div>
              <div className="p-6 rounded-2xl bg-teal-500/10 border border-teal-500/20 relative overflow-hidden md:col-span-2">
                <p className="text-xs text-teal-300 uppercase tracking-wider mb-2 font-black flex items-center gap-2"><span>👨‍🍳</span> Special Chef Requests</p>
                <p className="text-white font-medium text-lg relative z-10">{(!customer.health?.special_requests || customer.health?.special_requests === 'None') ? 'None' : customer.health?.special_requests}</p>
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
          <CustomerPackagesList
            customer={customer}
            user={user}
            onCustomerUpdate={setCustomer}
            openAddPackage={openAddPackage}
            openEditPackage={openEditPackage}
            openRenewPackage={openRenewPackage}
          />
        )}

        {activeTab === 'communications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Linked Inquiries & Chats</h3>
              {user?.role !== 'marketing_junior' && (
                <button onClick={openLinkModal} className="bg-brand-green/20 text-brand-green hover:bg-brand-green/30 border border-brand-green/30 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                  <span>🔗</span> Link Existing Inquiry
                </button>
              )}
            </div>

            {(!linkedInquiries || linkedInquiries.length === 0) ? (
              <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                <div className="text-4xl mb-4">💬</div>
                <h4 className="text-white font-bold mb-2">No Linked Inquiries</h4>
                <p className="text-slate-400 text-sm mb-6">This customer doesn't have any chat threads linked to their profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedInquiries.map(inquiry => (
                  <div key={inquiry.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-brand-green/30 transition-colors flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-black uppercase tracking-wider bg-white/5 text-slate-400 px-3 py-1 rounded-lg">
                          {inquiry.source}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500">{new Date(inquiry.created_at).toLocaleDateString()}</span>
                          <button onClick={() => setInquiryToUnlink(inquiry.id)} title="Unlink Inquiry" className="text-rose-500 hover:text-rose-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"></path><path d="m5.17 11.67-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"></path><line x1="8" x2="8" y1="2" y2="5"></line><line x1="2" x2="5" y1="8" y2="8"></line><line x1="16" x2="16" y1="19" y2="22"></line><line x1="19" x2="22" y1="16" y2="16"></line></svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-white mb-2">{inquiry.prospect_name}</h4>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {inquiry.inquiries_messages && inquiry.inquiries_messages.length > 0
                          ? inquiry.inquiries_messages[inquiry.inquiries_messages.length - 1].message_text
                          : 'No messages yet.'}
                      </p>
                    </div>
                    <button onClick={() => navigate(`/crm/inquiries?id=${inquiry.id}`)} className="w-full py-3 mt-auto bg-surface-900 border border-white/10 hover:bg-brand-green/10 hover:border-brand-green/30 hover:text-brand-green text-slate-300 rounded-xl font-bold transition-colors text-sm">
                      Open Chat Thread
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {(!customer.feedbacks || customer.feedbacks.length === 0) && (
              <div className="p-10 text-center text-slate-400">No feedback recorded for this customer yet.</div>
            )}
            {customer.feedbacks && customer.feedbacks.map(fb => {
              let displayComment = fb.comment || '';
              let badgeText = 'FEEDBACK';
              let badgeColor = 'bg-brand-green/20 text-brand-green border-brand-green/30';
              let dotColor = 'bg-brand-green';

              if (displayComment.includes('[COMPLAIN]')) {
                badgeText = 'COMPLAIN';
                badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                dotColor = 'bg-rose-500';
              } else if (displayComment.includes('[REQUEST]')) {
                badgeText = 'REQUEST';
                badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                dotColor = 'bg-amber-500';
              }

              displayComment = displayComment
                .replace(/\[GENERAL\]/g, '')
                .replace(/\[MENU\]/g, '')
                .replace(/\[FEEDBACK\]/g, '')
                .replace(/\[COMPLAIN\]/g, '')
                .replace(/\[REQUEST\]/g, '')
                .trim();

              return (
                <div key={fb.id} className="p-6 rounded-3xl border bg-surface-800 border-white/10 shadow-lg relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${dotColor}`}></div>
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-xs tracking-wider ${badgeColor}`}>
                        {badgeText}
                      </div>
                      {fb.rating > 0 && fb.rating !== null && (
                        <div className="flex items-center gap-1.5 bg-brand-orange/20 px-3 py-1.5 rounded-xl border border-brand-orange/30">
                          <span className="text-brand-orange font-black text-xs">{fb.rating}/5</span>
                          <svg className="w-3.5 h-3.5 text-brand-orange fill-brand-orange drop-shadow-[0_0_5px_rgba(255,119,0,0.5)]" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 bg-black/50 px-3 py-1.5 rounded-xl border border-white/5">{new Date(fb.created_at).toLocaleDateString()}</span>
                      {user?.role === 'boss' && (
                        <button onClick={() => handleDeleteFeedback(fb.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20" title="Delete Feedback">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pl-2 font-medium">
                    {displayComment || <span className="text-slate-600 italic">No comments provided.</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Link Inquiry Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-800 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-brand-green/10 to-transparent flex-shrink-0">
              <h3 className="font-black text-white text-lg">Link Unlinked Inquiry</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-slate-400 text-sm mb-4">Select an inquiry below to link it to {customer.full_name}'s profile.</p>

              {unlinkedInquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No unlinked inquiries found.</div>
              ) : (
                <div className="space-y-3">
                  {unlinkedInquiries.map(inq => (
                    <div key={inq.id} className="p-4 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-between gap-4 hover:border-white/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-white truncate">{inq.prospect_name}</h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 px-2 py-0.5 rounded">
                            {inq.source}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{inq.prospect_contact || 'No contact info'}</p>
                      </div>

                      <button
                        onClick={() => handleLinkInquiry(inq.id)}
                        disabled={isLinking}
                        className="px-4 py-2 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isLinking ? 'Linking...' : 'Link to Customer'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Edit Customer Modal */}
      {showEditCustomerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditCustomerModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-surface-900 border border-white/10 rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black text-white mb-6">Edit Customer</h3>
            <form onSubmit={handleUpdateCustomer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.full_name}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facebook Name</label>
                  <input
                    type="text"
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.facebook_name}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, facebook_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.age}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                  <select
                    className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                    value={customerForm.gender}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                <textarea
                  rows="2"
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Address</label>
                <textarea
                  rows="2"
                  className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green/50"
                  value={customerForm.delivery_address}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, delivery_address: e.target.value }))}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditCustomerModal(false)}
                  className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-800 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 rounded-xl font-black text-brand-black bg-brand-green hover:bg-[#b0f048] shadow-[0_0_15px_rgba(195,253,60,0.3)] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unlink Confirm Modal */}
      {inquiryToUnlink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setInquiryToUnlink(null)}></div>
          <div className="relative w-full max-w-md bg-surface-900 border border-white/10 rounded-3xl shadow-2xl p-8">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"></path><path d="m5.17 11.67-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"></path><line x1="8" x2="8" y1="2" y2="5"></line><line x1="2" x2="5" y1="8" y2="8"></line><line x1="16" x2="16" y1="19" y2="22"></line><line x1="19" x2="22" y1="16" y2="16"></line></svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 text-center">Unlink Inquiry</h3>
            <p className="text-slate-400 text-center mb-8">Are you sure you want to unlink this inquiry from the customer profile? The inquiry will be moved back to the New Inquiries list.</p>
            <div className="flex gap-4">
              <button onClick={() => setInquiryToUnlink(null)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-800 hover:text-white hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleUnlinkInquiry} className="flex-1 px-5 py-3 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-colors border border-rose-500/50">
                Unlink
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
