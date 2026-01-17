from pydantic import BaseModel

class VerifyRequest(BaseModel):
    text: str

class AlertCreate(BaseModel):
    ticker: str
    condition: str  # "Above" or "Below"
    price: float

class Trade(BaseModel):
    ticker: str
    qty: float
    avg_price: float