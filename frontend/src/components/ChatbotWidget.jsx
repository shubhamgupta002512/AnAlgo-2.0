import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AnAlgo assistant. Ask me anything about DSA concepts, complexity, or interview prep." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: text, history: newMessages.slice(-10) });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.response?.data?.message || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-violet-500 to-violet-700 text-xl text-white shadow-[0_18px_35px_rgba(124,58,237,0.45)] transition hover:-translate-y-0.5 hover:from-violet-400 hover:to-violet-600"
        aria-label="Open chat assistant"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-80 flex-col rounded-lg border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_30px_60px_rgba(2,6,23,0.9)] sm:w-96">
          <div className="rounded-t-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">AnAlgo Assistant</div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user' ? 'ml-auto bg-violet-600 text-white' : 'bg-slate-800 text-slate-100'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && <div className="px-1 text-sm text-slate-400">Thinking...</div>}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-700 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a doubt..."
              className="flex-1 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
