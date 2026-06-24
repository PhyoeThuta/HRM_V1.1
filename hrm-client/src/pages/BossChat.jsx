import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import api from '../api/client';

export default function BossChat() {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am CorpHRM Assistant. How can I help you manage your organization today?' }]);
  const [input, setInput] = useState('');

  const chatMutation = useMutation({
    mutationFn: (msg) => api.post('/boss/chat', { message: msg }).then(r => r.data),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    },
    onError: (err) => {
      setMessages(prev => [...prev, { role: 'ai', text: `Error: ${err.response?.data?.error || 'Failed to reach AI'}` }]);
    }
  });

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    chatMutation.mutate(userMsg);
  };

  return (
    <Layout title="AI Assistant" subtitle="Gemini-powered HR intelligence">
      <div className="flex flex-col h-[calc(100vh-180px)] rounded-2xl overflow-hidden" style={{ background: '#1e2235', border: '1px solid rgba(255,255,255,0.05)' }}>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {chatMutation.isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-slate-800 text-slate-400">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#161929] border-t border-white/5">
          <form onSubmit={send} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about HR data..."
              className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={chatMutation.isLoading}
            />
            <button 
              type="submit" 
              disabled={chatMutation.isLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
            >
              Send
            </button>
          </form>
        </div>
        
      </div>
    </Layout>
  );
}
