from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
from pathlib import Path

VECTOR_DB_DIR = Path("data/vector_store")

router = APIRouter(prefix="/rag", tags=["RAG"])

COLLECTION_NAME = "news_knowledge_base"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

client = chromadb.PersistentClient(path=str(VECTOR_DB_DIR))

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=EMBED_MODEL
)

collection = client.get_collection(
    name=COLLECTION_NAME,
    embedding_function=embedding_fn
)

model = SentenceTransformer(EMBED_MODEL)


class QueryRequest(BaseModel):
    question: str
    top_k: int = 5


@router.post("/query")
def rag_query(req: QueryRequest):
    if not req.question.strip():
        raise HTTPException(400, "Question cannot be empty")

    query_vector = model.encode([req.question]).tolist()

    results = collection.query(
        query_embeddings=query_vector,
        n_results=req.top_k,
        include=["documents", "metadatas", "distances"]
    )

    response = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        response.append({
            "chunk": doc,
            "score": float(dist),
            "source": meta.get("source"),
            "link": meta.get("link"),
            "published": meta.get("published"),
            "sentiment": meta.get("sentiment"),
            "companies": meta.get("companies"),
            "tickers": meta.get("tickers"),
            "events": meta.get("events"),
        })

    return {"matches": response}
