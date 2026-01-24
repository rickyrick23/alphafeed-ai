from fastapi import APIRouter
router = APIRouter()

@router.get("/active")
def get_alerts(): 
    return [
        {"id": 1, "type": "CRITICAL", "message": "NIFTY 50 crossed 24,000 resistance."},
        {"id": 2, "type": "INFO", "message": "Portfolio up 1.2% today."}
    ]