import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function MyPayslips() {
  const { user } = useAuth();
  const printRef = useRef(null);
  const [printingId, setPrintingId] = useState(null);

  const { data, isLoading } = useQuery({ 
    queryKey: ['portal_data'], 
    queryFn: () => api.get('/portal').then(r => r.data) 
  });

  const payslips = data?.payslips || [];

  const handleDownload = async (p) => {
    setPrintingId(p.id);
    const loadingToast = toast.loading('Generating PDF...');
    
    // Give React time to render the hidden printable component
    setTimeout(async () => {
      try {
        const element = printRef.current;
        if (element) {
          element.style.display = 'block';
          const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
          element.style.display = 'none';
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Payslip_${p.month}_${user?.full_name?.replace(/\s+/g, '_') || 'Employee'}.pdf`);
          toast.success('Payslip downloaded successfully!', { id: loadingToast });
        }
      } catch (err) {
        toast.error('Failed to generate PDF', { id: loadingToast });
      } finally {
        setPrintingId(null);
      }
    }, 150);
  };

  const pPrint = payslips.find(p => p.id === printingId) || null;

  return (
    <Layout title="My Payslips" subtitle="View your payroll history">
      <div className="grid gap-4 relative">
        {isLoading ? (
          <div className="h-24 bg-white/5 animate-pulse rounded-2xl" />
        ) : payslips.length > 0 ? (
          payslips.map(p => (
            <div key={p.id} className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{p.month}</h3>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">NET PAY: <span className="text-emerald-400 font-mono">${(p.net_salary || p.net_pay || 0).toLocaleString()}</span></p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="bg-[rgb(var(--color-surface-800))] rounded-xl px-4 py-2 border border-white/5">
                  <p className="text-slate-500 font-semibold mb-0.5">Base Salary</p>
                  <p className="text-slate-300 font-mono">${(p.base_salary || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[rgb(var(--color-surface-800))] rounded-xl px-4 py-2 border border-white/5">
                  <p className="text-slate-500 font-semibold mb-0.5">Bonus / Allowance</p>
                  <p className="text-emerald-400 font-mono">+${(p.bonus || p.allowance || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[rgb(var(--color-surface-800))] rounded-xl px-4 py-2 border border-white/5">
                  <p className="text-slate-500 font-semibold mb-0.5">Deductions</p>
                  <p className="text-rose-400 font-mono">-${(p.deductions || 0).toLocaleString()}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload(p)}
                disabled={printingId === p.id}
                className="bg-white/5 hover:bg-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors border border-white/5 flex items-center gap-2 disabled:opacity-50"
              >
                <span>{printingId === p.id ? '⏳' : '📄'}</span> {printingId === p.id ? 'Generating...' : 'Download'}
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl p-16 text-center" style={{ background: 'rgb(var(--color-surface-850))', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-4xl block mb-4">📄</span>
            <p className="text-slate-400 text-sm">No payslips available yet.</p>
          </div>
        )}

        {/* Hidden Printable Payslip Container */}
        {pPrint && (
          <div ref={printRef} style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px', width: '800px', backgroundColor: '#ffffff', padding: '40px', color: '#1a1a1a', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#4f46e5' }}>CorpHRM</h1>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Official Salary Statement</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Payslip - {pPrint.month}</h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '10px' }}>Employee Details</h3>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '18px' }}>{user?.full_name}</p>
                <p style={{ margin: '0 0 5px 0', color: '#4b5563' }}>Employee ID: {user?.employee_id || '—'}</p>
                <p style={{ margin: 0, color: '#4b5563' }}>Role: <span style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</span></p>
              </div>
              <div style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '10px' }}>Net Pay</h3>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>${(pPrint.net_salary || pPrint.net_pay || 0).toLocaleString()}</p>
              </div>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Earnings</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: '500' }}>Base Salary</td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace', fontSize: '16px' }}>${(pPrint.base_salary || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: '500' }}>Bonus & Allowances</td>
                    <td style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', textAlign: 'right', fontFamily: 'monospace', fontSize: '16px', color: '#10b981' }}>+ ${(pPrint.bonus || pPrint.allowance || 0).toLocaleString()}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', borderTop: '2px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>Deductions</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', borderTop: '2px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>Total Deductions (Absence, Late, etc.)</td>
                    <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontSize: '16px', color: '#ef4444' }}>- ${(pPrint.deductions || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
              <p>This is a computer generated document and requires no signature.</p>
              <p>CorpHRM Enterprise System • Confidential</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
