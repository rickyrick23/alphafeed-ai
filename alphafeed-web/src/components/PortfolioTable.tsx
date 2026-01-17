// src/components/PortfolioTable.tsx
"use client";
import { MoreHorizontal, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

export default function PortfolioTable() {
  return (
    <div className="w-full bg-[#13171f] border border-jup-border rounded-xl overflow-hidden shadow-xl">
      
      {/* HEADER */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-[#1c2128] border-b border-jup-border">
        <div className="col-span-3">Asset Name</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">Balance</div>
        <div className="col-span-2 text-right">Value</div>
        <div className="col-span-2 text-center">AI Risk Analysis</div>
        <div className="col-span-1"></div>
      </div>

      {/* ROWS */}
      <div className="divide-y divide-jup-border">
         <PortfolioRow 
            ticker="NVDA" name="Nvidia Corp" price="$142.50" change="+3.2%" 
            qty="150" value="$21,375.00" 
            risk="Safe" score={9.2} 
         />
         <PortfolioRow 
            ticker="SOL" name="Solana" price="$141.50" change="-4.1%" 
            qty="120.5" value="$17,050.75" 
            risk="Med" score={6.8} 
         />
         <PortfolioRow 
            ticker="TSLA" name="Tesla Inc" price="$245.00" change="-0.8%" 
            qty="45" value="$11,025.00" 
            risk="High" score={4.1} 
         />
         <PortfolioRow 
            ticker="AMD" name="Adv. Micro Dev" price="$160.00" change="+0.5%" 
            qty="30" value="$4,800.00" 
            risk="Safe" score={8.5} 
         />
         <PortfolioRow 
            ticker="JUP" name="Jupiter" price="$0.92" change="+1.2%" 
            qty="6700" value="$6,164.00" 
            risk="Safe" score={8.8} 
         />
      </div>
    </div>
  );
}

function PortfolioRow({ ticker, name, price, change, qty, value, risk, score }: any) {
    const isPositive = change.includes('+');
    
    // Logic for the Risk Badge color
    let badgeColor = "text-green-400 bg-green-400/10 border-green-400/20";
    let Icon = CheckCircle;
    
    if (risk === "Med") {
        badgeColor = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        Icon = AlertTriangle;
    } else if (risk === "High") {
        badgeColor = "text-red-400 bg-red-400/10 border-red-400/20";
        Icon = AlertTriangle;
    }

    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#1c2128] transition-colors group cursor-pointer">
            
            {/* 1. ASSET NAME */}
            <div className="col-span-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-black text-xs ${risk === 'High' ? 'bg-red-400' : 'bg-[#e0e0e0]'}`}>
                    {ticker[0]}
                </div>
                <div>
                    <div className="text-sm font-bold text-white group-hover:text-jup-lime transition-colors">{ticker}</div>
                    <div className="text-[10px] text-gray-500">{name}</div>
                </div>
            </div>

            {/* 2. PRICE */}
            <div className="col-span-2 text-right">
                <div className="text-sm font-mono text-gray-300">{price}</div>
                <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-jup-lime' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {change}
                </div>
            </div>

            {/* 3. BALANCE */}
            <div className="col-span-2 text-right">
                <div className="text-sm font-mono text-gray-300">{qty}</div>
                <div className="text-[10px] text-gray-500">{ticker}</div>
            </div>

            {/* 4. VALUE */}
            <div className="col-span-2 text-right">
                <div className="text-sm font-bold text-white">{value}</div>
            </div>

            {/* 5. AI RISK ANALYSIS */}
            <div className="col-span-2 flex flex-col items-center">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold ${badgeColor} mb-1.5`}>
                    <Icon size={10} /> {risk} Risk
                </div>
                {/* The Progress Bar */}
                <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${score > 8 ? 'bg-green-400' : score > 5 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${score * 10}%` }}></div>
                </div>
            </div>

            {/* 6. ACTION DOTS */}
            <div className="col-span-1 text-right">
                <button className="text-gray-500 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

        </div>
    )
}