// src/components/PortfolioSummary.tsx
"use client";
import { Wallet, TrendingUp, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export default function PortfolioSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* CARD 1: NET WORTH (The Money) */}
      <div className="bg-gradient-to-br from-[#1c2128] to-[#13171f] border border-jup-border rounded-xl p-5 shadow-lg relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-jup-lime/5 rounded-full blur-3xl pointer-events-none" />
         
         <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <Wallet size={14} className="text-jup-lime" /> Total Net Worth
         </div>
         <div className="text-3xl font-black text-white tracking-tight mb-1">$60,416.38</div>
         <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-jup-lime flex items-center gap-1 bg-jup-lime/10 px-1.5 py-0.5 rounded border border-jup-lime/20">
                <TrendingUp size={10} /> +$959.28 (1.6%)
            </span>
            <span className="text-[10px] text-gray-500">24h Change</span>
         </div>
      </div>

      {/* CARD 2: AI HEALTH SCORE (The Safety) */}
      <div className="bg-[#13171f] border border-jup-border rounded-xl p-5 relative overflow-hidden group hover:border-gray-600 transition-colors">
         <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-blue-400" /> Portfolio Health
         </div>
         <div className="flex items-end gap-2 mb-2">
            <div className="text-4xl font-black text-white">8.4</div>
            <div className="text-sm font-bold text-gray-500 mb-1.5">/ 10</div>
         </div>
         <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 h-full w-[84%]" />
         </div>
         <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
            <AlertTriangle size={10} className="text-yellow-400" />
            AI Warning: 1 Asset (TSLA) at high risk.
         </p>
      </div>

      {/* CARD 3: SMART ACTIONS (The Intelligence) */}
      <div className="bg-[#13171f] border border-jup-border rounded-xl p-5 flex flex-col justify-center gap-3">
         <button className="w-full bg-jup-lime hover:bg-[#b8e866] text-black font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(199,242,132,0.15)] active:scale-[0.98]">
            <RefreshCw size={14} /> Auto-Rebalance
         </button>
         <button className="w-full bg-[#1c2128] hover:bg-[#2a303c] text-white border border-jup-border font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
            View Analytics Report
         </button>
      </div>

    </div>
  );
}