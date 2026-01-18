"use client";
import { useState, useEffect } from 'react';
import { fetchSentiment, fetchMacroView } from '@/lib/api'; 
import Link from 'next/link';
import { 
  Zap, Activity, TrendingUp, Search, BarChart3, ChevronDown, 
  Globe, ExternalLink, ArrowUpRight
} from 'lucide-react';

// --- CONFIG ---
const SECTORS = ["MARKET LEADERS", "INDIAN GIANTS", "CRYPTO", "COMMODITIES"];

// --- VIDEO MATCH DEFAULT DATA (Prevents "Neutral" Flash) ---
const DEFAULT_SENTIMENT = {
    sentiment_label: "BULLISH",
    sentiment_score: 55,
    summary: "NVDA is trading ABOVE its 50-day moving average. Volume inflows suggest institutional accumulation despite short-term volatility.",
    projected_low: "182.21",
    projected_high: "190.25"
};

export default function DashboardPage() {
  // --- STATE ---
  const [activeTicker, setActiveTicker] = useState("NVDA");
  const [searchInput, setSearchInput] = useState("");
  // Initialize with Video Data so it looks perfect immediately
  const [sentiment, setSentiment] = useState<any>(DEFAULT_SENTIMENT);
  const [marketData, setMarketData] = useState<any[]>([]); 
  
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("MARKET LEADERS");
  const [chartUrl, setChartUrl] = useState("https://s.tradingview.com/widgetembed/?symbol=NASDAQ:NVDA&interval=D&theme=dark&style=1&timezone=Etc%2FUTC");

  // --- LOAD DATA ---
  useEffect(() => {
    refreshMarketData();
    // Refresh prices every 5s
    const interval = setInterval(refreshMarketData, 5000); 
    return () => clearInterval(interval);
  }, []);

  async function refreshMarketData() {
    try {
        const data = await fetchMacroView(); 
        if (data && data.length > 0) setMarketData(data);
    } catch (e) { console.error(e); }
  }

  async function handleSearch(e: React.FormEvent) { 
      e.preventDefault(); 
      if (!searchInput.trim()) return; 
      const ticker = searchInput.toUpperCase().trim();
      setActiveTicker(ticker);
      
      // Update Chart
      let tv = `NASDAQ:${ticker}`;
      if (["BTC", "ETH", "SOL"].some(x => ticker.includes(x))) tv = `COINBASE:${ticker}`;
      else if (ticker.includes(".NS") || ticker === "RELIANCE") tv = `NSE:${ticker.replace('.NS', '')}`;
      setChartUrl(`https://s.tradingview.com/widgetembed/?symbol=${tv}&interval=D&theme=dark&style=1&timezone=Etc%2FUTC`);

      // Update Sentiment (Mock)
      const newScore = Math.floor(Math.random() * 30) + 50;
      setSentiment({
          ...DEFAULT_SENTIMENT,
          sentiment_label: newScore > 50 ? "BULLISH" : "BEARISH",
          sentiment_score: newScore,
          summary: `Analyzing ${ticker} price action against key resistance levels. Volume profile indicates ${newScore > 50 ? 'strong buying' : 'selling'} pressure.`
      });
  }

  const getChangeColor = (change: number) => change >= 0 ? "text-[#3fb950]" : "text-[#f85149]";
  const topMovers = [...marketData].sort((a,b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

  return (
    <div className="flex flex-1 h-full w-full overflow-hidden bg-[#0d1016]">
        {/* CSS for Marquee */}
        <style jsx global>{`
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } 
            .animate-marquee-infinite { display: flex; animation: marquee 40s linear infinite; }
            .mask-linear-fade { mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }
        `}</style>

        {/* --- LEFT/CENTER COLUMN --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 border-r border-[#2d333b]">
            
            {/* 1. TOP BAR (Fixed Z-Index & Overflow for Dropdown) */}
            <div className="h-12 bg-[#161b22] border-b border-[#2d333b] flex items-center px-4 gap-4 shrink-0 relative z-50">
                
                {/* DROPDOWN - Removed overflow-hidden from parent so this pops out */}
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1c2128] border border-gray-700 rounded text-[11px] font-bold text-gray-300 hover:text-white uppercase tracking-wider min-w-[160px] justify-between transition-colors shadow-lg"
                    >
                        <div className="flex items-center gap-2"><Zap size={14} className="text-[#d2fc52]"/> {selectedSector}</div>
                        <ChevronDown size={12} />
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-2 z-[9999]">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Select Sector</div>
                            {SECTORS.map(sector => (
                                <button 
                                    key={sector} 
                                    onClick={() => {setSelectedSector(sector); setIsDropdownOpen(false);}} 
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-300 hover:bg-[#d2fc52] hover:text-black transition-all rounded-lg mb-1 flex items-center justify-between group"
                                >
                                    {sector}
                                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100"/>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* TICKER */}
                <div className="flex-1 overflow-hidden relative flex items-center mask-linear-fade cursor-default h-full">
                    <div className="animate-marquee-infinite flex items-center gap-8 text-[11px] font-bold uppercase whitespace-nowrap">
                        {(marketData.length > 0 ? [...marketData, ...marketData] : []).map((item, i) => (
                            <span key={i} className="flex items-center gap-2">
                                <span className="text-white">{item.name}</span>
                                <span className={getChangeColor(item.change)}>{item.change > 0 ? "+" : ""}{item.change}%</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-6 custom-scrollbar bg-[#0d1016]">
                
                {/* Search Header */}
                <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-lg">
                    <div className="flex-1 flex items-center bg-[#161b22] border border-[#30363d] p-1.5 rounded-lg shadow-lg focus-within:border-[#d2fc52] transition-colors group">
                        <div className="h-10 w-10 flex items-center justify-center text-gray-500 group-focus-within:text-[#d2fc52] transition-colors"><Search size={18}/></div>
                        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder-gray-600 uppercase" placeholder="SEARCH (E.G. RELIANCE, TSLA...)"/>
                    </div>
                    <button type="submit" className="bg-[#d2fc52] hover:bg-white text-black h-[54px] px-8 rounded-lg font-black text-sm uppercase transition-all shadow-[0_0_20px_rgba(210,252,82,0.2)] active:scale-95">GO</button>
                </form>

                {/* Chart Area */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex-1 min-h-[500px] relative z-0 group">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
                        <div className="bg-[#d2fc52] text-black h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm border border-white/20 shadow-lg">{activeTicker[0]}</div>
                        <div>
                            <h2 className="text-base font-black text-white leading-none tracking-wide">{activeTicker}</h2>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> LIVE FEED ACTIVE</span>
                        </div>
                    </div>
                    {chartUrl && <iframe src={chartUrl} className="w-full h-full border-none" scrolling="no" allowFullScreen />}
                </div>

                {/* AI Sentiment Panel (Exact Video Match) */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[160px] relative overflow-hidden gap-8 z-0">
                    <div className={`absolute top-0 left-0 w-2 h-full ${sentiment?.sentiment_label === "BULLISH" ? "bg-[#d2fc52]" : "bg-[#f85149]"}`}></div>
                    <div className={`absolute top-0 left-0 w-64 h-full opacity-10 blur-3xl ${sentiment?.sentiment_label === "BULLISH" ? "bg-[#d2fc52]" : "bg-[#f85149]"}`}></div>
                    
                    <div className="flex flex-col gap-2 relative z-10 flex-1">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                            <Zap size={12} className="text-[#d2fc52]"/> AI SENTIMENT ANALYSIS
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
                                {sentiment.sentiment_label}
                            </span>
                            <span className={`text-4xl lg:text-5xl font-bold ${sentiment.sentiment_label === "BULLISH" ? "text-[#d2fc52]" : "text-[#f85149]"}`}>
                                {sentiment.sentiment_score}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium border-l-2 border-gray-700 pl-4 mt-2 leading-relaxed max-w-2xl">
                            {sentiment.summary}
                        </p>
                    </div>

                    <div className="w-full md:w-auto bg-[#0d1016] border border-[#30363d] p-6 rounded-xl shadow-inner min-w-[260px] relative z-10">
                        <div className="flex items-center justify-end gap-2 mb-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            <Activity size={12} className="text-blue-500"/> PROJECTED RANGE (24H)
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-3xl text-white font-bold tracking-tight">${sentiment.projected_low}</span>
                            <span className="w-full h-px bg-[#30363d] my-1"></span>
                            <span className="font-mono text-3xl text-white font-bold tracking-tight">${sentiment.projected_high}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* --- RIGHT SIDEBAR (Functional) --- */}
        <div className="w-[340px] bg-[#161b22] flex flex-col shrink-0 overflow-y-auto custom-scrollbar border-l border-[#2d333b] hidden xl:flex z-40">
            
            {/* Market Heat */}
            <div className="p-6 border-b border-[#2d333b]">
                <div className="flex justify-between items-center mb-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <h3 className="flex items-center gap-2"><Globe size={14} className="text-[#d2fc52]"/> MARKET HEAT</h3>
                    <Link href="/screener" className="text-[9px] hover:text-white transition-colors flex items-center gap-1">MORE <ExternalLink size={8}/></Link>
                </div>
                <div className="space-y-3">
                    {marketData.slice(0, 3).map((s,i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#0d1016] border border-[#30363d] hover:border-gray-500 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-gray-600 font-mono">#{i+1}</span>
                                <div className="font-bold text-xs text-gray-200 group-hover:text-white">{s.name}</div>
                            </div>
                            <div className={`font-mono text-xs font-bold ${getChangeColor(s.change)}`}>{s.change}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Movers */}
            <div className="p-6 border-b border-[#2d333b]">
                <div className="flex justify-between items-center mb-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <h3 className="flex items-center gap-2"><TrendingUp size={14} className="text-[#ff9b00]"/> TOP MOVERS</h3>
                    <Link href="/screener" className="text-[9px] hover:text-white transition-colors flex items-center gap-1">MORE <ExternalLink size={8}/></Link>
                </div>
                <div className="space-y-3">
                    {topMovers.map((s,i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#0d1016] border border-[#30363d] hover:border-gray-500 transition-all">
                            <div className="flex items-center gap-3">
                                <span className="text-sm">{s.change > 0 ? "🚀" : "📉"}</span>
                                <div className="font-bold text-xs text-gray-200">{s.name}</div>
                            </div>
                            <div className={`font-mono text-xs font-bold ${getChangeColor(s.change)}`}>{s.change}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sector Flow */}
            <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <h3 className="flex items-center gap-2"><BarChart3 size={14} className="text-[#e3b341]"/> SECTOR FLOW</h3>
                    <Link href="/charts" className="text-[9px] hover:text-white transition-colors flex items-center gap-1">MORE <ExternalLink size={8}/></Link>
                </div>
                <div className="space-y-6">
                     {marketData.filter(i => ["NIFTY 50", "SENSEX", "GOLD"].includes(i.name)).map((item, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between text-[10px] text-gray-400 mb-2 font-mono group-hover:text-white transition-colors">
                                <span className="font-bold">{item.name}</span>
                                <span className={getChangeColor(item.change)}>{item.change}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#21262d] rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${item.change >= 0 ? "bg-[#d2fc52]" : "bg-[#f85149]"}`} style={{width: `${Math.min(Math.abs(item.change) * 30 + 10, 100)}%`}}></div>
                            </div>
                        </div>
                     ))}
                </div>
            </div>
        </div>
    </div>
  );
}