import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function BossChat() {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am Busy Boss Diet Assistant. How can I help you manage your organization today?' }]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Fetch all chat sessions
  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['boss-chat-sessions'],
    queryFn: () => api.get('/boss/chat/sessions').then(res => res.data)
  });

  // Fetch messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      api.get(`/boss/chat/sessions/${activeSessionId}/messages`).then(res => {
        const history = res.data.map(m => ({ role: m.role, text: m.content }));
        setMessages(history);
      });
    } else {
      setMessages([{ role: 'ai', text: 'Hello! I am Busy Boss Diet Assistant. How can I help you manage your organization today?' }]);
    }
  }, [activeSessionId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (msg) => api.post('/boss/chat', { message: msg, session_id: activeSessionId }).then(r => r.data),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
      if (!activeSessionId && data.session_id) {
        setActiveSessionId(data.session_id);
        queryClient.invalidateQueries(['boss-chat-sessions']);
      }
    },
    onError: (err) => {
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${err.response?.data?.error || 'Failed to reach AI'}` }]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/boss/chat/sessions/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries(['boss-chat-sessions']);
      if (activeSessionId === deletedId) {
        setActiveSessionId(null);
      }
    }
  });

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevent row click from activating the session
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(id);
    }
  };

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    chatMutation.mutate(userMsg);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
  };

  return (
    <Layout title="AI Assistant" subtitle="Gemini-powered HR intelligence">
      <div className="flex h-[calc(100vh-180px)] rounded-2xl overflow-hidden" style={{ background: 'var(--bg-800, #1e2235)', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Sidebar */}
        <div className="w-72 bg-surface-900 border-r border-white/5 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-white/5">
            <button 
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {loadingSessions ? (
              <div className="text-center text-slate-500 py-4 text-sm font-bold">Loading history...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-slate-500 py-4 text-sm">No recent chats</div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    activeSessionId === session.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                  onClick={() => setActiveSessionId(session.id)}
                >
                  <span className="truncate text-sm font-bold flex-1">{session.title}</span>
                  <button 
                    onClick={(e) => handleDelete(e, session.id)}
                    className="ml-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete Chat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-surface-800 text-slate-300 border border-white/5'}`}>
                  {m.role === 'ai' && <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Boss AI</div>}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-surface-800 text-slate-400 border border-white/5">
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-surface-850 border-t border-white/5">
            <form onSubmit={send} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-surface-900 border border-white/10 text-white px-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                disabled={chatMutation.isPending}
              />
              <button 
                type="submit" 
                disabled={chatMutation.isPending}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center justify-center"
              >
                Send
              </button>
            </form>
          </div>
        </div>

      </div>
    </Layout>
  );
}
