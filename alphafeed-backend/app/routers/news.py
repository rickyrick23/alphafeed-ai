from fastapi import APIRouter
import yfinance as yf
router = APIRouter()

@router.get("/live")
def get_live_news():
    try: 
        ticker = yf.Ticker("AAPL") # Default news source
        news = ticker.news[:5]
        return [
            {
                "source": n.get("publisher"), 
                "time": "Today", # yfinance timestamp conversion can be complex, keeping simple for now
                "headline": n.get("title"),
                "link": n.get("link")
            } for n in news
        ]
    except: 
        return []
