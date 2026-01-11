# ---------------- STOCK ----------------
STOCK_KEYWORDS = [
    "stock", "stocks", "share", "shares", "equity", "equities",
    "ipo", "earnings", "results", "quarter", "revenue", "profit",
    "loss", "dividend", "buyback", "valuation", "market cap",
    "nasdaq", "nyse", "sensex", "nifty", "dow", "s&p",
    "price target", "analyst rating", "upgrade", "downgrade",
    "bullish", "bearish", "portfolio",
    "tesla", "apple", "microsoft", "google", "meta",
    "amazon", "nvidia", "amd", "intel", "tcs", "infosys",
    "reliance", "hdfc", "icici", "axis"
]

# ---------------- CRYPTO ----------------
CRYPTO_KEYWORDS = [
    "crypto", "cryptocurrency", "blockchain", "token",
    "bitcoin", "btc", "ethereum", "eth", "solana", "sol",
    "dogecoin", "doge", "shiba", "shib", "cardano", "ada",
    "ripple", "xrp", "binance", "bnb", "avalanche", "avax",
    "polygon", "matic", "chainlink", "link",
    "nft", "defi", "staking", "airdrops", "mining",
    "wallet", "exchange", "coinbase", "kraken", "binance",
    "market cap", "hashrate", "gas fee"
]

# ---------------- FOREX ----------------
FOREX_KEYWORDS = [
    "forex", "fx", "currency", "exchange rate",
    "usd", "inr", "eur", "gbp", "jpy", "cny", "aud", "cad",
    "usd to inr", "eur to usd", "gbp to inr",
    "dollar", "rupee", "euro", "pound", "yen", "yuan",
    "appreciation", "depreciation",
    "currency pair", "usdinr", "eurusd", "gbpusd",
    "central bank", "rate hike", "rate cut"
]

# ---------------- COMMODITY ----------------
COMMODITY_KEYWORDS = [
    "commodity", "commodities",

    # Metals
    "gold", "silver", "copper", "aluminium", "aluminum",
    "zinc", "nickel", "lead", "platinum", "palladium",

    # Energy
    "oil", "crude", "brent", "wti",
    "natural gas", "lng", "petrol", "diesel",

    # Agriculture
    "wheat", "rice", "corn", "maize", "soybean",
    "cotton", "sugar", "coffee", "tea",
    "rubber", "palm oil", "sunflower oil",

    # Commodity terms
    "futures", "spot price", "inventory",
    "supply", "demand", "opec"
]

# ---------------- MACRO ----------------
MACRO_KEYWORDS = [
    "inflation", "cpi", "ppi",
    "gdp", "growth", "recession",
    "interest rate", "repo rate", "reverse repo",
    "fed", "fomc", "rbi", "ecb", "boe",
    "central bank", "monetary policy",
    "rate hike", "rate cut",
    "bond yield", "treasury",
    "unemployment", "job data",
    "trade deficit", "current account",
    "budget", "fiscal policy"
]


# ---------------- FUNCTION ----------------
def detect_intent(query: str) -> str:
    q = query.lower()

    if any(word in q for word in CRYPTO_KEYWORDS):
        return "CRYPTO"

    if any(word in q for word in FOREX_KEYWORDS):
        return "FOREX"

    if any(word in q for word in COMMODITY_KEYWORDS):
        return "COMMODITY"

    if any(word in q for word in MACRO_KEYWORDS):
        return "MACRO"

    if any(word in q for word in STOCK_KEYWORDS):
        return "STOCK"

    return "NEWS"
