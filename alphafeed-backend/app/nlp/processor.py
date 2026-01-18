# backend/nlp/processor.py
from textblob import TextBlob # Make sure to `pip install textblob`

def calculate_sentiment_score(text: str) -> int:
    """
    Returns a score from 0 to 100 based on text polarity.
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity # -1.0 to 1.0
    
    # Normalize -1...1 to 0...100
    # -1 -> 0
    # 0 -> 50
    # 1 -> 100
    normalized_score = int((polarity + 1) * 50)
    
    # Add some variance so it's not always 50 for neutral text
    return normalized_score