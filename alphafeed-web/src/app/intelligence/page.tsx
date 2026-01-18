"use client";
import { useState, useEffect, useRef } from 'react';
import { askIntelligence, fetchSystemStatus } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, Cpu, Activity, Globe, ShieldCheck, 
  ArrowUp, Link as LinkIcon, Database, Terminal, Clock 
} from 'lucide-react';

// --- TYPES ---
interface Source {
  title: string;
  domain: string;
  url: string;
}

interface IntelligenceData {
  ticker: string;
  price: string;
  change: string;
  sentiment: {
    score: number;
    label: string;
    delta: string;
  };
  sources: Source[];
}

// FIX: Explicitly allow 'data' to be null
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  data?: IntelligenceData | null;
}

export default function IntelligencePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>({ status: "CONNECTING...", latency: "--" });
  
  const [activeStreams, setActiveStreams] = useState(14);
  const [globalSentiment, setGlobalSentiment] = useState(72); 
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. LOAD HISTORY ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('alphafeed_chat_history');
    if (savedHistory) {
      try { setMessages(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    fetchSystemStatus().then(setSystemStatus);
    setIsLoaded(true);
    
    const interval = setInterval(() => {
        setActiveStreams(p => Math.max(12, Math.min(25, p + Math.floor(Math.random() * 3) - 1)));
        setGlobalSentiment(p => Math.max(10, Math.min(95, p + Math.floor(Math.random() * 5) - 2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. SAVE HISTORY ---
  useEffect(() => {
    if (isLoaded) localStorage.setItem('alphafeed_chat_history', JSON.stringify(messages));
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoaded, isThinking]);

  // --- HANDLER ---
  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput(""); 
    setIsThinking(true);

    try {
      const rawResponse = await askIntelligence(userMsg.content);
      
      // FIX: Ensure 'role' is typed correctly and 'data' can be null
      const aiResponse: Message = {
          id: rawResponse.id,
          role: 'assistant',
          content: rawResponse.content,
          timestamp: rawResponse.timestamp,
          data: rawResponse.data
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSentimentColor = (score: number) => {
      if (score >= 60) return "text-[#d2fc52] bg-[#d2fc52]/10 border-[#d2fc52]/20";
      if (score <= 40) return "text-red-500 bg-red-500/10 border-red-500/20";
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans">
      
      {/* LEFT: CHAT INTERFACE */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Header (Cleaned) */}
        <div className="h-14 border-b border-[#2d333b] flex items-center justify-between px-6 bg-[#0d1016]/80 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
                <Cpu size={18} className="text-[#d2fc52]"/> 
                <span className="font-bold text-white tracking-tight">AlphaFeed Intelligence</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Connected to Neural Core
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-80 pb-20">
                   <Cpu size={48} className="text-[#d2fc52] mb-4"/>
                   <h1 className="text-3xl font-bold text-white mb-2">AlphaFeed Intelligence</h1>
                   <p className="text-gray-400">Ask about Stocks, Crypto, or Global Markets.</p>
                </div>
            )}

            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-5 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {msg.role === 'user' ? (
                        <div className="bg-[#2a303c] text-white px-5 py-3 rounded-2xl rounded-tr-none border border-[#30363d] max-w-[80%] shadow-lg">
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 w-full max-w-[90%]">
                            <div className="w-8 h-8 rounded-lg bg-[#d2fc52] flex items-center justify-center shrink-0 mt-1">
                                <Sparkles size={16} className="text-black" />
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div className="text-gray-200 text-sm leading-7 font-medium prose prose-invert max-w-none">
                                    <ReactMarkdown components={{
                                        strong: ({...props}) => <span className="text-[#d2fc52] font-black" {...props} />,
                                        h3: ({...props}) => <h3 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                        ul: ({...props}) => <ul className="list-disc pl-4 space-y-1 mb-4" {...props} />
                                    }}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>

                                {msg.data && msg.data.ticker !== 'GENERAL' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        
                                        {/* Market Data */}
                                        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Market Data</span>
                                                <Activity size={14} className="text-[#d2fc52]" />
                                            </div>
                                            <div className="flex items-end gap-3">
                                                <span className="text-2xl font-black text-white">{msg.data.ticker}</span>
                                                <span className="text-xl font-mono text-gray-300">{msg.data.price}</span>
                                            </div>
                                            <div className={`text-xs font-bold mt-1 ${msg.data.change.includes("-") ? "text-red-500" : "text-[#3fb950]"}`}>
                                                {msg.data.change} (24h)
                                            </div>
                                        </div>

                                        {/* Sentiment */}
                                        <div className={`border rounded-xl p-4 flex flex-col justify-between ${getSentimentColor(msg.data.sentiment.score)}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-bold opacity-70 uppercase">Sentiment</span>
                                                <ShieldCheck size={14} />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-3xl font-black">{msg.data.sentiment.score}/100</span>
                                            </div>
                                            <div className="text-xs font-bold mt-1 uppercase opacity-90">
                                                {msg.data.sentiment.label} • {msg.data.sentiment.delta}
                                            </div>
                                        </div>

                                        {/* Verified Sources */}
                                        {msg.data.sources && msg.data.sources.length > 0 && (
                                            <div className="md:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Database size={12} className="text-gray-500"/>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified Sources</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.data.sources.map((source, i) => (
                                                        <a 
                                                            key={i} 
                                                            href={source.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#0d1016] border border-[#30363d] rounded-lg hover:border-[#d2fc52] hover:bg-[#1c2128] transition-all group cursor-pointer"
                                                        >
                                                            <Globe size={10} className="text-gray-500 group-hover:text-[#d2fc52]"/>
                                                            <span className="text-xs text-gray-300 group-hover:text-white truncate max-w-[150px]">{source.title}</span>
                                                            <LinkIcon size={8} className="text-gray-600 group-hover:text-[#d2fc52]"/>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {isThinking && <div className="pl-12 text-xs text-gray-500 animate-pulse">AlphaFeed is thinking...</div>}
            <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#0d1016] relative z-20">
            <div className="max-w-4xl mx-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d2fc52] to-[#2a303c] rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
                <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl flex items-center p-2 shadow-2xl">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask AlphaFeed..."
                        className="flex-1 bg-transparent text-white px-4 py-3 outline-none text-sm placeholder-gray-600"
                        disabled={isThinking}
                    />
                    <button onClick={() => handleSend()} disabled={!input.trim() || isThinking} className={`p-2 rounded-lg transition-all ${input.trim() ? 'bg-[#d2fc52] text-black' : 'bg-[#2a303c] text-gray-500'}`}>
                        <ArrowUp size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Sidebar with Widgets */}
      <div className="w-80 bg-[#161b22] border-l border-[#2d333b] hidden xl:flex flex-col shrink-0">
          
          {/* 1. Live Connection */}
          <div className="p-6 border-b border-[#2d333b]">
              <div className="bg-[#0d1016] border border-[#30363d] rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                      <Globe size={14} className="text-[#d2fc52]"/>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Connection</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="relative"><div className="w-3 h-3 bg-[#3fb950] rounded-full"></div><div className="w-3 h-3 bg-[#3fb950] rounded-full absolute top-0 left-0 animate-ping opacity-75"></div></div>
                      <div>
                          <div className="text-lg font-bold text-white">{activeStreams} Active Streams</div>
                          <div className="text-[10px] text-gray-500">Bloomberg, Reuters, SEC EDGAR</div>
                      </div>
                  </div>
              </div>
          </div>

          {/* 2. Sentiment Gauge */}
          <div className="p-6 border-b border-[#2d333b]">
              <div className="bg-[#0d1016] border border-[#30363d] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                      <Activity size={14} className="text-blue-400"/>
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sentiment Gauge</span>
                  </div>
                  <div className="text-2xl font-black text-white mb-2">
                      {globalSentiment > 75 ? "Extreme Greed" : (globalSentiment < 25 ? "Extreme Fear" : "Neutral")}
                  </div>
                  <div className="h-2 w-full bg-[#2a303c] rounded-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-500 via-yellow-500 to-[#d2fc52]"></div>
                      <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_10px_white] transition-all duration-1000 ease-out" style={{ left: `${globalSentiment}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-mono uppercase"><span>Bearish</span><span>Bullish</span></div>
              </div>
          </div>

          {/* 3. History List */}
          <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                  <Clock size={14}/>
                  <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
              </div>
              <div className="space-y-3">
                  {messages.filter(m => m.role === 'user').slice(-6).reverse().map((m, i) => (
                      <div key={i} onClick={() => handleSend(m.content)} className="p-3 bg-[#0d1016] border border-[#30363d] rounded-lg text-xs text-gray-300 truncate cursor-pointer hover:border-[#d2fc52] hover:text-white transition-all">
                          {m.content}
                      </div>
                  ))}
              </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#0d1016] border-t border-[#2d333b] text-[10px] text-gray-500 flex justify-between">
              <div className="flex items-center gap-1.5"><Terminal size={10}/><span>{systemStatus.status}</span></div>
              <span>{systemStatus.latency}</span>
          </div>
      </div>
    </div>
  );
}