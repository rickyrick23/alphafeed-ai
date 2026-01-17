"use client";
import { useState } from 'react';
import { verifySourceText } from '@/lib/api'; // Ensure this function exists in api.ts!
import { ShieldCheck, AlertTriangle, CheckCircle, Search, AlertOctagon } from 'lucide-react';

export default function SourceVerifierPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleVerify() {
    if (!input) return;
    setLoading(true);
    const data = await verifySourceText(input);
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="text-jup-lime w-8 h-8" /> 
            Source Verifier Engine
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
            Our AI-powered engine analyzes news, social media rumors, and financial reports for credibility, bias, and manipulation. 
            Paste your text below to generate a Trust Score.
        </p>
      </div>

      {/* INPUT AREA */}
      <div className="bg-[#1c2128] border border-jup-border rounded-xl p-1 shadow-lg focus-within:ring-2 focus-within:ring-jup-lime/50 transition-all">
        <textarea 
            className="w-full bg-[#0d1016] border border-jup-border rounded-lg p-6 text-white placeholder-gray-600 focus:outline-none focus:bg-[#0f1218] transition-colors h-40 resize-none font-mono text-sm"
            placeholder="PASTE TEXT HERE (e.g., 'Company X guaranteed to explode 100x tomorrow! Insider info!')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end">
            <button 
                onClick={handleVerify}
                disabled={loading || !input}
                className="bg-jup-lime hover:bg-[#b8e866] text-black font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(199,242,132,0.2)] active:scale-95"
            >
                {loading ? "Running Analysis..." : "Verify Content"}
                {!loading && <Search size={18} />}
            </button>
      </div>

      {/* RESULTS AREA */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 mt-4">
            
            {/* 1. SCORE CARD */}
            <div className="md:col-span-1 bg-[#1c2128] border border-jup-border rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                    {/* Circle Background */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#333" strokeWidth="10" fill="transparent" />
                        <circle cx="80" cy="80" r="70" stroke={result.trust_score > 75 ? '#C7F284' : result.trust_score > 50 ? '#FACC15' : '#EF4444'} strokeWidth="10" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * result.trust_score) / 100} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className={`absolute text-5xl font-black ${result.trust_score > 75 ? 'text-jup-lime' : result.trust_score > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                        {result.trust_score}
                    </div>
                </div>
                
                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Trust Score</h3>
                <div className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold border ${
                    result.trust_score > 75 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : result.trust_score > 50 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                    {result.verdict}
                </div>
            </div>

            {/* 2. ANALYSIS DETAILS */}
            <div className="md:col-span-2 bg-[#1c2128] border border-jup-border rounded-xl p-6 space-y-6">
                
                {/* Sentiment */}
                <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                    <div className="flex items-center gap-2">
                         <span className="w-2 h-6 bg-blue-500 rounded-full"/>
                         <span className="text-gray-300 font-bold">Market Sentiment</span>
                    </div>
                    <span className="text-white font-mono bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">
                        {result.sentiment}
                    </span>
                </div>

                {/* Flags */}
                <div>
                    <span className="text-gray-400 text-sm block mb-3 font-bold uppercase">Risk Detection</span>
                    {result.flags.length === 0 ? (
                        <div className="flex items-center gap-3 text-green-400 text-sm bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                            <CheckCircle size={18} /> No content manipulation flags detected.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {result.flags.map((flag: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-red-400 text-sm bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                    <AlertTriangle size={18} className="shrink-0" /> {flag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cross-Check */}
                <div>
                    <span className="text-gray-400 text-sm block mb-3 font-bold uppercase">Source Database Cross-Check</span>
                    <div className="text-xs text-gray-500 space-y-2 font-mono bg-[#0d1016] p-4 rounded-lg border border-gray-800">
                        {result.sources.map((source: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <AlertOctagon size={12} className="text-gray-600" /> {source}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
}