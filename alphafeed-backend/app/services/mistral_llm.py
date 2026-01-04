import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise RuntimeError("MISTRAL_API_KEY is missing in .env")

client = Mistral(api_key=MISTRAL_API_KEY)


async def ask_mistral(prompt: str, system_prompt: str | None = None) -> str:
    """
    Calls Mistral instruct model and returns the response text.
    """
    messages = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages.append({"role": "user", "content": prompt})

    try:
        response = client.chat.complete(
            model="mistral-small-latest",   # lightweight + fast
            messages=messages,
            temperature=0.35
        )

        return response.choices[0].message["content"]

    except Exception as e:
        print("Mistral API Error:", e)
        return "Sorry — the AI response is temporarily unavailable."
