import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { crmApi } from '../../api/crm';

export default function AdminAICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'မင်္ဂလာပါ Admin ရှင့်! ကျွန်မက BBD ရဲ့ CRM AI Copilot ဖြစ်ပါတယ်။ CRM System တစ်ခုလုံးရဲ့ Customer Profile များ၊ Inactive List များ၊ Health History/Allergies များ၊ Package သက်တမ်းများနှင့် Sales/Lead Metrics အရာရာကို CRM Database ထဲမှ တိုက်ရိုက် တိကျစွာ ရှာဖွေပေးနိုင်ပါတယ်ရှင့်။ ဘာမေးမြန်းချင်ပါသလဲရှင့်။'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const [quotaInfo, setQuotaInfo] = useState(null);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await crmApi.askAiAssistant(userText);
      if (res.quota) setQuotaInfo(res.quota);
      setMessages(prev => [...prev, { role: 'ai', text: res.response }]);
    } catch (err) {
      const errMsg = err.response?.data?.response || err.message || 'AI Assistant Error';
      toast.error(err.response?.data?.error || 'AI Assistant Error');
      setMessages(prev => [...prev, { role: 'ai', text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text) => {
    // Extract Myanmar message section or copy full text
    navigator.clipboard.writeText(text);
    toast.success('📋 Copied AI response & Welcome Back message to clipboard!');
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-emerald-300/40 hover:scale-105 hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all flex items-center gap-2 group"
      >
        <span className="text-xl animate-bounce">✨</span>
        <span className="tracking-wide">Admin AI Copilot</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-surface-900 border-l border-white/10 shadow-2xl z-50 flex flex-col transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 bg-surface-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <h3 className="font-black text-white text-base">Admin CRM AI Copilot</h3>
              <p className="text-slate-400 text-xs font-medium">Memory Recall & Auto-Message Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-surface-800 text-slate-300 border border-white/10 rounded-tl-none shadow-lg'
                }`}
              >
                {m.role === 'ai' && (
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">✨ BBD Copilot</span>
                    <button
                      onClick={() => handleCopyMessage(m.text)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold transition-all border border-emerald-500/20 flex items-center gap-1"
                    >
                      📋 Copy Message
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-medium">
                  {m.text.split(/(\[.*?\]\(.*?\))/g).map((part, pIdx) => {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      return (
                        <Link
                          key={pIdx}
                          to={match[2]}
                          className="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold hover:underline border border-emerald-500/30"
                          onClick={() => setIsOpen(false)}
                        >
                          🔗 {match[1]}
                        </Link>
                      );
                    }
                    return part;
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-800 text-slate-400 p-4 rounded-2xl border border-white/5 flex items-center gap-3 text-xs">
                <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Database ရှာဖွေပြီး Memory Recall တွက်ချက်နေပါသည်...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Action Chips */}
        <div className="px-4 py-2 bg-surface-850 border-t border-white/5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setQuery('Test Customer 273 ကို ရှာပေးပါ'); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-all"
          >
            🔍 Test Customer 273
          </button>
          <button
            type="button"
            onClick={() => { setQuery('Inactive ဖြစ်နေတဲ့ customer တွေ ရှာပေးပါ'); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] border border-white/5 transition-all"
          >
            💤 Inactive Customer များ
          </button>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-4 bg-surface-850 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Customer အမည်၊ ဖုန်း သို့မဟုတ် ID ဖြင့် မေးပါ..."
            className="flex-1 bg-surface-900 border border-white/10 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}
