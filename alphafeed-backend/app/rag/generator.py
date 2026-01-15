# File: app/rag/generator.py

import os
import re
from groq import Groq
from dotenv import load_dotenv
from app.rag.retriever import Retriever

load_dotenv()

class Generator:
    def __init__(self):
        print("🧠 Initializing Groq AI Brain...")
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.retriever = Retriever()

    def generate_answer(self, query):
        print(f"🔎 Searching memory for: {query}")
        
        # 1. Get Rich Results (Text + Metadata + Score)
        retrieved_items = self.retriever.search(query, k=5) # Increased to 5 for better context
        
        # Prepare text for the AI
        context_text = ""
        structured_sources = []
        
        for item in retrieved_items:
            # Build context string for LLM
            context_text += f"---\n{item['text']}\n"
            
            # Extract Link from text if not in metadata (Helper function)
            link = "N/A"
            link_match = re.search(r'Link: (https?://\S+)', item['text'])
            if link_match:
                link = link_match.group(1)

            # Create the detailed source object you asked for
            structured_sources.append({
                "title": item['metadata'].get('title', 'Unknown Title'),
                "source": item['metadata'].get('source', 'Unknown Source'),
                "published_at": item['metadata'].get('published', 'N/A'),
                "relevance_score": f"{item['score']:.4f}",  # Precision Score
                "link": link,
                "type": item['metadata'].get('type', 'general')
            })

        if not context_text:
            context_text = "No specific financial data found."

        # 2. AI Prompt
        system_prompt = (
            "You are AlphaFeed, an elite Financial Analyst AI. "
            "Use the provided CONTEXT to answer. Cite specific numbers and sources. "
        )
        
        user_message = f"CONTEXT:\n{context_text}\n\nQUESTION: {query}"

        # 3. Call Groq
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
            )
            
            return {
                "answer": chat_completion.choices[0].message.content,
                "sources": structured_sources  # <-- Returns the detailed JSON list
            }
        except Exception as e:
            return {"answer": f"AI Error: {str(e)}", "sources": []}