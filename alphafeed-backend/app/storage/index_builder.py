import json
import hashlib
import pathlib
from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient

DATA_NER_DIR = pathlib.Path("data/processed/ner")
VECTOR_DB_PATH = "data/vectorstore"
COLLECTION_NAME = "news_chunks"

# -----------------------------
# Load embedding model (single load)
# -----------------------------
print("Loading Sentence-BERT model...")
EMBED_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
print("Embedding model loaded ✓")

# -----------------------------
# Init Vector DB + Collection
# -----------------------------
db = PersistentClient(path=VECTOR_DB_PATH)
collection = db.get_or_create_collection(COLLECTION_NAME)


def make_id(text: str) -> str:
    """Create deterministic ID to avoid duplicates"""
    return hashlib.md5(text.encode("utf-8")).hexdigest()


def index_file(json_file: pathlib.Path):
    """Index a processed NER JSON file"""
    print(f"\nIndexing file: {json_file.name}")

    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    ids, docs, metas = [], [], []

    for item in data:
        chunk = item.get("chunk") or item.get("text") or ""
        if not chunk or len(chunk.strip()) == 0:
            continue

        # deterministic id to prevent duplicates
        doc_id = make_id(chunk)

        # metadata — NEW content_type support
        meta = {
            "content_type": item.get("content_type", "news"),
            "source": item.get("source", ""),
            "link": item.get("link", ""),
            "published": item.get("published", ""),
            "companies": (item.get("companies") or "")[:300],
            "events": (item.get("events") or "")[:300],
            "tickers": (item.get("tickers") or "")[:200],
        }

        ids.append(doc_id)
        docs.append(chunk)
        metas.append(meta)

    if not ids:
        print("No valid chunks found — skipping.")
        return

    # compute embeddings
    embeds = EMBED_MODEL.encode(docs).tolist()

    # add to vector DB (duplicates auto-ignored by id)
    collection.add(
        ids=ids,
        documents=docs,
        metadatas=metas,
        embeddings=embeds,
    )

    print(f"Indexed {len(ids)} chunks ✓")


def index_latest_file():
    """Index only the most recent processed file"""
    files = sorted(DATA_NER_DIR.glob("*.json"))
    if not files:
        print("No NER files found — nothing to index.")
        return

    latest = files[-1]
    index_file(latest)


def index_all_files():
    """Rebuild index from all files (rarely needed)"""
    files = sorted(DATA_NER_DIR.glob("*.json"))
    if not files:
        print("No files found.")
        return

    for f in files:
        index_file(f)


if __name__ == "__main__":
    index_latest_file()
