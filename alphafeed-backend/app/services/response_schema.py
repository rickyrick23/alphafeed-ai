# File: app/services/response_schema.py

from pydantic import BaseModel, Field
from typing import List, Optional

class SourceRef(BaseModel):
    title: str
    url: str
    credibility_rating: str = Field(
        description="Rating of the source's reputation (e.g., 'High' for Reuters/SEC, 'Medium' for news blogs, 'Low' for unverified)."
    )

class RiskFactor(BaseModel):
    factor: str
    impact: str = Field(description="Potential impact severity: High, Medium, or Low.")
    description: str = Field(description="Brief explanation of why this is a risk.")

class FinancialResponse(BaseModel):
    answer: str = Field(
        description="The main, direct answer to the user's query."
    )
    summary: str = Field(
        description="A concise 2-sentence summary suitable for a dashboard card."
    )
    sentiment: str = Field(
        description="Overall market sentiment: Bullish, Bearish, or Neutral."
    )
    confidence_score: float = Field(
        description="A score from 0.0 to 1.0 indicating how confident the AI is based on the available evidence."
    )
    credibility_score: float = Field(
        description="A score from 0.0 to 1.0 representing the average reliability of the sources used."
    )
    reasoning: str = Field(
        description="Chain-of-thought explanation of how the conclusion was reached (improves transparency)."
    )
    key_events: List[str] = Field(
        description="List of specific market events identified (e.g., 'Fed Rate Cut', 'Earnings Miss')."
    )
    risks: List[RiskFactor] = Field(
        description="List of potential downside risks or market uncertainties."
    )
    sources: List[SourceRef] = Field(
        description="List of all sources cited in this response."
    )