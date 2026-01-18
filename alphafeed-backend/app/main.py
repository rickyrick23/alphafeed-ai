from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- FIX IMPORTS FOR BACKEND FOLDER EXECUTION ---
# We now import from 'app.routers' instead of just 'routers'
from app.routers import intelligence, market, portfolio, screener, alerts, reports, verifier

app = FastAPI(title="AlphaFeed API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTER ROUTERS
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["AI Core"])
app.include_router(market.router, prefix="/api/market", tags=["Market Data"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(screener.router, prefix="/api/screener", tags=["Screener"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(verifier.router, prefix="/api/verify", tags=["Source Verifier"])

@app.get("/")
def read_root():
    return {"status": "AlphaFeed Neural Core Online", "modules_active": ["NLP", "RAG", "Market"]}