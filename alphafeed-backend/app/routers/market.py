from fastapi import APIRouter
from datetime import datetime
from app.calendar_data import get_mock_calendar_data

# IMPORT FROM INGESTION LAYER
from app.ingestion.market_fetcher import market_fetcher

router = APIRouter()

@router.get("/status")
def get_system_status():
    return {
        "status": "Online",
        "latency": "24ms", 
        "timestamp": datetime.now().isoformat()
    }

@router.get("/macro")
def get_macro_view():
    return market_fetcher.fetch_macro_data()

@router.get("/news")
def get_real_news():
    return market_fetcher.fetch_marketaux_news()

@router.get("/stock/{ticker}")
def get_stock_data(ticker: str):
    return market_fetcher.fetch_single_stock(ticker)

@router.get("/calendar")
def get_calendar():
    return get_mock_calendar_data()