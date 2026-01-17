// src/components/ResearchSidebar.tsx
"use client";
import { Activity, Globe, Wifi, FileText, Zap } from 'lucide-react';

export default function ResearchSidebar() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
      
      {/* 1. SYSTEM STATUS */}
      <div className="bg-[#13171f] border border-jup-border rounded-xl p-4">
         <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-jup-lime" />
            <span className="text-xs font-bold text-gray-400 uppercase">Live Connection</span>
         </div>
         <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-white">14 Active Sources</span>
         </div>
         <p className="text-[10px] text-gray-500">Bloomberg, Reuters, SEC EDGAR, Twitter API, AlphaVantage...</p>
      </div>

      {/* 2. MARKET MOOD */}
      <div className="bg-[#13171f] border border-jup-border rounded-xl p-4">
         <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-gray-400 uppercase">Sentiment Gauge</span>
         </div>
         <div className="text-xl font-bold text-white mb-2">Extreme Greed</div>
         <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-gradient-to-r from-blue-500 to-green-400 h-full w-[85%]" />
         </div>
         <div className="flex justify-between text-[10px] text-gray-500">
            <span>Bearish</span>
            <span>Bullish</span>
         </div>
      </div>

      {/* 3. RELATED TOPICS (Context Awareness) */}
      <div className="bg-[#13171f] border border-jup-border rounded-xl p-4 flex-1">
         <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-gray-400 uppercase">Context Memory</span>
         </div>
         <div className="space-y-2">
            <ContextItem label="NVDA Earnings Q3" type="Report" />
            <ContextItem label="Semi-conductor Sector" type="Theme" />
            <ContextItem label="Jerome Powell Speech" type="Event" />
         </div>
      </div>

    </div>
  );
}

function ContextItem({ label, type }: any) {
    return (
        <div className="flex items-center gap-3 p-2 hover:bg-[#1c2128] rounded-lg cursor-pointer transition-colors group">
            <div className="bg-[#2a303c] p-1.5 rounded-md text-gray-400 group-hover:text-white">
                <Zap size={10} />
            </div>
            <div>
                <div className="text-xs font-bold text-gray-300 group-hover:text-jup-lime">{label}</div>
                <div className="text-[10px] text-gray-500">{type}</div>
            </div>
        </div>
    )
}