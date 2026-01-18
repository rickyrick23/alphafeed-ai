"use client";
import { useState } from 'react';
import { Calendar, Moon, Sun, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';

// --- MASSIVE MOCK DATA (100+ Entries) ---
const EARNINGS_DATA = [
  // --- WEEK 1: JAN 19 - JAN 23 ---
  { id: 1, ticker: "RELIANCE", name: "Reliance Industries", date: "2026-01-19", time: "After Market", eps: "₹45.20", rev: "₹2.1T", sentiment: "Bullish", status: "Confirmed" },
  { id: 2, ticker: "HDFCBANK", name: "HDFC Bank Ltd", date: "2026-01-19", time: "Pre Market", eps: "₹22.50", rev: "₹450B", sentiment: "Bullish", status: "Confirmed" },
  { id: 3, ticker: "JPM", name: "JPMorgan Chase", date: "2026-01-19", time: "Pre Market", eps: "$4.10", rev: "$38B", sentiment: "Neutral", status: "Confirmed" },
  { id: 4, ticker: "TCS", name: "Tata Consultancy Svcs", date: "2026-01-20", time: "Pre Market", eps: "₹32.10", rev: "₹610B", sentiment: "Neutral", status: "Confirmed" },
  { id: 5, ticker: "NFLX", name: "Netflix Inc.", date: "2026-01-20", time: "After Market", eps: "$2.10", rev: "$9.2B", sentiment: "Bullish", status: "Confirmed" },
  { id: 6, ticker: "GS", name: "Goldman Sachs", date: "2026-01-20", time: "Pre Market", eps: "$8.50", rev: "$14B", sentiment: "Bearish", status: "Confirmed" },
  { id: 7, ticker: "ULTRACEMCO", name: "UltraTech Cement", date: "2026-01-20", time: "After Market", eps: "₹65.00", rev: "₹180B", sentiment: "Bullish", status: "Estimated" },
  { id: 8, ticker: "TSLA", name: "Tesla, Inc.", date: "2026-01-21", time: "After Market", eps: "$0.85", rev: "$25.4B", sentiment: "Bearish", status: "Confirmed" },
  { id: 9, ticker: "INFY", name: "Infosys Limited", date: "2026-01-21", time: "Pre Market", eps: "₹18.40", rev: "₹390B", sentiment: "Neutral", status: "Estimated" },
  { id: 10, ticker: "IBM", name: "Intl Business Machines", date: "2026-01-21", time: "After Market", eps: "$3.80", rev: "$17.5B", sentiment: "Neutral", status: "Confirmed" },
  { id: 11, ticker: "ASIANPAINT", name: "Asian Paints Ltd", date: "2026-01-22", time: "Pre Market", eps: "₹14.20", rev: "₹92B", sentiment: "Bearish", status: "Estimated" },
  { id: 12, ticker: "INTC", name: "Intel Corporation", date: "2026-01-22", time: "After Market", eps: "$0.12", rev: "$13.2B", sentiment: "Bearish", status: "Confirmed" },
  { id: 13, ticker: "AXISBANK", name: "Axis Bank Ltd", date: "2026-01-23", time: "Pre Market", eps: "₹38.50", rev: "₹280B", sentiment: "Bullish", status: "Estimated" },
  { id: 14, ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", date: "2026-01-23", time: "After Market", eps: "₹18.20", rev: "₹140B", sentiment: "Neutral", status: "Confirmed" },
  { id: 15, ticker: "SLB", name: "Schlumberger NV", date: "2026-01-23", time: "Pre Market", eps: "$0.75", rev: "$8.1B", sentiment: "Bullish", status: "Estimated" },

  // --- WEEK 2: JAN 26 - JAN 30 ---
  { id: 16, ticker: "AAPL", name: "Apple Inc.", date: "2026-01-27", time: "After Market", eps: "$1.40", rev: "$85B", sentiment: "Bullish", status: "Estimated" },
  { id: 17, ticker: "MSFT", name: "Microsoft Corp", date: "2026-01-27", time: "After Market", eps: "$2.90", rev: "$60B", sentiment: "Bullish", status: "Estimated" },
  { id: 18, ticker: "AMD", name: "Adv Micro Devices", date: "2026-01-27", time: "After Market", eps: "$0.65", rev: "$6.1B", sentiment: "Bullish", status: "Estimated" },
  { id: 19, ticker: "BAJFINANCE", name: "Bajaj Finance", date: "2026-01-27", time: "Pre Market", eps: "₹150.0", rev: "₹88B", sentiment: "Bullish", status: "Confirmed" },
  { id: 20, ticker: "TATAMOTORS", name: "Tata Motors Ltd", date: "2026-01-28", time: "Pre Market", eps: "₹12.80", rev: "₹950B", sentiment: "Neutral", status: "Confirmed" },
  { id: 21, ticker: "META", name: "Meta Platforms", date: "2026-01-28", time: "After Market", eps: "$4.10", rev: "$38B", sentiment: "Bullish", status: "Estimated" },
  { id: 22, ticker: "BA", name: "Boeing Company", date: "2026-01-28", time: "Pre Market", eps: "-$1.20", rev: "$18B", sentiment: "Bearish", status: "Confirmed" },
  { id: 23, ticker: "GOOGL", name: "Alphabet Inc.", date: "2026-01-29", time: "After Market", eps: "$1.60", rev: "$72B", sentiment: "Neutral", status: "Estimated" },
  { id: 24, ticker: "AMZN", name: "Amazon.com Inc.", date: "2026-01-29", time: "After Market", eps: "$0.95", rev: "$140B", sentiment: "Bullish", status: "Estimated" },
  { id: 25, ticker: "ITC", name: "ITC Limited", date: "2026-01-29", time: "Pre Market", eps: "₹4.20", rev: "₹180B", sentiment: "Neutral", status: "Confirmed" },
  { id: 26, ticker: "MA", name: "Mastercard Inc", date: "2026-01-29", time: "Pre Market", eps: "$3.10", rev: "$6.5B", sentiment: "Bullish", status: "Confirmed" },
  { id: 27, ticker: "XOM", name: "Exxon Mobil Corp", date: "2026-01-30", time: "Pre Market", eps: "$2.10", rev: "$80B", sentiment: "Bearish", status: "Estimated" },
  { id: 28, ticker: "CVX", name: "Chevron Corp", date: "2026-01-30", time: "Pre Market", eps: "$3.05", rev: "$48B", sentiment: "Neutral", status: "Estimated" },
  { id: 29, ticker: "LT", name: "Larsen & Toubro", date: "2026-01-30", time: "After Market", eps: "₹28.40", rev: "₹520B", sentiment: "Bullish", status: "Confirmed" },
  { id: 30, ticker: "CAT", name: "Caterpillar Inc", date: "2026-01-30", time: "Pre Market", eps: "$4.80", rev: "$16B", sentiment: "Neutral", status: "Confirmed" },

  // --- WEEK 3: FEB 02 - FEB 06 ---
  { id: 31, ticker: "SBIN", name: "State Bank of India", date: "2026-02-02", time: "Pre Market", eps: "₹19.50", rev: "₹1.1T", sentiment: "Neutral", status: "Estimated" },
  { id: 32, ticker: "PYPL", name: "PayPal Holdings", date: "2026-02-02", time: "After Market", eps: "$1.20", rev: "$7.4B", sentiment: "Bearish", status: "Estimated" },
  { id: 33, ticker: "PFE", name: "Pfizer Inc", date: "2026-02-02", time: "Pre Market", eps: "$0.55", rev: "$12B", sentiment: "Neutral", status: "Confirmed" },
  { id: 34, ticker: "UPS", name: "United Parcel Service", date: "2026-02-03", time: "Pre Market", eps: "$2.40", rev: "$22B", sentiment: "Bearish", status: "Confirmed" },
  { id: 35, ticker: "SBUX", name: "Starbucks Corp", date: "2026-02-03", time: "After Market", eps: "$0.80", rev: "$9.1B", sentiment: "Neutral", status: "Estimated" },
  { id: 36, ticker: "SUNPHARMA", name: "Sun Pharma", date: "2026-02-04", time: "Pre Market", eps: "₹32.00", rev: "₹120B", sentiment: "Bullish", status: "Confirmed" },
  { id: 37, ticker: "QCOM", name: "Qualcomm Inc", date: "2026-02-04", time: "After Market", eps: "$2.30", rev: "$9.8B", sentiment: "Neutral", status: "Estimated" },
  { id: 38, ticker: "DIS", name: "Walt Disney Co", date: "2026-02-05", time: "After Market", eps: "$1.10", rev: "$22B", sentiment: "Bullish", status: "Estimated" },
  { id: 39, ticker: "MARUTI", name: "Maruti Suzuki", date: "2026-02-05", time: "Pre Market", eps: "₹310.0", rev: "₹340B", sentiment: "Neutral", status: "Estimated" },
  { id: 40, ticker: "UBER", name: "Uber Technologies", date: "2026-02-06", time: "Pre Market", eps: "$0.30", rev: "$10B", sentiment: "Bullish", status: "Estimated" },
  { id: 41, ticker: "FORD", name: "Ford Motor Co", date: "2026-02-06", time: "After Market", eps: "$0.40", rev: "$42B", sentiment: "Neutral", status: "Confirmed" },
  { id: 42, ticker: "GM", name: "General Motors", date: "2026-02-06", time: "Pre Market", eps: "$1.90", rev: "$40B", sentiment: "Bullish", status: "Confirmed" },
  { id: 43, ticker: "SPOT", name: "Spotify Tech", date: "2026-02-06", time: "Pre Market", eps: "€0.80", rev: "€3.8B", sentiment: "Bullish", status: "Estimated" },
  { id: 44, ticker: "SNAP", name: "Snap Inc.", date: "2026-02-06", time: "After Market", eps: "$0.05", rev: "$1.2B", sentiment: "Bearish", status: "Confirmed" },
  { id: 45, ticker: "PINS", name: "Pinterest Inc", date: "2026-02-06", time: "After Market", eps: "$0.15", rev: "$800M", sentiment: "Neutral", status: "Estimated" },

  // --- WEEK 4: FEB 09 - FEB 13 ---
  { id: 46, ticker: "WIPRO", name: "Wipro Limited", date: "2026-02-10", time: "After Market", eps: "₹5.60", rev: "₹220B", sentiment: "Bearish", status: "Estimated" },
  { id: 47, ticker: "KO", name: "Coca-Cola Co", date: "2026-02-10", time: "Pre Market", eps: "$0.45", rev: "$10.5B", sentiment: "Neutral", status: "Neutral" },
  { id: 48, ticker: "PEP", name: "PepsiCo Inc", date: "2026-02-10", time: "Pre Market", eps: "$1.60", rev: "$28B", sentiment: "Neutral", status: "Neutral" },
  { id: 49, ticker: "CSCO", name: "Cisco Systems", date: "2026-02-11", time: "After Market", eps: "$0.85", rev: "$12B", sentiment: "Bearish", status: "Estimated" },
  { id: 50, ticker: "SHOP", name: "Shopify Inc", date: "2026-02-11", time: "After Market", eps: "$0.20", rev: "$1.8B", sentiment: "Bullish", status: "Confirmed" },
  { id: 51, ticker: "ABNB", name: "Airbnb Inc", date: "2026-02-12", time: "After Market", eps: "$0.70", rev: "$2.5B", sentiment: "Neutral", status: "Estimated" },
  { id: 52, ticker: "DASH", name: "DoorDash Inc", date: "2026-02-12", time: "After Market", eps: "$0.05", rev: "$2.3B", sentiment: "Bullish", status: "Confirmed" },
  { id: 53, ticker: "COIN", name: "Coinbase Global", date: "2026-02-13", time: "After Market", eps: "$1.10", rev: "$1.2B", sentiment: "Bullish", status: "Estimated" },
  { id: 54, ticker: "DKNG", name: "DraftKings Inc", date: "2026-02-13", time: "Pre Market", eps: "-$0.10", rev: "$950M", sentiment: "Bullish", status: "Estimated" },
  { id: 55, ticker: "ROKU", name: "Roku Inc", date: "2026-02-13", time: "After Market", eps: "-$0.40", rev: "$890M", sentiment: "Bearish", status: "Confirmed" },
  { id: 56, ticker: "TTD", name: "The Trade Desk", date: "2026-02-13", time: "After Market", eps: "$0.35", rev: "$550M", sentiment: "Bullish", status: "Confirmed" },
  { id: 57, ticker: "TWLO", name: "Twilio Inc", date: "2026-02-13", time: "After Market", eps: "$0.25", rev: "$1.1B", sentiment: "Neutral", status: "Estimated" },
  { id: 58, ticker: "PLTR", name: "Palantir Tech", date: "2026-02-13", time: "After Market", eps: "$0.08", rev: "$650M", sentiment: "Bullish", status: "Confirmed" },
  { id: 59, ticker: "U", name: "Unity Software", date: "2026-02-13", time: "After Market", eps: "-$0.20", rev: "$480M", sentiment: "Bearish", status: "Estimated" },
  { id: 60, ticker: "RBLX", name: "Roblox Corp", date: "2026-02-13", time: "Pre Market", eps: "-$0.45", rev: "$750M", sentiment: "Neutral", status: "Confirmed" },

  // --- LATE FEB / MARCH ESTIMATES ---
  { id: 61, ticker: "NVDA", name: "NVIDIA Corp", date: "2026-02-21", time: "After Market", eps: "$5.20", rev: "$28B", sentiment: "Bullish", status: "Estimated" },
  { id: 62, ticker: "CRM", name: "Salesforce Inc", date: "2026-02-25", time: "After Market", eps: "$2.10", rev: "$9.4B", sentiment: "Neutral", status: "Estimated" },
  { id: 63, ticker: "SNOW", name: "Snowflake Inc", date: "2026-02-26", time: "After Market", eps: "$0.18", rev: "$850M", sentiment: "Bullish", status: "Confirmed" },
  { id: 64, ticker: "ZS", name: "Zscaler Inc", date: "2026-02-27", time: "After Market", eps: "$0.45", rev: "$520M", sentiment: "Bullish", status: "Estimated" },
  { id: 65, ticker: "CRWD", name: "CrowdStrike", date: "2026-03-02", time: "After Market", eps: "$0.85", rev: "$980M", sentiment: "Bullish", status: "Confirmed" },
  { id: 66, ticker: "PANW", name: "Palo Alto Net", date: "2026-03-03", time: "After Market", eps: "$1.20", rev: "$2.1B", sentiment: "Neutral", status: "Estimated" },
  { id: 67, ticker: "AVGO", name: "Broadcom Inc", date: "2026-03-05", time: "After Market", eps: "$10.50", rev: "$12B", sentiment: "Bullish", status: "Estimated" },
  { id: 68, ticker: "ADBE", name: "Adobe Inc", date: "2026-03-12", time: "After Market", eps: "$4.10", rev: "$5.2B", sentiment: "Neutral", status: "Estimated" },
  { id: 69, ticker: "ORCL", name: "Oracle Corp", date: "2026-03-14", time: "After Market", eps: "$1.30", rev: "$13B", sentiment: "Bullish", status: "Estimated" },
  { id: 70, ticker: "NKE", name: "Nike Inc", date: "2026-03-18", time: "After Market", eps: "$0.65", rev: "$12B", sentiment: "Bearish", status: "Estimated" },
  { id: 71, ticker: "FDX", name: "FedEx Corp", date: "2026-03-20", time: "After Market", eps: "$3.50", rev: "$22B", sentiment: "Neutral", status: "Estimated" },
  { id: 72, ticker: "LULU", name: "Lululemon", date: "2026-03-21", time: "After Market", eps: "$2.40", rev: "$2.8B", sentiment: "Neutral", status: "Estimated" },
  { id: 73, ticker: "COST", name: "Costco Wholesale", date: "2026-03-25", time: "After Market", eps: "$4.20", rev: "$58B", sentiment: "Bullish", status: "Confirmed" },
  { id: 74, ticker: "TGT", name: "Target Corp", date: "2026-03-26", time: "Pre Market", eps: "$1.80", rev: "$24B", sentiment: "Bearish", status: "Estimated" },
  { id: 75, ticker: "WMT", name: "Walmart Inc", date: "2026-03-27", time: "Pre Market", eps: "$1.50", rev: "$150B", sentiment: "Neutral", status: "Estimated" },

  // --- ADDITIONAL GLOBAL & INDIAN MIDCAPS ---
  { id: 76, ticker: "ZOMATO", name: "Zomato Ltd", date: "2026-02-08", time: "Pre Market", eps: "₹0.45", rev: "₹38B", sentiment: "Bullish", status: "Confirmed" },
  { id: 77, ticker: "PAYTM", name: "One97 Comm", date: "2026-02-09", time: "After Market", eps: "-₹2.50", rev: "₹24B", sentiment: "Neutral", status: "Estimated" },
  { id: 78, ticker: "NYKAA", name: "FSN E-Commerce", date: "2026-02-11", time: "Pre Market", eps: "₹0.15", rev: "₹14B", sentiment: "Bearish", status: "Estimated" },
  { id: 79, ticker: "DELHIVERY", name: "Delhivery Ltd", date: "2026-02-12", time: "After Market", eps: "-₹1.20", rev: "₹18B", sentiment: "Neutral", status: "Confirmed" },
  { id: 80, ticker: "POLICYBZR", name: "PB Fintech", date: "2026-02-14", time: "Pre Market", eps: "₹0.80", rev: "₹9B", sentiment: "Bullish", status: "Estimated" },
  { id: 81, ticker: "PIDILITIND", name: "Pidilite Ind", date: "2026-01-24", time: "Pre Market", eps: "₹28.00", rev: "₹32B", sentiment: "Neutral", status: "Confirmed" },
  { id: 82, ticker: "HAVELLS", name: "Havells India", date: "2026-01-25", time: "After Market", eps: "₹14.50", rev: "₹48B", sentiment: "Bullish", status: "Estimated" },
  { id: 83, ticker: "TITAN", name: "Titan Company", date: "2026-01-31", time: "Pre Market", eps: "₹32.00", rev: "₹110B", sentiment: "Bullish", status: "Confirmed" },
  { id: 84, ticker: "DMART", name: "Avenue Supermarts", date: "2026-02-01", time: "After Market", eps: "₹24.00", rev: "₹130B", sentiment: "Neutral", status: "Estimated" },
  { id: 85, ticker: "VBL", name: "Varun Beverages", date: "2026-02-04", time: "Pre Market", eps: "₹18.00", rev: "₹42B", sentiment: "Bullish", status: "Confirmed" },
  { id: 86, ticker: "TRENT", name: "Trent Ltd", date: "2026-02-07", time: "After Market", eps: "₹22.00", rev: "₹36B", sentiment: "Bullish", status: "Estimated" },
  { id: 87, ticker: "HAL", name: "Hindustan Aero", date: "2026-02-10", time: "Pre Market", eps: "₹45.00", rev: "₹85B", sentiment: "Bullish", status: "Confirmed" },
  { id: 88, ticker: "BEL", name: "Bharat Electronics", date: "2026-02-12", time: "After Market", eps: "₹4.50", rev: "₹42B", sentiment: "Neutral", status: "Estimated" },
  { id: 89, ticker: "COALINDIA", name: "Coal India", date: "2026-02-14", time: "Pre Market", eps: "₹12.00", rev: "₹340B", sentiment: "Bearish", status: "Estimated" },
  { id: 90, ticker: "NTPC", name: "NTPC Limited", date: "2026-01-28", time: "Pre Market", eps: "₹5.80", rev: "₹410B", sentiment: "Neutral", status: "Confirmed" },
  { id: 91, ticker: "ONGC", name: "Oil & Nat Gas", date: "2026-02-03", time: "After Market", eps: "₹9.20", rev: "₹1.4T", sentiment: "Bullish", status: "Estimated" },
  { id: 92, ticker: "BPCL", name: "Bharat Petroleum", date: "2026-01-30", time: "Pre Market", eps: "₹14.00", rev: "₹980B", sentiment: "Neutral", status: "Estimated" },
  { id: 93, ticker: "IOC", name: "Indian Oil Corp", date: "2026-01-31", time: "After Market", eps: "₹8.50", rev: "₹1.8T", sentiment: "Bearish", status: "Confirmed" },
  { id: 94, ticker: "POWERGRID", name: "Power Grid Corp", date: "2026-02-05", time: "Pre Market", eps: "₹6.00", rev: "₹110B", sentiment: "Bullish", status: "Confirmed" },
  { id: 95, ticker: "ADANIENT", name: "Adani Enterprises", date: "2026-02-08", time: "After Market", eps: "₹18.00", rev: "₹280B", sentiment: "Neutral", status: "Estimated" },
  { id: 96, ticker: "ADANIGREEN", name: "Adani Green", date: "2026-02-09", time: "Pre Market", eps: "₹1.50", rev: "₹24B", sentiment: "Bullish", status: "Estimated" },
  { id: 97, ticker: "ADANIPORTS", name: "Adani Ports", date: "2026-02-10", time: "After Market", eps: "₹22.00", rev: "₹65B", sentiment: "Bullish", status: "Confirmed" },
  { id: 98, ticker: "AMBUJACEM", name: "Ambuja Cements", date: "2026-02-12", time: "Pre Market", eps: "₹8.00", rev: "₹48B", sentiment: "Neutral", status: "Estimated" },
  { id: 99, ticker: "ACC", name: "ACC Limited", date: "2026-02-13", time: "After Market", eps: "₹32.00", rev: "₹44B", sentiment: "Neutral", status: "Confirmed" },
  { id: 100, ticker: "DLF", name: "DLF Limited", date: "2026-02-15", time: "Pre Market", eps: "₹4.20", rev: "₹18B", sentiment: "Bullish", status: "Estimated" },
];

export default function CalendarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // Filtering Logic
  const filteredData = EARNINGS_DATA.filter(item => {
    const matchesSearch = item.ticker.includes(searchTerm.toUpperCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" ? true : item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 h-full overflow-hidden bg-transparent">
      <div className="max-w-7xl w-full mx-auto flex flex-col h-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Calendar className="text-[#d2fc52]" size={32}/>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Earnings Calendar</h1>
                </div>
                <p className="text-gray-400 text-sm lg:text-base">
                    Global consensus estimates, release dates, and AI sentiment impact analysis.
                </p>
            </div>
            
            {/* SEARCH & FILTER BAR */}
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-[#d2fc52]" size={14} />
                    <input 
                        type="text" 
                        placeholder="SEARCH TICKER..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#161b22] border border-[#30363d] text-white text-xs font-bold rounded-lg pl-9 pr-4 py-2 w-56 outline-none focus:border-[#d2fc52] transition-all uppercase placeholder:text-gray-600"
                    />
                </div>
                <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-1">
                    {["All", "Confirmed", "Estimated"].map((f) => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${filter === f ? "bg-[#2a303c] text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${f === "All" ? "bg-blue-500" : f === "Confirmed" ? "bg-[#d2fc52]" : "bg-yellow-500"}`}></div>
                            {f}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* DATA TABLE - FLEXIBLE HEIGHT */}
        <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#30363d] bg-[#0d1016]/80 text-[10px] font-bold text-gray-500 uppercase tracking-widest backdrop-blur-sm shrink-0">
                <div className="col-span-4 pl-4">Company / Ticker</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Time</div>
                <div className="col-span-2 text-right">Est. EPS / Rev</div>
                <div className="col-span-2 text-right pr-4">AI Sentiment</div>
            </div>

            {/* Table Body - SCROLLABLE FILL */}
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#30363d]">
                {filteredData.length > 0 ? filteredData.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#2a303c]/40 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-l-[#d2fc52]">
                        
                        {/* Company */}
                        <div className="col-span-4 flex items-center gap-4 pl-4">
                            <div className="w-9 h-9 rounded-lg bg-[#2a303c] flex items-center justify-center font-bold text-white border border-[#30363d] group-hover:border-[#d2fc52] transition-colors shrink-0 text-xs">
                                {item.ticker[0]}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-white text-sm group-hover:text-[#d2fc52] transition-colors truncate">{item.ticker}</div>
                                <div className="text-[10px] text-gray-500 truncate">{item.name}</div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-2 text-xs text-gray-300 font-mono tracking-wide">
                            {item.date}
                        </div>

                        {/* Time */}
                        <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                item.time === "After Market" 
                                ? "bg-purple-900/20 text-purple-400 border-purple-500/20" 
                                : "bg-orange-900/20 text-orange-400 border-orange-500/20"
                            }`}>
                                {item.time === "After Market" ? <Moon size={10} /> : <Sun size={10} />}
                                {item.time.replace(" Market", "")}
                            </span>
                        </div>

                        {/* Estimates */}
                        <div className="col-span-2 text-right">
                            <div className="text-xs font-bold text-gray-200"><span className="text-gray-600 text-[10px] mr-1">EPS</span> <span className="text-[#d2fc52]">{item.eps}</span></div>
                            <div className="text-[10px] text-gray-500"><span className="text-gray-600 mr-1">REV</span> {item.rev}</div>
                        </div>

                        {/* Sentiment */}
                        <div className="col-span-2 flex justify-end pr-4">
                             <Badge type={item.sentiment === "Bullish" ? 'bull' : item.sentiment === "Bearish" ? 'bear' : 'neutral'} />
                        </div>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2 p-10">
                        <Filter size={24} className="opacity-30"/>
                        <span className="text-xs uppercase tracking-widest">No reports match "{filter}"</span>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="p-2 bg-[#0d1016] border-t border-[#30363d] text-center shrink-0">
                <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                    Displaying {filteredData.length} upcoming reports
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}

// Badge Component
function Badge({ type }: { type: 'bull' | 'bear' | 'neutral' }) {
    if (type === 'bull') return (
        <div className="flex items-center gap-1.5 text-[#3fb950] bg-[#3fb950]/10 px-2 py-1 rounded border border-[#3fb950]/20 min-w-[80px] justify-center">
            <TrendingUp size={12} /> <span className="text-[10px] font-bold uppercase">Bullish</span>
        </div>
    );
    if (type === 'bear') return (
        <div className="flex items-center gap-1.5 text-[#f85149] bg-[#f85149]/10 px-2 py-1 rounded border border-[#f85149]/20 min-w-[80px] justify-center">
            <TrendingDown size={12} /> <span className="text-[10px] font-bold uppercase">Bearish</span>
        </div>
    );
    return (
        <div className="flex items-center gap-1.5 text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 min-w-[80px] justify-center">
            <Minus size={12} /> <span className="text-[10px] font-bold uppercase">Neutral</span>
        </div>
    );
}