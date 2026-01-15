# File: app/ingestion/market_fetcher.py

import yfinance as yf

class MarketFetcher:
    def __init__(self):
        # Map common names to Yahoo Finance Tickers
        # This helps the "Intent Detector" find the right asset.
        self.ticker_map = {
            "bitcoin": "BTC-USD",
            "btc": "BTC-USD",
            "ethereum": "ETH-USD",
            "nvidia": "NVDA",
            "apple": "AAPL",
            "tesla": "TSLA",
            "gold": "GC=F",
            "oil": "CL=F",
            "euro": "EURUSD=X",
            "sp500": "^GSPC",
            "nasdaq": "^IXIC"
        }

    def get_ticker_from_query(self, query: str):
        """
        Simple keyword extraction to find which asset the user is asking about.
        """
        query_lower = query.lower()
        for key, ticker in self.ticker_map.items():
            if key in query_lower:
                return ticker
        return None

    def get_data_for_query(self, query: str):
        """
        Fetches live price, change, and volume for the requested asset.
        """
        ticker_symbol = self.get_ticker_from_query(query)
        
        if not ticker_symbol:
            return None  # No specific asset found in query

        try:
            print(f"📈 Fetching Live Data for: {ticker_symbol}")
            ticker = yf.Ticker(ticker_symbol)
            
            # fast_info is faster than .info
            info = ticker.fast_info
            
            # Calculate % change manually if needed, or get from history
            current_price = info.last_price
            prev_close = info.previous_close
            change_percent = ((current_price - prev_close) / prev_close) * 100

            return {
                "asset": ticker_symbol,
                "current_price": round(current_price, 2),
                "change_percent": f"{change_percent:+.2f}%",
                "market_cap": info.market_cap,
                "status": "Live Data Fetched Successfully"
            }
            
        except Exception as e:
            print(f"Market Data Error: {e}")
            return {"error": "Failed to fetch live data"}

# Test block
if __name__ == "__main__":
    mf = MarketFetcher()
    print(mf.get_data_for_query("How is Bitcoin performing today?"))