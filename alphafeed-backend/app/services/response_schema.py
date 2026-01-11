from dataclasses import dataclass
from typing import List
from pydantic import BaseModel


# ---------------- API REQUEST ----------------
class QueryRequest(BaseModel):
    query: str


# ---------------- AI RESPONSE STRUCTURE ----------------
@dataclass
class EvidenceItem:
    source: str
    link: str
    snippet: str


@dataclass
class AIResponse:
    summary: str
    reasoning: str
    risks: str
    evidence: List[EvidenceItem]
    confidence: int  # 0–100


# ---------------- PROMPT BUILDER ----------------
def build_ai_prompt(query: str, context_chunks: List[str]) -> str:
    """
    Prompt template for Mistral — ensures structured, analyst-style thinking.
    """

    context_text = "\n\n".join(context_chunks[:10]) if context_chunks else "No context available."

    return f"""
You are AlphaFeed — a calm, analytical market intelligence assistant.

You MUST respond in the following JSON structure only:

{{
  "summary": "...",
  "reasoning": "...",
  "risks": "...",
  "confidence": 0-100
}}

Rules:
- Be objective and analytical — tone like a financial analyst.
- Use short, dense sentences — avoid hype.
- If information is uncertain, say so.
- Do NOT invent facts.

User Query:
{query}

Relevant Market Context:
{context_text}

Now produce the structured response.
"""
