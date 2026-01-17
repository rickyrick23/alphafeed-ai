// src/components/MarketWidgets.tsx
"use client";
import { Flame, TrendingUp, Zap, ChevronRight, MessageCircle } from 'lucide-react';

export default function MarketWidgets() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
      
      <WidgetCard title="Market Heat" icon={<Flame size={14} className="text-orange-500" />}>
        <WidgetItem rank="#1" symbol="NVDA" label="Nvidia" change="+3.2%" volume="$52B" />
        <WidgetItem rank="#2" symbol="TSLA" label="Tesla" change="+1.8%" volume="$12B" />
        <WidgetItem rank="#3" symbol="AMD" label="Adv. Micro" change="-0.5%" volume="$8B" isNegative />
      </WidgetCard>

      <WidgetCard title="Top Movers" icon={<TrendingUp size={14} className="text-green-400" />}>
        <WidgetItem rank="🚀" symbol="SMCI" label="Super Micro" change="+18.5%" volume="$2.1B" />
        <WidgetItem rank="🚀" symbol="MSTR" label="MicroStrat" change="+12.2%" volume="$4.5B" />
      </WidgetCard>

      <WidgetCard title="Sector Flow" icon={<Zap size={14} className="text-yellow-400" />}>
        <div className="space-y-3 pt-1">
            <YieldItem label="Technology" value="+1.2%" sub="Bullish" />
            <YieldItem label="Energy" value="-0.8%" sub="Correction" isNegative />
        </div>
      </WidgetCard>

      {/* NEW WIDGET: Social Sentiment */}
      <WidgetCard title="Social Sentiment" icon={<MessageCircle size={14} className="text-blue-400" />}>
        <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">X Mention Vol.</span>
                <span className="text-jup-lime">+42.8%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-jup-lime h-full w-[75%]" />
            </div>
            <p className="text-[10px] text-gray-500 italic leading-relaxed">
              "Significant retail chatter detected regarding semiconductor earnings; sentiment remains highly bullish."
            </p>
        </div>
      </WidgetCard>

    </div>
  );
}

/* UI Helpers */
function WidgetCard({ title, icon, children }: any) {
  return (
    <div className="bg-[#13171f] border border-jup-border rounded-xl p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4 text-sm font-bold text-white uppercase tracking-wider">
        <div className="flex items-center gap-2">{icon} {title}</div>
        <button className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1">MORE <ChevronRight size={10} /></button>
      </div>
      <div>{children}</div>
    </div>
  );
}

function WidgetItem({ rank, symbol, label, change, volume, isNegative }: any) {
  return (
    <div className="flex items-center justify-between py-2 hover:bg-[#1c2128] rounded-lg px-2 -mx-2 group cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-gray-500 w-4">{rank}</span>
        <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-jup-lime">{symbol}</span>
            <span className="text-[10px] text-gray-500">{label}</span>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold ${isNegative ? 'text-red-400' : 'text-jup-lime'}`}>{change}</div>
        <div className="text-[10px] text-gray-500">Vol {volume}</div>
      </div>
    </div>
  );
}

function YieldItem({ label, value, sub, isNegative }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isNegative ? 'bg-red-400' : 'bg-jup-lime'}`} />
                <span className="text-xs text-gray-300">{label}</span>
            </div>
            <div className="text-right">
                <span className={`text-xs font-bold ${isNegative ? 'text-red-400' : 'text-jup-lime'} block`}>{value}</span>
                <span className="text-[10px] text-gray-500">{sub}</span>
            </div>
        </div>
    );
}