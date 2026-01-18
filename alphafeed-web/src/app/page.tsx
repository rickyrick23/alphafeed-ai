"use client";
import { useState, useEffect } from 'react';
import { fetchChartData, fetchSentiment, fetchMacroView, ChartDataPoint } from '@/lib/api';
import { 
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Activity, Zap, TrendingUp, Layers, ArrowUpRight, ArrowDownRight, 
  Search, BarChart2, Plus, Camera 
} from 'lucide-react';

// --- CUSTOM CANDLESTICK SHAPE ---
const Candlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isUp = close >= open;
  const color = isUp ? '#3fb950' : '#ef4444';
  const ratio = Math.abs(height / (open - close)); // Pixel-to-Value ratio
  
  // Calculate Wick Coordinates
  // We guard against division by zero if open === close
  const safeRatio = (open === close) ? 1 : ratio;
  
  const yHigh = y - (high - Math.max(open, close)) * safeRatio;
  const yLow = y + height + (Math.min(open, close) - low) * safeRatio;

  return (
    <g stroke={color} fill={color} strokeWidth="2">
      {/* Wick (High to Low line) */}
      <path d={`M ${x + width / 2},${yHigh} L ${x + width / 2},${yLow}`} />
      {/* Body (Open to Close bar) */}
      <rect x={x} y={y} width={width} height={Math.max(2, height)} fill={color} stroke="none" />
    </g>
  );
};

