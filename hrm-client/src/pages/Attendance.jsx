import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';
import RostersTab from '../components/attendance/RostersTab';
import WeeklyRosterPlanner from '../components/attendance/WeeklyRosterPlanner';
import OvertimeTab from './OvertimeTab';

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'var(--bg-800, #1e2235)', border: `1px solid rgba(var(--${color}), 0.2)` }}>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default function Attendance() {
  const [activeTabState, setActiveTabState] = useState(localStorage.getItem('attendanceTab') || 'manual');
  const activeTab = activeTabState;
  const setActiveTab = (tab) => { setActiveTabState(tab); localStorage.setItem('attendanceTab', tab); };
  const [filter, setFilter] = useState({ name: '', date: new Date().toISOString().split('T')[0], status: 'all' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteMappingTarget, setDeleteMappingTarget] = useState(null);
  const [editMappingTarget, setEditMappingTarget] = useState(null);
  const [generatedQrToken, setGeneratedQrToken] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedPhotoEmpId, setSelectedPhotoEmpId] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['attendance'], queryFn: () => api.get('/attendance').then(r => r.data) });

  const addMappingMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/biometric/mapping', body),
    onSuccess: () => { qc.invalidateQueries(['attendance']); toast.success('Mapping saved'); },
  });

  const editMappingMutation = useMutation({
    mutationFn: ({ id, body }) => api.put(`/attendance/biometric/mapping/${id}`, body),
    onSuccess: () => { qc.invalidateQueries(['attendance']); setEditMappingTarget(null); toast.success('Mapping updated'); },
  });

  const deleteMappingMutation = useMutation({
    mutationFn: (id) => api.delete(`/attendance/biometric/mapping/${id}`),
    onSuccess: () => { qc.invalidateQueries(['attendance']); setDeleteMappingTarget(null); toast.success('Mapping deleted'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/attendance/${id}`),
    onSuccess: () => { qc.invalidateQueries(['attendance']); setDeleteTarget(null); },
  });

  const addMutation = useMutation({
    mutationFn: (body) => api.post('/attendance', body),
    onSuccess: () => qc.invalidateQueries(['attendance']),
  });

  const checkoutMutation = useMutation({
    mutationFn: (id) => api.post(`/attendance/${id}/checkout`),
    onSuccess: () => qc.invalidateQueries(['attendance']),
  });


  const records = (data?.records || []).filter(r => {
    const nameMatch = !filter.name || (r.Full_name || '').toLowerCase().includes(filter.name.toLowerCase());
    const dateMatch = !filter.date || String(r.check_in || '').startsWith(filter.date);
    const statusMatch = filter.status === 'all' || (filter.status === 'late' ? r.is_late : !r.is_late);
    return nameMatch && dateMatch && statusMatch;
  });

  const stats = data?.stats || {};
  const employees = data?.employees || [];
  const tokens = data?.active_tokens || [];

  const TABS = [
    { id: 'manual', icon: '✏️', label: 'Manual Entry' },
    { id: 'records', icon: '📋', label: 'Records' },
    { id: 'photo', icon: '📸', label: 'Photo Check-In' },
    { id: 'qr', icon: '📱', label: 'QR Code' },
    { id: 'biometric', icon: '👆', label: 'Biometric' },
    { id: 'rosters', icon: '📅', label: 'Rosters & Shifts' },
    { id: 'overtime', icon: '⏱️', label: 'Overtime Requests' },
  ];

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addMutation.mutate(Object.fromEntries(fd));
    e.target.reset();
  };

  const qrMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/generate-qr', body),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'QR Code Generated Successfully!');
      setGeneratedQrToken(res.data.token);
      qc.invalidateQueries(['attendance']);
    },
    onError: (err) => toast.error('Failed to generate QR Code')
  });

  const photoMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/photo-checkin', body),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Photo Attendance Recorded!');
      qc.invalidateQueries(['attendance']);
      setCapturedPhoto(null);
    },
    onError: (err) => toast.error('Failed to record photo attendance')
  });

  const addDeviceMutation = useMutation({
    mutationFn: (body) => api.post('/attendance/biometric/device', body),
    onSuccess: () => {
      toast.success('Device registered successfully');
      qc.invalidateQueries(['attendance']);
    },
    onError: () => toast.error('Failed to register device')
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: (id) => api.delete(`/attendance/biometric/device/${id}`),
    onSuccess: () => {
      toast.success('Device deleted');
      qc.invalidateQueries(['attendance']);
    },
    onError: () => toast.error('Failed to delete device')
  });


  const methodBadge = (m) => {
    const cfg = { QR: 'text-cyan-400 bg-cyan-400/10', Biometric: 'text-purple-400 bg-purple-400/10', Photo: 'text-pink-400 bg-pink-400/10' };
    return cfg[m] ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg[m]}`}>{m === 'QR' ? '📱 QR' : m === 'Biometric' ? '👆 Bio' : '📸 Photo'}</span>
      : <span className="text-xs font-medium px-2 py-0.5 rounded-full text-slate-400 bg-slate-400/10">✏️ Manual</span>;
  };

  const formatTimeByMethod = (isoString, method) => {
    if (!isoString) return '—';
    try {
      let s = isoString.replace(' ', 'T');
      if (s.split(':').length === 2) s += ':00'; 
      
      // Photo and QR save as UTC in DB. Bio and Manual save as Local Time.
      if (['Photo', 'QR'].includes(method)) {
        if (!s.includes('Z') && !s.includes('+') && !s.includes('-0')) s += 'Z'; 
        s = s.replace(/\+00(:00)?$/, 'Z');
      } else {
        // Strip any accidental UTC indicators so it parses as Local Time
        s = s.replace(/Z$/, '').replace(/\+00(:00)?$/, '');
      }
      
      const d = new Date(s);
      if (isNaN(d.getTime())) return isoString;
      
      let hrs = d.getHours();
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      const mins = String(d.getMinutes()).padStart(2, '0');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} ${hrs}:${mins} ${ampm}`;
    } catch {
      return isoString;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setCapturedPhoto(null);
    } catch (err) {
      toast.error('Failed to access camera');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      setCapturedPhoto(canvasRef.current.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!capturedPhoto) return toast.error('Please capture a photo first');
    const fd = new FormData(e.target);
    photoMutation.mutate({
      employee_id: fd.get('employee_id'),
      photo_base64: capturedPhoto
    });
    e.target.reset();
  };

  const handleQrGenerate = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    qrMutation.mutate(Object.fromEntries(fd));
  };

  return (
    <Layout title="Attendance Management" subtitle="Manual · Photo · QR Code · Biometric">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Records" value={stats.total || 0} color="indigo" />
        <StatCard label="Present Today" value={stats.present || 0} color="emerald" />
        <StatCard label="Late Arrivals" value={stats.late || 0} color="amber" />
        <StatCard label="Still In Office" value={stats.in_office || 0} color="cyan" />
      </div>

      {/* Tabs */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === t.id ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Manual Entry Tab */}
        {activeTab === 'manual' && (
          <div className="p-6">
            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="form-label">Employee *</label>
                <select name="employee_id" required className="form-input">
                  <option value="">— Select Employee —</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name} ({e.employee_id})</option>)}
                </select>
              </div>
              <div><label className="form-label">Check-In Time</label><input type="datetime-local" name="check_in" className="form-input" /></div>
              <div><label className="form-label">Check-Out Time</label><input type="datetime-local" name="check_out" className="form-input" /></div>
              <div><label className="form-label">Overtime (Hours)</label><input type="number" step="0.5" min="0" name="overtime_hours" className="form-input" placeholder="e.g. 2.5" /></div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" name="is_late" value="true" className="accent-amber-500" />
                <span className="text-xs text-slate-400">Mark as Late Arrival</span>
              </div>
              <input type="hidden" name="attendance_method" value="Manual" />
              <div className="md:col-span-2">
                <button type="submit" className="w-full text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors" style={{ background: '#4f46e5' }}>
                  ✏️ Record Manual Attendance
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Photo Check-In Tab */}
        {activeTab === 'photo' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camera Area */}
              <div className="flex flex-col gap-4">
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/10">
                  <video ref={videoRef} className={`w-full h-full object-cover ${isCameraActive && !capturedPhoto ? 'block' : 'hidden'}`} autoPlay playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {capturedPhoto && (
                    <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
                  )}

                  {!isCameraActive && !capturedPhoto && (
                    <div className="text-center">
                      <div className="text-5xl mb-3">📸</div>
                      <p className="text-slate-400 text-sm">Camera preview will appear here</p>
                    </div>
                  )}

                  {isCameraActive && !capturedPhoto && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-full px-3 py-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-xs text-white font-bold">LIVE</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={isCameraActive ? stopCamera : startCamera} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    {isCameraActive ? 'Stop Camera' : 'Start Camera'}
                  </button>
                  <button type="button" onClick={capturePhoto} disabled={!isCameraActive} className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    Capture
                  </button>
                </div>
              </div>

              {/* Form Area */}
              <form onSubmit={handlePhotoSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="form-label">Employee *</label>
                  <select name="employee_id" value={selectedPhotoEmpId} onChange={(e) => setSelectedPhotoEmpId(e.target.value)} required className="form-input">
                    <option value="">— Select Employee —</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name} ({e.employee_id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Check-In Notes</label>
                  <input type="text" name="notes" className="form-input" placeholder="e.g. Working from office — Floor 3" />
                </div>
                
                <div className="mt-auto">
                  {!capturedPhoto ? (
                    <div className="text-center py-2.5 px-4 rounded-xl text-amber-500 bg-amber-500/10 text-sm font-medium border border-amber-500/20">
                      📸 Please capture a photo before submitting
                    </div>
                  ) : (
                    <button type="submit" disabled={photoMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                      {photoMutation.isPending ? 'Submitting...' : (() => {
                        const today = new Date().toISOString().split('T')[0];
                        const isOpen = records.find(r => r.employee_id === selectedPhotoEmpId && String(r.check_in || '').startsWith(today) && !r.check_out);
                        return isOpen ? '📸 Submit Check-Out' : '📸 Submit Check-In';
                      })()}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <input value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} placeholder="Search employee..." className="form-input w-40" />
                <input type="date" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} className="form-input w-40" />
                <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="form-input w-36">
                  <option value="all">All Status</option>
                  <option value="late">Late</option>
                  <option value="ontime">On Time</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  if (records.length === 0) return toast.error('No records to export');
                  const hdrs = ['Employee', 'Check In', 'Check Out', 'Method', 'Hours', 'Overtime', 'Status'];
                  const rows = records.map(r => [
                    `"${r.Full_name || '—'}"`,
                    `"${r.check_in ? formatTimeByMethod(r.check_in, r.attendance_method) : '—'}"`,
                    `"${r.check_out ? formatTimeByMethod(r.check_out, r.attendance_method) : '—'}"`,
                    `"${r.attendance_method || '—'}"`,
                    `"${r.work_hours_calc != null ? r.work_hours_calc : '—'}"`,
                    `"${r.overtime_hours != null ? r.overtime_hours : '—'}"`,
                    `"${r.is_late ? 'Late' : 'On time'}"`
                  ]);
                  const csv = [hdrs.join(','), ...rows.map(row => row.join(','))].join('\n');
                  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `attendance_records_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <span>📥</span> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--bg-850, #161929)' }}>
                  <tr>{['Employee', 'Photo', 'Check In', 'Check Out', 'Method', 'Hours', 'Overtime', 'Status', 'Actions'].map(h => <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {isLoading ? <tr><td colSpan="9" className="py-10 text-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                  : records.length > 0 ? records.map(r => (
                    <tr key={r.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{(r.Full_name || '?')[0]}</div>
                          <div><p className="font-medium text-white text-sm whitespace-nowrap">{r.Full_name || '—'}</p><p className="text-xs text-slate-500 font-mono">{r.employee_code || '—'}</p></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {r.check_in_photo_url ? (
                          <img src={r.check_in_photo_url} alt="Photo" className="w-8 h-8 object-cover rounded border border-white/10" />
                        ) : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap"><span className="text-emerald-400 font-mono text-xs">{r.check_in ? formatTimeByMethod(r.check_in, r.attendance_method) : '—'}</span></td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.check_out ? <span className="text-rose-400 font-mono text-xs">{formatTimeByMethod(r.check_out, r.attendance_method)}</span>
                          : <button onClick={() => checkoutMutation.mutate(r.id)} className="text-xs text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-lg">Check Out</button>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{methodBadge(r.attendance_method)}</td>
                      <td className="py-3 px-4 whitespace-nowrap"><span className="font-mono text-white text-xs">{r.work_hours_calc != null ? `${r.work_hours_calc}h` : '—'}</span></td>
                      <td className="py-3 px-4 whitespace-nowrap"><span className="font-mono text-white text-xs">{r.overtime_hours != null ? `${r.overtime_hours}h` : '—'}</span></td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.is_late
                          ? <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Late</span>
                          : <span className="text-xs text-emerald-400">On time</span>}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAdmin() && <button onClick={() => setDeleteTarget(r)} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded-lg">Delete</button>}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="9" className="py-12 text-center text-slate-500 text-sm">No records for selected filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Generate QR Form */}
              <div>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  HR generates a unique QR code per employee. The employee scans it from any device to auto-check in. Each code is valid for <span className="font-semibold text-white">1 hour</span> and can only be used <span className="text-rose-400 font-semibold">once</span>.
                </p>
                <form onSubmit={handleQrGenerate} className="space-y-4">
                  <div>
                    <label className="form-label">Select Employee *</label>
                    <select name="employee_id" required className="form-input">
                      <option value="">— Select Employee —</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={qrMutation.isPending} className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors">
                    {qrMutation.isPending ? 'Generating...' : '📱 Generate QR Code'}
                  </button>
                </form>

                {generatedQrToken && (
                  <div className="mt-6 p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 text-center animate-fade-in">
                    <p className="text-sm text-slate-300 mb-4">Generated QR Token successfully!</p>
                    <div className="inline-block p-4 bg-white rounded-xl mb-3">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedQrToken}`} alt="QR Code" className="w-32 h-32" />
                    </div>
                    <p className="text-xs font-mono text-cyan-400 break-all">{generatedQrToken}</p>
                    <p className="text-xs text-slate-500 mt-2">Print or share this QR code with the employee.</p>
                  </div>
                )}
              </div>

              {/* Active QR Tokens List */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active QR Tokens</h3>
                {tokens.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {tokens.map(tok => (
                      <div key={tok.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div>
                          <p className="text-sm font-medium text-white">{tok.Full_name}</p>
                          <p className="text-xs font-mono text-cyan-400">{tok.token?.slice(0, 16)}...</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tok.used ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10 animate-pulse'}`}>
                          {tok.used ? '✓ Used' : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl p-8 text-center text-slate-500 text-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>No QR tokens generated yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Biometric Tab */}
        {activeTab === 'biometric' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Devices */}
              <div className="space-y-6">
                <div className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>🖧</span> Register Biometric Device</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addDeviceMutation.mutate(Object.fromEntries(new FormData(e.target))); e.target.reset(); }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">DEVICE NAME *</label>
                      <input name="device_name" required placeholder="e.g. ZKTeco Main Entrance" className="form-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">IP ADDRESS</label>
                        <input name="ip_address" placeholder="192.168.1.100" className="form-input" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">PORT</label>
                        <input name="port" placeholder="4370" className="form-input" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">LOCATION</label>
                      <input name="location" placeholder="Floor 1 — Main Entrance" className="form-input" />
                    </div>
                    <button type="submit" disabled={addDeviceMutation.isLoading} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2">
                      + Register Device
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Registered Devices ({data?.biometric_devices?.length || 0})</h3>
                  <div className="space-y-3">
                    {data?.biometric_devices?.length > 0 ? data.biometric_devices.map(d => (
                      <div key={d.id} className="p-4 bg-slate-800 rounded-lg flex justify-between items-center group">
                        <div>
                          <p className="font-bold text-slate-200">{d.device_name}</p>
                          <p className="text-xs text-slate-400 mt-1">{d.ip_address || 'N/A'}:{d.port || 4370}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active</span>
                          <button className="text-xs text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                          <button onClick={() => deleteDeviceMutation.mutate(d.id)} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-500">No devices registered.</p>}
                  </div>
                </div>
              </div>

              {/* Right Column: Mappings */}
              <div className="space-y-6">
                <div className="rounded-xl p-6 border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>👆</span> Map Employee to Device</h3>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">When you enroll an employee on the physical device, it assigns them an ID number. Record that ID here so the system knows which attendance records belong to which employee when the device syncs.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); addMappingMutation.mutate(Object.fromEntries(new FormData(e.target))); e.target.reset(); }} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">EMPLOYEE *</label>
                      <select name="employee_id" required className="form-input">
                        <option value="">— Select Employee —</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">DEVICE *</label>
                      <select name="device_id" required className="form-input">
                        <option value="">— Select Device —</option>
                        {data?.biometric_devices?.map(d => <option key={d.id} value={d.id}>{d.device_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">BIOMETRIC ID ON DEVICE *</label>
                      <input name="biometric_id" required placeholder="e.g. 001" className="form-input" />
                      <p className="text-[10px] text-slate-500 mt-1">The employee's enrolment ID as shown on the device</p>
                    </div>
                    <button type="submit" disabled={addMappingMutation.isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2">
                      👆 Save Mapping
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Enrolled Employees ({data?.biometric_registrations?.length || 0})</h3>
                  <div className="space-y-3">
                    {data?.biometric_registrations?.length > 0 ? data.biometric_registrations.map(r => (
                      <div key={r.id} className="p-4 bg-slate-800 rounded-lg flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">{(r.Full_name || '?')[0]}</div>
                          <div>
                            <p className="font-bold text-slate-200">{r.Full_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Device ID: <span className="font-mono text-cyan-400">{r.biometric_id}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">✓ Enrolled</span>
                          <button onClick={() => setEditMappingTarget(r)} className="text-xs text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                          <button onClick={() => setDeleteMappingTarget(r)} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-500">No employees mapped yet.</p>}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Rosters Tab */}
        {activeTab === 'rosters' && (
          <WeeklyRosterPlanner />
        )}

        {/* Overtime Tab */}
        {activeTab === 'overtime' && (
          <OvertimeTab />
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        itemName={`Attendance for ${deleteTarget?.Full_name || 'Employee'}`}
      />

      <ConfirmDeleteModal 
        isOpen={!!deleteMappingTarget} 
        onClose={() => setDeleteMappingTarget(null)}
        onConfirm={() => deleteMappingMutation.mutate(deleteMappingTarget.id)}
        itemName={`Biometric Mapping for ${deleteMappingTarget?.Full_name || 'Unknown Employee'}`}
      />

      {editMappingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditMappingTarget(null)} />
          <div className="relative rounded-2xl w-full max-w-md m-4 p-6" style={{ background: 'var(--bg-850, #161929)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-base font-bold text-white mb-4">Edit Mapping</h2>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              editMappingMutation.mutate({ id: editMappingTarget.id, body: Object.fromEntries(new FormData(e.target)) }); 
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">EMPLOYEE *</label>
                <select name="employee_id" required defaultValue={editMappingTarget.employee_id} className="form-input">
                  <option value="">— Select Employee —</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.Full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">DEVICE *</label>
                <select name="device_id" required defaultValue={editMappingTarget.device_id} className="form-input">
                  <option value="">— Select Device —</option>
                  {data?.biometric_devices?.map(d => <option key={d.id} value={d.id}>{d.device_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">BIOMETRIC ID ON DEVICE *</label>
                <input name="biometric_id" required defaultValue={editMappingTarget.biometric_id} className="form-input" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditMappingTarget(null)} className="flex-1 px-4 py-2.5 bg-white/5 text-slate-400 rounded-xl">Cancel</button>
                <button type="submit" disabled={editMappingMutation.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
