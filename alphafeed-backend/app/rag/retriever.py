from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from app.services.source_ranker import score_source

VECTOR_DB_PATH = "data/vectorstore"
COLLECTION_NAME = "news_chunks"

client = None
collection = None
model = None


def init_retriever():
    global client, collection, model

    print("Loading Sentence-BERT model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Embedding model loaded ✓")

    client = PersistentClient(path=VECTOR_DB_PATH)
    collection = client.get_or_create_collection(COLLECTION_NAME)

    print("✅ RAG retriever initialized")


def search(query: str, top_k: int = 5):
    if not collection or not model:
        raise RuntimeError("Retriever not initialized")

    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )

    final_results = []

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]

    for doc, meta, dist in zip(docs, metas, dists):
        credibility = score_source(meta.get("source",""))

        final_results.append({
            "chunk": doc,
            "score": float(1 - dist),
            "companies": meta.get("companies",""),
            "events": meta.get("events",""),
            "link": meta.get("link",""),
            "published": meta.get("published",""),
            "source": meta.get("source",""),
            "credibility": credibility
        })

    return final_results
