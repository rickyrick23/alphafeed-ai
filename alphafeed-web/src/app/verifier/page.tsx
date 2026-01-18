"use client";
import { useState } from 'react';
import { verifySourceContent } from '@/lib/api'; // IMPORT THE NEW FUNCTION
import { ShieldCheck, Search, Loader2, AlertTriangle, CheckCircle, FileText, XCircle } from 'lucide-react';

export default function VerifierPage() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null); // Clear previous
    
    try {
        // CALL THE REAL BACKEND SIMULATION
        const data = await verifySourceContent(inputText);
        setResult(data);
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  // Helper to color-code the score
  const getScoreColor = (score: number) => {
      if (score >= 80) return "text-[#d2fc52]"; // Green
      if (score >= 50) return "text-yellow-500"; // Yellow
      return "text-red-500"; // Red
  };

  const getScoreLabel = (score: number) => {
      if (score >= 80) return "Reliable Source";
      if (score >= 50) return "Unverified / Mixed";
      return "High Risk / Rumor";
  };

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-transparent">
      <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#d2fc52]" size={32}/>
                <h1 className="text-4xl font-bold text-white tracking-tight">Source Verifier Engine</h1>
            </div>
            <p className="text-gray-400 text-lg">
                Our AI-powered engine analyzes news, social media rumors, and financial reports for credibility, bias, and manipulation.
            </p>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-4">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d2fc52] to-blue-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="relative w-full h-48 bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-white text-sm font-mono outline-none focus:border-[#d2fc52] transition-colors resize-none placeholder:text-gray-600 shadow-inner"
                  placeholder="PASTE TEXT HERE (e.g., 'Insider says Bitcoin to 100k tomorrow guaranteed...')"
                />
            </div>
            
            <div className="flex justify-end">
                <button 
                    onClick={handleVerify}
                    disabled={loading || !inputText.trim()}
                    className="bg-[#d2fc52] hover:bg-white text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(210,252,82,0.3)] active:scale-95"
                >
                    {loading ? "Analyzing Neural Patterns..." : "Verify Content"}
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </button>
            </div>
        </div>

        {/* RESULTS SECTION (Dynamic) */}
        {result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in zoom-in-95 duration-500">
            
            {/* LEFT: CIRCULAR TRUST GAUGE */}
            <div className="md:col-span-4 bg-[#161b22] border border-[#30363d] rounded-xl p-8 flex flex-col items-center justify-center relative shadow-2xl">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Circular Gauge */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="#2a303c" strokeWidth="12" fill="transparent" />
                        <circle 
                            cx="96" cy="96" r="88" 
                            stroke={result.score >= 80 ? "#d2fc52" : result.score >= 50 ? "#eab308" : "#ef4444"} 
                            strokeWidth="12" 
                            fill="transparent" 
                            strokeDasharray="552" 
                            strokeDashoffset={552 - (552 * result.score) / 100} 
                            strokeLinecap="round" 
                            className="transition-all duration-1000 ease-out" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-6xl font-black ${getScoreColor(result.score)} drop-shadow-lg`}>{result.score}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">TRUST SCORE</span>
                    </div>
                </div>
                <div className={`mt-6 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${
                    result.score >= 80 ? "bg-[#d2fc52]/10 text-[#d2fc52]" : result.score >= 50 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                }`}>
                    {getScoreLabel(result.score)}
                </div>
            </div>

            {/* RIGHT: ANALYSIS DETAILS */}
            <div className="md:col-span-8 space-y-4">
                
                {/* 1. Market Sentiment / Risk Panel */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-1 h-5 rounded-full ${result.score >= 50 ? 'bg-[#d2fc52]' : 'bg-red-500'}`}></div>
                        <h3 className="font-bold text-gray-200">Analysis Report</h3>
                    </div>

                    <div className="bg-[#0d1016] border border-[#30363d] rounded-lg p-4 flex gap-4 items-start">
                         <div className={`${result.score < 50 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'} p-2 rounded-lg shrink-0`}>
                            {result.score < 50 ? <AlertTriangle size={24} /> : <FileText size={24} />}
                         </div>
                         <div>
                            <div className={`text-xs font-bold uppercase mb-1 ${result.score < 50 ? 'text-red-500' : 'text-blue-400'}`}>
                                RISK LEVEL: {result.riskLevel}
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {result.riskMessage}
                            </p>
                         </div>
                    </div>
                </div>

                {/* 2. Source Database Cross-Check */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-xl">
                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">SOURCE DATABASE CROSS-CHECK</h3>
                     <div className="space-y-3">
                        {result.sources.map((source: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0d1016] border border-[#30363d] group hover:border-gray-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    {source.active ? <CheckCircle size={16} className="text-[#d2fc52]"/> : <XCircle size={16} className="text-red-500"/>}
                                    <span className="text-sm font-bold text-gray-300">{source.name}</span>
                                </div>
                                <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded ${source.active ? "bg-[#d2fc52]/10 text-[#d2fc52]" : "bg-red-500/10 text-red-500"}`}>
                                    {source.status}
                                </span>
                            </div>
                        ))}
                     </div>
                </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}