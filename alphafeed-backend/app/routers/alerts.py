from fastapi import APIRouter
from datetime import datetime
from app.models import AlertCreate
from app.store import alerts_db

router = APIRouter()

@router.get("/alerts")
def get_alerts():
    return alerts_db

@router.post("/alerts")
def create_alert(alert: AlertCreate):
    if not alerts_db:
        new_id = 1
    else:
        new_id = max(a["id"] for a in alerts_db) + 1
        
    new_alert = {
        "id": new_id,
        "ticker": alert.ticker.upper(),
        "condition": alert.condition,
        "price": alert.price,
        "status": "Active",
        "created": datetime.now().strftime("%Y-%m-%d")
    }
    alerts_db.insert(0, new_alert)
    return new_alert

@router.delete("/alerts/{alert_id}")
def delete_alert(alert_id: int):
    global alerts_db
    alerts_db = [a for a in alerts_db if a["id"] != alert_id]
    return {"status": "deleted"}