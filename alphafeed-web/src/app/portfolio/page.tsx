"use client";
import { useState, useEffect } from 'react';
import { fetchPortfolioData } from '@/lib/api';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, Download, 
  DollarSign, Briefcase, Activity, X 
} from 'lucide-react';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    const result = await fetchPortfolioData();
    setData(result);
    setLoading(false);
  };

  // --- 1. EXPORT CSV FUNCTIONALITY ---
  const handleExportCSV = () => {
    if (!data || !data.holdings) return;

    // Define CSV Headers
    const headers = ["Symbol", "Name", "Type", "Price", "Balance", "Value", "P&L Amount", "P&L Percent", "Allocation"];
    
    // Map Data to CSV Rows
    const rows = data.holdings.map((item: any) => [
        item.symbol,
        item.name,
        item.type,
        item.price,
        item.balance,
        item.value,
        item.pl_amount,
        item.pl_percent,
        item.allocation + "%"
    ]);

    // Combine and Convert to CSV String
    const csvContent = [
        headers.join(","), 
        ...rows.map((row: any[]) => row.join(","))
    ].join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `alphafeed_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 2. ADD ASSET SIMULATION ---
  const handleAddAsset = () => {
      // Simulate adding a new asset (Mock Logic for UI Demo)
      const newAsset = { 
        id: Math.random().toString(), 
        symbol: "MSFT", 
        name: "Microsoft Corp", 
        type: "STOCK", 
        price: 420.50, 
        balance: 10, 
        value: 4205.00, 
        pl_amount: "+$120.00", 
        pl_percent: "+2.9%", 
        allocation: 5, 
        color: "#d2fc52" 
      };

      // Update Local State
      setData((prev: any) => ({
          ...prev,
          holdings: [...prev.holdings, newAsset]
      }));
      
      setIsModalOpen(false); // Close Modal
      alert("Simulated: Added Microsoft (MSFT) to holdings.");
  };

  if (loading) return (
    <div className="flex h-full w-full items-center justify-center bg-[#0d1016]">
        <div className="flex flex-col items-center gap-2">
             <Activity className="animate-bounce text-[#d2fc52]" size={32} />
             <span className="text-xs font-mono text-gray-500">SYNCING ASSETS...</span>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-[#0d1016] overflow-hidden font-sans p-8 overflow-y-auto custom-scrollbar relative">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wallet className="text-[#d2fc52]" size={24} /> My Portfolio
            </h1>
            <p className="text-gray-500 text-sm mt-1">Real-time performance tracking and asset allocation analysis.</p>
          </div>
          <div className="flex gap-3">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#30363d] text-gray-300 hover:bg-[#1c2128] hover:text-white transition-all text-sm font-bold active:scale-95"
              >
                  <Download size={16}/> Export CSV
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d2fc52] text-black hover:bg-[#b8e040] transition-all text-sm font-bold active:scale-95"
              >
                  <Plus size={16}/> Add Asset
              </button>
          </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          
          {/* 1. Total Net Worth */}
          <div className="bg-[#161b22] border border-[#2d333b] rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <DollarSign size={80} />
              </div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Net Worth</h2>
              <div className="text-4xl font-black text-white mb-2">{data.summary.total_value}</div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#d2fc52]">
                  <TrendingUp size={16} />
                  <span>{data.summary.day_percent} Today</span>
              </div>
          </div>

          {/* 2. Total Profit / Loss */}
          <div className="bg-[#161b22] border border-[#2d333b] rounded-xl p-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Profit / Loss</h2>
              <div className="text-4xl font-black text-[#3fb950] mb-2">{data.summary.total_profit}</div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#3fb950]/80">
                  <TrendingUp size={16} />
                  <span>{data.summary.all_time_percent} All Time</span>
              </div>
          </div>

          {/* 3. Top Performer */}
          <div className="bg-[#161b22] border border-[#2d333b] rounded-xl p-6 flex items-center justify-between">
              <div>
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Performer</h2>
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2a303c] flex items-center justify-center text-white font-bold text-xl">
                          {data.top_performer.symbol[0]}
                      </div>
                      <div>
                          <div className="text-xl font-black text-white">{data.top_performer.symbol}</div>
                          <div className="text-[#d2fc52] font-bold">{data.top_performer.change}</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* HOLDINGS TABLE */}
      <div className="bg-[#161b22] border border-[#2d333b] rounded-xl overflow-hidden shrink-0">
          <div className="p-4 border-b border-[#2d333b] flex items-center gap-2">
               <Briefcase size={16} className="text-[#d2fc52]" />
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">Current Holdings</h2>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-bold text-gray-500 uppercase bg-[#0d1016] tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Asset</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Balance</th>
                        <th className="px-6 py-4 text-right">Value</th>
                        <th className="px-6 py-4 text-right">P&L</th>
                        <th className="px-6 py-4 w-48">Allocation</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2d333b]">
                    {data.holdings.map((asset: any) => (
                        <tr key={asset.id} className="hover:bg-[#1c2128] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[#2a303c] border border-[#30363d] flex items-center justify-center text-white font-bold text-xs">
                                        {asset.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{asset.symbol}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">{asset.type}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-white font-mono">${asset.price.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="text-white font-bold">{asset.balance} <span className="text-gray-600 text-[10px]">{asset.symbol}</span></div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-white">
                                ${asset.value.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className={`font-bold ${asset.pl_percent.includes('-') ? 'text-red-500' : 'text-[#3fb950]'}`}>
                                    {asset.pl_percent}
                                </div>
                                <div className={`text-xs ${asset.pl_percent.includes('-') ? 'text-red-500/70' : 'text-[#3fb950]/70'}`}>
                                    {asset.pl_amount}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-[#0d1016] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{ width: `${asset.allocation}%`, backgroundColor: asset.color }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-400 w-8 text-right">{asset.allocation}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>

      {/* SIMPLE ADD ASSET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white">Add New Asset</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Ticker Symbol</label>
                        <input className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white text-sm focus:border-[#d2fc52] outline-none" placeholder="e.g. MSFT" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Quantity</label>
                        <input className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white text-sm focus:border-[#d2fc52] outline-none" type="number" placeholder="0.00" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-lg border border-[#30363d] text-gray-300 hover:bg-[#1c2128] font-bold text-sm">Cancel</button>
                    <button onClick={handleAddAsset} className="flex-1 py-3 rounded-lg bg-[#d2fc52] text-black hover:bg-[#b8e040] font-bold text-sm">Add Asset</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}