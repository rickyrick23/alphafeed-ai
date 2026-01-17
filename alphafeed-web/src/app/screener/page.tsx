"use client";
import { useState, useEffect } from 'react';
import { runScreener } from '@/lib/api';
import { Filter, Search, Sliders, DollarSign, Activity } from 'lucide-react';

export default function ScreenerPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [sector, setSector] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPe, setMinPe] = useState("");
  const [maxPe, setMaxPe] = useState("");

  // Run initial scan on load
  useEffect(() => {
    handleScan();
  }, []);

  async function handleScan() {
    setLoading(true);
    const filters = {
        sector,
        min_price: minPrice ? parseFloat(minPrice) : 0,
        max_price: maxPrice ? parseFloat(maxPrice) : 10000,
        min_pe: minPe ? parseFloat(minPe) : 0,
        max_pe: maxPe ? parseFloat(maxPe) : 200
    };
    
    const data = await runScreener(filters);
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Filter className="text-jup-lime w-8 h-8" /> 
            Deep Screener
        </h1>
        <p className="text-gray-400 text-sm mt-2">
            Filter the market universe by fundamental and technical criteria.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* LEFT PANEL: FILTERS */}
        <div className="w-1/4 bg-[#1c2128] border border-jup-border rounded-xl p-6 shadow-xl flex flex-col gap-6 h-max">
            <h2 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                <Sliders size={16}/> Filter Criteria
            </h2>
            
            {/* Sector */}
            <div>
                <label className="text-xs font-bold text-gray-500 block mb-2">SECTOR</label>
                <select 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-[#0d1016] border border-gray-700 rounded p-2 text-white outline-none focus:border-jup-lime"
                >
                    <option value="All">All Sectors</option>
                    <option value="Technology">Technology</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Consumer Cyclical">Consumer Cyclical</option>
                    <option value="Energy">Energy</option>
                    <option value="Healthcare">Healthcare</option>
                </select>
            </div>

            {/* Price Range */}
            <div>
                <label className="text-xs font-bold text-gray-500 block mb-2">PRICE RANGE ($)</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 bg-[#0d1016] border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-jup-lime"/>
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 bg-[#0d1016] border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-jup-lime"/>
                </div>
            </div>

            {/* P/E Ratio */}
            <div>
                <label className="text-xs font-bold text-gray-500 block mb-2">P/E RATIO</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="0" value={minPe} onChange={e => setMinPe(e.target.value)} className="w-1/2 bg-[#0d1016] border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-jup-lime"/>
                    <input type="number" placeholder="50" value={maxPe} onChange={e => setMaxPe(e.target.value)} className="w-1/2 bg-[#0d1016] border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-jup-lime"/>
                </div>
            </div>

            <button 
                onClick={handleScan}
                className="w-full bg-jup-lime hover:bg-[#b8e866] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 transition-transform active:scale-95"
            >
                {loading ? "Scanning..." : "Run Scanner"}
                <Search size={18} />
            </button>
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="flex-1 bg-[#1c2128] border border-jup-border rounded-xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b border-jup-border bg-[#0d1016] flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Results Found</span>
                <span className="text-xs font-mono text-jup-lime border border-jup-lime/30 bg-jup-lime/10 px-2 py-1 rounded">
                    {results.length} Matches
                </span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-3 bg-[#11141a] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                    <div className="col-span-4">Company</div>
                    <div className="col-span-2">Sector</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">P/E Ratio</div>
                    <div className="col-span-2 text-right">Market Cap</div>
                </div>

                {loading ? (
                    <div className="p-20 text-center text-gray-500 animate-pulse flex flex-col items-center gap-3">
                        <Activity size={32} className="animate-spin text-jup-lime"/>
                        Running algorithms...
                    </div>
                ) : results.length === 0 ? (
                    <div className="p-20 text-center text-gray-500">No stocks match your criteria.</div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {results.map((stock) => (
                            <div key={stock.ticker} className="grid grid-cols-12 px-6 py-4 hover:bg-[#2a303c] transition-colors items-center group">
                                <div className="col-span-4">
                                    <div className="text-white font-bold text-sm group-hover:text-jup-lime transition-colors">{stock.ticker}</div>
                                    <div className="text-gray-500 text-xs">{stock.name}</div>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">{stock.sector}</span>
                                </div>
                                <div className="col-span-2 text-right font-mono text-white text-sm">
                                    ${stock.price}
                                </div>
                                <div className="col-span-2 text-right font-mono text-sm">
                                    <span className={stock.pe < 20 ? "text-green-400" : stock.pe > 50 ? "text-red-400" : "text-yellow-400"}>
                                        {stock.pe}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right font-mono text-gray-400 text-xs">
                                    {(stock.market_cap / 1e9).toFixed(1)}B
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}