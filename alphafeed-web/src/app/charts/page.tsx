"use client";
import { useState, useEffect } from 'react';
import { fetchChartData, fetchSentiment, ChartDataPoint } from '@/lib/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Maximize2, TrendingUp, TrendingDown,
    BarChart2, Settings, Activity, Zap, Search, Plus
} from 'lucide-react';

const INITIAL_ASSETS = [
    { id: "NVDA", name: "NVIDIA Corp", type: "STOCK" },
    { id: "BTC-USD", name: "Bitcoin", type: "CRYPTO" },
    { id: "RELIANCE.NS", name: "Reliance Ind", type: "STOCK" },
    { id: "AAPL", name: "Apple Inc", type: "STOCK" },
    { id: "ETH-USD", name: "Ethereum", type: "CRYPTO" },
    { id: "TATA", name: "Tata Motors", type: "STOCK" },
];

export default function ProChartsPage() {
    const [watchlist, setWatchlist] = useState(INITIAL_ASSETS);
    const [selectedAsset, setSelectedAsset] = useState(INITIAL_ASSETS[0]);
    const [filter, setFilter] = useState("ALL"); // ALL, STOCK, CRYPTO
    const [searchTerm, setSearchTerm] = useState("");

    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [sentiment, setSentiment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState("1D");

    useEffect(() => {
        loadData();
    }, [selectedAsset, timeframe]);

    const loadData = async () => {
        setLoading(true);
        const [chartData, sentimentData] = await Promise.all([
            fetchChartData(selectedAsset.id, timeframe),
            fetchSentiment(selectedAsset.id)
        ]);
        setData(chartData);
        setSentiment(sentimentData);
        setLoading(false);
    };

    const addAsset = () => {
        if (!searchTerm.trim()) return;
        const ticker = searchTerm.toUpperCase().trim();
        // Simple heuristic for type
        const type = (ticker.includes("-USD") || ticker.includes("BTC") || ticker.includes("ETH")) ? "CRYPTO" : "STOCK";

        const newAsset = { id: ticker, name: ticker, type };

        // Prevent duplicates
        if (!watchlist.some(a => a.id === ticker)) {
            setWatchlist([newAsset, ...watchlist]);
        }
        setSelectedAsset(newAsset);
        setSearchTerm("");
    };

    const filteredAssets = watchlist.filter(asset => {
        if (filter !== "ALL" && asset.type !== filter) return false;
        return true;
    });

    const latest = data.length > 0 ? data[data.length - 1] : { close: 0 };
    const prev = data.length > 1 ? data[data.length - 2] : { close: 0 };
    const change = latest.close - prev.close;
    const percent = prev.close ? (change / prev.close) * 100 : 0;
    const isUp = change >= 0;

    return (
        <div className="flex flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans">

            {/* SIDEBAR: WATCHLIST */}
            <div className="w-72 bg-[#161b22] border-r border-[#2d333b] flex flex-col shrink-0">
                <div className="p-4 border-b border-[#2d333b] space-y-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <BarChart2 size={14} /> Market Watch
                    </h2>

                    {/* Search & Add */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addAsset()}
                                placeholder="Add Ticker..."
                                className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg py-2 pl-8 pr-2 text-xs text-white font-bold placeholder-gray-600 focus:border-[#d2fc52] outline-none transition-colors"
                            />
                        </div>
                        <button
                            onClick={addAsset}
                            disabled={!searchTerm}
                            className="bg-[#2a303c] hover:bg-[#d2fc52] hover:text-black text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex p-1 bg-[#0d1016] rounded-lg border border-[#30363d]">
                        {["ALL", "STOCK", "CRYPTO"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-1 text-[10px] font-bold rounded ${filter === f ? 'bg-[#2a303c] text-[#d2fc52]' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredAssets.map(asset => (
                        <div
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`p-4 border-b border-[#2d333b] cursor-pointer hover:bg-[#1c2128] transition-colors ${selectedAsset.id === asset.id ? 'bg-[#1c2128] border-l-2 border-l-[#d2fc52]' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold ${selectedAsset.id === asset.id ? 'text-white' : 'text-gray-400'}`}>{asset.id}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${asset.type === 'CRYPTO' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                    {asset.type}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 truncate">{asset.name}</div>
                        </div>
                    ))}
                    {filteredAssets.length === 0 && (
                        <div className="p-8 text-center text-gray-600 text-xs italic">
                            No assets found.
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d1016]">

                {/* Top Bar */}
                <div className="h-14 border-b border-[#2d333b] flex items-center justify-between px-6 bg-[#0d1016] shrink-0">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                {selectedAsset.name}
                                <span className="text-sm font-mono text-gray-500">({selectedAsset.id})</span>
                            </h1>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isUp ? 'bg-[#3fb950]/10 text-[#3fb950]' : 'bg-red-500/10 text-red-500'}`}>
                            {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="text-lg font-bold">{latest.close.toFixed(2)}</span>
                            <span className="text-xs font-mono">({isUp ? '+' : ''}{percent.toFixed(2)}%)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-[#161b22] rounded-lg p-1 border border-[#30363d]">
                            {["1H", "1D", "1W", "1M", "1Y"].map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${timeframe === tf ? 'bg-[#2a303c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <button className="p-2 hover:bg-[#161b22] rounded"><Settings size={18} /></button>
                            <button className="p-2 hover:bg-[#161b22] rounded"><Maximize2 size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* Chart Canvas */}
                <div className="flex-1 relative p-4 min-h-0">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Activity className="animate-bounce text-[#d2fc52]" size={32} />
                                <span className="text-xs font-mono text-gray-500">CALCULATING VECTORS...</span>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isUp ? "#3fb950" : "#ef4444"} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={isUp ? "#3fb950" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d333b" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#4b5563"
                                    tick={{ fontSize: 10 }}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    stroke="#4b5563"
                                    tick={{ fontSize: 10 }}
                                    axisLine={false}
                                    tickFormatter={(val) => val.toFixed(0)}
                                    orientation="right"
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [parseFloat(value).toFixed(2), "Price"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="close"
                                    stroke={isUp ? "#3fb950" : "#ef4444"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* AI SENTIMENT WIDGET (FIXED) */}
                <div className="h-56 border-t border-[#2d333b] bg-[#161b22] p-6 shrink-0 flex items-center justify-between gap-6">
                    {loading || !sentiment ? (
                        <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                            <Zap size={16} /> Analyzing market sentiment...
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col h-full flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap size={14} className="text-[#d2fc52] fill-current" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Sentiment Analysis</span>
                                </div>

                                {/* Score and Label (Adjusted Size) */}
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-black text-white uppercase tracking-tight">{sentiment.sentiment_label}</span>
                                    <span className="text-3xl font-bold text-[#d2fc52]">{sentiment.sentiment_score}%</span>
                                </div>

                                {/* SCROLLABLE SUMMARY TEXT (Fixed) */}
                                <div className="overflow-y-auto custom-scrollbar pr-2 h-24">
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                        {sentiment.summary}
                                    </p>
                                </div>
                            </div>

                            {/* PROJECTED RANGE CARD */}
                            <div className="bg-[#0d1016] border border-[#30363d] rounded-xl p-4 w-72 h-full flex flex-col justify-center shrink-0">
                                <div className="flex items-center gap-2 mb-3 text-blue-400">
                                    <Activity size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Projected Range (24h)</span>
                                </div>

                                <div className="flex flex-col gap-1 font-mono font-bold w-full">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-red-400">{sentiment.projected_low}</span>
                                        <span className="text-gray-600">-</span>
                                        <span className="text-[#3fb950]">{sentiment.projected_high}</span>
                                    </div>
                                </div>

                                <div className="w-full bg-[#2d333b] h-1.5 rounded-full mt-4 relative overflow-hidden">
                                    <div className="absolute left-1/4 right-1/4 h-full bg-blue-500/50 rounded-full"></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}