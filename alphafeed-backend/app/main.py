from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.rag.generator import Generator
from app.ingestion.universal_ingestor import UniversalIngestor
import uvicorn

# 1. Define the Input Format
class QueryRequest(BaseModel):
    query: str
    deep_analysis: bool = False

# 2. Initialize the App & AI
app = FastAPI(title="AlphaFeed AI API", version="1.0")

print("🧠 Loading AI Model... Please wait.")
ai_generator = Generator() 
ingestor = UniversalIngestor()

@app.get("/")
def home():
    return {"status": "Online", "message": "AlphaFeed Financial Brain is Ready."}

@app.post("/chat")
def chat_endpoint(request: QueryRequest):
    """
    Main Chat Endpoint:
    Receives a question -> Searches Memory -> Generates Answer
    """
    try:
        response = ai_generator.generate_answer(request.query)
        return {
            "answer": response["answer"],
            "sources": response["sources"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/refresh-data")
def refresh_data():
    """
    Trigger this to fetch new news/prices immediately.
    """
    try:
        ingestor.ingest_all()
        return {"status": "success", "message": "Knowledge Base Updated with latest data."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run server if executed directly
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)