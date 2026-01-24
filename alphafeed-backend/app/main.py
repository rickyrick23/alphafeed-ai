from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import market, intelligence, portfolio, verifier, news, alerts, auth, reports

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router, prefix="/api/market", tags=["Market"])
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(verifier.router, prefix="/api/verifier", tags=["Verifier"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
def root(): return {"message": "AlphaFeed System Online"}