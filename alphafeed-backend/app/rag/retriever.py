from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
from .query_expander import rewrite_query

# ---------- Load Embedding Model ----------
print("Loading Sentence-BERT model...")
_embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
print("Embedding model loaded ✓")

# ---------- Connect to Chroma ----------
client = PersistentClient(path="data/vectorstore")
collection = client.get_or_create_collection("news_chunks")

initialized = True


def is_initialized() -> bool:
    return initialized and collection is not None


def embed_text(text: str) -> List[float]:
    return _embedder.encode(text).tolist()


def search(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Smart semantic search with:
    - query rewriting
    - synonym expansion
    - ticker detection
    - merged multi-query retrieval
    """

    if not is_initialized():
        raise RuntimeError("RAG retriever not initialized")

    q = rewrite_query(query)

    all_results: List[Dict[str, Any]] = []

    for qtext in q["expanded_queries"]:
        emb = embed_text(qtext)

        results = collection.query(
            query_embeddings=[emb],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )

        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        scores = results.get("distances", [[]])[0]

        for i in range(len(docs)):
            all_results.append({
                "chunk": docs[i],
                "score": float(scores[i]),
                **(metas[i] if metas and i < len(metas) else {})
            })

    # ---- Deduplicate by chunk text ----
    unique = {item["chunk"]: item for item in all_results}

    # ---- Sort best to worst ----
    sorted_results = sorted(unique.values(), key=lambda x: x["score"], reverse=True)

    return sorted_results[:top_k]


def init_retriever():
    """
    Provided for compatibility with startup hooks.
    """
    global initialized
    initialized = True
    return True
