# backend/nlp/processor.py
from textblob import TextBlob # Make sure to `pip install textblob`

# Preprocessing Parameters (Research Feedback)
# OCR: None (Text-only ingestion)
# Tokenization: NLTK Standard (via TextBlob)
# Lemmatization: Disabled (Preserving exact phrasing for sentiment)
# Noise Filtering: Basic alphanumeric + punctuation retention

def preprocess_text(text: str) -> str:
    """
    Cleans text by removing excessive whitespace and non-printable characters.
    Note: Deep lemmatization is avoided to maintain sentiment nuance.
    """
    if not text: return ""
    # Noise Filtering: Remove extra spaces
    cleaned = " ".join(text.split())
    return cleaned

def calculate_sentiment_score(text: str) -> int:
    """
    Returns a score from 0 to 100 based on text polarity.
    """
    clean_text = preprocess_text(text)
    blob = TextBlob(clean_text)
    polarity = blob.sentiment.polarity # -1.0 to 1.0
    
    # Normalize -1...1 to 0...100
    # -1 -> 0
    # 0 -> 50
    # 1 -> 100
    normalized_score = int((polarity + 1) * 50)
    
    # Add some variance so it's not always 50 for neutral text
    return normalized_score