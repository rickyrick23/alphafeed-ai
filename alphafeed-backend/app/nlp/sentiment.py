import yfinance as yf
import numpy as np

def analyze_market_sentiment(ticker: str):
    """
    REAL-TIME TECHNICAL SENTIMENT ENGINE
    Fetches live candles and calculates Trend Direction.
    """
    try:
        # 1. Fetch 3 months of data to calculate Moving Averages
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")
        
        if hist.empty:
            return _get_fallback_sentiment(ticker)

        # 2. Calculate Indicators (Simple Moving Average)
        current_price = hist['Close'].iloc[-1]
        sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        
        # If not enough data for SMA 50, use SMA 20
        if np.isnan(sma_50):
            sma_50 = hist['Close'].rolling(window=20).mean().iloc[-1]

        # 3. Determine Sentiment Logic
        # Price > SMA = Bullish Trend
        sentiment_score = 50 # Start Neutral
        
        if current_price > sma_50:
            gap = ((current_price - sma_50) / sma_50) * 100
            # Cap the score between 50 and 95
            sentiment_score = 50 + min(45, gap * 5) 
            label = "BULLISH"
            summary = f"{ticker} is trading ABOVE its 50-day moving average, indicating strong upward momentum."
        else:
            gap = ((sma_50 - current_price) / sma_50) * 100
            sentiment_score = 50 - min(45, gap * 5)
            label = "BEARISH"
            summary = f"{ticker} is trading BELOW its 50-day moving average, suggesting selling pressure."

        # 4. Projected Range (Based on Daily Volatility/ATR)
        daily_volatility = hist['Close'].pct_change().std()
        # Project 24h range (1 standard deviation)
        low_proj = current_price * (1 - daily_volatility)
        high_proj = current_price * (1 + daily_volatility)

        return {
            "ticker": ticker.upper(),
            "sentiment_score": round(sentiment_score),
            "sentiment_label": label,
            "current_price": round(current_price, 2),
            "projected_low": round(low_proj, 2),
            "projected_high": round(high_proj, 2),
            "summary": summary
        }

    except Exception as e:
        print(f"Sentiment Error: {e}")
        return _get_fallback_sentiment(ticker)

def _get_fallback_sentiment(ticker):
    """Graceful fallback if API fails"""
    return {
        "ticker": ticker,
        "sentiment_score": 50,
        "sentiment_label": "NEUTRAL",
        "current_price": 0,
        "projected_low": 0,
        "projected_high": 0,
        "summary": "Insufficient data to calculate technical sentiment."
    }