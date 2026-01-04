from typing import Dict, List
import re

FIN_TICKER_MAP = {
    "nvidia": "NVDA",
    "tesla": "TSLA",
    "apple": "AAPL",
    "microsoft": "MSFT",
    "google": "GOOGL",
    "alphabet": "GOOGL",
}

FIN_SYNONYMS = {
    "performance": ["returns", "trend", "movement", "price action", "stock trend"],
    "earnings": ["results", "quarterly report", "guidance", "outlook"],
    "revenue": ["sales", "top line"],
    "profit": ["income", "net income", "bottom line"],
    "growth": ["expansion", "increase", "uptrend"],
    "decline": ["drop", "selloff", "downtrend"]
}


def detect_ticker(query: str) -> str | None:
    q = query.lower()
    for name, ticker in FIN_TICKER_MAP.items():
        if name in q or ticker.lower() in q:
            return ticker
    return None


def expand_terms(query: str) -> List[str]:
    expanded = [query]

    for word, syns in FIN_SYNONYMS.items():
        if word in query.lower():
            expanded.extend([query.lower().replace(word, s) for s in syns])

    return list(set(expanded))  # remove duplicates


def rewrite_query(query: str) -> Dict:
    ticker = detect_ticker(query)
    expansions = expand_terms(query)

    return {
        "ticker": ticker,
        "expanded_queries": expansions
    }
