"use client";
import { useState, useEffect } from 'react';
import { fetchChartData, fetchSentiment, fetchMacroView, ChartDataPoint } from '@/lib/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Zap, TrendingUp, TrendingDown, Layers, BarChart3, ArrowRight 
} from 'lucide-react';

export default function HomePage() {
  const [ticker] = useState("NVDA"); // Default view
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [macroData, setMacroData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    setLoading(true);
    const [cData, sData, mData] = await Promise.all([
        fetchChartData(ticker, "1D"),
        fetchSentiment(ticker),
        fetchMacroView()
    ]);
    setChartData(cData);
    setSentiment(sData);
    setMacroData(mData);
    setLoading(false);
  };

  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : { close: 0 };
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : { close: 0 };
  const change = latest.close - prev.close;
  const percent = prev.close ? (change / prev.close) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div className="flex flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans p-6 gap-6">
      
      {/* LEFT COLUMN: CHART & SENTIMENT */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* 1. MAIN CHART CARD */}
          <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col p-4 min-h-[400px]">
              {/* Chart Header */}
              <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2a303c] flex items-center justify-center font-bold text-white">
                          {ticker[0]}
                      </div>
                      <div>
                          <div className="text-lg font-black text-white">{ticker}</div>
                          <div className={`flex items-center text-xs font-bold ${isUp ? 'text-[#3fb950]' : 'text-red-500'}`}>
                              {latest.close.toFixed(2)} ({isUp ? '+' : ''}{percent.toFixed(2)}%)
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      {['1D', '1W', '1M', '1Y'].map(t => (
                          <button key={t} className={`px-3 py-1 rounded text-xs font-bold ${t === '1D' ? 'bg-[#2a303c] text-white' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>
                      ))}
                  </div>
              </div>

              {/* Chart */}
              <div className="flex-1 relative w-full h-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                          <defs>
                              <linearGradient id="colorAnalysis" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={isUp ? "#3fb950" : "#ef4444"} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={isUp ? "#3fb950" : "#ef4444"} stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#0d1016', borderColor: '#30363d', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                            formatter={(value: any) => [parseFloat(value).toFixed(2), "Price"]}
                          />
                          <Area type="monotone" dataKey="close" stroke={isUp ? "#3fb950" : "#ef4444"} strokeWidth={2} fillOpacity={1} fill="url(#colorAnalysis)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* 2. AI SENTIMENT ANALYSIS (FIXED) */}
          <div className="h-56 bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d2fc52]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {loading || !sentiment ? (
                  <div className="flex items-center gap-2 text-gray-500 animate-pulse m-auto">
                      <Zap size={16}/> Generating AI Analysis...
                  </div>
              ) : (
                  <>
                    {/* Left: Text Content */}
                    <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-[#d2fc52] fill-current" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Sentiment Analysis</span>
                        </div>
                        
                        <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-4xl font-black text-white uppercase tracking-tight">{sentiment.sentiment_label}</span>
                            <span className="text-3xl font-bold text-[#d2fc52]">{sentiment.sentiment_score}%</span>
                        </div>
                        
                        {/* SCROLLABLE SUMMARY FIX */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 h-20">
                            <p className="text-sm text-gray-400 leading-relaxed font-normal">
                                {sentiment.summary}
                            </p>
                        </div>
                    </div>

                    {/* Right: Projected Range Card */}
                    <div className="w-full md:w-72 bg-[#0d1016] border border-[#30363d] rounded-xl p-5 flex flex-col justify-between shrink-0 relative z-10">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-blue-400">
                               <Activity size={14}/>
                               <span className="text-[10px] font-bold uppercase tracking-widest">Projected Range (24h)</span>
                           </div>
                        </div>
                        
                        {/* PRICE NUMBERS (Fixed: No Double $$) */}
                        <div className="flex justify-between items-center text-lg font-mono font-bold mt-1">
                            <span className="text-red-400">{sentiment.projected_low}</span>
                            <span className="text-gray-600">-</span>
                            <span className="text-[#3fb950]">{sentiment.projected_high}</span>
                        </div>

                        {/* Progress Bar Visual */}
                        <div className="w-full bg-[#2d333b] h-1.5 rounded-full mt-4 relative overflow-hidden">
                             <div className="absolute left-[20%] right-[20%] h-full bg-blue-500/50 rounded-full"></div>
                             <div className="absolute left-[40%] w-1 h-2 -top-0.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                  </>
              )}
          </div>
      </div>

      {/* RIGHT COLUMN: WIDGETS */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
          
          {/* Market Heat */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 max-h-[250px] flex flex-col">
              <div className="p-4 border-b border-[#30363d] flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Activity size={12}/> Market Heat</span>
                  <span className="text-[10px] text-gray-600 cursor-pointer hover:text-white">MORE &gt;</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {macroData.slice(0, 3).map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#0d1016] border border-[#2d333b] flex justify-between items-center hover:border-[#d2fc52] transition-colors group">
                          <span className="text-xs font-bold text-gray-300 group-hover:text-white">{item.name}</span>
                          <span className={`text-xs font-mono font-bold ${item.change >= 0 ? 'text-[#3fb950]' : 'text-red-500'}`}>
                              {item.change > 0 ? '+' : ''}{item.change}%
                          </span>
                      </div>
                  ))}
              </div>
          </div>

          {/* Top Movers */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 max-h-[250px] flex flex-col">
              <div className="p-4 border-b border-[#30363d] flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={12}/> Top Movers</span>
                  <span className="text-[10px] text-gray-600 cursor-pointer hover:text-white">MORE &gt;</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {macroData.slice(3, 6).map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#0d1016] border border-[#2d333b] flex justify-between items-center hover:border-[#d2fc52] transition-colors group">
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
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex-1 flex flex-col">
              <div className="p-4 border-b border-[#30363d] flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Layers size={12}/> Sector Flow</span>
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
  );
}