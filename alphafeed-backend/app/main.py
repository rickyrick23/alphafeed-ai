from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag.retriever import init_retriever, search
from app.services.groq_llm import ask_groq

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryIn(BaseModel):
    query: str


@app.on_event("startup")
def startup():
    init_retriever()


@app.post("/rag/query")
async def rag_query(req: QueryIn):
    matches = search(req.query)

    context = "\n\n".join([m["chunk"] for m in matches])

    prompt = f"""
You are a financial AI assistant.

Use ONLY the context below to answer the question.
If the context is insufficient, say you are unsure.

Context:
{context}

Question:
{req.query}

Answer clearly and concisely.
"""

    answer = await ask_groq(prompt)

    return {
        "matches": matches,
        "answer": answer
    }
