// src/app/calendar/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { fetchEarningsCalendar } from '@/lib/api';
import { Calendar, Clock, DollarSign, TrendingUp, TrendingDown, Minus, Briefcase } from 'lucide-react';

export default function EarningsCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchEarningsCalendar();
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    // FIX 1: 'h-full flex flex-col' ensures the page takes full height and stacks elements
    <div className="h-full flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION (Fixed height) */}
      <div className="flex-none flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Calendar className="text-jup-lime w-8 h-8" /> 
                Earnings Calendar
            </h1>
            <p className="text-gray-400 text-sm mt-2">
                Upcoming financial reports, consensus estimates, and market impact forecasts.
            </p>
        </div>
        <div className="flex gap-2">
            <span className="bg-[#1c2128] border border-jup-border text-gray-400 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jup-lime"/> Confirmed
            </span>
            <span className="bg-[#1c2128] border border-jup-border text-gray-400 px-3 py-1 rounded text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"/> Estimated
            </span>
        </div>
      </div>

      {/* TABLE CONTAINER (Takes remaining space) */}
      {/* FIX 2: 'flex-1 min-h-0' forces this box to take exactly the remaining height, not more */}
      <div className="flex-1 bg-[#1c2128] border border-jup-border rounded-xl overflow-hidden shadow-xl flex flex-col min-h-0">
        
        {/* TABLE HEADER (Sticky at top of table) */}
        <div className="flex-none grid grid-cols-12 bg-[#0d1016] border-b border-jup-border p-4 text-xs font-bold text-gray-500 uppercase tracking-wider z-10">
            <div className="col-span-4 pl-2">Company / Ticker</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2 text-right">Est. EPS / Rev</div>
            <div className="col-span-2 text-right pr-2">Sentiment</div>
        </div>

        {/* SCROLLABLE LIST AREA */}
        {/* FIX 3: 'overflow-y-auto' enables scrolling ONLY inside this list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {loading ? (
                <div className="p-12 text-center text-gray-500 text-sm animate-pulse flex flex-col items-center gap-2">
                    <Briefcase className="opacity-50" size={32} />
                    Loading market data...
                </div>
            ) : (
                events.map((event) => (
                    <div key={event.id} className="grid grid-cols-12 p-4 items-center hover:bg-[#2a303c] transition-colors group cursor-pointer border-l-2 border-transparent hover:border-jup-lime">
                        
                        {/* 1. COMPANY */}
                        <div className="col-span-4 flex items-center gap-3 pl-2">
                            <div className="w-10 h-10 rounded-lg bg-[#0d1016] border border-gray-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                {event.ticker[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm group-hover:text-jup-lime transition-colors flex items-center gap-2">
                                    {event.ticker}
                                    {/* US Flag badge for USD stocks, just a visual touch */}
                                    {event.eps_est.includes('$') && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 rounded">US</span>}
                                </h3>
                                <p className="text-gray-500 text-xs truncate max-w-[180px]">{event.name}</p>
                            </div>
                        </div>

                        {/* 2. DATE */}
                        <div className="col-span-2 text-gray-300 text-sm font-mono flex items-center gap-2">
                             <Calendar size={14} className="text-gray-600" />
                             {event.date}
                        </div>

                        {/* 3. TIME */}
                        <div className="col-span-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 w-max ${
                                event.time === "After Market" 
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            }`}>
                                <Clock size={10} /> {event.time}
                            </span>
                        </div>

                        {/* 4. ESTIMATES */}
                        <div className="col-span-2 text-right">
                            <div className="text-white text-sm font-mono flex items-center justify-end gap-1.5">
                                <span className="text-gray-600 text-[10px] font-bold">EPS</span> 
                                <span className={event.eps_est.includes('$') ? 'text-green-400' : 'text-white'}>{event.eps_est}</span>
                            </div>
                            <div className="text-gray-500 text-xs font-mono mt-0.5">
                                Rev: <span className="text-gray-400">{event.rev_est}</span>
                            </div>
                        </div>

                        {/* 5. SENTIMENT */}
                        <div className="col-span-2 flex justify-end pr-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border w-28 justify-center shadow-sm ${
                                event.sentiment.includes("Bull") 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : event.sentiment.includes("Bear") 
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : event.sentiment === "Volatile"
                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }`}>
                                {event.sentiment.includes("Bull") && <TrendingUp size={12} />}
                                {event.sentiment.includes("Bear") && <TrendingDown size={12} />}
                                {event.sentiment === "Volatile" && <Activity size={12} />}
                                {event.sentiment === "Neutral" && <Minus size={12} />}
                                {event.sentiment}
                            </div>
                        </div>

                    </div>
                ))
            )}
            
            {/* FOOTER PADDING */}
            <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}
// Helper icon for volatile
function Activity({size, className}: {size: number, className?: string}) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
}