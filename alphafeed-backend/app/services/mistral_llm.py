import os
from mistralai import Mistral

API_KEY = os.getenv("MISTRAL_API_KEY")

if not API_KEY:
    raise RuntimeError("MISTRAL_API_KEY not found in environment variables")

client = Mistral(api_key=API_KEY)


async def ask_mistral(query: str, context: str) -> str:
    """
    Sends user query + retrieved context to Mistral
    """

    prompt = f"""
You are a financial news analyst AI.

Answer ONLY using the context below.

Context:
{context}

Question:
{query}

Give a clear, short and factual answer.
"""

    try:
        response = client.chat.complete(
            model="mistral-medium",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=400
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Mistral API Error:", e)
        return "Sorry, AI service is currently unavailable."
