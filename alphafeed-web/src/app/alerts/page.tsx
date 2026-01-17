// src/app/alerts/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { fetchAlerts, createAlert, deleteAlert, fetchStockPrice } from '@/lib/api'; // Added fetchStockPrice
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Activity, CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Above");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'alert'} | null>(null);

  // 1. Load Data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await fetchAlerts();
    setAlerts(data);
    setLoading(false);
  }

  // 2. THE MARKET WATCHER LOOP (Runs every 10 seconds)
  useEffect(() => {
    if (alerts.length === 0) return;

    const interval = setInterval(async () => {
        console.log("🔍 Scanning market for alerts...");
        
        // We iterate through all active alerts
        const updatedAlerts = await Promise.all(alerts.map(async (alert) => {
            // Skip if already triggered to avoid spam
            if (alert.status === "Triggered") return alert;

            // Fetch LIVE price
            const stockData = await fetchStockPrice(alert.ticker);
            if (!stockData || stockData.error) return alert;

            const currentPrice = stockData.price;
            let isHit = false;

            // Check Condition
            if (alert.condition === "Above" && currentPrice >= alert.price) isHit = true;
            if (alert.condition === "Below" && currentPrice <= alert.price) isHit = true;

            if (isHit) {
                // TRIGGER ALERT!
                triggerNotification(`🚨 ALERT TRIGGERED: ${alert.ticker} hit ${currentPrice}!`);
                return { ...alert, status: "Triggered" }; // Update local status
            }
            return alert;
        }));

        // Only update state if something changed to avoid re-renders
        if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
            setAlerts(updatedAlerts);
        }

    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alerts]);


  // Helper: Show Notification Toast
  function triggerNotification(msg: string) {
    setNotification({ message: msg, type: 'alert' });
    // Hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  }

  // Handle Create
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticker || !price) return;
    setIsSubmitting(true);
    await createAlert({ ticker, condition, price: parseFloat(price) });
    setTicker("");
    setPrice("");
    setIsSubmitting(false);
    loadData();
  }

  // Handle Delete
  async function handleDelete(id: number) {
    const success = await deleteAlert(id);
    if (success) setAlerts(alerts.filter(a => a.id !== id));
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="fixed top-20 right-6 bg-[#1c2128] border border-jup-lime text-white p-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-right">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center animate-pulse">
                <Bell size={20} />
            </div>
            <div>
                <h4 className="font-bold text-sm text-jup-lime">SIGNAL DETECTED</h4>
                <p className="text-xs text-gray-300">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)}><X size={16} className="text-gray-500 hover:text-white"/></button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex-none">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="text-jup-lime w-8 h-8" /> 
            Alerts & Signals
        </h1>
        <p className="text-gray-400 text-sm mt-2">
            System automatically scans live prices every 10s.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* CREATE FORM */}
        <div className="w-1/3 bg-[#1c2128] border border-jup-border rounded-xl p-6 shadow-xl flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus size={18} className="text-jup-lime"/> Create Signal
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Asset Ticker</label>
                    <input type="text" placeholder="e.g. AAPL, BTC-USD" value={ticker} onChange={(e) => setTicker(e.target.value)} className="w-full bg-[#0d1016] border border-jup-border rounded-lg p-3 text-white focus:border-jup-lime outline-none mt-1 font-mono uppercase"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Condition</label>
                        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-[#0d1016] border border-jup-border rounded-lg p-3 text-white focus:border-jup-lime outline-none mt-1">
                            <option value="Above">Price Above</option>
                            <option value="Below">Price Below</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Target Price</label>
                        <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-[#0d1016] border border-jup-border rounded-lg p-3 text-white focus:border-jup-lime outline-none mt-1 font-mono"/>
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting || !ticker || !price} className="w-full bg-jup-lime hover:bg-[#b8e866] text-black font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2">
                    {isSubmitting ? "Creating..." : "Start Watcher"}
                    {!isSubmitting && <Activity size={18} />}
                </button>
            </form>
        </div>

        {/* ALERTS LIST */}
        <div className="flex-1 bg-[#1c2128] border border-jup-border rounded-xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b border-jup-border bg-[#0d1016] flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Active Monitors</span>
                <span className="text-xs font-mono text-gray-600 bg-gray-900 px-2 py-1 rounded border border-gray-800">{alerts.length} Running</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
                {loading ? <div className="text-center text-gray-500 mt-10">Syncing...</div> : alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center justify-between p-4 border rounded-lg transition-colors group ${alert.status === "Triggered" ? "bg-red-900/10 border-red-900/30" : "bg-[#13161c] border-gray-800"}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${alert.status === "Triggered" ? "text-red-500 border-red-500/50 bg-red-500/10 animate-pulse" : "text-green-500 border-green-500/30 bg-green-500/10"}`}>
                                {alert.status === "Triggered" ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                    {alert.ticker}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-600 text-gray-400">{alert.condition.toUpperCase()}</span>
                                    <span className="font-mono text-white">{alert.price}</span>
                                </h3>
                                <p className="text-[10px] text-gray-500">Status: {alert.status}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(alert.id)} className="text-gray-600 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}