from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.ingestion.screener_fetcher import fetch_screener_results

router = APIRouter()

# Define the Filter Data Model
class ScreenerFilters(BaseModel):
    sector: Optional[str] = "All"
    min_price: Optional[float] = 0
    max_price: Optional[float] = 10000
    min_pe: Optional[float] = 0
    max_pe: Optional[float] = 200

@router.post("/screener")
def run_screener(filters: ScreenerFilters):
    # Convert Pydantic model to dict
    filter_dict = filters.dict()
    results = fetch_screener_results(filter_dict)
    return results