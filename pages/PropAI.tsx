
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { Send, Loader2, Sparkles, Bot, Globe, ExternalLink, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What's the ROI for Emerald Meadows?",
  "Explain the PropToken Value Rail.",
  "Show my portfolio risk assessment.",
  "Compare Sarjapur vs Nandi Hills trends.",
  "How do I liquidate my units to INR?"
];

const PropAI: React.FC = () => {
  const { user, wallet } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([
    { 
      role: 'model', 
      text: `Greetings ${user?.name}. I am the PropToken AI. I have analyzed your portfolio of ${(Object.values(wallet.tokensByAsset) as number[]).reduce((a, b) => a + (b as number), 0)} tokens across ${Object.values(wallet.tokensByAsset).filter(c => c > 0).length} assets. I can provide real-time market data, risk assessments, or explain the PropToken Value Rail. How can I assist you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input.trim();
    if (!messageToSend || isTyping) return;

    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      return;
    }

    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: messageToSend }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `
            You are "PropAI", a world-class institutional financial analyst for PropToken, a fractional real estate platform in India.
            Tone: Institutional, precise, professional, and data-driven.
            User Profile: ${user?.name}, Email: ${user?.email}.
            Current Portfolio: ${JSON.stringify(wallet.tokensByAsset)}.
            Internal Platform Assets: ${JSON.stringify(DUMMY_ASSETS)}.
            Guidelines:
            - Always use the Indian Rupee symbol (₹).
            - Use Google Search grounding for any real-world market questions.
            - Provide clear, concise answers.
            - If asked about "Value Rail", explain it as an end-to-end institutional highway for land verification, tokenization, and settlement.
          `,
          thinkingConfig: { thinkingBudget: 0 }
        },
      });

      let fullResponseText = '';
      let groundingSources: any[] = [];
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const textPart = chunk.text;
        if (textPart) {
          fullResponseText += textPart;
          const metadata = chunk.candidates?.[0]?.groundingMetadata;
          if (metadata?.groundingChunks) {
            groundingSources = [...groundingSources, ...metadata.groundingChunks];
          }

          setMessages(prev => {
            const historyWithoutLast = prev.slice(0, -1);
            return [
              ...historyWithoutLast, 
              { role: 'model', text: fullResponseText, sources: groundingSources }
            ];
          });
        }
      }
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      const errorMessage = error.message?.includes('API_KEY') 
        ? "Analyst connection refused. Secure API Key missing." 
        : "Neural link disruption. Please verify your connection to the PropToken Ledger.";
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: errorMessage 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'model', 
        text: `Resetting analyst session. Hello again, ${user?.name}. How can I assist with your real estate portfolio today?` 
      }
    ]);
  };

  if (apiKeyMissing) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-white dark:bg-slate-900 border-4 border-red-500 rounded-3xl text-center shadow-2xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase mb-4">Analyst Offline</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-8 leading-relaxed">
          The PropAI neural link requires an active Gemini API Key. Please configure <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">API_KEY</code> in your environment settings.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs btn-flat"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-b-4 border-slate-900 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              PropAI <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full align-middle ml-2 uppercase font-black tracking-widest">Active</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-500 font-black uppercase text-[9px] tracking-[0.3em] mt-1">Real-time Market Intelligence Analyst</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 border-2 border-slate-900 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Analyst
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border-4 border-slate-900 dark:border-slate-800 overflow-hidden flex flex-col shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {m.role === 'model' && (
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyst System</span>
                  </div>
                )}
                <div className={`p-6 rounded-2xl border-2 font-bold text-sm leading-relaxed transition-all ${
                  m.role === 'user' 
                  ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none shadow-[4px_4px_0px_rgba(79,70,229,0.2)]' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                    {m.sources.filter(s => s.web?.uri || s.web?.title).map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.web?.uri || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 transition-all text-slate-500 dark:text-slate-400"
                      >
                        <Globe className="w-3 h-3 text-indigo-500" />
                        {source.web?.title || `Ref ${idx + 1}`}
                        <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && !isTyping && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Quick Suggestions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 rounded-xl text-left text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-between group"
                  >
                    <span className="text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors uppercase text-[10px] tracking-tight">{prompt}</span>
                    <Sparkles className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-800 border-4 border-slate-900 p-5 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying Regional Market Data...</span>
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
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="bg-indigo-600 text-white px-8 rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center shrink-0 border-b-4 border-slate-900 active:transform active:scale-95"
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
