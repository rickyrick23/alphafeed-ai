// src/components/LiveDetections.tsx
"use client";
import { Crosshair } from 'lucide-react';

export default function LiveDetections() {
  return (
    <div className="h-full flex flex-col bg-[#0d1016] border-l border-jup-border">
      
      <div className="p-4 border-b border-jup-border">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live Scans
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
         <ScanItem time="10:42" ticker="NVDA" pattern="Bull Flag" conf="High" />
         <ScanItem time="10:41" ticker="BTC" pattern="Support Bounce" conf="Med" />
         <ScanItem time="10:38" ticker="TSLA" pattern="RSI Divergence" conf="High" />
         <ScanItem time="10:35" ticker="AAPL" pattern="Golden Cross" conf="Low" />
         <ScanItem time="10:30" ticker="AMD" pattern="Breakout" conf="High" />
         <ScanItem time="10:28" ticker="SOL" pattern="Volume Spike" conf="Med" />
         <ScanItem time="10:25" ticker="ETH" pattern="Double Bottom" conf="High" />
      </div>
    </div>
  );
}

function ScanItem({ time, ticker, pattern, conf }: any) {
    return (
        <div className="bg-[#13171f] p-3 rounded-lg border border-jup-border hover:border-gray-500 transition-colors cursor-pointer">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-white">{ticker}</span>
                <span className="text-[10px] text-gray-500">{time}</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-1">{pattern}</div>
            <div className="flex justify-between items-center">
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${conf === 'High' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {conf} Conf.
                </span>
            </div>
        </div>
    )
}