from fastapi import APIRouter
from app.models import VerifyRequest
# IMPORT FROM NLP LAYER
from app.nlp.verification import analyze_source_text

router = APIRouter()

@router.post("/verify")
def verify_source(request: VerifyRequest):
    return analyze_source_text(request.text)