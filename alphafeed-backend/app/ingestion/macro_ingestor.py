# File: app/ingestion/macro_ingestor.py

import pandas_datareader.data as web
import datetime
import uuid
import requests
import yfinance as yf
from app.rag.retriever import Retriever

class MacroIngestor:
    def __init__(self):
        print("🔌 Connecting to Vector Database for Macro Data...")
        self.retriever = Retriever()

    def fetch_fred_data(self):
        """
        Fetches Global & US Economic Benchmarks from FRED.
        """
        print("🏛️ Fetching Federal Reserve (FRED) Data...")
        # Dictionary of 'Series ID': 'Readable Name'
        indicators = {
            "CPIAUCSL": "US Inflation Rate (CPI)",
            "FEDFUNDS": "US Federal Funds Interest Rate",
            "GDP": "US Gross Domestic Product",
            "UNRATE": "US Unemployment Rate",
            "M2SL": "US M2 Money Supply",
            "VIXCLS": "CBOE Volatility Index (Market Fear Gauge)"
        }
        
        start_date = datetime.datetime.now() - datetime.timedelta(days=365*2)
        end_date = datetime.datetime.now()
        
        insights = []
        for code, name in indicators.items():
            try:
                # FRED is free via pandas_datareader
                df = web.DataReader(code, 'fred', start_date, end_date)
                latest_val = df.iloc[-1, 0]
                prev_val = df.iloc[-2, 0]
                change = latest_val - prev_val
                trend = "Rising" if change > 0 else "Falling"
                
                text = (
                    f"GLOBAL MACRO METRIC: {name}.\n"
                    f"Current Level: {latest_val:.2f}.\n"
                    f"Trend: {trend} (Change: {change:.2f}).\n"
                    f"Significance: This is a key indicator for global market liquidity and risk."
                )
                
                insights.append({
                    "id": str(uuid.uuid4()),
                    "text": text,
                    "title": f"Macro Data: {name}",
                    "source": "Federal Reserve (FRED)",
                    "published": datetime.datetime.now().isoformat(),
                    "type": "macro_indicator"
                })
                print(f"   ✅ Fetched {name}: {latest_val:.2f}")
            except Exception as e:
                print(f"   ⚠️ Failed to fetch {name}: {e}")
        
        return insights

    def fetch_world_bank_data(self):
        """
        Fetches Economic Data for INDIA, CHINA, US, and WORLD.
        """
        print("🌍 Fetching World Bank Data (Focus: India & Global)...")
        # API Query for: GDP Growth (NY.GDP.MKTP.KD.ZG), Inflation (FP.CPI.TOTL.ZG)
        # Countries: IN (India), CN (China), US (USA), WLD (World)
        url = "http://api.worldbank.org/v2/country/IN;CN;US;WLD/indicator/NY.GDP.MKTP.KD.ZG;FP.CPI.TOTL.ZG?format=json&per_page=20&date=2022:2024&source=2"
        
        insights = []
        try:
            resp = requests.get(url).json()
            if len(resp) < 2: return []
            
            data_list = resp[1]
            for entry in data_list:
                if entry['value'] is None: continue
                
                country = entry['country']['value']
                indicator = entry['indicator']['value']
                val = entry['value']
                year = entry['date']
                
                # Create a rich narrative for the AI
                text = (
                    f"ECONOMIC DATA FOR {country.upper()} ({year}):\n"
                    f"Indicator: {indicator}.\n"
                    f"Value: {val}%\n"
                    f"Source: World Bank Official Data."
                )
                
                insights.append({
                    "id": str(uuid.uuid4()),
                    "text": text,
                    "title": f"{country} - {indicator}",
                    "source": "World Bank API",
                    "published": datetime.datetime.now().isoformat(),
                    "type": "macro_indicator"
                })
            print(f"   ✅ Fetched {len(insights)} data points from World Bank.")
            
        except Exception as e:
            print(f"   ⚠️ World Bank Error: {e}")
            
        return insights

    def fetch_market_yields(self):
        """
        Fetches Bond Yields (India & US) via Yahoo Finance.
        Critical for calculating 'Risk-Free Rate'.
        """
        print("📈 Fetching Bond Yields (India & US)...")
        tickers = {
            "^TNX": "US 10-Year Treasury Yield",
            "^BSESN": "India SENSEX Index (Proxy for Indian Market Health)",
            "INR=X": "USD/INR Exchange Rate"
        }
        
        insights = []
        for ticker, name in tickers.items():
            try:
                t = yf.Ticker(ticker)
                info = t.fast_info
                price = info.last_price
                
                text = (
                    f"MARKET YIELD/INDEX: {name}\n"
                    f"Current Level: {price:.2f}\n"
                    f"Insight: Updates directly from live market data."
                )
                
                insights.append({
                    "id": str(uuid.uuid4()),
                    "text": text,
                    "title": f"Market Data: {name}",
                    "source": "Yahoo Finance API",
                    "published": datetime.datetime.now().isoformat(),
                    "type": "macro_indicator"
                })
                print(f"   ✅ Fetched {name}: {price:.2f}")
            except Exception as e:
                print(f"   ⚠️ Failed to fetch {name}: {e}")
                
        return insights

    def ingest_all(self):
        print("\n🚀 STARTING MACRO-ECONOMIC INGESTION...")
        all_data = []
        
        # 1. Run all fetchers
        all_data.extend(self.fetch_fred_data())
        all_data.extend(self.fetch_world_bank_data())
        all_data.extend(self.fetch_market_yields())
        
        if not all_data:
            print("❌ No data fetched. Check internet connection.")
            return

        # 2. Store in Vector Database
        print(f"\n🧠 Injecting {len(all_data)} Macro-Economic Indicators into ChromaDB...")
        
        ids = [d['id'] for d in all_data]
        texts = [d['text'] for d in all_data]
        metadatas = [{
            "source": d['source'],
            "title": d['title'],
            "published": d['published'],
            "type": d['type']
        } for d in all_data]
        
        try:
            self.retriever.collection.add(
                documents=texts,
                metadatas=metadatas,
                ids=ids
            )
            print("🎉 SUCCESS! Macro-Economic Knowledge Base Updated.")
        except Exception as e:
            print(f"❌ Database Error: {e}")

if __name__ == "__main__":
    ingestor = MacroIngestor()
    ingestor.ingest_all()