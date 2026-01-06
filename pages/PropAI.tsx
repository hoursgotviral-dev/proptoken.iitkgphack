
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { Send, Loader2, Sparkles, Bot, Globe, ExternalLink } from 'lucide-react';

const PropAI: React.FC = () => {
  const { user, wallet } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([
    { 
      role: 'model', 
      text: `Greetings ${user?.name}. I am the PropToken AI. I have analyzed your portfolio of ${(Object.values(wallet.tokensByAsset) as number[]).reduce((a, b) => a + (b as number), 0)} tokens. I can provide real-time market data, risk assessments, or explain our Value Rail. How can I assist you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = newMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `
            You are "PropAI", a world-class financial analyst for PropToken, a fractional real estate platform in India.
            Tone: Institutional, precise, data-driven.
            Data: Portfolio ${JSON.stringify(wallet.tokensByAsset)}, Internal Assets ${JSON.stringify(DUMMY_ASSETS)}.
            Guidelines: Use grounding for real-time market trends. Always use ₹.
          `,
          thinkingConfig: { thinkingBudget: 0 }
        },
      });

      let fullResponse = '';
      let groundingSources: any[] = [];
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of response) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullResponse += textChunk;
          const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (chunks) groundingSources = [...groundingSources, ...chunks];

          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, text: fullResponse, sources: groundingSources }];
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Synchronization error in the neural link. Please re-authenticate." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-b-4 border-slate-900 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">PropAI <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full align-middle ml-2 uppercase font-black tracking-widest">Active Analyst</span></h1>
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mt-1">Grounding & Real-time Market Intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border-4 border-slate-900 dark:border-slate-800 overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.role === 'model' && (
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Response</span>
                  </div>
                )}
                <div className={`p-6 rounded-2xl border-2 font-bold text-sm leading-relaxed transition-all ${
                  m.role === 'user' 
                  ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                    {m.sources.filter(s => s.web?.uri).map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all text-slate-500 dark:text-slate-400"
                      >
                        <Globe className="w-3 h-3 text-indigo-500" />
                        Ref {idx + 1}
                        <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-800 border-4 border-slate-900 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying Ledger Data...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t-4 border-slate-900 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Query ROI in Bengaluru or explain Value Rail..."
              className="flex-1 bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-slate-700 px-6 py-4 rounded-xl font-black outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all dark:text-slate-100 text-[11px] uppercase tracking-wider"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-indigo-600 text-white px-8 rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center shrink-0 border-b-4 border-slate-900"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAI;
