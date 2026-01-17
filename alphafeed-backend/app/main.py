from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# IMPORT ALL ROUTERS (The "Kitchen Stations")
from app.routers import market, verifier, alerts, portfolio, screener, reports

app = FastAPI()

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# INCLUDE ROUTERS
# ---------------------------------------------------------
# 1. Market Data (Stocks, News, Macro) -> routers/market.py
app.include_router(market.router, prefix="/api", tags=["Market"])

# 2. Source Verifier (NLP Logic) -> routers/verifier.py
app.include_router(verifier.router, prefix="/api", tags=["Verifier"])

# 3. Alerts System (Watchlist) -> routers/alerts.py
app.include_router(alerts.router, prefix="/api", tags=["Alerts"])

# 4. Portfolio Engine (Holdings & P/L) -> routers/portfolio.py
app.include_router(portfolio.router, prefix="/api", tags=["Portfolio"])

# 5. Deep Screener (Filter Logic) -> routers/screener.py
app.include_router(screener.router, prefix="/api", tags=["Screener"])

# 6. Saved Reports (PDF Generation) -> routers/reports.py
app.include_router(reports.router, prefix="/api", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "AlphaFeed AI Terminal API is Running"}