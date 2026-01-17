// src/components/ChartCanvas.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { Terminal, Globe, Activity, FileText, Maximize2 } from 'lucide-react';

export default function ChartCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("Price");

  // 1. INITIALIZE CHART
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the Chart Instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(45, 55, 72, 0.2)' },
        horzLines: { color: 'rgba(45, 55, 72, 0.2)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { borderColor: '#2d3748', timeVisible: true },
      rightPriceScale: { borderColor: '#2d3748' },
    });

    // FIX: Use the new v5 API 'addSeries' instead of 'addCandlestickSeries'
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#c7f284',         // Jupiter Lime
      downColor: '#ef4444',       // Red
      borderVisible: false,
      wickUpColor: '#c7f284',
      wickDownColor: '#ef4444',
    });

    // GENERATE DUMMY DATA
    const data = generateDummyData(100); 
    candleSeries.setData(data);

    // Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col bg-[#1c2128] border border-jup-border rounded-xl relative group overflow-hidden h-full min-h-[500px]">
      
      {/* A. ASSET HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-jup-border bg-[#13171f]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-jup-lime flex items-center justify-center shadow-[0_0_15px_rgba(199,242,132,0.3)]">
              <span className="text-black font-bold text-lg">N</span>
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-white tracking-tight">NVDA</h2>
                 <span className="text-xs bg-jup-card border border-jup-border px-1.5 py-0.5 rounded text-gray-400">NASDAQ</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                 <span className="text-jup-lime font-mono text-sm font-bold">$142.50</span>
                 <span className="text-green-400 font-medium">+3.24%</span>
              </div>
           </div>
        </div>

        <div className="flex bg-[#0d1016] p-1 rounded-lg border border-jup-border">
           <TabButton label="Price Chart" active={activeTab === "Price"} onClick={() => setActiveTab("Price")} icon={<Activity size={14}/>} />
           <TabButton label="Financials" active={activeTab === "Financials"} onClick={() => setActiveTab("Financials")} icon={<Globe size={14}/>} />
           <TabButton label="AI Report" active={activeTab === "AI Report"} onClick={() => setActiveTab("AI Report")} icon={<FileText size={14}/>} />
        </div>

        <button className="p-2 hover:bg-jup-border rounded-lg text-gray-400 transition-colors">
            <Maximize2 size={18} />
        </button>
      </div>

      {/* B. CHART CANVAS */}
      <div className="flex-1 relative bg-[#13171f]">
         <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
            <h1 className="text-9xl font-black text-white">ALPHA</h1>
         </div>
      </div>

      {/* C. TERMINAL LOG */}
      <div className="h-9 bg-black/60 border-t border-jup-border flex items-center px-4 gap-3 overflow-hidden">
         <Terminal size={14} className="text-jup-lime shrink-0" />
         <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-xs font-mono text-gray-400 flex gap-8">
               <span>[10:42:05] <span className="text-green-400">SYS</span> Connected to NASDAQ Stream...</span>
               <span>[10:42:08] <span className="text-blue-400">INFO</span> NVDA Volume Spike (+150%)...</span>
               <span>[10:42:12] <span className="text-yellow-400">WARN</span> RSI Divergence detected on 15m...</span>
            </div>
         </div>
         <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            LIVE
         </div>
      </div>

    </div>
  );
}

// --- HELPER FUNCTIONS ---

function TabButton({ label, active, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${active ? 'bg-jup-card text-jup-lime shadow-sm' : 'text-gray-500 hover:text-white'}`}
    >
      {icon} {label}
    </button>
  );
}

function generateDummyData(count: number) {
    const data = [];
    let time = Math.floor(Date.now() / 1000) - (count * 60 * 60 * 24); 
    let value = 140;

    for (let i = 0; i < count; i++) {
        const open = value + (Math.random() * 2 - 1);
        const close = open + (Math.random() * 4 - 2);
        const high = Math.max(open, close) + Math.random();
        const low = Math.min(open, close) - Math.random();
        
        data.push({ time: time as any, open, high, low, close });
        time += 60 * 60 * 24; 
        value = close;
    }
    return data;
}