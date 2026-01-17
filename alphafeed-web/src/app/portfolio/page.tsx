"use client";
import { useState, useEffect } from 'react';
import { fetchPortfolio, addTrade } from '@/lib/api';
import { PieChart, Plus, Download, RefreshCw, MoreHorizontal, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State for "Add Asset"
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetchPortfolio();
    setData(res);
    setLoading(false);
  }

  async function handleAddAsset() {
    if(!newTicker || !newQty) return;
    await addTrade({ ticker: newTicker, qty: parseFloat(newQty), avg_price: parseFloat(newPrice) || 0 });
    setShowAddModal(false);
    loadData();
  }

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Loading AI Portfolio Analysis...</div>;

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <PieChart className="text-jup-lime w-8 h-8" /> 
                Unified Portfolio
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                Status: AI Analyst Active
            </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-jup-lime hover:bg-[#b8e866] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
            >
                <Plus size={18}/> Add Asset
            </button>
            <button className="bg-[#1c2128] border border-jup-border text-gray-300 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Download size={18}/> Export Report
            </button>
        </div>
      </div>

      {/* 2. METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: NET WORTH */}
        <div className="bg-[#13161c] border border-jup-border rounded-xl p-6 relative overflow-hidden group">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="p-1 rounded bg-gray-800"><RefreshCw size={10}/></span> Total Net Worth
            </h3>
            <div className="text-4xl font-black text-white tracking-tight">
                ${data.net_worth.toLocaleString()}
            </div>
            <div className={`mt-3 inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${data.total_gain >= 0 ? "bg-green-900/20 text-green-400 border border-green-900" : "bg-red-900/20 text-red-400 border border-red-900"}`}>
                {data.total_gain >= 0 ? "+" : ""}{data.total_gain.toLocaleString()} ({data.total_gain_percent}%)
                <span className="text-gray-500 font-normal">24h Change</span>
            </div>
        </div>

        {/* CARD 2: HEALTH SCORE */}
        <div className="bg-[#13161c] border border-jup-border rounded-xl p-6 flex flex-col justify-between">
             <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="p-1 rounded bg-gray-800"><ShieldCheck size={10}/></span> Portfolio Health
                </h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{data.health_score}</span>
                    <span className="text-gray-500 text-lg mb-1">/ 10</span>
                </div>
             </div>
             <div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${data.health_score > 7 ? 'bg-gradient-to-r from-green-500 to-jup-lime' : 'bg-red-500'}`} 
                        style={{width: `${data.health_score * 10}%`}}
                    />
                </div>
                <p className="text-[10px] text-yellow-500 mt-2 flex items-center gap-1.5">
                    <AlertTriangle size={10} /> AI Warning: {data.risk_warning}
                </p>
             </div>
        </div>

        {/* CARD 3: ACTIONS */}
        <div className="bg-[#13161c] border border-jup-border rounded-xl p-6 flex flex-col gap-3 justify-center">
            <button className="w-full bg-[#c7f284] hover:bg-[#b8e866] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(199,242,132,0.15)] transition-all">
                <RefreshCw size={16} /> Auto-Rebalance
            </button>
            <button className="w-full bg-[#1c2128] hover:bg-[#2a303c] border border-jup-border text-white font-bold py-3 rounded-lg text-sm transition-colors">
                View Analytics Report
            </button>
        </div>
      </div>

      {/* 3. HOLDINGS TABLE */}
      <div className="flex-1 bg-[#13161c] border border-jup-border rounded-xl overflow-hidden flex flex-col min-h-0 shadow-2xl">
        
        {/* Tabs */}
        <div className="flex items-center justify-between p-4 border-b border-jup-border bg-[#0d1016]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Holdings</h3>
            <div className="flex gap-1">
                <button className="px-3 py-1 rounded bg-[#1c2128] text-white text-[10px] font-bold border border-gray-700">All Assets</button>
                <button className="px-3 py-1 rounded text-gray-500 hover:text-white text-[10px] font-bold transition-colors">Crypto</button>
                <button className="px-3 py-1 rounded text-gray-500 hover:text-white text-[10px] font-bold transition-colors">Stocks</button>
            </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 bg-[#11141a] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800/50">
            <div className="col-span-4">Asset Name</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Balance</div>
            <div className="col-span-2 text-right">Value</div>
            <div className="col-span-2 pl-4">AI Risk Analysis</div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
            {data.holdings.map((asset: any) => (
                <div key={asset.id} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-[#1c2128] rounded-lg transition-colors group border border-transparent hover:border-gray-800">
                    
                    {/* 1. Name */}
                    <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2a303c] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                            {asset.ticker[0]}
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">{asset.ticker}</div>
                            <div className="text-gray-500 text-[10px]">{asset.name}</div>
                        </div>
                    </div>

                    {/* 2. Price */}
                    <div className="col-span-2 text-right">
                        <div className="text-white font-mono text-sm">${asset.price.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold ${asset.change_24h >= 0 ? "text-jup-lime" : "text-red-500"}`}>
                             {asset.change_24h > 0 ? "+" : ""}{asset.change_24h}%
                        </div>
                    </div>

                    {/* 3. Balance */}
                    <div className="col-span-2 text-right">
                        <div className="text-white font-mono text-sm">{asset.qty}</div>
                        <div className="text-gray-600 text-[10px]">{asset.ticker}</div>
                    </div>

                    {/* 4. Value */}
                    <div className="col-span-2 text-right">
                        <div className="text-white font-bold font-mono text-sm">${asset.value.toLocaleString()}</div>
                    </div>

                    {/* 5. Risk Pill */}
                    <div className="col-span-2 pl-4 flex items-center justify-between">
                        <div className="flex flex-col w-24">
                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-bold border w-max mb-1 ${
                                asset.risk_level === "High Risk" ? "bg-red-500/10 text-red-400 border-red-500/30" :
                                asset.risk_level === "Med Risk" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" :
                                "bg-green-500/10 text-green-400 border-green-500/30"
                            }`}>
                                {asset.risk_level === "High Risk" ? <AlertOctagon size={10}/> : 
                                 asset.risk_level === "Med Risk" ? <AlertTriangle size={10}/> : 
                                 <ShieldCheck size={10}/>
                                }
                                {asset.risk_level}
                            </div>
                            {/* Mini Progress Bar */}
                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${
                                        asset.risk_level === "High Risk" ? "bg-red-500" : 
                                        asset.risk_level === "Med Risk" ? "bg-yellow-500" : "bg-green-500"
                                    }`} 
                                    style={{width: `${asset.risk_score}%`}}
                                />
                            </div>
                        </div>
                        <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                </div>
            ))}
        </div>
      </div>

      {/* 4. ADD ASSET MODAL (Simple Overlay) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#1c2128] border border-jup-border p-6 rounded-xl w-96 shadow-2xl animate-in zoom-in-95">
                <h3 className="text-white font-bold text-lg mb-4">Add Manual Asset</h3>
                <input placeholder="Ticker (e.g. AAPL)" className="w-full bg-[#0d1016] border border-gray-700 p-3 rounded text-white mb-3 outline-none focus:border-jup-lime" onChange={e => setNewTicker(e.target.value)}/>
                <input placeholder="Quantity" type="number" className="w-full bg-[#0d1016] border border-gray-700 p-3 rounded text-white mb-3 outline-none focus:border-jup-lime" onChange={e => setNewQty(e.target.value)}/>
                <input placeholder="Avg Buy Price" type="number" className="w-full bg-[#0d1016] border border-gray-700 p-3 rounded text-white mb-4 outline-none focus:border-jup-lime" onChange={e => setNewPrice(e.target.value)}/>
                <div className="flex gap-2">
                    <button onClick={handleAddAsset} className="flex-1 bg-jup-lime text-black font-bold py-2 rounded">Add Asset</button>
                    <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-800 text-white font-bold py-2 rounded">Cancel</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}