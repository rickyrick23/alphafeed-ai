from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag.retriever import init_retriever, search
from app.services.mistral_llm import ask_mistral
from app.services.intent_detector import detect_intent

app = FastAPI(title="AlphaFeed AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


@app.on_event("startup")
def startup():
    init_retriever()
    print("✅ RAG retriever initialized")


@app.post("/rag/query")
async def rag_query(req: QueryRequest):

    query = req.query.strip().lower()

    # 1️⃣ Detect intent
    intent = detect_intent(query)

    # 2️⃣ Vector search
    matches = search(query)

    # 3️⃣ Build context
    context = "\n".join([m["chunk"] for m in matches])

    # 4️⃣ Ask Mistral (NOW PASS CONTEXT)
    try:
        answer = await ask_mistral(query, context)
    except Exception:
        answer = "AI service unavailable."

    return {
        "intent": intent,
        "matches": matches,
        "answer": answer
    }
