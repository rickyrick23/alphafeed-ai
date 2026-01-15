# File: app/ingestion/file_ingestor.py

import os
import uuid
import pandas as pd
from pypdf import PdfReader
from datetime import datetime
from app.rag.retriever import Retriever

class FileIngestor:
    def __init__(self):
        # Define paths
        base_dir = os.getcwd()
        self.docs_dir = os.path.join(base_dir, "data", "raw", "documents")
        
        # Create directory for Kaggle/PDF files
        os.makedirs(self.docs_dir, exist_ok=True)
        
        print("🔌 Connecting to Vector Database...")
        self.retriever = Retriever()

    def parse_pdf(self, filepath):
        """Extracts text from Annual Reports/10-Ks"""
        try:
            reader = PdfReader(filepath)
            text_chunks = []
            print(f"   📖 Reading PDF with {len(reader.pages)} pages...")
            
            # Read first 10 pages (Executive Summary usually here) to save time
            # or read all if needed.
            for i, page in enumerate(reader.pages[:20]): 
                text = page.extract_text()
                if text and len(text) > 100:
                    text_chunks.append({
                        "text": f"DOCUMENT EXCERPT (Page {i+1}): {text[:2000]}", # Limit chunk size
                        "page": i + 1
                    })
            return text_chunks
        except Exception as e:
            print(f"   ❌ Error reading PDF: {e}")
            return []

    def parse_financial_csv(self, filepath):
        """
        Smart Parser for Kaggle Financial Datasets.
        Instead of reading 10,000 rows, it generates a statistical summary.
        """
        try:
            df = pd.read_csv(filepath)
            summary_chunks = []
            
            # Check if it looks like Stock Data (Open, Close, Date)
            columns = [c.lower() for c in df.columns]
            if 'close' in columns and 'date' in columns:
                # It's a Price Dataset
                desc = df.describe().to_string()
                start_date = df['date'].min() if 'date' in columns else "Unknown"
                end_date = df['date'].max() if 'date' in columns else "Unknown"
                
                summary_text = (
                    f"HISTORICAL MARKET DATA SUMMARY ({os.path.basename(filepath)}).\n"
                    f"Period: {start_date} to {end_date}.\n"
                    f"Statistics:\n{desc}\n"
                    f"Analysis: This dataset contains historical pricing data. Use this for trend analysis."
                )
                summary_chunks.append({"text": summary_text, "page": 0})
            
            else:
                # It's likely a Balance Sheet or Fundamental Dataset
                # Convert first 50 rows to narrative (e.g. "Apple 2023 Revenue...")
                # We limit to 50 to avoid token overflow, assuming top rows are most recent.
                for index, row in df.head(50).iterrows():
                    row_str = ", ".join([f"{k}: {v}" for k,v in row.items() if pd.notna(v)])
                    summary_chunks.append({
                        "text": f"FINANCIAL RECORD: {row_str}",
                        "page": index
                    })
            
            return summary_chunks
            
        except Exception as e:
            print(f"   ❌ Error reading CSV: {e}")
            return []

    def ingest_local_files(self):
        print(f"📂 Scanning {self.docs_dir} for Kaggle Datasets & PDFs...")
        
        files = [f for f in os.listdir(self.docs_dir) if f.endswith(('.pdf', '.csv', '.xlsx'))]
        
        if not files:
            print(f"⚠️ No files found in {self.docs_dir}.")
            print("👉 ACTION: Download a 'Financials.csv' from Kaggle or a '10-K.pdf' and drop it there.")
            return

        total_new = 0
        
        for filename in files:
            filepath = os.path.join(self.docs_dir, filename)
            print(f"⚙️ Processing: {filename}...")
            
            chunks = []
            if filename.endswith('.pdf'):
                chunks = self.parse_pdf(filepath)
            elif filename.endswith('.csv'):
                chunks = self.parse_financial_csv(filepath)
            
            if not chunks: continue

            # Indexing
            ids = [str(uuid.uuid4()) for _ in chunks]
            texts = [c['text'] for c in chunks]
            metadatas = [{
                "source": filename,
                "type": "uploaded_file",
                "title": filename,
                "published": datetime.now().isoformat()
            } for c in chunks]

            self.retriever.collection.add(documents=texts, metadatas=metadatas, ids=ids)
            print(f"   ✅ Indexed {len(chunks)} insights from {filename}")
            total_new += len(chunks)

        print(f"🎉 Ingestion Complete! Added {total_new} documents to the Knowledge Base.")

if __name__ == "__main__":
    ingestor = FileIngestor()
    ingestor.ingest_local_files()