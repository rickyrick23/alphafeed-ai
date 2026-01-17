// src/components/ForecastCard.tsx
"use client";
import { TrendingUp, TrendingDown, ArrowRight, Activity } from 'lucide-react';

export default function ForecastCard({ ticker, name, target, timeframe, bullishProb, volume }: any) {
  const bearishProb = 100 - bullishProb;

  return (
    <div className="bg-[#13171f] border border-jup-border rounded-xl p-4 hover:border-gray-500 transition-all group cursor-pointer relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black ${bullishProb > 50 ? 'bg-jup-lime' : 'bg-red-400'}`}>
                {ticker[0]}
            </div>
            <div>
                <div className="text-sm font-bold text-white group-hover:text-jup-lime transition-colors">{ticker}</div>
                <div className="text-[10px] text-gray-500">{name}</div>
            </div>
        </div>
        <div className="text-[10px] font-bold bg-[#1c2128] text-gray-400 px-2 py-1 rounded border border-jup-border">
            {timeframe}
        </div>
      </div>

      {/* THE PREDICTION SCENARIO */}
      <div className="mb-4">
        <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Will {ticker} hit <span className="text-white font-bold">{target}</span> before close?
        </p>
      </div>

      {/* PROBABILITY BARS (The "Yes/No" Equivalent) */}
      <div className="space-y-2 mb-4">
        
        {/* Bullish Bar */}
        <div className="flex justify-between text-[10px] font-bold text-jup-lime mb-0.5">
            <span>BULLISH</span>
            <span>{bullishProb}%</span>
        </div>
        <div className="w-full bg-[#1c2128] h-2 rounded-full overflow-hidden">
            <div className="bg-jup-lime h-full" style={{ width: `${bullishProb}%` }} />
        </div>

        {/* Bearish Bar */}
        <div className="flex justify-between text-[10px] font-bold text-red-400 mb-0.5 mt-1">
            <span>BEARISH</span>
            <span>{bearishProb}%</span>
        </div>
        <div className="w-full bg-[#1c2128] h-2 rounded-full overflow-hidden">
            <div className="bg-red-400 h-full" style={{ width: `${bearishProb}%` }} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center border-t border-jup-border pt-3">
        <div className="text-[10px] text-gray-500 flex items-center gap-1">
            <Activity size={10} /> Vol: {volume}
        </div>
        <button className="text-[10px] text-white flex items-center gap-1 hover:text-jup-lime transition-colors">
            Chart <ArrowRight size={10} />
        </button>
      </div>

    </div>
  );
}