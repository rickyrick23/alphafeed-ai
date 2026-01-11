from app.services.intent_detector import detect_intent
from app.rag.retriever import search
from app.services.mistral_llm import ask_mistral
from app.ingestion.market_fetcher import fetch_market_data


async def route_query(query: str):
    intent = detect_intent(query)

    if intent == "STOCK":
        matches = search(query)
        answer = await ask_mistral(query, matches)
        return intent, matches, answer

    if intent == "CRYPTO":
        matches = search(query)
        answer = await ask_mistral(query, matches)
        return intent, matches, answer

    if intent == "FOREX":
        data = fetch_market_data(query)
        return intent, [], data

    if intent == "COMMODITY":
        matches = search(query)
        answer = await ask_mistral(query, matches)
        return intent, matches, answer

    if intent == "MACRO":
        matches = search(query)
        answer = await ask_mistral(query, matches)
        return intent, matches, answer

    # default
    matches = search(query)
    answer = await ask_mistral(query, matches)
    return "NEWS", matches, answer
