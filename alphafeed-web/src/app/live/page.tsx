// src/app/live/page.tsx
import LiveFeedTable from "@/components/LiveFeedTable";
import { Wifi, Zap, BarChart3 } from 'lucide-react';

export default function LiveFeedPage() {
  return (
    <div className="h-full overflow-y-auto bg-jup-bg">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 1. HERO BANNER (Matches Jupiter's Top Box) */}
        <div className="bg-gradient-to-r from-[#1c2128] to-[#13171f] border border-jup-border rounded-2xl p-8 mb-8 relative overflow-hidden shadow-2xl">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-jup-lime/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />

           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <Wifi size={24} className="text-jup-lime" />
                 <h1 className="text-3xl font-bold text-white tracking-tight">AlphaFeed <span className="text-jup-lime">Live Stream</span></h1>
              </div>
              <p className="text-gray-400 max-w-xl mb-6">
                 Real-time market intelligence curated from 50+ premium sources including Bloomberg, Reuters, SEC EDGAR, and X (Twitter).
              </p>

              {/* STATS ROW (Matches "Total Supply/Borrowed") */}
              <div className="flex items-center gap-12 border-t border-gray-800 pt-6">
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Articles / Min</div>
                    <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                        42 <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Global Sentiment</div>
                    <div className="text-2xl font-mono font-bold text-jup-lime flex items-center gap-2">
                        Bullish <BarChart3 size={14} />
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-gray-500 font-bold uppercase mb-1">Active Sources</div>
                    <div className="text-2xl font-mono font-bold text-white">58</div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. THE FEED LIST (Matches Jupiter's Table) */}
        <div className="bg-[#13171f] border border-jup-border rounded-2xl overflow-hidden shadow-xl min-h-[500px]">
           <LiveFeedTable />
        </div>

      </div>
    </div>
  );
}