import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise RuntimeError("MISTRAL_API_KEY not found in .env")

client = Mistral(api_key=API_KEY)

MODEL = "mistral-large-latest"


async def ask_mistral(query: str, context: str) -> str:
    """
    Query Mistral with context
    """

    prompt = f"""
You are AlphaFeed, a financial intelligence AI.

User Question:
{query}

Context:
{context}

Give a factual, concise financial answer.
"""

    try:
        response = client.chat.complete(
            model=MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        return response.choices[0].message.content

    except Exception as e:
        print("❌ Mistral API Error:", e)
        raise
