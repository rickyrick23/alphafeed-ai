import Groq from "groq-sdk";

// --- 1. CONFIGURATION & HELPERS ---

const getGroqClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

export const fetchSystemStatus = async () => {
  return {
    status: "OPERATIONAL",
    latency: "24ms",
    database: "Encrypted",
    ai_engine: "Llama-3.3-70B"
  };
};

// --- 2. INTELLIGENCE CHAT (AI) ---

export const askIntelligence = async (query: string) => {
    const groq = getGroqClient();
    if (!groq) return generateErrorResponse("API Key missing. Check .env.local");

    const systemPrompt = `
    You are AlphaFeed, an elite financial intelligence engine.
    Analyze the user's query about stocks, crypto, or economics.

    **CRITICAL INSTRUCTIONS:**
    1. Return ONLY a valid JSON object.
    2. The 'analysis' field MUST end with a distinct section titled '### AlphaFeed Verdict' giving a clear Bullish/Bearish/Neutral outlook with a target price range.
    3. The 'sources' array MUST contain 2-3 credible sources (e.g., Investor Relations, Bloomberg, Reuters) with realistic (even if estimated) URLs.

    **JSON STRUCTURE:**
    {
      "ticker": "Symbol (e.g. RELIANCE.NS, BTC-USD) or 'UNLISTED' or 'GENERAL'",
      "price": "Current Price with currency (e.g. ₹1,200, $145.20)",
      "change": "24h Change (e.g. +1.2%)",
      "analysis": "3-paragraph Markdown analysis. \n- Para 1: Price Action & Context.\n- Para 2: Technicals (RSI, MACD) or Fundamentals.\n- Para 3: ### AlphaFeed Verdict\n(Clear outlook: Bullish/Bearish, Key levels to watch).",
      "sentiment": {
        "score": Integer 0-100,
        "label": "Bullish/Bearish/Neutral",
        "delta": "Change (e.g. +2%)"
      },
      "sources": [
         { "title": "Official Investor Relations", "domain": "ir.company.com", "url": "https://www.google.com/search?q=investor+relations" },
         { "title": "Market Data Analysis", "domain": "reuters.com", "url": "https://www.reuters.com/markets" }
      ]
    }
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.2, 
            response_format: { type: "json_object" }
        });

        const jsonContent = completion.choices[0]?.message?.content;
        if (!jsonContent) throw new Error("Empty response from AI");
        const parsedData = JSON.parse(jsonContent);

        return {
            id: Date.now().toString(),
            role: 'assistant',
            content: parsedData.analysis || "Analysis generated.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            data: {
                ticker: parsedData.ticker || "GENERAL",
                price: parsedData.price || "---",
                change: parsedData.change || "0.00%",
                sentiment: parsedData.sentiment || { score: 50, label: "Neutral", delta: "0%" },
                sources: parsedData.sources || []
            }
        };
    } catch (e) {
        console.error("Groq Error:", e);
        return generateErrorResponse("Neural Core connection failed.");
    }
};

function generateErrorResponse(msg: string) {
    return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Error:** ${msg}`,
        timestamp: new Date().toLocaleTimeString(),
        data: null
    };
}

// --- 3. SOURCE VERIFIER (AI) ---

export const verifySourceContent = async (text: string) => {
    const groq = getGroqClient();
    
    if (!groq) {
        return {
            score: 0,
            riskLevel: "UNKNOWN",
            riskMessage: "API Key missing.",
            sources: []
        };
    }

    const systemPrompt = `
    You are a Fact-Checking AI. Analyze the text for credibility.
    Return JSON ONLY:
    {
      "score": Integer 0-100,
      "riskLevel": "LOW" | "MODERATE" | "CRITICAL",
      "riskMessage": "Verdict sentence.",
      "sources": [
        { "name": "Cross-Check Source", "status": "VERIFIED" | "NO MATCH", "active": boolean }
      ]
    }
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Verify this: "${text}"` }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const jsonContent = completion.choices[0]?.message?.content;
        return jsonContent ? JSON.parse(jsonContent) : { score: 0, riskLevel: "ERROR", riskMessage: "AI Parse Error", sources: [] };
    } catch (e) {
        console.error("Verifier Error", e);
        return { score: 0, riskLevel: "ERROR", riskMessage: "Service Offline", sources: [] };
    }
};

