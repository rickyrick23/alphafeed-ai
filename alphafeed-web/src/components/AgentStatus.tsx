// src/components/AgentStatus.tsx
"use client";
import { Activity, Globe, Wifi } from 'lucide-react';

export default function AgentStatus() {
  return (
    <div className="flex gap-4 mt-4 w-full max-w-[480px]">
      
      {/* CARD 1: SENTIMENT GAUGE (Replaces Left Chart) */}
      <div className="flex-1 bg-[#13171f] border border-jup-border rounded-xl p-3 flex flex-col justify-between hover:border-gray-600 transition-colors cursor-pointer group">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
               <Activity size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400 group-hover:text-white">Market Mood</span>
         </div>
         <div>
            <div className="text-lg font-bold text-white">Bullish</div>
            <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
               <div className="bg-green-400 h-full w-[75%]" />
            </div>
            <div className="flex justify-between mt-1">
               <span className="text-[10px] text-gray-500">Fear</span>
               <span className="text-[10px] text-gray-500">Greed</span>
            </div>
         </div>
      </div>

      {/* CARD 2: NETWORK STATUS (Replaces Right Chart) */}
      <div className="flex-1 bg-[#13171f] border border-jup-border rounded-xl p-3 flex flex-col justify-between hover:border-gray-600 transition-colors cursor-pointer group">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-jup-lime/20 flex items-center justify-center text-jup-lime">
               <Globe size={14} />
            </div>
            <span className="text-xs font-bold text-gray-400 group-hover:text-white">Live Sources</span>
         </div>
         <div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
               14 Active
               <Wifi size={14} className="text-jup-lime animate-pulse" />
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
               Connected to Bloomberg, Reuters, SEC...
            </div>
         </div>
      </div>

    </div>
  );
}