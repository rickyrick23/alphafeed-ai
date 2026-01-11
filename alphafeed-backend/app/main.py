from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag.retriever import init_retriever, search
from app.services.mistral_llm import ask_mistral
from app.services.response_schema import build_ai_prompt
from app.services.intent_detector import detect_intent

# ---------------- APP INIT ----------------

app = FastAPI(
    title="AlphaFeed AI Backend",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODELS ----------------

class QueryRequest(BaseModel):
    query: str

# ---------------- STARTUP ----------------

@app.on_event("startup")
def startup_event():
    init_retriever()
    print("✅ RAG retriever initialized")

# ---------------- ROUTES ----------------

@app.get("/")
def root():
    return {"status": "AlphaFeed AI Backend running"}

@app.post("/rag/query")
async def rag_query(req: QueryRequest):

    query = req.query.strip().lower()

    # 1️⃣ Detect intent
    intent = detect_intent(query)

    # 2️⃣ Vector search (NO k argument)
    matches = search(query)

    # 3️⃣ Extract chunks
    context_chunks = [m["chunk"] for m in matches]

    # 4️⃣ Build prompt
    prompt = build_ai_prompt(query, context_chunks)

    # 5️⃣ Call Mistral
    try:
        ai_response = await ask_mistral(prompt)
    except Exception as e:
        print("❌ Mistral Error:", e)
        ai_response = "AI service unavailable."

    return {
        "intent": intent,
        "matches": matches,
        "answer": ai_response
    }
