# File: app/rag/retriever.py

import chromadb
from sentence_transformers import SentenceTransformer
import os

class Retriever:
    def __init__(self):
        # 1. Initialize Embedding Model (Sentence-BERT)
        # Matches Layer 3 of your Architecture Diagram
        # "all-MiniLM-L6-v2" is fast, efficient, and free.
        print("Loading Embedding Model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # 2. Connect to ChromaDB (Persistent Storage)
        # This looks for the 'data/vectorstore' folder where your index_builder.py saved data.
        db_path = os.path.join(os.getcwd(), "data", "vectorstore")
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Get or Create the collection
        self.collection = self.client.get_or_create_collection(name="financial_news")
        print(f"✅ Retriever Ready. Database Path: {db_path}")

    def search(self, query: str, top_k: int = 5):
        """
        Performs Semantic Search + Credibility Boosting
        """
        # 1. Convert User Query to Vector
        query_embedding = self.embedding_model.encode(query).tolist()
        
        # 2. Search ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        # 3. Format & "Boost" Credibility
        # We process the raw DB results into a clean list for the LLM.
        cleaned_results = []
        
        if results['documents']:
            # Chroma returns a list of lists (one per query), we take the first.
            docs = results['documents'][0]
            metas = results['metadatas'][0]
            
            for doc, meta in zip(docs, metas):
                source_url = meta.get('source', '').lower()
                
                # --- AUTHENTICITY LOGIC ---
                # We flag "High Trust" sources for the LLM.
                # This helps Mistral calculate the "credibility_score" later.
                is_trusted = any(x in source_url for x in ["reuters", "bloomberg", "sec.gov", "wsj", "ft.com"])
                credibility_tag = "[VERIFIED SOURCE]" if is_trusted else "[GENERAL SOURCE]"
                
                cleaned_results.append({
                    "text": doc,
                    "source": f"{credibility_tag} {source_url}",
                    "published": meta.get('published', 'Unknown')
                })
                
        return cleaned_results

# Simple test block to check if it runs
if __name__ == "__main__":
    r = Retriever()
    # Note: This will return empty list if you haven't run ingestion yet.
    print(r.search("inflation rates"))