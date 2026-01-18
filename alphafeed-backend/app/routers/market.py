from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# --- FIX IMPORTS ---
# We point to 'app.ingestion' and 'app.services'
from app.ingestion.market_fetcher import market_fetcher
# If you have a legacy sentiment service, import it here too, e.g.:
# from app.services import sentiment as sentiment_service

router = APIRouter()

# --- ENDPOINTS ---

@router.get("/stock/{ticker}")
async def get_stock_price(ticker: str):
    """
    Fetches real-time price using the MarketFetcher utility.
    """
    try:
        data = market_fetcher.fetch_single_stock(ticker)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/news")
async def get_market_news():
    """
    Fetches general market news.
    """
    try:
        news = market_fetcher.fetch_marketaux_news()
        return news
    except Exception as e:
        print(f"News Error: {e}")
        return []

@router.get("/macro")
async def get_macro_data():
    """
    Fetches macro indicators (S&P 500, Gold, etc).
    """
    try:
        return market_fetcher.fetch_macro_data()
    except Exception as e:
        return []