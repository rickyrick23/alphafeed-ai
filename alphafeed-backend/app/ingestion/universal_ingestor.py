# File: app/ingestion/universal_ingestor.py

import os
import uuid
import requests
from datetime import datetime
from dotenv import load_dotenv
from gnews import GNews
from app.rag.retriever import Retriever

# Load environment variables
load_dotenv()

class UniversalIngestor:
    def __init__(self):
        print("🔌 Connecting to AlphaFeed Brain...")
        self.retriever = Retriever()
        self.marketaux_key = os.getenv("MARKETAUX_API_TOKEN")
        
        # --- KAGGLE SAFETY BLOCK ---
        # We will only try to load Kaggle if we are SURE the keys exist.
        self.k_api = None
        self.use_kaggle = False
        
        # Check if we have the file OR the environment variables
        has_kaggle_file = os.path.exists(os.path.join(os.getcwd(), 'kaggle.json')) or \
                          os.path.exists(os.path.expanduser('~/.kaggle/kaggle.json'))
        has_kaggle_env = os.getenv("KAGGLE_USERNAME") and os.getenv("KAGGLE_KEY")

        if has_kaggle_file or has_kaggle_env:
            try:
                # Only import if we are safe
                from kaggle.api.kaggle_api_extended import KaggleApi
                if has_kaggle_file:
                    os.environ['KAGGLE_CONFIG_DIR'] = os.getcwd()
                self.k_api = KaggleApi()
                self.k_api.authenticate()
                self.use_kaggle = True
                print("✅ Kaggle API: Authenticated")
            except Exception as e:
                print(f"⚠️ Kaggle Error: {e}. (Skipping Kaggle)")
        else:
            print("⚠️ Kaggle JSON/Keys not found. Skipping Kaggle (System running in safe mode).")

    # ==========================================
    # 1. GOOGLE NEWS (FREE & ROBUST)
    # ==========================================
    def fetch_google_news(self):
        print("📰 Fetching Google News (Expanded)...")
        # 10 articles per topic
        google_news = GNews(language='en', country='IN', period='1d', max_results=10)
        
        topics = [
            "Stock Market India", "Nifty 50", "Sensex", "RBI Policy",
            "US Markets", "Fed Rates", "AI Stocks",
            "Gold Price", "Crude Oil", "Bitcoin", "USD INR"
        ]
        
        insights = []
        for topic in topics:
            try:
                news = google_news.get_news(topic)
                for article in news:
                    pub_date = article.get('published date', str(datetime.now()))
                    text = f"NEWS ({topic}): {article['title']}\nSource: {article['publisher']['title']}\nLink: {article['url']}"
                    
                    insights.append({
                        "id": str(uuid.uuid4()),
                        "text": text,
                        "title": article['title'],
                        "source": "Google News",
                        "published": pub_date,
                        "type": "news_google"
                    })
            except: continue
        
        print(f"   ✅ Fetched {len(insights)} Google News Articles")
        return insights

    # ==========================================
    # 2. FREE MARKET DATA (Crypto & Macro)
    # ==========================================
    def fetch_free_market_data(self):
        print("🌍 Fetching Macro & Crypto Data...")
        insights = []
        
        # Crypto
        try:
            url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1"
            data = requests.get(url, timeout=5).json()
            for coin in data:
                text = f"CRYPTO: {coin['name']} is ${coin['current_price']} ({coin['price_change_percentage_24h']}%)"
                insights.append({"id": str(uuid.uuid4()), "text": text, "title": coin['name'], "source": "CoinGecko", "published": datetime.now().isoformat(), "type": "crypto"})
            print("   ✅ Fetched Crypto Data")
        except: pass

        # World Bank
        try:
            url = "http://api.worldbank.org/v2/country/IN;US/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=2&date=2023"
            resp = requests.get(url, timeout=5).json()
            if len(resp) > 1:
                for entry in resp[1]:
                    if entry['value']:
                        text = f"MACRO: {entry['country']['value']} GDP Growth: {entry['value']}%"
                        insights.append({"id": str(uuid.uuid4()), "text": text, "title": "GDP", "source": "World Bank", "published": datetime.now().isoformat(), "type": "macro"})
            print("   ✅ Fetched World Bank Data")
        except: pass

        return insights

    # ==========================================
    # 3. MARKETAUX (If Key Exists)
    # ==========================================
    def fetch_marketaux_news(self):
        if not self.marketaux_key: return []
        print("📰 Fetching MarketAux News...")
        try:
            url = f"https://api.marketaux.com/v1/news/all?symbols=TSLA,BTC,USD&filter_entities=true&language=en&api_token={self.marketaux_key}"
            resp = requests.get(url).json()
            insights = []
            for art in resp.get('data', []):
                insights.append({
                    "id": str(uuid.uuid4()),
                    "text": f"PRO NEWS: {art['title']}\nSummary: {art['description']}",
                    "title": art['title'],
                    "source": "MarketAux",
                    "published": art['published_at'],
                    "type": "news_premium"
                })
            print(f"   ✅ Fetched {len(insights)} Premium Articles")
            return insights
        except: return []

    # ==========================================
    # MAIN EXECUTION
    # ==========================================
    def ingest_all(self):
        print("\n🚀 STARTING UNIVERSAL DATA AGENT...")
        all_data = []
        
        all_data.extend(self.fetch_google_news())
        all_data.extend(self.fetch_free_market_data()) 
        all_data.extend(self.fetch_marketaux_news())
        
        if not all_data:
            print("❌ No data collected.")
            return

        print(f"\n🧠 Injecting {len(all_data)} insights into Brain...")
        
        ids = [d['id'] for d in all_data]
        texts = [d['text'] for d in all_data]
        metadatas = [{
            "source": d['source'],
            "title": d['title'],
            "published": d['published'],
            "type": d['type']
        } for d in all_data]
        
        try:
            self.retriever.collection.add(documents=texts, metadatas=metadatas, ids=ids)
            print("🎉 SUCCESS! Data Agent Completed.")
        except Exception as e:
            print(f"❌ DB Error: {e}")

if __name__ == "__main__":
    ingestor = UniversalIngestor()
    ingestor.ingest_all()