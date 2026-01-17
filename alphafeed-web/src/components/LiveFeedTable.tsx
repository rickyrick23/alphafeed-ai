// src/components/LiveFeedTable.tsx
"use client";
import { Twitter, FileText, Globe, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

export default function LiveFeedTable() {
  return (
    <div className="w-full">
      
      {/* TABLE HEADER */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-jup-border">
        <div className="col-span-2">Source</div>
        <div className="col-span-6">Headline / Event</div>
        <div className="col-span-2 text-right">Impact Score</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* FEED ITEMS */}
      <div className="flex flex-col">
        <FeedItem 
           source="Bloomberg" 
           type="News" 
           time="2m ago" 
           headline="Nvidia (NVDA) announces surprise stock buyback program worth $10B." 
           impact="High"
           sentiment="Bullish" 
        />
        <FeedItem 
           source="Elon Musk" 
           type="Social" 
           time="5m ago" 
           headline="Thinking about accepting $DOGE for merch again..." 
           impact="Medium"
           sentiment="Volatile" 
        />
        <FeedItem 
           source="SEC Edgar" 
           type="Filing" 
           time="12m ago" 
           headline="Form 8-K Filing: MICROSTRATEGY INC. (Acquisition of Assets)" 
           impact="Critical"
           sentiment="Neutral" 
        />
        <FeedItem 
           source="Reuters" 
           type="News" 
           time="45m ago" 
           headline="Fed Chair Powell signals potential rate cut in December meeting." 
           impact="High"
           sentiment="Bullish" 
        />
         <FeedItem 
           source="Whale Alert" 
           type="On-Chain" 
           time="1h ago" 
           headline="10,000 BTC ($650M) transferred from Coinbase to Unknown Wallet." 
           impact="Medium"
           sentiment="Bearish" 
        />
      </div>
    </div>
  );
}

function FeedItem({ source, type, time, headline, impact, sentiment }: any) {
  // Dynamic Icons based on source type
  const getIcon = () => {
    if (type === 'Social') return <Twitter size={16} className="text-blue-400" />;
    if (type === 'Filing') return <FileText size={16} className="text-yellow-400" />;
    return <Globe size={16} className="text-jup-lime" />;
  };

  // Dynamic Colors based on Impact
  const getImpactColor = () => {
    if (impact === 'Critical') return 'text-red-400';
    if (impact === 'High') return 'text-jup-lime';
    return 'text-blue-400';
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-jup-border hover:bg-[#1c2128] transition-colors group cursor-pointer items-center">
      
      {/* COL 1: SOURCE */}
      <div className="col-span-2 flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-[#13171f] border border-jup-border flex items-center justify-center shadow-sm group-hover:border-gray-500 transition-colors">
            {getIcon()}
         </div>
         <div>
            <div className="text-sm font-bold text-white">{source}</div>
            <div className="text-[10px] text-gray-500">{time}</div>
         </div>
      </div>

      {/* COL 2: HEADLINE */}
      <div className="col-span-6 pr-4">
         <div className="text-sm font-medium text-gray-200 group-hover:text-white leading-relaxed">
            {headline}
         </div>
         <div className="flex gap-2 mt-1.5">
            <span className="text-[10px] bg-[#13171f] border border-jup-border px-1.5 rounded text-gray-400">{type}</span>
            <span className={`text-[10px] px-1.5 rounded border border-transparent bg-opacity-10 ${sentiment === 'Bullish' ? 'text-green-400 bg-green-400' : sentiment === 'Bearish' ? 'text-red-400 bg-red-400' : 'text-gray-400 bg-gray-400'}`}>
                {sentiment}
            </span>
         </div>
      </div>

      {/* COL 3: IMPACT SCORE */}
      <div className="col-span-2 text-right">
         <div className={`text-sm font-bold ${getImpactColor()} flex items-center justify-end gap-1`}>
            {impact === 'Critical' && <AlertTriangle size={12} />}
            {impact === 'High' && <TrendingUp size={12} />}
            {impact} Impact
         </div>
         <div className="text-[10px] text-gray-500">AI Confidence: 92%</div>
      </div>

      {/* COL 4: ACTION */}
      <div className="col-span-2 flex justify-end">
         <button className="w-8 h-8 rounded-full border border-jup-border flex items-center justify-center text-gray-400 group-hover:bg-jup-lime group-hover:text-black group-hover:border-jup-lime transition-all">
            <ArrowRight size={16} />
         </button>
      </div>

    </div>
  );
}