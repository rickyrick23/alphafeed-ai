// src/app/page.tsx
"use client";
import MarketStatusBar from "@/components/MarketStatusBar";
import MarketWidgets from "@/components/MarketWidgets";
import { Layers, Maximize2 } from 'lucide-react';

// --- PLACEHOLDER CHART ---
function TradingChartPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] bg-opacity-10">
      <div className="text-center">
        <div className="text-jup-lime text-sm font-bold mb-2 animate-pulse">LIVE MARKET DATA FEED</div>
        <p className="text-gray-600 text-xs">Select a generic asset to initialize chart</p>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  return (
    <div className="flex flex-col h-full relative">
      
      {/* 1. MARKET STATUS BAR (The Top Ticker) */}
      <MarketStatusBar />

      {/* 2. DASHBOARD CONTENT */}
      {/* ERROR CHECK: Do NOT put <Sidebar /> here. It is already in layout.tsx! */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-y-auto min-h-0">
        
        {/* LEFT PANEL: CHART */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 min-h-[500px]">
            <div className="flex-1 bg-[#13171f] border border-jup-border rounded-2xl overflow-hidden shadow-xl relative flex flex-col">
                <div className="h-12 border-b border-jup-border flex items-center justify-between px-4 bg-[#1c2128]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-jup-lime flex items-center justify-center text-black font-bold text-xs">N</div>
                        <div>
                            <h2 className="text-sm font-bold text-white leading-none">NVDA</h2>
                            <span className="text-[10px] text-gray-500">Nasdaq • Realtime</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white"><Layers size={14} /></button>
                        <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white"><Maximize2 size={14} /></button>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <TradingChartPlaceholder /> 
                </div>
            </div>
            
            <div className="h-32 bg-[#13171f] border border-jup-border rounded-xl p-4 flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">AI Sentiment Analysis</h3>
                    <div className="text-2xl font-black text-white">BULLISH <span className="text-jup-lime text-sm">92%</span></div>
                 </div>
                 <div className="text-right space-y-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase">Projected Range (24h)</h3>
                    <div className="text-lg font-mono text-white">$138.50 - $145.20</div>
                 </div>
            </div>
        </div>

        {/* RIGHT PANEL: WIDGETS */}
        <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
            <MarketWidgets />
        </div>

      </div>
    </div>
  );
}