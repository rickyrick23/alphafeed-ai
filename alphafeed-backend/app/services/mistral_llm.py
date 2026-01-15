# File: app/services/mistral_llm.py

import os
import json
from groq import Groq
from app.services.response_schema import FinancialResponse

class MistralLLM:
    def __init__(self):
        # 1. Initialize Groq Client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
            
        self.client = Groq(api_key=api_key)
        
        # 2. Use the Latest Stable Model (Updated Jan 2026)
        # "llama-3.3-70b-versatile" is currently the most powerful free-tier model on Groq.
        # It replaces the decommissioned 'mixtral-8x7b-32768'.
        self.model_name = "llama-3.3-70b-versatile" 
        
        # Backup models if you ever need them:
        # self.model_name = "llama-3.1-8b-instant"  # Faster, less smart
        # self.model_name = "gemma2-9b-it"          # Google's open model

    def generate_insight(self, query: str, context_chunks: list, market_data: dict) -> dict:
        """
        Generates structured financial insight using Llama 3.3 via Groq.
        """
        
        # 3. Format RAG Context
        formatted_context = ""
        for i, chunk in enumerate(context_chunks):
            source = chunk.get('source', 'Unknown')
            text = chunk.get('text', '')
            formatted_context += f"[Source {i+1}: {source}]\n{text}\n\n"
        
        market_summary = f"LIVE MARKET DATA: {market_data}" if market_data else "NO LIVE DATA AVAILABLE."

        # 4. System Prompt (The Persona)
        system_instruction = """
        You are AlphaFeed AI, an expert financial analyst.
        
        YOUR GOAL:
        Provide an accurate, evidence-based market report based STRICTLY on the provided Context.
        
        CRITICAL INSTRUCTION:
        You must output ONLY valid JSON. Do not write any introduction text.
        Use this exact schema:
        {
            "answer": "Direct answer to the query.",
            "summary": "2-sentence executive summary.",
            "sentiment": "Bullish/Bearish/Neutral",
            "confidence_score": 0.95,
            "credibility_score": 0.90,
            "reasoning": "Step-by-step logic...",
            "key_events": ["Event 1", "Event 2"],
            "risks": [{"factor": "Risk Name", "impact": "High", "description": "Why..."}],
            "sources": [{"title": "Source Name", "url": "URL", "credibility_rating": "High"}]
        }
        """

        # 5. User Prompt
        prompt = f"""
        USER QUERY: {query}
        
        CONTEXT:
        {formatted_context}
        
        MARKET DATA:
        {market_summary}
        
        Generate the JSON response now.
        """

        try:
            # 6. Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                model=self.model_name,
                temperature=0.1, # Keep it factual
                response_format={"type": "json_object"} # Forces JSON mode
            )
            
            # 7. Parse the JSON string into a Python Dictionary
            response_content = chat_completion.choices[0].message.content
            return json.loads(response_content)

        except Exception as e:
            print(f"Mistral/Groq API Error: {e}")
            return {
                "answer": "Error generating insight using AI Model.",
                "error_details": str(e),
                "confidence_score": 0.0
            }