"use client";
import { useState, useEffect, useRef } from 'react';
import { fetchMacroView } from '@/lib/api';
import { Bell, Plus, Trash2, Activity, AlertTriangle, ArrowRight, Loader2, X, Zap } from 'lucide-react';

// Define the exact types
type SignalStatus = 'ACTIVE' | 'TRIGGERED';
type SignalCondition = 'ABOVE' | 'BELOW';

interface Signal {
  id: string;
  ticker: string;
  condition: SignalCondition;
  targetPrice: number;
  status: SignalStatus;
  createdAt: string;
  currentPrice?: number;
}

export default function AlertsPage() {
  // --- STATE ---
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [ticker, setTicker] = useState("");
  const [target, setTarget] = useState("");
  const [condition, setCondition] = useState<SignalCondition>("ABOVE");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{title: string, msg: string} | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- 1. LOAD SAVED SIGNALS ON STARTUP ---
  useEffect(() => {
    // Load sound safely
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    }

    const saved = localStorage.getItem('alphafeed_signals');
    if (saved) {
      try {
        setSignals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse signals", e);
      }
    } else {
      setSignals([
        { id: '1', ticker: 'NVDA', condition: 'ABOVE', targetPrice: 200, status: 'ACTIVE', createdAt: '10:42 AM' },
        { id: '2', ticker: 'BTC-USD', condition: 'BELOW', targetPrice: 85000, status: 'ACTIVE', createdAt: '09:15 AM' }
      ]);
    }
    setIsLoaded(true);

    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // --- 2. SAVE SIGNALS WHENEVER THEY CHANGE ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('alphafeed_signals', JSON.stringify(signals));
    }
  }, [signals, isLoaded]);

  // --- 3. NEURAL ENGINE (LIVE MONITORING) ---
  useEffect(() => {
    if (!isLoaded) return;

    const checkSignals = async () => {
      try {
        const marketData = await fetchMacroView(); 
        
        setSignals(prevSignals => {
          let hasNewTrigger = false;
          let triggerDetails = { ticker: "", price: 0 };

          // Explicitly map to Signal type
          const updatedSignals: Signal[] = prevSignals.map((signal) => {
            if (signal.status === 'TRIGGERED') return signal;

            const asset = marketData.find((m: any) => 
              m.name.toUpperCase().includes(signal.ticker.toUpperCase()) || 
              (signal.ticker === 'BTC-USD' && m.name === 'Bitcoin') || 
              (signal.ticker === 'NVDA' && m.name === 'NVIDIA')
            );

            if (asset) {
              const current = asset.price;
              const isTriggered = 
                (signal.condition === 'ABOVE' && current >= signal.targetPrice) ||
                (signal.condition === 'BELOW' && current <= signal.targetPrice);
              
              if (isTriggered) {
                hasNewTrigger = true;
                triggerDetails = { ticker: signal.ticker, price: current };
                // Explicitly cast status to SignalStatus to satisfy TS
                return { ...signal, currentPrice: current, status: 'TRIGGERED' as SignalStatus };
              }
              
              return { ...signal, currentPrice: current };
            }
            return signal;
          });

          if (hasNewTrigger) {
            triggerAlert(triggerDetails.ticker, triggerDetails.price);
          }

          return updatedSignals;
        });
      } catch (e) {
        console.error("Signal Engine Error:", e);
      }
    };

    const interval = setInterval(checkSignals, 5000); 
    return () => clearInterval(interval);
  }, [isLoaded]);

  // --- ALERTS ---
  const triggerAlert = (ticker: string, price: number) => {
    // Audio safeguard
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }

    if (Notification.permission === "granted") {
      new Notification(`ALPHAFEED ALERT: ${ticker}`, {
        body: `${ticker} hit target! Current: ${price.toLocaleString()}`,
        icon: "/favicon.ico"
      });
    }

    setToast({ 
      title: "SIGNAL TRIGGERED", 
      msg: `${ticker} crossed target at $${price.toLocaleString()}` 
    });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAddSignal = () => {
    if (!ticker || !target) return;
    setLoading(true);
    setTimeout(() => {
        const newSignal: Signal = {
            id: Math.random().toString(36).substr(2, 9),
            ticker: ticker.toUpperCase(),
            condition,
            targetPrice: parseFloat(target),
            status: 'ACTIVE',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSignals(prev => [newSignal, ...prev]);
        setTicker("");
        setTarget("");
        setLoading(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));
  };

  if (!isLoaded) return null;

  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-transparent relative">
      <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#d2fc52]/10 rounded-xl border border-[#d2fc52]/20 shadow-[0_0_15px_rgba(210,252,82,0.1)]">
                <Bell size={32} className="text-[#d2fc52]" />
            </div>
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Alerts & Signals</h1>
                <div className="flex items-center gap-2 mt-2">
                    <Zap size={14} className="text-[#d2fc52] animate-pulse"/>
                    <p className="text-gray-400 text-sm font-mono uppercase tracking-wide">
                        Neural Engine refreshes every 5s • Real-time Watchdog Active
                    </p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: FORM */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d2fc52] to-transparent"></div>
                    
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Plus size={18} className="text-[#d2fc52]"/> Create Signal
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Asset Ticker</label>
                            <input 
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none transition-all uppercase placeholder:text-gray-700 focus:shadow-[0_0_10px_rgba(210,252,82,0.1)]"
                                placeholder="E.G. AAPL, BTC-USD"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Condition</label>
                                <select 
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value as SignalCondition)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white text-sm focus:border-[#d2fc52] outline-none appearance-none cursor-pointer"
                                >
                                    <option value="ABOVE">Price Above</option>
                                    <option value="BELOW">Price Below</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Target Price</label>
                                <input 
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="w-full bg-[#0d1016] border border-[#30363d] rounded-lg p-3 text-white font-mono text-sm focus:border-[#d2fc52] outline-none transition-all focus:shadow-[0_0_10px_rgba(210,252,82,0.1)]"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleAddSignal}
                            disabled={loading || !ticker || !target}
                            className="w-full bg-[#d2fc52] hover:bg-white text-black font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg hover:shadow-[0_0_20px_rgba(210,252,82,0.4)]"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18}/> : <Activity size={18} />}
                            {loading ? "Syncing..." : "Start Watcher"}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT: LIST */}
            <div className="lg:col-span-8">
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
                    <div className="p-4 border-b border-[#30363d] bg-[#0d1016]/50 flex justify-between items-center backdrop-blur-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Monitors</h3>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c2128] border border-[#30363d]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d2fc52] animate-pulse"></span>
                            <span className="text-[10px] font-mono font-bold text-[#d2fc52]">SCANNING LIVE</span>
                        </div>
                    </div>

                    <div className="divide-y divide-[#30363d] overflow-y-auto custom-scrollbar flex-1">
                        {signals.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3 min-h-[300px]">
                                <Bell size={32} className="opacity-20" />
                                <span className="text-xs uppercase tracking-widest">No active signals</span>
                            </div>
                        ) : (
                            signals.map((signal) => (
                                <div key={signal.id} className={`p-5 flex items-center justify-between transition-all duration-300 group ${signal.status === 'TRIGGERED' ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-[#2a303c]/30'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${signal.status === 'TRIGGERED' ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] scale-110' : 'bg-[#d2fc52]/10 border-[#d2fc52]/30 text-[#d2fc52]'}`}>
                                            {signal.status === 'TRIGGERED' ? <AlertTriangle size={18} /> : <Activity size={18} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-white text-lg tracking-tight">{signal.ticker}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">{signal.createdAt}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                <span>Target:</span>
                                                <span className="text-white font-mono font-bold">{signal.condition === 'ABOVE' ? '>' : '<'} ${signal.targetPrice.toLocaleString()}</span>
                                                {signal.currentPrice && (
                                                    <>
                                                        <ArrowRight size={10} />
                                                        <span className={signal.status === 'TRIGGERED' ? "text-red-400 font-bold" : "text-gray-300"}>
                                                            Curr: ${signal.currentPrice.toLocaleString()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm transition-all duration-300 ${signal.status === 'TRIGGERED' ? "bg-red-500 text-black animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "bg-[#1c2128] text-gray-400 border border-[#30363d]"}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${signal.status === 'TRIGGERED' ? "bg-black" : "bg-[#d2fc52] animate-pulse"}`}></div>
                                            {signal.status}
                                        </div>
                                        <button onClick={() => handleDelete(signal.id)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- TOAST NOTIFICATION --- */}
        {toast && (
            <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
                <div className="bg-[#161b22] border border-red-500/50 rounded-xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-start gap-4 max-w-sm backdrop-blur-md">
                    <div className="bg-red-500 p-2 rounded-lg text-black shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h4 className="text-red-500 font-black uppercase text-sm tracking-widest mb-1">{toast.title}</h4>
                        <p className="text-white text-sm font-medium">{toast.msg}</p>
                    </div>
                    <button onClick={() => setToast(null)} className="text-gray-500 hover:text-white">
                        <X size={14} />
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}