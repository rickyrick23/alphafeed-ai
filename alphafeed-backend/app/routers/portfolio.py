from fastapi import APIRouter
import yfinance as yf
from app.models import Trade
from app.store import portfolio_db

router = APIRouter()

@router.get("/portfolio")
def get_portfolio():
    total_value = 0
    total_cost = 0
    updated_holdings = []
    
    for holding in portfolio_db:
        # Default to avg_price if fetch fails
        current_price = holding["avg_price"] 
        day_change = 0
        
        # 1. Try to fetch live price
        try:
            ticker_data = yf.Ticker(holding["ticker"])
            hist = ticker_data.history(period="1d")
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                open_price = hist['Open'].iloc[0]
                day_change = ((current_price - open_price) / open_price) * 100
        except:
            pass 

        # 2. Calculate Values
        market_value = current_price * holding["qty"]
        cost_basis = holding["avg_price"] * holding["qty"]
        total_value += market_value
        total_cost += cost_basis

        # 3. AI Risk Analysis Logic
        risk_level = "Safe Risk"
        risk_score = 90
        
        # Crypto = High Risk
        if any(x in holding["ticker"] for x in ["SOL", "BTC", "ETH", "COIN"]): 
            risk_level = "High Risk"
            risk_score = 45
        # Tech/Volatile = Med Risk
        elif any(x in holding["ticker"] for x in ["TSLA", "AMD", "NVDA"]):
            risk_level = "Med Risk"
            risk_score = 70

        updated_holdings.append({
            "id": holding["id"],
            "ticker": holding["ticker"],
            "name": holding["ticker"].replace("-USD", ""),
            "qty": holding["qty"],
            "price": round(current_price, 2),
            "change_24h": round(day_change, 2),
            "value": round(market_value, 2),
            "risk_level": risk_level,
            "risk_score": risk_score
        })

    # 4. Calculate Portfolio Health Score (0-10)
    # Start at 10, penalize for High Risk assets
    high_risk_count = sum(1 for h in updated_holdings if h["risk_level"] == "High Risk")
    health_score = max(0.0, round(10.0 - (high_risk_count * 1.5), 1))
    
    total_gain = total_value - total_cost
    total_gain_percent = (total_gain / total_cost) * 100 if total_cost > 0 else 0

    return {
        "net_worth": round(total_value, 2),
        "total_gain": round(total_gain, 2),
        "total_gain_percent": round(total_gain_percent, 2),
        "health_score": health_score,
        "risk_warning": f"{high_risk_count} Asset(s) at high risk" if high_risk_count > 0 else "Portfolio looks balanced",
        "holdings": updated_holdings
    }

@router.post("/portfolio")
def add_trade(trade: Trade):
    new_id = len(portfolio_db) + 1 if len(portfolio_db) == 0 else max(t["id"] for t in portfolio_db) + 1
    new_trade = {
        "id": new_id,
        "ticker": trade.ticker.upper(),
        "qty": trade.qty,
        "avg_price": trade.avg_price,
        "type": "Buy"
    }
    portfolio_db.append(new_trade)
    return new_trade