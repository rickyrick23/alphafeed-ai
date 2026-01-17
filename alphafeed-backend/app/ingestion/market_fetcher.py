import yfinance as yf
import requests
import os

class MarketFetcher:
    def __init__(self):
        self.api_key = os.getenv("MARKETAUX_API_KEY")

    def fetch_marketaux_news(self):
        if not self.api_key:
            print("❌ Error: MARKETAUX_API_KEY not found in env")
            return []

        url = f"https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT,NVDA,AAPL,GOOGL&filter_entities=true&limit=5&api_token={self.api_key}"

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
            if data.empty: return {"error": "No data"}
            
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
            return {"error": str(e)}

# Initialize a global instance to be used by routers
market_fetcher = MarketFetcher()