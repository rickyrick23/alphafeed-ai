# app/ingestion/market_fetcher.py

import yfinance as yf
from datetime import datetime


TICKER_MAP = {
    "usd to inr": "USDINR=X",
    "dollar to rupee": "USDINR=X",
    "gold": "GC=F",
    "silver": "SI=F",
    "bitcoin": "BTC-USD",
    "btc": "BTC-USD",
    "ethereum": "ETH-USD",
    "eth": "ETH-USD",
    "nvidia": "NVDA",
    "apple": "AAPL",
    "tesla": "TSLA",
    "sensex": "^BSESN",
    "nifty": "^NSEI"
}


def extract_ticker(query: str):
    q = query.lower()
    for key, ticker in TICKER_MAP.items():
        if key in q:
            return ticker
    return None


def fetch_market_data(query: str):
    """
    Auto-detect ticker from query and fetch live data
    """

    ticker = extract_ticker(query)

    if not ticker:
        return {"error": "No valid ticker found in query"}

    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        return {
            "query": query,
            "ticker": ticker,
            "price": info.get("currentPrice"),
            "change_percent": info.get("regularMarketChangePercent"),
            "currency": info.get("currency"),
            "market_cap": info.get("marketCap"),
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        return {"error": str(e)}
