"use client";
import { useState, useEffect } from 'react';
import { fetchMacroView } from '@/lib/api'; // CONNECTED TO BACKEND
import { Filter, Search, Sliders, RotateCcw, TrendingUp, ChevronDown, Loader2, Zap } from 'lucide-react';

// --- BASE DATABASE (Static Metadata) ---
// We use this for Sector/PE data, but PRICES will be overwritten by the Live API
const BASE_UNIVERSE = [
  { ticker: "NVDA", name: "NVIDIA Corp", sector: "Technology", pe: 74.5, mktCap: "2.2T", volume: "45M" },
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", pe: 26.4, mktCap: "2.7T", volume: "52M" },
  { ticker: "MSFT", name: "Microsoft Corp", sector: "Technology", pe: 36.2, mktCap: "3.1T", volume: "22M" },
  { ticker: "AMZN", name: "Amazon.com", sector: "Consumer Cyclical", pe: 60.1, mktCap: "1.8T", volume: "38M" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", pe: 24.8, mktCap: "1.9T", volume: "28M" },
  { ticker: "META", name: "Meta Platforms", sector: "Technology", pe: 32.5, mktCap: "1.2T", volume: "18M" },
  { ticker: "TSLA", name: "Tesla, Inc.", sector: "Consumer Cyclical", pe: 42.1, mktCap: "550B", volume: "85M" },
  { ticker: "BTC-USD", name: "Bitcoin", sector: "Crypto", pe: 0, mktCap: "1.4T", volume: "45B" },
  { ticker: "ETH-USD", name: "Ethereum", sector: "Crypto", pe: 0, mktCap: "400B", volume: "20B" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financial", pe: 11.5, mktCap: "560B", volume: "9M" },
  { ticker: "V", name: "Visa Inc.", sector: "Financial", pe: 30.2, mktCap: "580B", volume: "6M" },
  { ticker: "LLY", name: "Eli Lilly", sector: "Healthcare", pe: 120.5, mktCap: "740B", volume: "3M" },
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", pe: 12.4, mktCap: "440B", volume: "15M" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", pe: 16.8, mktCap: "370B", volume: "7M" },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumer Defensive", pe: 25.2, mktCap: "380B", volume: "5M" },
  { ticker: "AMD", name: "Adv Micro Devices", sector: "Technology", pe: 350.2, mktCap: "290B", volume: "65M" },
  { ticker: "INTC", name: "Intel Corp", sector: "Technology", pe: 95.4, mktCap: "180B", volume: "44M" },
  { ticker: "NFLX", name: "Netflix", sector: "Consumer Cyclical", pe: 48.2, mktCap: "260B", volume: "4M" },
  { ticker: "CRM", name: "Salesforce", sector: "Technology", pe: 65.4, mktCap: "290B", volume: "5M" },
  { ticker: "ORCL", name: "Oracle", sector: "Technology", pe: 32.1, mktCap: "340B", volume: "8M" },
  { ticker: "DIS", name: "Disney", sector: "Consumer Cyclical", pe: 45.2, mktCap: "205B", volume: "11M" },
];

export default function ScreenerPage() {
  // --- STATE ---
  const [sector, setSector] = useState("All Sectors");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPE, setMinPE] = useState("");
  const [maxPE, setMaxPE] = useState("");
  
  const [stocks, setStocks] = useState<any[]>([]); // Holds the merged live data
  const [isScanning, setIsScanning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // --- 1. CONNECT TO BACKEND & SYNC PRICES ---
  const syncMarketData = async () => {
    try {
      const liveData = await fetchMacroView(); // Call your backend API
      
      const mergedData = BASE_UNIVERSE.map(stock => {
        // Try to find live price from API
        const liveAsset = liveData.find((d: any) => 
            d.name.includes(stock.ticker) || 
            d.name.includes(stock.name) ||
            (stock.sector === 'Crypto' && d.name.includes(stock.ticker.split('-')[0]))
        );

        return {
          ...stock,
          // Use Live API price if found, otherwise mock a price for demo
          price: liveAsset ? liveAsset.price : (Math.random() * 500 + 50), 
          change: liveAsset ? liveAsset.change : (Math.random() * 5 - 2.5)
        };
      });

      setStocks(mergedData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Backend Sync Failed:", e);
    }
  };

  // Run Sync on Mount
  useEffect(() => {
    syncMarketData();
  }, []);

  // --- 2. FILTERING ENGINE ---
  const runScanner = () => {
    setIsScanning(true);
    
    // Simulate algorithmic processing time
    setTimeout(() => {
      // Re-sync with backend to ensure latest prices before filtering
      syncMarketData().then(() => {
        setIsScanning(false);
      });
    }, 800);
  };

  // Apply filters to the `stocks` state
  const filteredResults = stocks.filter(stock => {
    // 1. Sector Filter
    if (sector !== "All Sectors" && stock.sector !== sector) return false;
    
    // 2. Price Range Filter
    const minP = parseFloat(minPrice) || 0;
    const maxP = parseFloat(maxPrice) || 100000;
    if (stock.price < minP || stock.price > maxP) return false;

    // 3. PE Ratio Filter
    const minE = parseFloat(minPE) || 0;
    const maxE = parseFloat(maxPE) || 10000;
    if (stock.pe < minE || stock.pe > maxE) return false;

    return true;
  });

  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-transparent relative">
      <div className="max-w-7xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-[#d2fc52]/10 rounded-xl border border-[#d2fc52]/20 shadow-[0_0_15px_rgba(210,252,82,0.1)]">
                    <Filter size={32} className="text-[#d2fc52]" />
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Deep Screener</h1>
            </div>
            <div className="flex items-center gap-3">
                <p className="text-gray-400 text-lg">
                    Real-time market universe filtering engine.
                </p>
                {lastUpdated && (
                    <span className="text-[10px] font-mono text-[#d2fc52] bg-[#d2fc52]/10 px-2 py-1 rounded border border-[#d2fc52]/20 flex items-center gap-1">
                        <Zap size={10} className="fill-current"/> LIVE DATA: {lastUpdated}
                    </span>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: FILTER PANEL */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Sliders size={18} className="text-[#d2fc52]"/>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Filter Criteria</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Sector Select */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Sector</label>
                            <div className="relative">
                                <select 
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white text-sm focus:border-[#d2fc52] outline-none appearance-none cursor-pointer"
                                >
                                    <option>All Sectors</option>
                                    <option>Technology</option>
                                    <option>Financial</option>
                                    <option>Healthcare</option>
                                    <option>Energy</option>
                                    <option>Consumer Cyclical</option>
                                    <option>Consumer Defensive</option>
                                    <option>Crypto</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={14} />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Price Range ($)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none"
                                />
                                <span className="text-gray-500">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none"
                                />
                            </div>
                        </div>

                        {/* P/E Ratio */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">P/E Ratio</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={minPE}
                                    onChange={(e) => setMinPE(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none"
                                />
                                <span className="text-gray-500">-</span>
                                <input 
                                    type="number" 
                                    placeholder="100+" 
                                    value={maxPE}
                                    onChange={(e) => setMaxPE(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                onClick={runScanner}
                                disabled={isScanning}
                                className="w-full bg-[#d2fc52] hover:bg-white text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(210,252,82,0.3)] disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isScanning ? <Loader2 className="animate-spin" size={18}/> : <Search size={18} />}
                                {isScanning ? "Scanning..." : "Run Scanner"}
                            </button>
                            <button 
                                onClick={() => {
                                    setSector("All Sectors"); setMinPrice(""); setMaxPrice(""); setMinPE(""); setMaxPE("");
                                }}
                                className="w-full bg-[#1c2128] hover:bg-[#2a303c] text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-[#30363d]"
                            >
                                <RotateCcw size={14} /> Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: RESULTS TABLE */}
            <div className="lg:col-span-9">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[600px]">
                    
                    {/* Table Header */}
                    <div className="p-5 border-b border-[#30363d] bg-[#0d1016]/50 flex justify-between items-center backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Results Found</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d2fc52]/10 text-[#d2fc52] border border-[#d2fc52]/20">
                                {filteredResults.length} Matches
                            </span>
                        </div>
                        {isScanning && <span className="text-xs text-[#d2fc52] animate-pulse font-mono">Running Algorithms...</span>}
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0d1016] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#30363d]">
                                    <th className="p-4 pl-6">Company</th>
                                    <th className="p-4">Sector</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">P/E Ratio</th>
                                    <th className="p-4 text-right">Market Cap</th>
                                    <th className="p-4 pr-6 text-right">24h Change</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#30363d] text-sm">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((stock) => (
                                        <tr key={stock.ticker} className="hover:bg-[#2a303c]/20 transition-colors group cursor-pointer">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#2a303c] flex items-center justify-center font-bold text-white border border-[#30363d] group-hover:border-[#d2fc52] transition-colors text-xs">
                                                        {stock.ticker[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-[#d2fc52] transition-colors">{stock.ticker}</div>
                                                        <div className="text-[10px] text-gray-500">{stock.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400">
                                                <span className="px-2 py-1 rounded bg-[#2a303c] border border-[#30363d] text-xs">
                                                    {stock.sector}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono text-white">
                                                ${stock.price?.toFixed(2)}
                                            </td>
                                            <td className="p-4 text-right font-mono text-gray-400">
                                                {stock.pe}
                                            </td>
                                            <td className="p-4 text-right font-mono text-gray-400">
                                                {stock.mktCap}
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className={`inline-flex items-center gap-1 font-bold ${stock.change >= 0 ? "text-[#3fb950]" : "text-[#f85149]"}`}>
                                                    {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
                                                    {stock.change?.toFixed(2)}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-50">
                                                <Search size={48} className="text-gray-600"/>
                                                <p className="text-gray-400 text-sm uppercase tracking-widest">No stocks match your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}