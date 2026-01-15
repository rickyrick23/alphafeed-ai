# File: app/ingestion/rss_ingestor.py

import feedparser
import json
import os
import uuid
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from dateutil import parser
from app.rag.retriever import Retriever

class RSSIngestor:
    def __init__(self):
        # --- THE MASTER LIST OF FREE FINANCIAL FEEDS ---
        self.feeds = {
            # === GLOBAL MARKETS & GENERAL FINANCE ===
            "reuters_business": "http://feeds.reuters.com/reuters/businessNews",
            "reuters_company": "http://feeds.reuters.com/reuters/companyNews",
            "cnbc_top": "https://www.cnbc.com/id/100003114/device/rss/rss.html",
            "cnbc_finance": "https://www.cnbc.com/id/10000664/device/rss/rss.html",
            "cnbc_investing": "https://www.cnbc.com/id/15839069/device/rss/rss.html",
            "yahoo_top": "https://finance.yahoo.com/news/rssindex",
            "wsj_markets": "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
            "wsj_business": "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
            "ft_world": "https://www.ft.com/?format=rss",
            "ft_companies": "https://www.ft.com/companies?format=rss",
            "marketwatch_top": "http://feeds.marketwatch.com/marketwatch/topstories/",
            "investing_news": "https://www.investing.com/rss/news.rss",
            "investing_stock": "https://www.investing.com/rss/stock.rss",

            # === CRYPTO & BLOCKCHAIN ===
            "coindesk": "https://www.coindesk.com/arc/outboundfeeds/rss/",
            "cointelegraph": "https://cointelegraph.com/rss",
            "bitcoin_mag": "https://bitcoinmagazine.com/.rss/full/",
            "decrypt": "https://decrypt.co/feed",
            "newsbtc": "https://www.newsbtc.com/feed/",
            "cryptoslate": "https://cryptoslate.com/feed/",
            "blockworks": "https://blockworks.co/feed",

            # === FOREX & CURRENCIES ===
            "forexlive": "https://www.forexlive.com/feed",
            "fxstreet": "https://www.fxstreet.com/rss",
            "dailyfx": "https://www.dailyfx.com/feeds/market-news",
            "babypips": "https://www.babypips.com/feed",
            "investing_forex": "https://www.investing.com/rss/forex.rss",

            # === COMMODITIES (GOLD, OIL, ENERGY) ===
            "investing_commodities": "https://www.investing.com/rss/commodities.rss",
            "oilprice": "https://oilprice.com/rss/main",
            "kitco_gold": "https://www.kitco.com/rss/latest/news_and_commentary",
            "mining_com": "https://www.mining.com/feed/",

            # === MACRO ECONOMY & POLICY ===
            "economics_help": "https://www.economicshelp.org/blog/feed/",
            "project_syndicate": "https://www.project-syndicate.org/rss",
            "calculated_risk": "https://calculatedrisk.substack.com/feed",
            "investing_central_banks": "https://www.investing.com/rss/central_banks.rss",

            # === TECH STOCKS & AI ===
            "techcrunch": "https://techcrunch.com/feed/",
            "wired_business": "https://www.wired.com/feed/category/business/latest/rss",
            "venturebeat": "https://venturebeat.com/feed/",
            "verge_tech": "https://www.theverge.com/rss/index.xml"
        }

        # Paths
        base_dir = os.getcwd()
        self.raw_dir = os.path.join(base_dir, "data", "raw", "news")
        self.processed_dir = os.path.join(base_dir, "data", "processed", "news")
        
        # Create folders
        os.makedirs(self.raw_dir, exist_ok=True)
        os.makedirs(self.processed_dir, exist_ok=True)
        
        # Connect to DB
        print("🔌 Connecting to Vector Database...")
        self.retriever = Retriever()

    def fetch_feed_safe(self, url):
        """
        Fetches RSS content with a fake User-Agent to avoid 403 Forbidden errors.
        """
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        try:
            response = requests.get(url, headers=headers, timeout=10)
            return feedparser.parse(response.content)
        except Exception as e:
            print(f"⚠️ Network error fetching {url}: {e}")
            return None

    def clean_html(self, html_content):
        if not html_content: return ""
        soup = BeautifulSoup(html_content, "html.parser")
        return soup.get_text(separator=' ').strip()

    def parse_date(self, date_str):
        """Standardizes date format for easier sorting."""
        try:
            dt = parser.parse(date_str)
            return dt.isoformat()
        except:
            return str(datetime.now().isoformat())

    def ingest_all(self):
        print(f"🚀 Starting MASSIVE Ingestion at {datetime.now()}...")
        all_articles = []
        
        for source_name, url in self.feeds.items():
            print(f"🌐 Contacting: {source_name}...")
            
            feed = self.fetch_feed_safe(url)
            
            if not feed or not feed.entries:
                print(f"   ❌ Failed or empty: {source_name}")
                continue

            count = 0
            for entry in feed.entries:
                # Basic Extraction
                title = entry.get('title', '')
                link = entry.get('link', '')
                raw_summary = entry.get('summary', '') or entry.get('description', '')
                published = self.parse_date(entry.get('published', str(datetime.now())))
                
                # Cleaning
                summary = self.clean_html(raw_summary)
                
                # Quality Filter: Skip tiny updates or empty content
                if len(title) < 10 or len(summary) < 40:
                    continue

                article = {
                    "id": str(uuid.uuid4()),
                    "source": source_name,
                    "url": link,
                    "title": title,
                    "text": f"Title: {title}\nSummary: {summary}\nSource: {source_name}",
                    "published": published,
                    "ingested_at": datetime.now().isoformat()
                }
                all_articles.append(article)
                count += 1
            
            print(f"   ✅ Fetched {count} articles.")

        if not all_articles:
            print("❌ TOTAL FAILURE: No articles fetched from any source.")
            return

        # Save Raw JSON Backup
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.raw_dir, f"global_news_{timestamp}.json")
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(all_articles, f, indent=2)
        print(f"💾 Saved Backup: {filename}")

        # Indexing to ChromaDB
        print(f"🧠 Embeddings & Indexing {len(all_articles)} articles... (This may take a minute)")
        
        # Batch processing to prevent memory crash
        batch_size = 50
        ids = [a['id'] for a in all_articles]
        texts = [a['text'] for a in all_articles]
        metadatas = [{
            "source": a['url'],
            "published": a['published'],
            "title": a['title'],
            "feed_name": a['source']
        } for a in all_articles]

        try:
            for i in range(0, len(ids), batch_size):
                self.retriever.collection.add(
                    documents=texts[i:i+batch_size],
                    metadatas=metadatas[i:i+batch_size],
                    ids=ids[i:i+batch_size]
                )
                print(f"   Indexed batch {i}-{min(i+batch_size, len(ids))}")
            
            print(f"🎉 SUCCESS! System is now fueled with {len(all_articles)} financial insights.")
            
        except Exception as e:
            print(f"❌ ChromaDB Error: {e}")

if __name__ == "__main__":
    # Required dependencies: pip install feedparser beautifulsoup4 requests python-dateutil
    ingestor = RSSIngestor()
    ingestor.ingest_all()