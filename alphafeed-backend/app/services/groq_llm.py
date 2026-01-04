import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("MISTRAL_API_KEY")
if not API_KEY:
    raise RuntimeError("MISTRAL_API_KEY is missing in .env")

client = Mistral(api_key=API_KEY)

MODEL_NAME = "mistral-small-latest"   # lightweight + stable


async def ask_groq(prompt: str) -> str:
    """
    Sends a prompt to the Mistral chat model and returns the response text.
    """

    try:
        response = client.chat.complete(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        # New SDK returns objects — not dicts
        return response.choices[0].message.content

    except Exception as e:
        print("Mistral API Error:", e)
        return "Sorry — the AI service is temporarily unavailable."
