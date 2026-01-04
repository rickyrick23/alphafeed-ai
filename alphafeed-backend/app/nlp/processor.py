import json
from pathlib import Path
from datetime import datetime
from app.nlp.cleaner import clean_text

RAW_DIR = Path("data/raw/news")
PROCESSED_DIR = Path("data/processed/news")
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def process_news_file(raw_file_path: Path):
    with open(raw_file_path, "r", encoding="utf-8") as f:
        articles = json.load(f)

    processed = []

    for article in articles:
        article["title"] = clean_text(article.get("title", ""))
        article["summary"] = clean_text(article.get("summary", ""))
        processed.append(article)

    output_file = PROCESSED_DIR / raw_file_path.name

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(processed, f, indent=2, ensure_ascii=False)

    print(f"Processed file saved: {output_file}")


if __name__ == "__main__":
    # pick most recent file automatically
    latest_file = sorted(RAW_DIR.glob("*.json"))[-1]
    process_news_file(latest_file)
