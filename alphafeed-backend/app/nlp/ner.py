import re
import spacy
from pathlib import Path
import json

PROCESSED_NEWS_DIR = Path("data/processed/news")
NER_DIR = Path("data/processed/ner")
NER_DIR.mkdir(parents=True, exist_ok=True)

print("Loading spaCy model...")
nlp = spacy.load("en_core_web_sm")
print("spaCy model loaded ✓")


# --- Helper: detect tickers like AAPL, TCS, INFY, RELIANCE ---
TICKER_PATTERN = re.compile(r"\b[A-Z]{2,6}\b")


EVENT_KEYWORDS = {
    "earnings": ["earnings", "q1", "q2", "q3", "q4", "results", "profit", "revenue"],
    "merger": ["merger", "acquisition", "m&a", "buyout"],
    "guidance": ["guidance", "forecast", "outlook"],
    "dividend": ["dividend", "payout"],
    "layoffs": ["layoff", "job cuts", "headcount reduction"]
}


def extract_events(text: str):
    text_low = text.lower()
    events = []

    for label, keywords in EVENT_KEYWORDS.items():
        if any(k in text_low for k in keywords):
            events.append(label)

    return events


def process_ner_file(processed_file: Path):

    with open(processed_file, "r", encoding="utf-8") as f:
        articles = json.load(f)

    enriched = []

    for a in articles:
        text = f"{a.get('title','')} {a.get('summary','')}"
        doc = nlp(text)

        companies = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "PERSON"]]

        tickers = list(set(TICKER_PATTERN.findall(text)))
        events = extract_events(text)

        a["companies"] = companies
        a["tickers"] = tickers
        a["events"] = events

        enriched.append(a)

    output_file = NER_DIR / processed_file.name

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)

    print(f"NER file saved: {output_file}")


if __name__ == "__main__":
    latest_file = sorted(PROCESSED_NEWS_DIR.glob("*.json"))[-1]
    print(f"Running NER on: {latest_file.name}")
    process_ner_file(latest_file)
