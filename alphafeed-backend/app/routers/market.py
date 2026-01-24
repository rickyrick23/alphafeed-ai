from fastapi import APIRouter, HTTPException
import yfinance as yf
from datetime import datetime
import pandas as pd

router = APIRouter()

@router.get("/macro")
def get_macro_view():
    tickers = ["^NSEI", "^BSESN", "RELIANCE.NS", "WIPRO.NS", "NVDA", "BTC-USD", "AAPL", "GOOGL"]
    data = []
    try:
        # Optimization: Fetch all tickers in one go
        ticker_data = yf.Tickers(" ".join(tickers))
        for symbol in tickers:
            try:
                info = ticker_data.tickers[symbol].info
                # Handle different key names in yfinance info
                price = info.get("currentPrice") or info.get("regularMarketPrice") or 0.0
                prev_close = info.get("regularMarketPreviousClose") or price
                
                change_percent = 0.0
                if prev_close > 0:
                    change_percent = ((price - prev_close) / prev_close) * 100
                
                name = symbol.replace("^NSEI", "NIFTY 50").replace("^BSESN", "SENSEX")
                data.append({
                    "name": name, 
                    "price": round(price, 2), 
                    "change": round(change_percent, 2)
                })
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue
    except Exception as e:
        print(f"Macro error: {e}")
        return []
    return data

@router.get("/candles/{ticker}")
def get_candles(ticker: str, timeframe: str = "1D"):
    try:
        period_map = {"1D": "1d", "1W": "5d", "1M": "1mo", "1Y": "1y", "ALL": "max"}
        interval_map = {"1D": "15m", "1W": "1h", "1M": "1d", "1Y": "1wk", "ALL": "1mo"}
        yf_period = period_map.get(timeframe, "1d")
        yf_interval = interval_map.get(timeframe, "15m")

        stock = yf.Ticker(ticker)
        hist = stock.history(period=yf_period, interval=yf_interval)
        
        if hist.empty: 
            return []

        data = []
        for index, row in hist.iterrows():
            # Format time based on timeframe
            if timeframe in ["1D", "1W"]:
                t_str = index.strftime("%H:%M") 
            else:
                t_str = index.strftime("%b %d")
            
            data.append({
                "time": t_str,
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2),
                "close": round(row['Close'], 2),
                "volume": int(row['Volume'])
            })
        return data
    except Exception as e:
        print(f"Candle error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sentiment/{ticker}")
def get_sentiment(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")
        if hist.empty: return None
        
        current = hist['Close'].iloc[-1]
        sma = hist['Close'].mean()
        
        label = "BULLISH" if current > sma else "BEARISH"
        # Calculate a simple score derived from deviation from SMA
        deviation = abs(current - sma) / sma
        score = min(99, int(50 + (50 * deviation))) if label == "BULLISH" else max(1, int(50 - (50 * deviation)))
        
        return {
            "sentiment_label": label,
            "sentiment_score": score,
            "summary": f"Real-time analysis: {ticker} is trading {'above' if label == 'BULLISH' else 'below'} its 3-month average of {round(sma, 2)}.",
            "projected_high": round(current * 1.05, 2),
            "projected_low": round(current * 0.95, 2)
        }
    except Exception as e:
        print(f"Sentiment error: {e}")
        return {
            "sentiment_label": "NEUTRAL", 
            "sentiment_score": 50, 
            "summary": "Data unavailable", 
            "projected_high": 0, 
            "projected_low": 0
        }