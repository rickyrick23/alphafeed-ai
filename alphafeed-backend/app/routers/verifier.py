from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class VerifyRequest(BaseModel): 
    content: str

@router.post("/verify")
def verify(req: VerifyRequest): 
    # Mock advanced analysis logic
    trust_score = random.randint(85, 99)
    bias_rating = "Low" if trust_score > 90 else "Medium"
    
    return {
        "trust_score": trust_score,
        "status": "VERIFIED" if trust_score > 70 else "QUESTIONABLE",
        "bias_rating": bias_rating,
        "fact_check_details": [
            {"claim": "Data matched with trusted sources", "verified": True},
            {"claim": "No sentiment manipulation detected", "verified": True}
        ],
        "analysis": f"Source analysis complete. Content appears to be {bias_rating.lower()} bias and highly credible."
    }