import yfinance as yf
import random
import math  # <--- Added to check for NaN

# A robust "Universe" of 50+ major global stocks for realistic screening
STOCK_UNIVERSE = [
    # --- US TECH & AI ---
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Technology", "pe": 32.5, "cap": 3400000000000},
    {"ticker": "MSFT", "name": "Microsoft", "sector": "Technology", "pe": 36.2, "cap": 3100000000000},
    {"ticker": "NVDA", "name": "NVIDIA", "sector": "Technology", "pe": 65.4, "cap": 3200000000000},
    {"ticker": "GOOGL", "name": "Alphabet", "sector": "Technology", "pe": 24.8, "cap": 2200000000000},
    {"ticker": "META", "name": "Meta Platforms", "sector": "Technology", "pe": 28.1, "cap": 1200000000000},
    {"ticker": "AVGO", "name": "Broadcom", "sector": "Technology", "pe": 26.5, "cap": 600000000000},
    {"ticker": "ORCL", "name": "Oracle", "sector": "Technology", "pe": 31.0, "cap": 350000000000},
    {"ticker": "ADBE", "name": "Adobe", "sector": "Technology", "pe": 45.2, "cap": 220000000000},
    {"ticker": "CRM", "name": "Salesforce", "sector": "Technology", "pe": 42.1, "cap": 280000000000},
    {"ticker": "AMD", "name": "AMD", "sector": "Technology", "pe": 140.5, "cap": 250000000000},
    {"ticker": "INTC", "name": "Intel", "sector": "Technology", "pe": 85.0, "cap": 130000000000},

    # --- INDIAN TECH (NSE) ---
    {"ticker": "TCS.NS", "name": "TCS", "sector": "Technology", "pe": 29.1, "cap": 140000000000},
    {"ticker": "INFY.NS", "name": "Infosys", "sector": "Technology", "pe": 24.5, "cap": 90000000000},
    {"ticker": "HCLTECH.NS", "name": "HCL Tech", "sector": "Technology", "pe": 22.1, "cap": 50000000000},
    {"ticker": "WIPRO.NS", "name": "Wipro", "sector": "Technology", "pe": 20.8, "cap": 30000000000},

    # --- FINANCIAL SERVICES ---
    {"ticker": "JPM", "name": "JPMorgan Chase", "sector": "Financial Services", "pe": 11.5, "cap": 580000000000},
    {"ticker": "V", "name": "Visa", "sector": "Financial Services", "pe": 28.4, "cap": 560000000000},
    {"ticker": "MA", "name": "Mastercard", "sector": "Financial Services", "pe": 35.1, "cap": 450000000000},
    {"ticker": "BAC", "name": "Bank of America", "sector": "Financial Services", "pe": 10.8, "cap": 280000000000},
    {"ticker": "HDFCBANK.NS", "name": "HDFC Bank", "sector": "Financial Services", "pe": 18.4, "cap": 130000000000},
    {"ticker": "ICICIBANK.NS", "name": "ICICI Bank", "sector": "Financial Services", "pe": 17.2, "cap": 100000000000},
    {"ticker": "SBIN.NS", "name": "SBI", "sector": "Financial Services", "pe": 9.5, "cap": 70000000000},
    {"ticker": "BAJFINANCE.NS", "name": "Bajaj Finance", "sector": "Financial Services", "pe": 30.2, "cap": 50000000000},

    # --- CONSUMER & RETAIL ---
    {"ticker": "AMZN", "name": "Amazon", "sector": "Consumer Cyclical", "pe": 42.1, "cap": 1950000000000},
    {"ticker": "TSLA", "name": "Tesla", "sector": "Consumer Cyclical", "pe": 58.9, "cap": 780000000000},
    {"ticker": "WMT", "name": "Walmart", "sector": "Consumer Defensive", "pe": 28.5, "cap": 480000000000},
    {"ticker": "PG", "name": "Procter & Gamble", "sector": "Consumer Defensive", "pe": 24.1, "cap": 390000000000},
    {"ticker": "KO", "name": "Coca-Cola", "sector": "Consumer Defensive", "pe": 23.8, "cap": 260000000000},
    {"ticker": "PEP", "name": "PepsiCo", "sector": "Consumer Defensive", "pe": 21.5, "cap": 230000000000},
    {"ticker": "TATAMOTORS.NS", "name": "Tata Motors", "sector": "Consumer Cyclical", "pe": 15.4, "cap": 40000000000},
    {"ticker": "MARUTI.NS", "name": "Maruti Suzuki", "sector": "Consumer Cyclical", "pe": 26.8, "cap": 35000000000},
    {"ticker": "ITC.NS", "name": "ITC Ltd", "sector": "Consumer Defensive", "pe": 25.4, "cap": 60000000000},

    # --- HEALTHCARE ---
    {"ticker": "LLY", "name": "Eli Lilly", "sector": "Healthcare", "pe": 110.5, "cap": 800000000000},
    {"ticker": "UNH", "name": "UnitedHealth", "sector": "Healthcare", "pe": 18.2, "cap": 450000000000},
    {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare", "pe": 16.2, "cap": 350000000000},
    {"ticker": "PFE", "name": "Pfizer", "sector": "Healthcare", "pe": 12.5, "cap": 160000000000},
    {"ticker": "SUNPHARMA.NS", "name": "Sun Pharma", "sector": "Healthcare", "pe": 32.1, "cap": 30000000000},
    {"ticker": "DRREDDY.NS", "name": "Dr. Reddys", "sector": "Healthcare", "pe": 19.8, "cap": 12000000000},

    # --- ENERGY & INDUSTRIAL ---
    {"ticker": "XOM", "name": "Exxon Mobil", "sector": "Energy", "pe": 12.8, "cap": 520000000000},
    {"ticker": "CVX", "name": "Chevron", "sector": "Energy", "pe": 11.2, "cap": 280000000000},
    {"ticker": "RELIANCE.NS", "name": "Reliance Ind", "sector": "Energy", "pe": 24.5, "cap": 200000000000},
    {"ticker": "ONGC.NS", "name": "ONGC", "sector": "Energy", "pe": 6.8, "cap": 25000000000},
    {"ticker": "NTPC.NS", "name": "NTPC", "sector": "Energy", "pe": 14.5, "cap": 35000000000},
    {"ticker": "LT.NS", "name": "Larsen & Toubro", "sector": "Industrials", "pe": 32.4, "cap": 55000000000},
    {"ticker": "BA", "name": "Boeing", "sector": "Industrials", "pe": 0, "cap": 110000000000},
]

# Helper to prevent JSON crashes on NaN (Not a Number) or Infinite values
def safe_float(val):
    if val is None: return 0.0
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return 0.0
        return f
    except:
        return 0.0

def fetch_screener_results(filters):
    results = []
    
    # 1. APPLY FILTERS
    filtered_candidates = []
    for s in STOCK_UNIVERSE:
        # Sector Filter
        if filters.get("sector") and filters["sector"] != "All":
            if s["sector"] != filters["sector"]: continue
            
        # P/E Filter
        if filters.get("min_pe") and s["pe"] < float(filters["min_pe"]): continue
        if filters.get("max_pe") and s["pe"] > float(filters["max_pe"]): continue
        
        filtered_candidates.append(s)

    if not filtered_candidates:
        return []

    # 2. FETCH LIVE PRICES (Limit to 30 to prevent timeouts)
    tickers = [s["ticker"] for s in filtered_candidates][:30]
    
    try:
        data = yf.download(tickers, period="1d", progress=False)['Close']
        
        # Handle single ticker result vs multiple
        if len(tickers) == 1:
            # Check if empty (some tickers might fail)
            if data.empty:
                prices = {}
            else:
                prices = {tickers[0]: data.iloc[-1]}
        else:
            if data.empty:
                prices = {}
            else:
                prices = data.iloc[-1].to_dict()

        # 3. BUILD FINAL RESULT LIST
        for s in filtered_candidates:
            # If the ticker wasn't fetched (failed or skipped), skip adding it
            if s["ticker"] not in tickers: continue
            
            raw_price = prices.get(s["ticker"], 0)
            
            # SANITIZE PRICE (Fixes the JSON Error)
            clean_price = safe_float(raw_price)
            
            if clean_price == 0: continue # Skip invalid prices

            # Price Filters
            if filters.get("min_price") and clean_price < float(filters["min_price"]): continue
            if filters.get("max_price") and clean_price > float(filters["max_price"]): continue

            results.append({
                "ticker": s["ticker"],
                "name": s["name"],
                "sector": s["sector"],
                "pe": s["pe"],
                "market_cap": s["cap"],
                "price": round(clean_price, 2),
                "volume": random.randint(1000000, 50000000) 
            })

    except Exception as e:
        print(f"Screener Error: {e}")
        return []

    return results