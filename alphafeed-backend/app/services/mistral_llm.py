import os
from mistralai import Mistral

API_KEY = os.getenv("MISTRAL_API_KEY")

client = Mistral(api_key=API_KEY)


def ask_mistral(query: str, context: str, live_data: str = ""):
    system_prompt = f"""
You are AlphaFeed, a professional financial intelligence analyst.

Context from verified sources:
{context}

Live market data:
{live_data}

Rules:
- Be factual
- Do not hallucinate
- If unsure, say "insufficient data"
- Keep tone professional
"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query}
    ]

    response = client.chat.complete(
        model="mistral-medium",
        messages=messages,
        temperature=0.2
    )

    return response.choices[0].message.content
