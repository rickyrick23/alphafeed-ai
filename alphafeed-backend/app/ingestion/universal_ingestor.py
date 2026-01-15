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
        self.k_api = None
        has_kaggle_file = os.path.exists(os.path.join(os.getcwd(), 'kaggle.json')) or \
                          os.path.exists(os.path.expanduser('~/.kaggle/kaggle.json'))
        has_kaggle_env = os.getenv("KAGGLE_USERNAME") and os.getenv("KAGGLE_KEY")

        if has_kaggle_file or has_kaggle_env:
            try:
                from kaggle.api.kaggle_api_extended import KaggleApi
                if has_kaggle_file:
                    os.environ['KAGGLE_CONFIG_DIR'] = os.getcwd()
                self.k_api = KaggleApi()
                self.k_api.authenticate()
                print("✅ Kaggle API: Authenticated")
            except Exception as e:
                print(f"⚠️ Kaggle Error: {e}. (Skipping Kaggle)")
        else:
            print("⚠️ Kaggle JSON/Keys not found. Skipping Kaggle (Safe Mode).")

    # ==========================================
    # 1. GOOGLE NEWS (JARVIS EDITION - ALL TOPICS)
    # ==========================================
    def fetch_google_news(self):
        print("📰 Fetching Comprehensive Financial News (Jarvis Mode)...")
        # 5 articles per topic x 35 topics = ~175 rich articles
        google_news = GNews(language='en', country='IN', period='1d', max_results=5)
        
        topics = [
            # --- CORE MARKETS ---
            "Stock Market India", "Nifty 50", "Sensex", "Bank Nifty",
            "US Stock Market", "Nasdaq", "Dow Jones",
            
            # --- POLICY & ECONOMY ---
            "RBI Monetary Policy", "Federal Reserve Interest Rates", 
            "Inflation Rate India", "India GDP News",
            
            # --- INVESTMENT VEHICLES ---
            "Mutual Funds India", "Best SIP to invest", "Debt Funds", "Small Cap Funds",
            "Upcoming IPO India", "IPO GMP (Grey Market Premium)", 
            "Sovereign Gold Bonds", "ETF Investment",
            
            # --- CORPORATE ACTIONS ---
            "Quarterly Earnings Results", "Stock Buybacks India", "Dividend Paying Stocks",
            
            # --- INSTITUTIONAL ACTIVITY ---
            "FII DII Activity India", "Hedge Fund News", "BlackRock News", "Warren Buffett News",
            
            # --- FOREX & COMMODITIES ---
            "USD INR Exchange Rate", "Forex Market News",
            "Gold Price Today", "Silver Price", "Crude Oil Price",
            
            # --- CRYPTO & TECH ---
            "Bitcoin News", "Ethereum Update", "DeFi News", "Artificial Intelligence Stocks"
        ]
        
        insights = []
        for topic in topics:
            try:
                # print(f"   Reading about: {topic}...") # Uncomment for detailed logs
                news = google_news.get_news(topic)
                for article in news:
                    pub_date = article.get('published date', str(datetime.now()))
                    text = (
                        f"TOPIC: {topic}\n"
                        f"TITLE: {article['title']}\n"
                        f"SOURCE: {article['publisher']['title']}\n"
                        f"LINK: {article['url']}"
                    )
                    
                    insights.append({
                        "id": str(uuid.uuid4()),
                        "text": text,
                        "title": article['title'],
                        "source": f"Google News ({topic})",
                        "published": pub_date,
                        "type": "news_google"
                    })
            except: continue
        
        print(f"   ✅ Fetched {len(insights)} Articles across {len(topics)} financial sectors.")
        return insights

    # ==========================================
    # 2. FREE MARKET DATA (Real-Time)
    # ==========================================
    def fetch_free_market_data(self):
        print("🌍 Fetching Real-Time Market Data...")
        insights = []
        
        # Crypto Prices
        try:
            url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1"
            data = requests.get(url, timeout=5).json()
            for coin in data:
                text = f"CRYPTO PRICE: {coin['name']} is ${coin['current_price']} (24h Change: {coin['price_change_percentage_24h']}%)"
                insights.append({"id": str(uuid.uuid4()), "text": text, "title": coin['name'], "source": "CoinGecko", "published": datetime.now().isoformat(), "type": "crypto"})
            print("   ✅ Fetched Top 15 Crypto Prices")
        except: pass

        # Macro Data (World Bank)
        try:
            url = "http://api.worldbank.org/v2/country/IN;US/indicator/NY.GDP.MKTP.KD.ZG?format=json&per_page=2&date=2023"
            resp = requests.get(url, timeout=5).json()
            if len(resp) > 1:
                for entry in resp[1]:
                    if entry['value']:
                        text = f"MACRO DATA: {entry['country']['value']} GDP Growth was {entry['value']}%"
                        insights.append({"id": str(uuid.uuid4()), "text": text, "title": "GDP Data", "source": "World Bank", "published": datetime.now().isoformat(), "type": "macro"})
            print("   ✅ Fetched World Bank Macro Data")
        except: pass

        return insights

    # ==========================================
    # 3. MARKETAUX (Premium News - Optional)
    # ==========================================
    def fetch_marketaux_news(self):
        if not self.marketaux_key: return []
        print("📰 Fetching Premium MarketAux News...")
        try:
            url = f"https://api.marketaux.com/v1/news/all?symbols=TSLA,BTC,USD,EUR,XAU&filter_entities=true&language=en&api_token={self.marketaux_key}"
            resp = requests.get(url).json()
            insights = []
            for art in resp.get('data', []):
                insights.append({
                    "id": str(uuid.uuid4()),
                    "text": f"PRO NEWS: {art['title']}\nSummary: {art['description']}",
                    "title": art['title'],
                    "source": "MarketAux Premium",
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
        print("\n🚀 STARTING JARVIS FINANCIAL CRAWLER...")
        all_data = []
        
        all_data.extend(self.fetch_google_news())    # The Big List
        all_data.extend(self.fetch_free_market_data()) # Live Prices
        all_data.extend(self.fetch_marketaux_news())   # Premium
        
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
            print("🎉 SUCCESS! Jarvis has been updated with global financial data.")
        except Exception as e:
            print(f"❌ DB Error: {e}")

if __name__ == "__main__":
    ingestor = UniversalIngestor()
    ingestor.ingest_all()