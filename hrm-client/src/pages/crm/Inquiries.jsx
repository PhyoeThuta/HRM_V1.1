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
          // Unknown thread — refresh list
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
  };

  const handleCreateTestLead = async () => {
    try {
      await crmApi.createInquiry({
        prospect_name: 'Test Customer ' + Math.floor(Math.random() * 1000),
        source: 'messenger',
        service_interest: 'Boss Diet'
      });
      toast.success('Test Lead created!');
      // Realtime inquiry:created will update list; fallback refresh
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
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleDeleteInquiry = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this test data?')) return;
    try {
      await crmApi.deleteInquiry(id);
      toast.success('Deleted successfully');
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      loadInquiries();
    } catch (err) {
      toast.error('Failed to delete');
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
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
      setNewMessage('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      // AI insights arrive via inquiry:updated websocket — no fixed delay needed
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

  // Simulate a prospect replying. This now triggers the REAL Gemini AI on the backend!
  const handleSimulateProspect = async () => {
    if (!selectedInquiry) return;
    setIsSending(true);
    try {
      const msg = await crmApi.postInquiryMessage(selectedInquiry.id, {
        message_text: "Hi, I am interested in losing weight. How much does a 30-day package cost?",
        sender_type: 'prospect'
      });
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      toast.success('Prospect message sent — AI analysis will update live', { duration: 3000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to simulate message');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in_progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'converted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'closed': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'messenger': return '💬';
      case 'telegram': return '✈️';
      case 'website': return '🌐';
      case 'instagram': return '📸';
      default: return '📱';
    }
  };

  return (
    <Layout title="Omni-channel Inbox" subtitle="AI-powered customer inquiries and messaging">
      <div className="mb-4">
        <button onClick={() => navigate('/crm')} className="text-slate-400 hover:text-white font-bold flex items-center gap-2 transition-colors">
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        
        {/* Left Pane: Inbox List */}
        <div className="w-full md:w-1/3 bg-surface-800 border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-4 border-b border-white/5 bg-surface-850">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg">Inbox ({inquiries.length})</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    wsStatus === 'live'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}
                  title="Realtime connection to customer messages"
                >
                  {wsStatus === 'live' ? '● Live' : '○ Offline'}
                </span>
              </div>
              <button onClick={handleCreateTestLead} className="px-2 py-1 bg-brand-green/20 text-brand-green hover:bg-brand-green hover:text-black rounded-lg text-xs font-bold transition-colors">
                + New Lead
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white">All</button>
              <button className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-transparent border border-white/10 text-slate-400 hover:text-white hover:bg-white/5">New</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500">No inquiries found.</p>
                <button onClick={handleCreateTestLead} className="px-4 py-2 bg-brand-green text-black font-bold rounded-xl hover:scale-105 transition-transform">
                  Create Test Lead
                </button>
              </div>
            ) : (
              inquiries.map(inq => (
                <div 
                  key={inq.id}
                  onClick={() => handleSelectInquiry(inq)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedInquiry?.id === inq.id 
                      ? 'bg-brand-green/5 border-brand-green/30' 
                      : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lime-400 group-hover:text-lime-300 transition-colors">
                        {inq.prospect_name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {new Date(inq.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button 
                          onClick={(e) => handleDeleteInquiry(inq.id, e)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{getSourceIcon(inq.source)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(inq.status)}`}>
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
                    ) : (
                      <button 
                        onClick={handleGenerateLink} 
                        className="px-3 py-1.5 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        🔗 Get Onboarding Link
                      </button>
                    )}
                    <button onClick={handleSimulateProspect} className="px-3 py-1.5 bg-white/5 text-slate-300 hover:text-white rounded-lg text-xs font-bold border border-white/10 transition-colors">
                      Simulate Reply 🤖
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">Start the conversation...</div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isAdmin = msg.sender_type === 'admin' || msg.sender_type === 'ai_bot';
                      return (
                        <div key={msg.id || idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            isAdmin 
                              ? 'bg-brand-green/20 text-brand-green border border-brand-green/30 rounded-tr-none' 
                              : 'bg-white/10 text-slate-200 border border-white/10 rounded-tl-none'
                          }`}>
                            <p className="text-sm font-medium whitespace-pre-wrap">{msg.message_text}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 mx-1 font-medium uppercase">
                            {msg.sender_type} • {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
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
                      className="flex-1 bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-green transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="px-6 py-2.5 bg-brand-green text-black font-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                    >
                      {isSending ? '...' : 'Send'}
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
                        {selectedInquiry.ai_analysis_result.recommended_action || 'Continue conversation naturally.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/5 text-center text-slate-500 text-sm">
                    No AI analysis available yet. Wait for customer response.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
