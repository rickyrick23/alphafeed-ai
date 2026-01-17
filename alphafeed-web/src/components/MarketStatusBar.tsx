// src/components/MarketStatusBar.tsx
"use client";
import { useState, useEffect } from 'react';
import { fetchMarketBatch } from '@/lib/api'; 
import { ChevronDown, TrendingUp, TrendingDown, LayoutList, Check } from 'lucide-react';

export default function MarketStatusBar() {
  const [tickers, setTickers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSector, setActiveSector] = useState("Market Leaders");

  const sectors: any = {
    "Market Leaders": ["^NSEI", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS"],
    "Banking Giants": ["HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS", "KOTAKBANK.NS", "INDUSINDBK.NS"],
    "Tech & IT": ["TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS", "LTIM.NS"],
    "Auto Sector": ["TATAMOTORS.NS", "MARUTI.NS", "M&M.NS", "HEROMOTOCO.NS", "EICHERMOT.NS", "BAJAJ-AUTO.NS"]
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const symbolList = sectors[activeSector];
      const data = await fetchMarketBatch(symbolList);
      const validData = data.filter(item => item !== null && typeof item.price === 'number');
      setTickers(validData);
      setLoading(false);
    }
    loadData(); 
    const interval = setInterval(loadData, 30000); 
    return () => clearInterval(interval);
  }, [activeSector]); 

  return (
    // FIX IS HERE: Changed from 'fixed' to 'sticky top-0 w-full'
    // Now it expands/shrinks automatically with the page layout
    <div className="sticky top-0 w-full h-10 bg-[#0d1016]/95 backdrop-blur-md border-b border-jup-border flex items-center px-4 z-30 transition-all">
      
      {/* SECTOR DROPDOWN */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-xs font-bold text-white bg-[#1c2128] border border-jup-border px-3 py-1.5 rounded-lg mr-4 hover:bg-[#2a303c] transition-colors shrink-0 shadow-sm min-w-[140px] justify-between"
        >
             <div className="flex items-center gap-2">
                <LayoutList size={12} className="text-jup-lime" />
                <span>{activeSector}</span>
             </div>
             <ChevronDown size={12} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1c2128] border border-jup-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="py-1">
                    {Object.keys(sectors).map((sector) => (
                        <button
                            key={sector}
                            onClick={() => { setActiveSector(sector); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-[#2a303c] hover:text-white flex items-center justify-between group"
                        >
                            {sector}
                            {activeSector === sector && <Check size={12} className="text-jup-lime" />}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* TICKER TAPE */}
      <div className="flex-1 overflow-hidden relative mask-linear-fade">
        {loading ? (
           <div className="flex items-center gap-2 text-xs text-gray-500 font-mono animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-jup-lime" />
              Scanning {activeSector}...
           </div>
        ) : (
           <div className="flex gap-8 items-center w-max animate-ticker pause-on-hover">
             {[...tickers, ...tickers].map((stock, index) => {
               let displayName = stock.ticker.replace(".NS", "");
               if (displayName === "^NSEI") displayName = "NIFTY 50";
               const isPositive = stock.change_percent >= 0;

               return (
                 <div key={`${stock.ticker}-${index}`} className="flex items-center gap-2 text-xs font-bold whitespace-nowrap cursor-pointer">
                    <span className="text-gray-300">{displayName}</span>
                    <span className="text-gray-500 font-mono">
                        ₹{stock.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className={`flex items-center ${isPositive ? "text-jup-lime" : "text-red-400"}`}>
                       {isPositive ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
                       {Math.abs(stock.change_percent).toFixed(2)}%
                    </span>
                    <span className="text-gray-800 mx-2">•</span>
                 </div>
               );
             })}
           </div>
        )}
      </div>

      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0d1016] to-transparent pointer-events-none z-20" />
    </div>
  );
}