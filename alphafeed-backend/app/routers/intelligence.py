import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# --- FIX IMPORTS ---
# All imports now start with "app." to satisfy the root execution path
from app.ingestion.market_fetcher import market_fetcher
from app.services.groq_llm import generate_market_summary 
from app.services.intent_detector import detect_intent 
from app.services.source_ranker import score_source

router = APIRouter()

# --- DATA MODELS ---
class IntelligenceRequest(BaseModel):
    query: str
    mode: str = "fast" 

class Source(BaseModel):
    title: str
    url: str
    source: str
    published_ago: str

class IntelligenceResponse(BaseModel):
    analysis: str 
    sentiment_score: int
    sentiment_label: str
    sources: List[Source]

# --- HELPER: ASYNC WRAPPER ---
def fetch_aggregated_data_sync(query: str):
    # 1. Fetch Stock Data
    stock_data = market_fetcher.fetch_single_stock(query)
    # 2. Fetch News 
    news_data = market_fetcher.fetch_marketaux_news()
    return stock_data, news_data

# --- MAIN ENDPOINT ---
@router.post("/chat", response_model=IntelligenceResponse)
async def chat_intelligence(request: IntelligenceRequest):
    try:
        query = request.query
        print(f"🧠 [Router] Processing: {query}")
        
        # 1. DETECT INTENT
        intent = await detect_intent(query)
        print(f"   ↳ Intent Detected: {intent}")
        
        # 2. FETCH DATA (Threaded)
        loop = asyncio.get_event_loop()
        stock_data, news_list = await loop.run_in_executor(None, fetch_aggregated_data_sync, query)
        
        # 3. RANK SOURCES
        ranked_news = sorted(
            news_list, 
            key=lambda x: (score_source(x.get('url', '')), x.get('sentiment_score', 0)), 
            reverse=True
        )
        top_sources = ranked_news[:4]
        
        # Prepare context for LLM
        context_payload = {
            "ticker": stock_data.get('ticker', query.upper()),
            "price": stock_data.get('price', 'N/A'),
            "change_percent": stock_data.get('change_percent', 'N/A'),
            "volume": stock_data.get('volume', 'N/A'),
            "news": top_sources
        }

        # 4. GENERATE AI SUMMARY
        llm_result = await generate_market_summary(
            query=query,
            context=context_payload,
            intent=intent
        )

        # 5. FORMAT SOURCES FOR FRONTEND
        formatted_sources = []
        for item in top_sources:
            formatted_sources.append(Source(
                title=item.get('title', 'Unknown Title'),
                url=item.get('url', '#'),
                source=item.get('source', 'MarketAux'),
                published_ago="Recent"
            ))

        return {
            "analysis": llm_result.get('content', "Market data unavailable."),
            "sentiment_score": llm_result.get('score', 50),
            "sentiment_label": llm_result.get('label', "NEUTRAL"),
            "sources": formatted_sources
        }

    except Exception as e:
        print(f"❌ Intelligence Error: {str(e)}")
        # Fallback response
        return {
            "analysis": f"I encountered a system error: {str(e)}. Please check the backend logs.",
            "sentiment_score": 0,
            "sentiment_label": "ERROR",
            "sources": []
        }