// --- 4. LIVE FEED (With Clickable URLs) ---

const NEWS_TEMPLATES = [
    { title: "Reliance Industries considers strategic partnership with {COMPANY} for renewable energy push.", sentiment: "BULLISH", category: "INDIA" },
    { title: "Wipro shares slide 2% as Q4 guidance misses street estimates; analyst downgrade follows.", sentiment: "BEARISH", category: "INDIA" },
    { title: "Bitcoin breaks key resistance at ${PRICE}, targeting new all-time highs amid ETF inflows.", sentiment: "BULLISH", category: "CRYPTO" },
    { title: "RBI Governor signals potential rate pause in upcoming MPC meeting citing cooling inflation.", sentiment: "NEUTRAL", category: "MACRO" },
    { title: "NVIDIA announces new AI chip architecture, claiming 30% efficiency boost over previous gen.", sentiment: "BULLISH", category: "TECH" },
    { title: "Adani Ports reports 15% YoY volume growth, expanding market share in East Coast.", sentiment: "BULLISH", category: "INDIA" },
    { title: "Tata Motors EV sales cross 100k milestone, outpacing domestic competitors.", sentiment: "BULLISH", category: "INDIA" },
    { title: "Ethereum gas fees spike to 6-month high as network activity surges.", sentiment: "NEUTRAL", category: "CRYPTO" },
    { title: "SEBI introduces tighter norms for F&O trading to curb retail speculation risks.", sentiment: "BEARISH", category: "REGULATION" },
    { title: "Tesla (TSLA) faces supply chain hurdles in Shanghai gigafactory; output may be impacted.", sentiment: "BEARISH", category: "TECH" }
];

const COMPANIES = ["Google", "Microsoft", "Aramco", "BP", "Shell"];

export const fetchLiveNews = async () => {
    await new Promise(resolve => setTimeout(resolve, 400)); 

    return Array.from({ length: 15 }).map((_, i) => {
        const template = NEWS_TEMPLATES[Math.floor(Math.random() * NEWS_TEMPLATES.length)];
        const randomCompany = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
        const randomPrice = Math.floor(Math.random() * 20000) + 40000;
        
        const title = template.title
            .replace("{COMPANY}", randomCompany)
            .replace("{PRICE}", randomPrice.toString());
        
        const url = `https://www.google.com/search?q=${encodeURIComponent(title)}`;

        return {
            id: `news-${Date.now()}-${i}`,
            title: title,
            source: ["Reuters", "Bloomberg", "CNBC", "Mint", "MoneyControl"][Math.floor(Math.random() * 5)],
            time: `${Math.floor(Math.random() * 59) + 1}m ago`,
            sentiment: template.sentiment,
            category: template.category,
            impact: Math.floor(Math.random() * 3) + 1,
            url: url 
        };
    });
};

// --- 5. DEEP SCREENER ---

export const fetchScreenerResults = async (filters: any) => {
    await new Promise(resolve => setTimeout(resolve, 800)); 
    return [
        { ticker: "NVDA", name: "NVIDIA Corp", price: "$879.95", change: "+3.24%", sector: "Technology", signal: "STRONG BUY" },
        { ticker: "RELIANCE.NS", name: "Reliance Ind", price: "₹2,980.50", change: "+1.45%", sector: "Energy", signal: "BUY" },
        { ticker: "TATAMOTORS.NS", name: "Tata Motors", price: "₹980.50", change: "+3.50%", sector: "Auto", signal: "STRONG BUY" },
        { ticker: "ZOMATO.NS", name: "Zomato Ltd", price: "₹185.00", change: "-1.20%", sector: "Tech", signal: "HOLD" },
        { ticker: "AAPL", name: "Apple Inc", price: "$178.41", change: "+1.20%", sector: "Technology", signal: "BUY" },
        { ticker: "TSLA", name: "Tesla Inc", price: "$175.40", change: "-2.40%", sector: "Auto", signal: "SELL" },
        { ticker: "BTC-USD", name: "Bitcoin", price: "$69,420", change: "+5.40%", sector: "Crypto", signal: "STRONG BUY" },
        { ticker: "SOL-USD", name: "Solana", price: "$145.20", change: "+8.50%", sector: "Crypto", signal: "STRONG BUY" }
    ];
};

