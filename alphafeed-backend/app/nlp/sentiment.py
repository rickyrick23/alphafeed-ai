import json
from pathlib import Path
from transformers import pipeline
from datetime import datetime

PROCESSED_NEWS_DIR = Path("data/processed/news")
SENTIMENT_DIR = Path("data/processed/sentiment")
SENTIMENT_DIR.mkdir(parents=True, exist_ok=True)

# Load FinBERT once
print("Loading FinBERT model...")
sentiment_model = pipeline(
    "sentiment-analysis",
    model="ProsusAI/finbert"
)
print("FinBERT loaded successfully")


def get_sentiment(text: str) -> str:
    if not text.strip():
        return "neutral"

    # FinBERT performs best with limited text length
    text = text[:512]

    result = sentiment_model(text)[0]
    return result["label"].lower()


def process_sentiment_file(processed_file: Path):
    with open(processed_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    output_data = []

    for a in articles:
        combined = f"{a.get('title','')} {a.get('summary','')}"
        sentiment = get_sentiment(combined)

        a["sentiment"] = sentiment
        output_data.append(a)

    output_file = SENTIMENT_DIR / processed_file.name

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Sentiment file saved: {output_file}")


if __name__ == "__main__":
    latest_file = sorted(PROCESSED_NEWS_DIR.glob("*.json"))[-1]
    print(f"Processing sentiment for: {latest_file.name}")
    process_sentiment_file(latest_file)
