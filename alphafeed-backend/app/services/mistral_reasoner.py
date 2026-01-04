import json
from typing import List
from app.services.response_schema import AIResponse, EvidenceItem, build_ai_prompt
from app.services.groq_llm import ask_groq   # temporary — later we swap to local Mistral


def parse_ai_json(raw_text: str) -> AIResponse:
    """
    Ensures the model output is valid JSON and matches our structure.
    Falls back safely if the model outputs extra text.
    """
    try:
        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1
        data = json.loads(raw_text[start:end])
    except Exception:
        # Safe fallback
        data = {
            "summary": raw_text.strip(),
            "reasoning": "AI response was unstructured.",
            "risks": "Unknown.",
            "confidence": 50
        }

    return AIResponse(
        summary=data.get("summary", ""),
        reasoning=data.get("reasoning", ""),
        risks=data.get("risks", ""),
        evidence=[],  # filled later
        confidence=int(data.get("confidence", 50))
    )


async def generate_structured_answer(query: str, context_chunks: List[str]):
    """
    Full reasoning pipeline:
    1) Build structured prompt
    2) Call Mistral (currently via Groq wrapper)
    3) Parse output safely
    """

    prompt = build_ai_prompt(query, context_chunks)

    llm_output = await ask_groq(prompt)   # <-- will become mistral_local() later

    ai_response = parse_ai_json(llm_output)

    return ai_response