// --- 6. EARNINGS CALENDAR ---

export const fetchEarnings = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
        { ticker: "RELIANCE", name: "Reliance Industries", date: "Jan 19, 2026", estimate: "₹25.00", status: "Confirmed" },
        { ticker: "TCS", name: "Tata Consultancy Svc", date: "Jan 20, 2026", estimate: "₹61.08", status: "Confirmed" },
        { ticker: "TSLA", name: "Tesla, Inc.", date: "Jan 21, 2026", estimate: "$0.85", status: "Projected" },
        { ticker: "HDFCBANK", name: "HDFC Bank Ltd", date: "Jan 21, 2026", estimate: "₹22.50", status: "Confirmed" },
        { ticker: "NVDA", name: "NVIDIA Corp", date: "Jan 25, 2026", estimate: "$5.12", status: "Projected" },
        { ticker: "AAPL", name: "Apple Inc.", date: "Jan 28, 2026", estimate: "$1.40", status: "Confirmed" }
    ];
};

// --- 7. DASHBOARD WIDGETS & SENTIMENT (Corrected) ---

export const fetchSentiment = async (ticker: string) => {
    // Generate realistic price based on ticker
    let basePrice = 150;
    if (ticker.includes("BTC")) basePrice = 65000;
    if (ticker.includes("NVDA")) basePrice = 880;
    if (ticker.includes("RELIANCE")) basePrice = 2980;
    if (ticker.includes("AAPL")) basePrice = 225;

    // Calculate Projected Range
    const volatility = basePrice * 0.03; 
    const low = (basePrice - volatility).toLocaleString(undefined, { maximumFractionDigits: 2 });
    const high = (basePrice + volatility).toLocaleString(undefined, { maximumFractionDigits: 2 });
    
    // Add Currency Symbol
    const currency = ticker.includes("NS") ? "₹" : "$";

    return {
        ticker: ticker,
        sentiment_score: Math.floor(Math.random() * 25) + 65, // 65-90%
        sentiment_label: "BULLISH",
        // Comprehensive Analysis Summary
        summary: `Technical indicators suggest a breakout pattern forming on the 4H timeframe, supported by increasing buy volume. Moving averages have crossed bullishly, indicating sustained momentum. Analysts predict a test of the upper resistance levels if current support holds through the session.`,
        // Returns formatted string with currency (e.g., "$145.50")
        projected_low: `${currency}${low}`,
        projected_high: `${currency}${high}`
    };
};

export const fetchMacroView = async () => {
    return [
       { name: "NIFTY 50", price: 24500, change: 0.5, sector: "INDEX" },
       { name: "SENSEX", price: 80500, change: 0.4, sector: "INDEX" },
       { name: "RELIANCE.NS", price: 2980, change: 1.2, sector: "INDIA" },
       { name: "WIPRO.NS", price: 480, change: -0.5, sector: "INDIA" },
       { name: "NVDA", price: 120, change: 2.1, sector: "LEADERS" },
       { name: "BTC-USD", price: 65000, change: 1.5, sector: "CRYPTO" }
    ];
};

// --- 8. PRO CHARTS API ---

export interface ChartDataPoint {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export const fetchChartData = async (ticker: string, timeframe: string = "1D") => {
    await new Promise(resolve => setTimeout(resolve, 600)); 

    let price = 150.00;
    if (ticker.includes("BTC")) price = 65000;
    if (ticker.includes("RELIANCE")) price = 2900;
    if (ticker.includes("NVDA")) price = 880;
    
