// src/components/IntelligenceEngine.tsx
"use client";
import { useState } from 'react';
import { Settings2, ArrowUp, ChevronDown, Sparkles, Bot, User } from 'lucide-react';

export default function IntelligenceEngine() {
  return (
    <div className="flex flex-col h-full relative">
      
      {/* 1. CHAT HISTORY AREA (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-32">
        
        {/* Welcome Message */}
        <div className="flex flex-col items-center justify-center mt-20 opacity-50">
            <div className="w-16 h-16 bg-jup-lime/10 rounded-full flex items-center justify-center mb-4">
                <Bot size={32} className="text-jup-lime" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">AlphaFeed Intelligence</h2>
            <p className="text-gray-400 text-sm">Ready to analyze markets, predict trends, and synthesize data.</p>
        </div>

        {/* Dummy Chat Item (User) */}
        <div className="flex justify-end">
            <div className="bg-[#2a303c] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] border border-gray-700">
                <p className="text-sm">Analyze NVDA's recent price action relative to the semiconductor sector.</p>
            </div>
        </div>

        {/* Dummy Chat Item (AI) */}
        <div className="flex justify-start gap-3 max-w-[90%]">
            <div className="w-8 h-8 rounded-full bg-jup-lime flex items-center justify-center shrink-0">
                <Bot size={18} className="text-black" />
            </div>
            <div className="flex flex-col gap-2">
                <div className="bg-[#13171f] border border-jup-border p-4 rounded-2xl rounded-tl-sm">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="font-bold text-white">Nvidia (NVDA)</span> is currently showing strong relative strength against the SOXX index. While the sector is down <span className="text-red-400">-1.2%</span>, NVDA is holding support at <span className="text-jup-lime">$142.50</span>.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-900/50">Bullish Divergence</span>
                        <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-900/50">High Volume</span>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* 2. INPUT AREA (Floating at Bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-jup-bg via-jup-bg to-transparent pt-10 pb-4 px-4">
        
        <div className="max-w-3xl mx-auto bg-[#1c2128] border border-jup-border rounded-2xl p-2 shadow-2xl flex flex-col gap-2 relative">
           
           {/* Top Controls */}
           <div className="flex items-center gap-2 px-2 pt-1">
              <button className="flex items-center gap-1.5 bg-[#13171f] hover:bg-[#2a303c] text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-jup-border transition-colors">
                 <span className="text-jup-lime">●</span> Live
              </button>
              <button className="flex items-center gap-1.5 bg-[#13171f] hover:bg-[#2a303c] text-gray-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-jup-border transition-colors">
                 GPT-4o
                 <ChevronDown size={10} />
              </button>
           </div>

           {/* Text Input */}
           <div className="flex items-end gap-2 px-2 pb-1">
              <textarea 
                placeholder="Ask anything about crypto, stocks, or macro..." 
                className="w-full bg-transparent text-white text-base max-h-32 min-h-[40px] outline-none resize-none placeholder-gray-500 py-2 custom-scrollbar"
                rows={1}
              />
              <button className="bg-jup-lime hover:bg-[#b8e866] text-black p-2 rounded-xl mb-1 transition-colors shadow-[0_0_10px_rgba(199,242,132,0.2)]">
                 <ArrowUp size={20} />
              </button>
           </div>

        </div>
        <p className="text-center text-[10px] text-gray-600 mt-2">AlphaFeed can make mistakes. Verify important financial data.</p>
      </div>

    </div>
  );
}