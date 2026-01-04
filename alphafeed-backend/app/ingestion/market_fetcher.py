import yfinance as yf
from datetime import datetime

def get_stock_snapshot(ticker: str):
    t = yf.Ticker(ticker)

    info = t.info or {}

    price = info.get("currentPrice") or info.get("regularMarketPrice")
    prev = info.get("previousClose")
    change = None

    if price and prev:
        change = round(((price - prev) / prev) * 100, 2)

    return {
        "ticker": ticker.upper(),
        "price": price,
        "change_percent": change,
        "currency": info.get("currency"),
        "market_cap": info.get("marketCap"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    print(get_stock_snapshot("NVDA"))