    const data: ChartDataPoint[] = [];
    const now = new Date();

    for (let i = 100; i > 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); 
        const volatility = price * 0.02; 
        
        const change = (Math.random() - 0.5) * volatility;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        const volume = Math.floor(Math.random() * 1000000) + 500000;

        data.push({
            time: date.toISOString().split('T')[0], 
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume: volume
        });

        price = close; 
    }

    return data;
};

// --- 9. PORTFOLIO API ---

export const fetchPortfolioData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        summary: {
            total_value: "$101,760.45",
            day_change: "+$2,420.50",
            day_percent: "+2.4%",
            total_profit: "+$23,858.45",
            all_time_percent: "+30.63%"
        },
        top_performer: {
            symbol: "NVDA",
            change: "+49.5%"
        },
        holdings: [
            { 
                id: "1", symbol: "NVDA", name: "NVIDIA Corp", type: "STOCK", 
                price: 186.23, balance: 45, value: 8380.35, 
                pl_amount: "+$2,778.00", pl_percent: "+49.6%", 
                allocation: 42, color: "#d2fc52" 
            },
            { 
                id: "2", symbol: "BTC-USD", name: "Bitcoin", type: "CRYPTO", 
                price: 85400.00, balance: 0.45, value: 38430.00, 
                pl_amount: "+$10,530.00", pl_percent: "+37.7%", 
                allocation: 28, color: "#3fb950" 
            },
            { 
                id: "3", symbol: "TSLA", name: "Tesla Inc", type: "STOCK", 
                price: 182.50, balance: 120, value: 21900.00, 
                pl_amount: "-$7,500.00", pl_percent: "-25.5%", 
                allocation: 15, color: "#ef4444" 
            },
            { 
                id: "4", symbol: "AAPL", name: "Apple Inc", type: "STOCK", 
                price: 225.00, balance: 65, value: 14625.00, 
                pl_amount: "+$3,200.00", pl_percent: "+36.6%", 
                allocation: 15, color: "#3fb950" 
            }
        ]
    };
};

// --- 10. ANALYSIS API (with Sectors) ---

export const fetchAnalysisFeed = async () => {
    await new Promise(resolve => setTimeout(resolve, 600)); 

    return [
        {
            id: "1",
            ticker: "NVDA",
            name: "NVIDIA Corp",
            sector: "Technology",
            price: "$880.12",
            change: "+3.5%",
            signal: "STRONG BUY",
            summary: "AI chip demand continues to outpace supply. Data center revenue is projected to grow 40% QoQ."
        },
        {
            id: "2",
            ticker: "JPM",
            name: "JPMorgan Chase",
            sector: "Finance",
            price: "$195.40",
            change: "+1.2%",
            signal: "BUY",
            summary: "Strong balance sheet despite rate volatility. CEO comments suggest resilience in consumer banking."
        },
        {
            id: "3",
            ticker: "PFE",
            name: "Pfizer Inc",
            sector: "Healthcare",
            price: "$28.50",
            change: "-0.5%",
            signal: "HOLD",
            summary: "Pipeline updates are mixed. Investors waiting for clearer guidance on non-COVID revenue streams."
        },
        {
            id: "4",
            ticker: "XOM",
            name: "Exxon Mobil",
            sector: "Energy",
            price: "$118.20",
            change: "+2.1%",
            signal: "BUY",
            summary: "Oil prices rebounding on geopolitical tension. Upstream margins look healthy for Q3."
        },
        {
            id: "5",
            ticker: "BTC-USD",
            name: "Bitcoin",
            sector: "Crypto",
            price: "$68,500",
            change: "+4.2%",
            signal: "STRONG BUY",
            summary: "Institutional inflows via ETFs are hitting record highs. Halving event supply shock is pricing in."
        },
        {
            id: "6",
            ticker: "TSLA",
            name: "Tesla Inc",
            sector: "Technology", 
            price: "$175.40",
            change: "-2.4%",
            signal: "SELL",
            summary: "Margins under pressure due to price cuts. Competition in China EV market intensifying."
        }
    ];
};