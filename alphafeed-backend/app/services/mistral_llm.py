# app/services/mistral_llm.py

from mistralai.client import MistralClient
import time
import os

API_KEY = os.getenv("MISTRAL_API_KEY")

client = MistralClient(api_key=API_KEY)

MODEL = "mistral-small"


def ask_mistral(prompt: str, context: str = "", live_data: dict = None):

    messages = [
        {"role": "system", "content": "You are a financial intelligence assistant."},
        {"role": "user", "content": prompt}
    ]

    for attempt in range(3):
        try:
            response = client.chat.complete(
                model=MODEL,
                messages=messages,
                temperature=0.3
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"⚠ Mistral attempt {attempt+1} failed:", e)

            if "429" in str(e):
                time.sleep(5)
            else:
                break

    return "⚠ LLM unavailable right now due to rate limits. Please try again shortly."
