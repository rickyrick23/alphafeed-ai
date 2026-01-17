"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSystemStatus, fetchMacroView } from '@/lib/api';
import { 
  Globe, ShieldCheck, Calendar, Bell, Briefcase, Filter, FileText, 
  Activity, Settings, HelpCircle, TrendingUp, TrendingDown, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [status, setStatus] = useState("Checking...");
  const [latency, setLatency] = useState("");
  const [macroData, setMacroData] = useState<any[]>([]);
  const [currentMacroIndex, setCurrentMacroIndex] = useState(0); 
  const [isMacroHovered, setIsMacroHovered] = useState(false);

  useEffect(() => {
    async function initSidebar() {
      const statusData = await fetchSystemStatus();
      setStatus(statusData.status || "Offline");
      setLatency(statusData.latency || "---");
      const macro = await fetchMacroView();
      setMacroData(macro);
    }
    initSidebar();
  }, []);

  useEffect(() => {
    if (macroData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMacroIndex((prev) => (prev + 1) % macroData.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [macroData]);

  const menuItems = [
    { icon: Globe, label: "Macro View", id: "macro", path: "/" },
    { icon: ShieldCheck, label: "Source Verifier", id: "verifier", path: "/verifier" },
    { icon: Calendar, label: "Earnings Cal.", id: "calendar", path: "/calendar" },
    { icon: Bell, label: "Alerts & Signals", id: "alerts", path: "/alerts" },
    { icon: Briefcase, label: "My Portfolio", id: "portfolio", path: "/portfolio" },
    { icon: Filter, label: "Deep Screener", id: "screener", path: "/screener" },
    { icon: FileText, label: "Saved Reports", id: "reports", path: "/reports" },
  ];

  return (
    // FIX 1: ADDED 'overflow-hidden' to force clipping
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-full bg-[#0d1016] border-r border-jup-border flex flex-col justify-between transition-all duration-300 relative shrink-0 z-50 overflow-hidden`}>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-[#1c2128] border border-jup-border rounded-full p-1 text-gray-400 hover:text-white hover:border-jup-lime transition-colors z-[100] shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-3 space-y-2 mt-2">
        {menuItems.map((item, idx) => {
            let displayLabel = item.label;
            let displayPrice = null;
            let isPositive = false;

            if (item.id === "macro" && macroData.length > 0 && !isCollapsed) {
                const currentItem = macroData[currentMacroIndex];
                displayLabel = currentItem.name; 
                displayPrice = currentItem.price.toLocaleString(); 
                isPositive = currentItem.change >= 0;
            }

            return (
              <div 
                key={idx}
                className="relative group hover:z-[100]" 
                onMouseEnter={() => item.id === "macro" && setIsMacroHovered(true)}
                onMouseLeave={() => item.id === "macro" && setIsMacroHovered(false)}
              >
                <Link href={item.path}>
                    <button className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all hover:bg-[#1c2128] hover:text-white text-gray-400`}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <item.icon size={20} className={`shrink-0 ${item.id === 'verifier' ? 'text-jup-lime' : ''}`} />
                        
                        {!isCollapsed && (
                            <div className="flex flex-col items-start leading-none transition-opacity duration-200">
                                <span className="text-sm font-medium whitespace-nowrap">{displayLabel}</span>
                                {displayPrice && (
                                    <span className={`text-[10px] font-mono mt-1 ${isPositive ? 'text-jup-lime' : 'text-red-400'} flex items-center gap-1`}>
                                        {isPositive ? <TrendingUp size={8}/> : <TrendingDown size={8}/>}
                                        {displayPrice}
                                    </span>
                                )}
                            </div>
                        )}
                      </div>
                      
                      {!isCollapsed && item.id === "macro" && (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"/>
                      )}
                    </button>
                </Link>
                
                {/* POPUP LOGIC */}
                {((isCollapsed) || (item.id === "macro" && isMacroHovered && macroData.length > 0)) && (
                  <div className="absolute left-full top-0 ml-4 w-max bg-[#1c2128] border border-jup-border p-3 rounded-xl shadow-2xl z-[200] animate-in fade-in slide-in-from-left-2 duration-200">
                    {item.id === "macro" && macroData.length > 0 ? (
                        <div className="space-y-2 w-48">
                            <h4 className="text-xs font-bold text-gray-400 uppercase border-b border-gray-700 pb-1 mb-1">Global Indices</h4>
                            {macroData.map((m) => (
                                <div key={m.name} className="flex justify-between text-xs items-center">
                                    <span className="text-gray-300">{m.name}</span>
                                    <span className={`font-mono ${m.change >= 0 ? "text-jup-lime" : "text-red-400"}`}>
                                        {m.price.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-white whitespace-nowrap">{item.label}</span>
                    )}
                  </div>
                )}
              </div>
            );
        })}
      </div>

      <div className="p-4 border-t border-jup-border bg-[#0d1016]">
        {!isCollapsed ? (
             <div className="flex items-center gap-3 px-2 py-2 text-xs font-medium text-gray-400">
                <Activity size={16} className={status === "Online" ? "text-jup-lime" : "text-red-500"} />
                <span>{status} {latency && `(${latency})`}</span>
            </div>
        ) : (
            <div className="flex justify-center py-2">
                 <Activity size={16} className={status === "Online" ? "text-jup-lime" : "text-red-500"} />
            </div>
        )}
      </div>
    </div>
  );
}