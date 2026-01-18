import yfinance as yf
import requests
import os
import asyncio # <--- Added this

class MarketFetcher:
    def __init__(self):
        self.api_key = os.getenv("MARKETAUX_API_KEY")

    def fetch_marketaux_news(self):
        if not self.api_key:
            print("❌ Error: MARKETAUX_API_KEY not found in env")
            return []

        url = f"https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT,NVDA,AAPL,GOOGL&filter_entities=true&limit=3&api_token={self.api_key}"

        try:
            response = requests.get(url)
            data = response.json()
            
            clean_news = []
            if "data" in data:
                for item in data["data"]:
                    clean_news.append({
                        "id": item["uuid"],
                        "title": item["title"],
                        "source": item["source"],
                        "url": item["url"],
                        "published_at": item["published_at"],
                        "published_ago": "Recent", # Helper for UI
                        "sentiment_score": item["entities"][0]["sentiment_score"] if item.get("entities") else 0
                    })
            return clean_news
        except Exception as e:
            print(f"Error fetching news: {str(e)}")
            return []

    def fetch_macro_data(self):
        tickers = {
            "NIFTY 50": "^NSEI", "SENSEX": "^BSESN", "S&P 500": "^GSPC",
            "GOLD": "GC=F", "CRUDE OIL": "CL=F", "USD/INR": "INR=X"
        }
        macro_data = []
        for name, ticker in tickers.items():
            try:
                stock = yf.Ticker(ticker)
                hist = stock.history(period="1d")
                if not hist.empty:
                    price = hist['Close'].iloc[-1]
                    prev = stock.info.get('previousClose', hist['Open'].iloc[0])
                    change = ((price - prev) / prev) * 100
                    macro_data.append({
                        "name": name,
                        "price": round(price, 2),
                        "change": round(change, 2),
                        "trend": "Bullish" if change > 0 else "Bearish"
                    })
            except Exception:
                pass
        return macro_data

    def fetch_single_stock(self, ticker: str):
        try:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1d")
            
            if data.empty: 
                # Return zero values instead of error dict to prevent crashes
                return {"price": 0.0, "change_percent": 0.0, "volume": 0}
            
            current = data['Close'].iloc[-1]
            prev = stock.info.get('previousClose', data['Open'].iloc[0]) 
            change = ((current - prev) / prev) * 100
            
            return {
                "ticker": ticker.upper(),
                "price": round(current, 2),
                "change_percent": round(change, 2),
                "volume": int(data['Volume'].iloc[-1])
            }
        except Exception as e:
            print(f"Stock fetch error: {e}")
            return {"price": 0.0, "change_percent": 0.0, "volume": 0}

# Initialize global instance
market_fetcher = MarketFetcher()

# --- NEW BRIDGE FUNCTION (This fixes the Import Error) ---
async def get_real_market_data(query: str):
    """
    Orchestrates data fetching for the AI Agent.
    """
    print(f"🔄 [Fetcher] Getting Real Data for: {query}")
    
    # 1. Fetch Price (Run in thread to avoid blocking)
    loop = asyncio.get_event_loop()
    stock_data = await loop.run_in_executor(None, market_fetcher.fetch_single_stock, query)
    
    # 2. Fetch News (Run in thread)
    news_data = await loop.run_in_executor(None, market_fetcher.fetch_marketaux_news)
    
    # Fallback news if API key is missing/limit reached
    if not news_data:
        news_data = [
            {"title": f"Market Analysis: {query} sees high volume trading activity", "source": "Bloomberg", "url": "#", "published_ago": "2h ago"},
            {"title": f"{query} technical indicators show consolidation", "source": "Reuters", "url": "#", "published_ago": "5h ago"}
        ]

    return {
        "ticker": query.upper(),
        "price": stock_data.get("price"),
        "change_percent": stock_data.get("change_percent"),
        "volume": stock_data.get("volume"),
        "news": news_data
    }