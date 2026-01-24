from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# In-memory storage for demonstration (simulating a DB)
portfolio_store = [
    {"ticker": "AAPL", "shares": 10, "avg_price": 150.00, "current_value": 1750.00},
    {"ticker": "NVDA", "shares": 5, "avg_price": 400.00, "current_value": 4500.00}
]

class Asset(BaseModel):
    ticker: str
    shares: float
    avg_price: float

@router.get("/summary")
def get_portfolio():
    total = sum(p['current_value'] for p in portfolio_store)
    return {
        "total_value": total,
        "daily_change": 1.25, # Mock change
        "positions": portfolio_store
    }

@router.post("/add")
def add_asset(asset: Asset):
    new_position = {
        "ticker": asset.ticker.upper(),
        "shares": asset.shares,
        "avg_price": asset.avg_price,
        "current_value": asset.shares * asset.avg_price * 1.05 # Mock current value bump
    }
    portfolio_store.append(new_position)
    return {"message": "Asset added successfully", "portfolio": portfolio_store}