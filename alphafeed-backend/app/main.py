from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel

from app.rag.retriever import init_retriever, search
from app.services.mistral_llm import ask_mistral
from app.services.intent_detector import detect_intent
from app.ingestion.market_fetcher import fetch_market_data

app = FastAPI(title="AlphaFeed AI", version="0.1.0")


class QueryRequest(BaseModel):
    query: str


@app.on_event("startup")
def startup():
    init_retriever()


@app.get("/")
def root():
    return {"status": "AlphaFeed backend running"}


@app.post("/rag/query")
def rag_query(req: QueryRequest):

    query = req.query

    # 1. Detect intent
    intent = detect_intent(query)

    # 2. Retrieve documents
    matches = search(query, top_k=5)

    # 3. Build context
    context_chunks = [m["chunk"] for m in matches]
    context_text = "\n".join(context_chunks)

    # 4. Fetch live data
    live_data = fetch_market_data(query)

    # 5. Ask Mistral correctly
    answer = ask_mistral(
        query=query,
        context=context_text,
        live_data=str(live_data)
    )

    return {
        "intent": intent,
        "matches": matches,
        "answer": answer
    }
