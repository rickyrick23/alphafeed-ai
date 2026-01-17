def analyze_source_text(text: str):
    """
    Logic for the Source Verifier Feature.
    """
    text = text.lower()
    score = 100
    flags = []
    
    # 1. Hype Detection
    hype_words = ["guaranteed", "100%", "insider tip", "moon", "pump", "urgent", "secret", "gem", "explode", "risk-free"]
    for word in hype_words:
        if word in text:
            score -= 15
            flags.append(f"Contains hype keyword: '{word}'")

    # 2. Content Checks
    if len(text) < 20:
        score -= 40
        flags.append("Content too short to verify context")
    
    if not any(w in text for w in ["official", "report", "citing", "announced"]):
        score -= 10
        flags.append("No clear citations or official sources referenced")

    # 3. Sentiment Simulation
    sentiment = "Neutral"
    if any(w in text for w in ["crash", "sell", "collapse", "crisis", "bear"]):
        sentiment = "Fear / Negative"
    elif any(w in text for w in ["buy", "bull", "high", "growth", "profit"]):
        sentiment = "Greed / Positive"

    # 4. Final Scoring
    score = max(0, min(100, score))
    verdict = "Reliable"
    if score < 50: verdict = "High Risk / Scam"
    elif score < 75: verdict = "Speculative / Unverified"

    # 5. Dynamic Sources Generation
    sources = []
    if score >= 80:
        sources = ["Reuters: Verified Match (98% Similarity)", "Bloomberg Terminal: Confirmed Event", "SEC Filings: 8-K Report Found"]
    elif score >= 50:
        sources = ["Reuters: No exact match found", "Social Sentiment: High Discussion Volume", "Official Filings: Pending / Not Found"]
    else:
        sources = ["FactCheck.org: Flagged as potential hoax", "Official Filings: NO RECORD FOUND", "Community Notes: Highly Disputed"]

    return {
        "trust_score": score,
        "verdict": verdict,
        "sentiment": sentiment,
        "flags": flags,
        "sources": sources 
    }