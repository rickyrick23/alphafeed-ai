// src/app/charts/page.tsx
import ForecastCard from "@/components/ForecastCard";
import LiveDetections from "@/components/LiveDetections";
import { Filter, Search } from 'lucide-react';

export default function ProChartsPage() {
  return (
    <div className="h-full flex bg-jup-bg overflow-hidden">
      
      {/* LEFT: THE FORECAST GRID (Scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
         
         {/* HEADER / FILTERS */}
         <div className="p-6 border-b border-jup-border flex items-center justify-between sticky top-0 bg-jup-bg/95 backdrop-blur-sm z-10">
            <h1 className="text-2xl font-bold text-white">AI Probability Forecasts</h1>
            
            <div className="flex gap-3">
                <div className="flex items-center bg-[#13171f] border border-jup-border rounded-lg px-3 py-1.5 w-64">
                    <Search size={14} className="text-gray-500" />
                    <input type="text" placeholder="Search Ticker..." className="bg-transparent text-xs text-white ml-2 w-full outline-none" />
                </div>
                <button className="flex items-center gap-2 bg-[#13171f] border border-jup-border text-gray-400 px-3 py-1.5 rounded-lg text-xs hover:text-white hover:border-gray-500 transition-colors">
                    <Filter size={14} /> Filter
                </button>
            </div>
         </div>

         {/* GRID CONTENT */}
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ForecastCard ticker="NVDA" name="Nvidia Corp" target="$148.50" timeframe="4H" bullishProb={82} volume="$2.5B" />
            <ForecastCard ticker="BTC" name="Bitcoin" target="$65,000" timeframe="1H" bullishProb={65} volume="$12B" />
            <ForecastCard ticker="TSLA" name="Tesla Inc" target="$230.00" timeframe="1D" bullishProb={42} volume="$850M" />
            <ForecastCard ticker="AMD" name="Adv. Micro Dev" target="$160.00" timeframe="1W" bullishProb={88} volume="$1.2B" />
            <ForecastCard ticker="SOL" name="Solana" target="$155.00" timeframe="4H" bullishProb={30} volume="$900M" />
            <ForecastCard ticker="AAPL" name="Apple Inc" target="$225.00" timeframe="1D" bullishProb={55} volume="$3.1B" />
            <ForecastCard ticker="MSTR" name="MicroStrategy" target="$1,800" timeframe="4H" bullishProb={91} volume="$500M" />
            <ForecastCard ticker="COIN" name="Coinbase" target="$210.00" timeframe="1D" bullishProb={48} volume="$200M" />
         </div>
      </div>

      {/* RIGHT: LIVE SIDEBAR (Fixed Width) */}
      <div className="w-64 h-full hidden lg:block">
         <LiveDetections />
      </div>

    </div>
  );
}