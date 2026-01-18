import os
import json
from groq import Groq

# Initialize Groq Client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

async def generate_market_summary(query: str, context: dict, intent: str):
    """
    Generates a Markdown-formatted financial report using Llama3-70b via Groq.
    """
    try:
        # 1. Construct the Prompt with Real Context
        news_text = "\n".join([f"- {n['title']} ({n['source']})" for n in context.get('news', [])])
        ticker = context.get('ticker', 'Unknown')
        price = context.get('price', 'N/A')
        
        system_prompt = (
            "You are AlphaFeed AI, an elite Wall Street quantitative analyst. "
            "Your output must be structured, professional Markdown. "
            "Analyze the provided market data and news. "
            "Be concise, data-driven, and neutral."
        )
        
        user_prompt = f"""
        User Query: {query}
        Ticker: {ticker} | Price: ${price}
        
        Recent News:
        {news_text}
        
        Task:
        1. Write an 'Executive Summary' (2-3 sentences).
        2. Provide 'Technical Outlook' based on the price action.
        3. Assign a Sentiment Score (0-100) and Label (BULLISH/BEARISH/NEUTRAL).
        
        Return ONLY valid JSON in this format:
        {{
            "content": "markdown string...",
            "score": 75,
            "label": "BULLISH"
        }}
        """

        # 2. Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama3-70b-8192",
            temperature=0.5,
            response_format={"type": "json_object"}
        )

        # 3. Parse Response
        result = json.loads(chat_completion.choices[0].message.content)
        return result

    except Exception as e:
        print(f"❌ Groq Error: {e}")
        # Fallback if API fails/quota exceeded
        return {
            "content": f"### ⚠️ System Note\nUnable to access neural core ({str(e)}). \n\n**{context.get('ticker')}** is trading at **${context.get('price')}**. Please rely on standard chart analysis for now.",
            "score": 50,
            "label": "NEUTRAL"
        }