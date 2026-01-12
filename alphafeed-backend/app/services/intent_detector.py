# app/services/intent_detector.py

# ---------------- KEYWORD LISTS ---------------- #

CRYPTO_KEYWORDS = [
    "bitcoin", "btc", "ethereum", "eth", "crypto", "blockchain",
    "dogecoin", "doge", "xrp", "ripple", "solana", "ada", "cardano",
    "binance", "bnb", "usdt", "tether", "stablecoin", "metamask",
    "nft", "web3", "defi", "staking", "hashrate", "mining",
    "altcoin", "crypto crash", "crypto rally", "bull run",
    "bear market", "coinbase", "kraken", "ledger", "wallet",
    "gas fee", "layer 2", "polygon", "arbitrum", "optimism",
    "airdrops", "whale", "rug pull", "yield farming"
]

FOREX_KEYWORDS = [
    "usd", "inr", "eur", "gbp", "jpy", "cad", "aud", "chf",
    "exchange rate", "forex", "fx", "currency",
    "usd to inr", "eur to usd", "gbp to inr", "yen",
    "dollar", "rupee", "pound", "euro",
    "fx market", "currency pair", "pip", "spread",
    "central bank", "interest rate",
    "federal reserve", "ecb", "boe", "rbi",
    "currency swap", "devaluation", "appreciation",
    "import export", "trade balance", "forex reserves"
]

COMMODITY_KEYWORDS = [
    "gold", "silver", "crude oil", "oil price", "brent",
    "wti", "natural gas", "lng", "coal",
    "copper", "aluminium", "zinc", "nickel", "lead",
    "platinum", "palladium", "uranium",
    "corn", "wheat", "soybean", "coffee", "sugar",
    "cotton", "rubber", "palm oil", "sunflower oil",
    "iron ore", "steel", "lithium", "cobalt",
    "fertilizer", "urea", "phosphate",
    "mcx", "ncdex", "commodities",
    "spot price", "futures", "contracts",
    "opec", "oil supply", "oil demand",
    "gold rate", "silver rate", "bullion",
    "base metals", "agri commodities",
    "precious metals", "energy market",
    "shipping rates", "freight index",
    "lme", "comex"
]

MACRO_KEYWORDS = [
    "inflation", "cpi", "ppi", "gdp", "growth rate",
    "recession", "economic slowdown", "stimulus",
    "interest rate hike", "rate cut",
    "bond yield", "treasury",
    "unemployment", "job data",
    "trade deficit", "current account",
    "fiscal deficit", "budget",
    "monetary policy", "liquidity",
    "quantitative easing",
    "consumer spending",
    "manufacturing data",
    "pmI", "services pmi",
    "exports", "imports",
    "world bank", "imf",
    "global economy"
]

STOCK_KEYWORDS = [
    "stock", "shares", "equity", "ipo",
    "nvidia", "tesla", "apple", "google",
    "amazon", "meta", "microsoft",
    "earnings", "quarter results",
    "dividend", "buyback",
    "nasdaq", "sensex", "nifty",
    "dow jones", "s&p 500",
    "market crash", "market rally",
    "valuation", "pe ratio",
    "brokerage", "analyst rating",
    "target price", "upgrade", "downgrade",
    "insider trading", "sec filing",
    "mutual funds", "hedge fund"
]

# ---------------- MAIN FUNCTION ---------------- #

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
