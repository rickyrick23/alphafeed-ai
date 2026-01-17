// src/app/login/page.tsx
import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, Terminal } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0d1016] relative overflow-hidden">
      
      {/* 1. BACKGROUND EFFECTS */}
      {/* Stardust Texture */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      {/* Green Glow Blob */}
      <div className="absolute w-[800px] h-[800px] bg-jup-lime/5 rounded-full blur-[120px] -top-40 -left-40 pointer-events-none" />

      {/* 2. THE MAIN LOGIN CARD */}
      <div className="z-10 w-full max-w-md bg-[#13171f]/80 backdrop-blur-xl border border-jup-border p-8 rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-jup-lime rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(199,242,132,0.4)]">
                <span className="text-3xl font-black text-black">A</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">AlphaFeed</h1>
            <p className="text-gray-500 text-sm font-mono">Secure Neural Finance Terminal</p>
        </div>

        {/* Input Form */}
        <div className="space-y-5">
            
            {/* Field 1: Access ID */}
            <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Access ID</label>
                <div className="flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-3 mt-1 focus-within:border-jup-lime transition-colors group">
                    <ShieldCheck size={18} className="text-gray-500 group-focus-within:text-jup-lime mr-3 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="user@alphafeed.ai" 
                      className="bg-transparent text-white w-full outline-none text-sm font-bold placeholder-gray-700" 
                    />
                </div>
            </div>
            
            {/* Field 2: Security Key */}
            <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Security Key</label>
                <div className="flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-3 mt-1 focus-within:border-jup-lime transition-colors group">
                    <Lock size={18} className="text-gray-500 group-focus-within:text-jup-lime mr-3 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-transparent text-white w-full outline-none text-sm font-bold placeholder-gray-700" 
                    />
                </div>
            </div>

            {/* Action Button */}
            {/* UPDATED: Links directly to /portfolio */}
            <Link href="/portfolio" className="block w-full pt-2">
                <button className="w-full bg-jup-lime hover:bg-[#b8e866] text-black font-extrabold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(199,242,132,0.2)] active:scale-[0.98]">
                    INITIALIZE SESSION <ArrowRight size={20} />
                </button>
            </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center flex justify-center gap-6 border-t border-jup-border pt-6">
            <span className="text-[10px] text-gray-600 flex items-center gap-1 cursor-pointer hover:text-jup-lime transition-colors">
                <Terminal size={10} /> System Status: Online
            </span>
            <span className="text-[10px] text-gray-600 cursor-pointer hover:text-white underline transition-colors">
                Forgot Credentials?
            </span>
        </div>

      </div>
    </div>
  );
}