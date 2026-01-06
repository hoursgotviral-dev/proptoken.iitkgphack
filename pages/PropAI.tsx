
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { Bot, Send, Loader2, Sparkles, MessageSquare, ShieldAlert, TrendingUp, Globe, ExternalLink } from 'lucide-react';

const PropAI: React.FC = () => {
  const { user, wallet } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([
    { 
      role: 'model', 
      text: `Greetings ${user?.name}. I am the PropToken AI. I have analyzed your portfolio of ${(Object.values(wallet.tokensByAsset) as number[]).reduce((a: number, b: number) => a + b, 0)} tokens. I can provide real-time market data, risk assessments, or explain our Value Rail. How can I assist you today?` 
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
    
    // Add user message to state
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare history for context-aware chat
      const history = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `
            You are "PropAI", a world-class financial analyst for PropToken, a fractional real estate platform in India.
            
            Contextual Awareness:
            - User: ${user?.name}
            - Current Portfolio: ${JSON.stringify(wallet.tokensByAsset)}
            - Real-world Market: Use Google Search to find latest Indian Real Estate (Bangalore, Chennai, etc.) trends if asked.
            - Internal Assets: ${JSON.stringify(DUMMY_ASSETS)}
            
            Behavioral Guidelines:
            - Tone: High-end, technical, and precise.
            - Formatting: Use Markdown for lists or emphasis.
            - Currency: Always use Indian Rupees (₹).
            - Mission: Guide users through the Value Rail (Verify -> Tokenize -> Swap -> Pay).
          `,
        },
      });

      let fullResponse = '';
      let groundingSources: any[] = [];
      
      // Add empty message for streaming
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullResponse += textChunk;
          
          // Capture grounding metadata if available in this chunk or final response
          const chunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (chunks) {
            groundingSources = chunks;
          }

          setMessages(prev => {
            const last = prev[prev.length - 1];
            const updated = { ...last, text: fullResponse, sources: groundingSources };
            return [...prev.slice(0, -1), updated];
          });
        }
      }
    } catch (error) {
      console.error("PropAI Stream Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The PropToken ledger link experienced a synchronization error. Please try your request again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            PropAI <Sparkles className="text-indigo-600 w-8 h-8" />
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Grounding with Real-Time Market Data</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border-4 border-slate-900 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-6 rounded-2xl border-2 font-medium text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.sources.map((source, idx) => (
                      source.web?.uri && (
                        <a 
                          key={idx}
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-800"
                        >
                          <Globe className="w-3 h-3" />
                          Source {idx + 1}
                          <ExternalLink className="w-2 h-2" />
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length-1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consulting Live Market...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t-4 border-slate-900 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Ask about current plot appreciation in Bengaluru..."
              className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-700 px-6 py-4 rounded-xl font-bold outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all dark:text-slate-100"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: Globe, text: "Market Trends 2024" },
              { icon: TrendingUp, text: "Compare Asset Yields" },
              { icon: ShieldAlert, text: "Regulatory Audit" },
              { icon: MessageSquare, text: "Explain Value Rail" }
            ].map((btn, i) => (
              <button 
                key={i}
                onClick={() => setInput(btn.text)}
                className="whitespace-nowrap flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <btn.icon className="w-3 h-3" /> {btn.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAI;
