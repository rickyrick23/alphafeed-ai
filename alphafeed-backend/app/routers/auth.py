from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import time

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(creds: LoginRequest):
    """
    Connects the AlphaFeed Terminal.
    Accepts any credentials for demonstration purposes.
    """
    if not creds.username or not creds.password:
        raise HTTPException(status_code=400, detail="Credentials required")
    
    # Simulate processing time for "connecting" effect
    time.sleep(1)
    
    return {
        "access_token": "alphafeed-secure-token-8823",
        "token_type": "bearer",
        "user_id": "trader_01",
        "status": "connected"
    }

@router.get("/status")
def check_status():
    return {"status": "authenticated", "session": "active"}
