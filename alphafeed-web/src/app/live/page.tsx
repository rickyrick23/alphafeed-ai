"use client";
import { useState, useEffect } from 'react';
import { fetchLiveNews } from '@/lib/api';
import { 
  Radio, RefreshCw, Clock, ExternalLink 
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: string;
  category: string;
  impact: number;
  url: string; // Updated Interface
}

export default function LiveFeedPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
        fetchLiveNews().then(newBatch => {
            setNews(prev => [newBatch[0], ...prev].slice(0, 50)); 
        });
    }, 8000); 
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchLiveNews();
    setNews(data);
    setLoading(false);
  };

  const filteredNews = filter === "ALL" 
    ? news 
    : news.filter(item => item.category === filter);

  const getSentimentStyle = (sentiment: string) => {
    if (sentiment === "BULLISH") return "bg-[#d2fc52]/10 text-[#d2fc52] border-[#d2fc52]/20";
    if (sentiment === "BEARISH") return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  return (
    <div className="flex flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans">
      
      {/* LEFT: MAIN FEED */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Header */}
        <div className="h-16 border-b border-[#2d333b] flex items-center justify-between px-6 bg-[#0d1016]/90 backdrop-blur z-10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Radio size={20} className="text-red-500 animate-pulse" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">Live Market Terminal</h1>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                        <span>Latency: 24ms</span>
                        <span className="text-[#3fb950]">● Stream Active</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${autoRefresh ? 'bg-[#1c2128] border-[#30363d] text-[#d2fc52]' : 'border-red-900/50 text-gray-500'}`}
                >
                    <RefreshCw size={12} className={autoRefresh ? "animate-spin" : ""} />
                    {autoRefresh ? "AUTO-SYNC ON" : "PAUSED"}
                </button>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto border-b border-[#2d333b] bg-[#0d1016]">
            {["ALL", "INDIA", "CRYPTO", "TECH", "MACRO"].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        filter === cat 
                        ? "bg-white text-black border-white" 
                        : "bg-[#161b22] text-gray-400 border-[#30363d] hover:border-gray-500"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* News Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
            {loading && news.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-40 text-gray-500 animate-pulse">
                    <RefreshCw size={24} className="animate-spin mb-2"/>
                    <span className="text-xs font-mono">ESTABLISHING UPLINK...</span>
                 </div>
            ) : (
                filteredNews.map((item) => (
                    <a 
                        key={item.id} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group relative bg-[#161b22] border border-[#30363d] rounded-xl p-4 hover:border-[#d2fc52] transition-all cursor-pointer hover:bg-[#1c2128]"
                    >
                        
                        {/* Sentiment Strip */}
                        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${item.sentiment === "BULLISH" ? "bg-[#d2fc52]" : (item.sentiment === "BEARISH" ? "bg-red-500" : "bg-blue-500")}`}></div>

                        <div className="pl-4 flex flex-col gap-2">
                            {/* Meta Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 bg-[#0d1016] px-2 py-0.5 rounded border border-[#30363d]">
                                        {item.source}
                                    </span>
                                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                        <Clock size={10} /> {item.time}
                                    </span>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentimentStyle(item.sentiment)}`}>
                                    {item.sentiment}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors pr-6">
                                {item.title}
                            </h3>

                            {/* External Link Icon */}
                            <ExternalLink size={12} className="absolute top-4 right-4 text-gray-600 group-hover:text-[#d2fc52] transition-colors" />
                        </div>
                    </a>
                ))
            )}
        </div>
      </div>
    </div>
  );
}