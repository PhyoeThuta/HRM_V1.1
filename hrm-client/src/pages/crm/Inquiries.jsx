import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';
import { getCrmSocket, joinInquiryRoom, leaveInquiryRoom, disconnectCrmSocket } from '../../lib/crmSocket';

export default function Inquiries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [wsStatus, setWsStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const selectedIdRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [selectedPackageForPaid, setSelectedPackageForPaid] = useState('');

  useEffect(() => {
    selectedIdRef.current = selectedInquiry?.id || null;
  }, [selectedInquiry?.id]);

  useEffect(() => {
    loadInquiries();
  }, []);

  // Realtime: customer (Zernio webhook) + agent replies + AI updates
  useEffect(() => {
    const socket = getCrmSocket();
    if (!socket) {
      setWsStatus('offline');
      return undefined;
    }

    const onConnect = () => setWsStatus('live');
    const onDisconnect = () => setWsStatus('offline');

    const onMessage = ({ inquiry_id, message }) => {
      if (!message?.id) return;

      setInquiries(prev => {
        const idx = prev.findIndex(i => i.id === inquiry_id);
        if (idx === -1) {
          loadInquiries();
          return prev;
        }
        const next = [...prev];
        const inq = { ...next[idx] };
        const existingMsgs = inq.inquiries_messages || [];
        if (!existingMsgs.some(m => m.id === message.id)) {
          inq.inquiries_messages = [...existingMsgs, message];
        }
        inq.updated_at = message.created_at || new Date().toISOString();
        next.splice(idx, 1);
        next.unshift(inq);
        return next;
      });

      if (selectedIdRef.current === inquiry_id) {
        setMessages(prev => (prev.some(m => m.id === message.id) ? prev : [...prev, message]));
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        if (message.sender_type === 'prospect') {
          toast('New customer message', { icon: '💬', duration: 2500 });
        }
      } else if (message.sender_type === 'prospect') {
        toast(`New message from a lead`, { icon: '💬', duration: 3000 });
      }
    };

    const onUpdated = ({ inquiry_id, inquiry }) => {
      if (!inquiry_id || !inquiry) return;
      setInquiries(prev => prev.map(i => (i.id === inquiry_id ? { ...i, ...inquiry } : i)));
      if (selectedIdRef.current === inquiry_id) {
        setSelectedInquiry(prev => (prev ? { ...prev, ...inquiry } : prev));
      }
    };

    const onCreated = ({ inquiry }) => {
      if (!inquiry?.id) return;
      setInquiries(prev => (prev.some(i => i.id === inquiry.id) ? prev : [{ ...inquiry, inquiries_messages: [] }, ...prev]));
      toast.success(`New lead: ${inquiry.prospect_name}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('inquiry:message', onMessage);
    socket.on('inquiry:updated', onUpdated);
    socket.on('inquiry:created', onCreated);
    if (socket.connected) setWsStatus('live');

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('inquiry:message', onMessage);
      socket.off('inquiry:updated', onUpdated);
      socket.off('inquiry:created', onCreated);
      disconnectCrmSocket();
    };
  }, []);

  useEffect(() => {
    const id = selectedInquiry?.id;
    if (!id) return undefined;
    joinInquiryRoom(id);
    return () => leaveInquiryRoom(id);
  }, [selectedInquiry?.id]);

  const location = useLocation();

  const loadInquiries = () => {
    crmApi.getInquiries().then(data => {
      setInquiries(data);
      if (data.length > 0 && !selectedIdRef.current) {
        const queryParams = new URLSearchParams(location.search);
        const urlId = queryParams.get('id');
        if (urlId) {
          const targetInquiry = data.find(i => i.id === parseInt(urlId));
          if (targetInquiry) {
            handleSelectInquiry(targetInquiry);
            return;
          }
        }
        handleSelectInquiry(data[0]);
      } else if (selectedIdRef.current) {
        const updated = data.find(i => i.id === selectedIdRef.current);
        if (updated) setSelectedInquiry(prev => ({ ...prev, ...updated }));
      }
    }).catch(() => toast.error('Failed to load inquiries'));

    crmApi.getPackages().then(data => setPackages(data)).catch(() => console.error('Failed to load packages'));
  };

  const handleCreateTestLead = async () => {
    try {
      await crmApi.createInquiry({
        prospect_name: 'Test Customer ' + Math.floor(Math.random() * 1000),
        source: 'messenger',
        service_interest: 'Boss Diet'
      });
      toast.success('Test Lead created!');
      setTimeout(loadInquiries, 300);
    } catch (err) {
      toast.error('Failed to create test lead');
    }
  };

  const handleSelectInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    try {
      const msgs = await crmApi.getInquiryMessages(inquiry.id);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView(), 100);
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleDeleteInquiry = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this lead forever?')) return;
    try {
      await crmApi.deleteInquiry(id);
      toast.success('Lead deleted');
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
        setMessages([]);
      }
      loadInquiries();
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedInquiry) return;
    setIsSending(true);
    try {
      const msg = await crmApi.postInquiryMessage(selectedInquiry.id, {
        message_text: newMessage,
        sender_type: 'admin'
      });
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await crmApi.generateOnboardingLink(selectedInquiry.id);
      if (res.link) {
        await navigator.clipboard.writeText(res.link);
        toast.success('Onboarding link copied to clipboard!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to generate link');
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedPackageForPaid) {
      toast.error('Please select a package first');
      return;
    }
    const pkg = packages.find(p => p.id === parseInt(selectedPackageForPaid));
    
    setIsSending(true);
    try {
      await crmApi.markPaid(selectedInquiry.id, pkg);
      toast.success('Marked as Paid! Customer will receive the form link via AI bot.', { duration: 4000 });
      setShowPaidModal(false);
      loadInquiries();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to mark paid');
    } finally {
      setIsSending(false);
    }
  };

  // Simulate a prospect replying.
  const handleSimulateProspect = async () => {
    if (!selectedInquiry) return;
    try {
      const msg = await crmApi.postInquiryMessage(selectedInquiry.id, {
        message_text: "Can you tell me more about your meal plans?",
        sender_type: 'prospect'
      });
      toast.success('Simulated prospect reply');
    } catch (err) {
      toast.error('Simulation failed');
    }
  };

  return (
    <Layout title="Inbox & Leads">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Pane: Inquiries List */}
        <div className="w-full md:w-1/3 bg-surface-800 border border-white/5 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-surface-850">
            <h2 className="font-black text-white text-lg flex items-center gap-2">
              Inbox
              <span className={`w-2 h-2 rounded-full ${wsStatus === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} title={`Socket: ${wsStatus}`}></span>
            </h2>
            <button 
              onClick={handleCreateTestLead} 
              className="px-3 py-1.5 bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-black rounded-lg text-xs font-bold transition-colors"
            >
              + Test Lead
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {inquiries.length === 0 ? (
              <p className="text-slate-500 text-sm p-4 text-center">No leads yet.</p>
            ) : (
              inquiries.map(inq => (
                <div 
                  key={inq.id} 
                  onClick={() => handleSelectInquiry(inq)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedInquiry?.id === inq.id 
                      ? 'bg-brand-green/10 border-brand-green/30 shadow-sm' 
                      : 'bg-surface-900 border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                        {inq.prospect_name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-white text-sm">{inq.prospect_name}</h4>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteInquiry(inq.id, e)}
                      className="text-slate-600 hover:text-rose-500 transition-colors px-1"
                      title="Delete Lead"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md">
                      {inq.source}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      inq.status === 'New' ? 'bg-rose-500/20 text-rose-400' :
                      inq.status === 'Chatting' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {inq.inquiries_messages && inq.inquiries_messages.length > 0 
                      ? inq.inquiries_messages[inq.inquiries_messages.length-1].message_text 
                      : 'No messages yet...'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Chat & AI Analysis */}
        <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-6">
          
          {/* Chat Window */}
          <div className="flex-1 bg-surface-800 border border-white/5 rounded-3xl shadow-xl flex flex-col overflow-hidden">
            {selectedInquiry ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 bg-surface-850 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-500/30">
                      {selectedInquiry.prospect_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-white">{selectedInquiry.prospect_name}</h3>
                      <p className="text-xs text-slate-400">{selectedInquiry.prospect_contact || 'No contact provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedInquiry.customer_id ? (
                      <button 
                        onClick={() => navigate(`/crm/customers/${selectedInquiry.customer_id}`)} 
                        className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        ✓ Form Completed — View Profile
                      </button>
                    ) : selectedInquiry.onboarding_status === 'form_sent' ? (
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1">
                          ⏳ Waiting for Form
                        </span>
                        <button 
                          onClick={handleGenerateLink} 
                          className="px-3 py-1.5 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          title="Copy Link Manually"
                        >
                          🔗 Copy Link
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowPaidModal(true)} 
                        className="px-4 py-1.5 bg-brand-green text-black hover:scale-105 rounded-lg text-sm font-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1"
                      >
                        💰 Mark as Paid
                      </button>
                    )}
                    <button onClick={handleSimulateProspect} className="px-3 py-1.5 bg-white/5 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-white/10 transition-colors">
                      Simulate Reply 🤖
                    </button>
                  </div>
                </div>

                {/* Messages Area - Messenger Style */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#1e2330]">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">Start the conversation...</div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isAdmin = msg.sender_type === 'admin' || msg.sender_type === 'ai_bot';
                      const hasImage = msg.metadata?.imageUrl;
                      const showAvatar = !isAdmin;
                      
                      return (
                        <div key={msg.id || idx} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex max-w-[75%] gap-2 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {showAvatar && (
                              <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-300 mt-auto mb-1">
                                {selectedInquiry.prospect_name.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="flex flex-col gap-1">
                              <div className={`px-4 py-2.5 shadow-sm ${
                                isAdmin 
                                  ? 'bg-[#0A7CFF] text-white rounded-[20px] rounded-br-sm' 
                                  : 'bg-[#3A3B3C] text-[#E4E6EB] rounded-[20px] rounded-bl-sm'
                              }`}>
                                {hasImage && (
                                  <img 
                                    src={msg.metadata.imageUrl} 
                                    alt="attachment" 
                                    className="max-w-full rounded-[14px] mb-2 object-cover max-h-64 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(msg.metadata.imageUrl, '_blank')}
                                  />
                                )}
                                {msg.message_text && !msg.message_text.includes('[Zernio Msg]') && !msg.message_text.startsWith('{"id":') && !msg.message_text.startsWith('{"event":') && !msg.message_text.includes('"event":"message.received"') && (
                                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                                )}
                              </div>
                              <div className={`text-[10px] text-slate-500 px-1 flex items-center gap-1.5 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <span className="uppercase font-semibold opacity-70">
                                  {msg.sender_type === 'ai_bot' ? '🤖 AI' : msg.sender_type}
                                </span>
                                <span>•</span>
                                <span>{new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/5 bg-surface-850">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..." 
                      className="flex-1 bg-surface-900 border border-white/10 rounded-full px-5 py-3 text-white focus:outline-none focus:border-brand-green transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="w-12 h-12 bg-brand-green text-black font-black rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 font-medium">
                Select an inquiry to view conversation
              </div>
            )}
          </div>

          {/* AI Analysis Sidebar */}
          {selectedInquiry && (
            <div className="w-full md:w-64 bg-surface-800 border border-indigo-500/20 rounded-3xl p-5 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              
              <h3 className="font-black text-white mb-6 flex items-center gap-2">
                <span>✨</span> AI Insights
              </h3>

              <div className="space-y-6 flex-1">
                {/* Confidence Score */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Purchase Confidence</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{selectedInquiry.service_interest_confidence || 0}</span>
                    <span className="text-slate-500 mb-1 font-bold">%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedInquiry.service_interest_confidence > 75 ? 'bg-emerald-500' :
                        selectedInquiry.service_interest_confidence > 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${selectedInquiry.service_interest_confidence || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Analysis Result */}
                {selectedInquiry.ai_analysis_result ? (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Detected Intent</p>
                      <p className="text-indigo-400 font-bold bg-indigo-500/10 inline-block px-2 py-1 rounded-md text-sm">
                        {selectedInquiry.ai_analysis_result.intent || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Sentiment</p>
                      <p className="text-white font-medium capitalize text-sm">
                        {selectedInquiry.ai_analysis_result.sentiment || 'Neutral'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Action</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selectedInquiry.ai_analysis_result.recommended_action || 'Continue assisting the customer.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/5 text-center text-slate-500 text-sm">
                    Waiting for enough messages to analyze...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mark Paid Modal */}
      {showPaidModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-800 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-black text-white mb-2">💰 Approve Payment</h2>
            <p className="text-sm text-slate-400 mb-6">Select the package the customer paid for. This will automatically send them the enrollment form via Messenger.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-300 mb-2">Purchased Package</label>
              <select 
                value={selectedPackageForPaid}
                onChange={(e) => setSelectedPackageForPaid(e.target.value)}
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-green transition-colors"
              >
                <option value="">-- Select Package --</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price} THB</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowPaidModal(false)}
                disabled={isSending}
                className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-400 bg-surface-900 border border-white/5 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleMarkPaid}
                disabled={!selectedPackageForPaid || isSending}
                className="flex-1 px-5 py-3 rounded-xl font-black text-black bg-brand-green hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Confirm Paid'}
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
