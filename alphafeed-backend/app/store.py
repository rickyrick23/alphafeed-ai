# 1. ALERTS DATA
alerts_db = [
    {"id": 1, "ticker": "AAPL", "condition": "Above", "price": 240.00, "status": "Active", "created": "2026-01-10"},
    {"id": 2, "ticker": "BTC-USD", "condition": "Below", "price": 85000.00, "status": "Triggered", "created": "2026-01-12"},
    {"id": 3, "ticker": "RELIANCE", "condition": "Above", "price": 3200.00, "status": "Active", "created": "2026-01-14"},
]

# 2. PORTFOLIO DATA (Matches your Design)
portfolio_db = [
    {"id": 1, "ticker": "NVDA", "qty": 150, "avg_price": 120.50, "type": "Buy"},
    {"id": 2, "ticker": "SOL-USD", "qty": 120.5, "avg_price": 85.00, "type": "Buy"},
    {"id": 3, "ticker": "TSLA", "qty": 45, "avg_price": 245.00, "type": "Buy"},
    {"id": 4, "ticker": "AMD", "qty": 70, "avg_price": 140.00, "type": "Buy"},
]