export default function HomePage() {
  const [ticker, setTicker] = useState("NVDA");
  const [searchInput, setSearchInput] = useState("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [macroData, setMacroData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1D");

  useEffect(() => {
    loadAnalysisData();
  }, [ticker, timeframe]);

  const loadAnalysisData = async () => {
    setLoading(true);
    const [cData, sData, mData] = await Promise.all([
        fetchChartData(ticker, timeframe),
        fetchSentiment(ticker),
        fetchMacroView()
    ]);
    setChartData(cData);
    setSentiment(sData);
    setMacroData(mData);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTicker(searchInput.toUpperCase());
      setSearchInput("");
    }
  };

  // Prepare Data for Candlestick (Recharts needs specific formatting)
  const candleData = chartData.map(d => ({
    ...d,
    // We pass [min, max] to the Bar to define the body range
    body: [Math.min(d.open, d.close), Math.max(d.open, d.close)], 
    // We pass raw values for color calculation in custom shape
    open: d.open,
    close: d.close,
    high: d.high,
    low: d.low,
    color: d.close >= d.open ? '#3fb950' : '#ef4444'
  }));

  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : { close: 0 };
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : { close: 0 };
  const change = latest.close - prev.close; // Fixed calculation logic
  const percent = prev.close ? (change / prev.close) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans">
      
      {/* 1. LIVE TICKER */}
      <div className="h-10 bg-[#0d1016] border-b border-[#2d333b] flex items-center overflow-hidden shrink-0 relative z-20">
          <div className="px-4 bg-[#0d1016] h-full flex items-center z-30 border-r border-[#2d333b]">
              <div className="flex items-center gap-2 text-[#d2fc52] text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#d2fc52]"></span> Live Feed
              </div>
          </div>
          <div className="flex-1 overflow-hidden relative flex items-center">
              <div className="flex items-center gap-12 px-4 animate-marquee whitespace-nowrap hover:paused">
                  {[...macroData, ...macroData].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-white font-bold">{item.name}</span>
                          <span className={item.change >= 0 ? "text-[#3fb950]" : "text-red-500"}>{item.price.toLocaleString()}</span>
                          <span className={`flex items-center text-[10px] ${item.change >= 0 ? "text-[#3fb950]" : "text-red-500"}`}>
                              {item.change >= 0 ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(item.change)}%
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <div className="flex flex-1 p-6 gap-6 overflow-hidden min-h-0">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto custom-scrollbar pr-2">
              
              {/* 2. PRO CANDLESTICK CHART CARD */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col h-[600px] shrink-0 relative">
                  
                  {/* SEARCH & HEADER BAR */}
                  <div className="flex items-center justify-between p-4 border-b border-[#2d333b]">
                      <div className="flex items-center gap-4">
                           {/* Search Input */}
                           <div className="relative group w-48">
                                <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
                                <form onSubmit={handleSearch}>
                                    <input 
                                        type="text" 
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder={ticker} 
                                        className="w-full bg-[#0d1016] border border-[#30363d] text-white text-sm font-bold rounded-md pl-9 pr-2 py-1.5 focus:border-[#d2fc52] outline-none uppercase"
                                    />
                                </form>
                           </div>

                           {/* Divider */}
                           <div className="h-6 w-px bg-[#30363d]"></div>

                           {/* Chart Toolbar */}
                           <div className="flex items-center gap-1">
                                <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a303c] rounded"><Plus size={16}/></button>
                                <button className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-[#2a303c] rounded text-xs font-bold">
                                    <BarChart2 size={14}/> <span>Interval</span>
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-white hover:bg-[#2a303c] rounded text-xs font-bold">
                                    <Activity size={14}/> <span>Indicators</span>
                                </button>
                           </div>
                      </div>

                      <div className="flex items-center gap-3">
                           {/* Price Info */}
                           <div className="text-right mr-4">
                                <span className={`text-lg font-bold font-mono block ${isUp ? 'text-[#3fb950]' : 'text-red-500'}`}>
                                    {latest.close?.toFixed(2)}
                                </span>
                           </div>

                           {/* Timeline Selector */}
                           <div className="flex bg-[#0d1016] rounded-md p-1 border border-[#30363d]">
                                {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                                    <button 
                                        key={t} 
                                        onClick={() => setTimeframe(t)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${timeframe === t ? 'bg-[#2a303c] text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                           </div>
                           
                           <div className="h-6 w-px bg-[#30363d] mx-1"></div>
                           <button className="p-2 text-gray-400 hover:text-white"><Camera size={16}/></button>
                      </div>
                  </div>

                  {/* CHART VISUALS (CANDLESTICK) */}
                  <div className="flex-1 w-full min-h-0 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={candleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" vertical={false} />
                              <XAxis dataKey="time" hide />
                              <YAxis 
                                domain={['auto', 'auto']} 
                                orientation="right" 
                                tick={{fontSize: 11, fill: '#6b7280', fontFamily: 'monospace'}} 
                                axisLine={false} 
                                tickLine={false}
                                width={50}
                              />
                              <Tooltip 
                                contentStyle={{backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff'}}
                                itemStyle={{color: '#fff', fontFamily: 'monospace'}}
                                labelStyle={{display: 'none'}}
                                cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '4 4' }}
                                // FIX: Updated type definition for 'name' to 'any' to satisfy TypeScript
                                formatter={(value: any, name: any, props: any) => {
                                    if (name === 'body') return [props.payload.close.toFixed(2), 'Close'];
                                    return [value, name];
                                }}
                              />
                              {/* The Custom Candlestick Shape */}
                              <Bar 
                                dataKey="body" 
                                shape={<Candlestick />} 
                                animationDuration={500}
                              >
                                {candleData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                          </ComposedChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* 3. SENTIMENT PANEL */}
              <div className="h-60 bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#d2fc52]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  {loading || !sentiment ? (
                      <div className="flex items-center justify-center w-full h-full text-gray-500 gap-2">
                          <Zap size={16} className="animate-pulse"/> Generating Analysis...
                      </div>
                  ) : (
                      <>
                        <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap size={14} className="text-[#d2fc52] fill-current" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Sentiment Analysis</span>
                                </div>
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-5xl font-black text-white uppercase tracking-tight">{sentiment.sentiment_label}</span>
                                    <span className="text-4xl font-bold text-[#d2fc52]">{sentiment.sentiment_score}%</span>
                                </div>
                            </div>
                            
                            <div className="overflow-y-auto custom-scrollbar pr-4 h-24">
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    {sentiment.summary}
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-80 bg-[#0d1016] border border-[#30363d] rounded-xl p-6 flex flex-col justify-between shrink-0 relative z-10">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2 text-blue-400">
                                   <Activity size={14}/>
                                   <span className="text-[10px] font-bold uppercase tracking-widest">Projected Range (24h)</span>
                               </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-xl font-mono font-bold mt-2">
                                <span className="text-red-400">{sentiment.projected_low}</span>
                                <span className="text-gray-600">-</span>
                                <span className="text-[#3fb950]">{sentiment.projected_high}</span>
                            </div>

                            <div className="w-full bg-[#2d333b] h-1.5 rounded-full mt-4 relative overflow-hidden">
                                 <div className="absolute left-[20%] right-[20%] h-full bg-blue-500/50 rounded-full"></div>
                                 <div className="absolute left-[40%] w-1 h-2 -top-0.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                            </div>
                        </div>
                      </>
                  )}
              </div>
          </div>

          {/* 4. RIGHT COLUMN: WIDGETS */}
          <div className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
              {/* Market Heat */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 flex flex-col min-h-[200px]">
                  <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1016]/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12}/> Market Heat
                      </span>
                      <span className="text-[9px] text-gray-600 cursor-pointer hover:text-white">MORE &gt;</span>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                      {macroData.slice(0, 4).map((item, i) => (
                          <div key={i} className="p-3 rounded bg-[#0d1016] border border-[#2d333b] flex justify-between items-center hover:border-[#d2fc52]/50 transition-colors group cursor-pointer">
                              <span className="text-xs font-bold text-gray-300 group-hover:text-white">{item.name}</span>
                              <span className={`text-xs font-mono font-bold ${item.change >= 0 ? 'text-[#3fb950]' : 'text-red-500'}`}>
                                  {item.change > 0 ? '+' : ''}{item.change}%
                              </span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Top Movers */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 flex flex-col min-h-[200px]">
                  <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1016]/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={12}/> Top Movers
                      </span>
                      <span className="text-[9px] text-gray-600 cursor-pointer hover:text-white">MORE &gt;</span>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                      {macroData.slice(2, 6).map((item, i) => (
                          <div key={i} className="p-3 rounded bg-[#0d1016] border border-[#2d333b] flex justify-between items-center hover:border-[#d2fc52]/50 transition-colors group cursor-pointer">
                              <div className="flex items-center gap-2">
                                  <Zap size={10} className={item.change > 0 ? "text-[#3fb950]" : "text-red-500"}/>
                                  <span className="text-xs font-bold text-gray-300 group-hover:text-white">{item.name}</span>
                              </div>
                              <span className={`text-xs font-mono font-bold ${item.change >= 0 ? 'text-[#3fb950]' : 'text-red-500'}`}>
                                  {item.change}%
                              </span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Sector Flow */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 flex flex-col min-h-[200px]">
                  <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#0d1016]/50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={12}/> Sector Flow
                      </span>
                  </div>
                  <div className="p-4 space-y-4">
                      {[
                          { name: "Technology", val: 82, col: "#d2fc52" },
                          { name: "Energy", val: 45, col: "#3fb950" },
                          { name: "Finance", val: 60, col: "#3b82f6" }
                      ].map((s) => (
                          <div key={s.name}>
                              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                  <span>{s.name}</span>
                                  <span>{s.val}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#0d1016] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${s.val}%`, background: s.col }}></div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
}