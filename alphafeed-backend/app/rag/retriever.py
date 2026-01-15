# File: app/rag/retriever.py

import chromadb
from sentence_transformers import SentenceTransformer
import os

class Retriever:
    def __init__(self):
        base_dir = os.getcwd()
        db_path = os.path.join(base_dir, "data", "vectorstore")
        
        self.client = chromadb.PersistentClient(path=db_path)
        self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        
        self.collection = self.client.get_or_create_collection(
            name="alphafeed_knowledge",
            metadata={"hnsw:space": "cosine"}
        )

    def search(self, query, k=3):
        try:
            query_embedding = self.embedding_model.encode([query]).tolist()
            
            # Fetch Documents, Metadatas, AND Distances (Scores)
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=k,
                include=["documents", "metadatas", "distances"]
            )
            
            # Combine them into a clean list of dictionaries
            structured_results = []
            if results['documents']:
                for i in range(len(results['documents'][0])):
                    structured_results.append({
                        "text": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i],
                        "score": 1 - results['distances'][0][i]  # Convert distance to similarity score
                    })
            
            return structured_results
            
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return []