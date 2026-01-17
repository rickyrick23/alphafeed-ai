// src/components/AddAssetModal.tsx
"use client";
import { X, Search, PlusCircle, DollarSign, Hash } from 'lucide-react';

export default function AddAssetModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Content */}
      <div className="bg-[#1c2128] border border-jup-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#13171f] p-4 border-b border-jup-border flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Asset</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
            </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
            
            {/* 1. Ticker Search */}
            <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Asset Ticker Symbol</label>
                <div className="flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-3 mt-1 focus-within:border-jup-lime transition-colors">
                    <Search size={16} className="text-jup-lime mr-3" />
                    <input type="text" placeholder="e.g. NVDA, BTC, AAPL" className="bg-transparent text-white w-full outline-none font-bold uppercase placeholder-gray-700" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* 2. Quantity */}
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Quantity Held</label>
                    <div className="flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-3 mt-1 focus-within:border-jup-lime transition-colors">
                        <Hash size={16} className="text-gray-500 mr-2" />
                        <input type="number" placeholder="0.00" className="bg-transparent text-white w-full outline-none font-bold placeholder-gray-700" />
                    </div>
                </div>
                {/* 3. Buy Price */}
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Avg. Buy Price</label>
                    <div className="flex items-center bg-[#0d1016] border border-jup-border rounded-xl px-4 py-3 mt-1 focus-within:border-jup-lime transition-colors">
                        <DollarSign size={16} className="text-gray-500 mr-1" />
                        <input type="number" placeholder="0.00" className="bg-transparent text-white w-full outline-none font-bold placeholder-gray-700" />
                    </div>
                </div>
            </div>

            {/* AI Info Note */}
            <div className="bg-jup-lime/5 border border-jup-lime/20 p-3 rounded-lg flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-jup-lime mt-1.5 shrink-0 animate-pulse" />
                <p className="text-[10px] text-gray-400 leading-relaxed">
                    <span className="text-jup-lime font-bold">AI Analysis:</span> Upon adding, AlphaFeed will instantly calculate the Risk Score and scan news for this asset.
                </p>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-jup-border bg-[#13171f] flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                Cancel
            </button>
            <button className="bg-jup-lime hover:bg-[#b8e866] text-black px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                <PlusCircle size={14} /> Add to Portfolio
            </button>
        </div>

      </div>
    </div>
  );
}