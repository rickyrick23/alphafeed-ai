# backend/app/calendar_data.py
from datetime import datetime, timedelta

def get_mock_calendar_data():
    today = datetime.now()
    
    # A mix of top Indian (NSE) and US (NASDAQ/NYSE) stocks
    data = [
        # --- WEEK 1 ---
        {
            "id": 1, "ticker": "RELIANCE", "name": "Reliance Industries",
            "date": (today + timedelta(days=2)).strftime("%Y-%m-%d"), 
            "eps_est": "₹45.20", "rev_est": "₹2.1T", "time": "After Market", "sentiment": "Bullish"
        },
        {
            "id": 2, "ticker": "TCS", "name": "Tata Consultancy Svcs",
            "date": (today + timedelta(days=3)).strftime("%Y-%m-%d"), 
            "eps_est": "₹32.10", "rev_est": "₹610B", "time": "Pre Market", "sentiment": "Neutral"
        },
        {
            "id": 3, "ticker": "TSLA", "name": "Tesla, Inc.",
            "date": (today + timedelta(days=4)).strftime("%Y-%m-%d"), 
            "eps_est": "$0.85", "rev_est": "$25B", "time": "After Market", "sentiment": "Volatile"
        },
        {
            "id": 4, "ticker": "HDFCBANK", "name": "HDFC Bank Ltd",
            "date": (today + timedelta(days=5)).strftime("%Y-%m-%d"), 
            "eps_est": "₹22.50", "rev_est": "₹450B", "time": "Pre Market", "sentiment": "Strong Bull"
        },

        # --- WEEK 2 ---
        {
            "id": 5, "ticker": "NVDA", "name": "NVIDIA Corp",
            "date": (today + timedelta(days=8)).strftime("%Y-%m-%d"), 
            "eps_est": "$5.12", "rev_est": "$24B", "time": "After Market", "sentiment": "Strong Bull"
        },
        {
            "id": 6, "ticker": "INFY", "name": "Infosys Limited",
            "date": (today + timedelta(days=9)).strftime("%Y-%m-%d"), 
            "eps_est": "₹18.40", "rev_est": "₹380B", "time": "Pre Market", "sentiment": "Bearish"
        },
        {
            "id": 7, "ticker": "ICICIBANK", "name": "ICICI Bank Ltd",
            "date": (today + timedelta(days=10)).strftime("%Y-%m-%d"), 
            "eps_est": "₹14.20", "rev_est": "₹320B", "time": "Pre Market", "sentiment": "Bullish"
        },
        {
            "id": 8, "ticker": "AAPL", "name": "Apple Inc.",
            "date": (today + timedelta(days=11)).strftime("%Y-%m-%d"), 
            "eps_est": "$1.40", "rev_est": "$85B", "time": "After Market", "sentiment": "Neutral"
        },
        {
            "id": 9, "ticker": "TATAMOTORS", "name": "Tata Motors Ltd",
            "date": (today + timedelta(days=12)).strftime("%Y-%m-%d"), 
            "eps_est": "₹12.80", "rev_est": "₹950B", "time": "After Market", "sentiment": "Bullish"
        },

        # --- WEEK 3 ---
        {
            "id": 10, "ticker": "MSFT", "name": "Microsoft Corp",
            "date": (today + timedelta(days=15)).strftime("%Y-%m-%d"), 
            "eps_est": "$2.90", "rev_est": "$60B", "time": "After Market", "sentiment": "Bullish"
        },
        {
            "id": 11, "ticker": "SBIN", "name": "State Bank of India",
            "date": (today + timedelta(days=16)).strftime("%Y-%m-%d"), 
            "eps_est": "₹19.50", "rev_est": "₹1.1T", "time": "Pre Market", "sentiment": "Neutral"
        },
        {
            "id": 12, "ticker": "WIPRO", "name": "Wipro Limited",
            "date": (today + timedelta(days=17)).strftime("%Y-%m-%d"), 
            "eps_est": "₹5.60", "rev_est": "₹210B", "time": "After Market", "sentiment": "Bearish"
        },
        {
            "id": 13, "ticker": "AMZN", "name": "Amazon.com Inc",
            "date": (today + timedelta(days=18)).strftime("%Y-%m-%d"), 
            "eps_est": "$0.70", "rev_est": "$130B", "time": "After Market", "sentiment": "Bullish"
        },

        # --- WEEK 4 ---
        {
            "id": 14, "ticker": "BAJFINANCE", "name": "Bajaj Finance",
            "date": (today + timedelta(days=22)).strftime("%Y-%m-%d"), 
            "eps_est": "₹150.0", "rev_est": "₹80B", "time": "Pre Market", "sentiment": "Volatile"
        },
        {
            "id": 15, "ticker": "GOOGL", "name": "Alphabet Inc.",
            "date": (today + timedelta(days=24)).strftime("%Y-%m-%d"), 
            "eps_est": "$1.60", "rev_est": "$75B", "time": "After Market", "sentiment": "Neutral"
        },
        {
            "id": 16, "ticker": "ITC", "name": "ITC Limited",
            "date": (today + timedelta(days=25)).strftime("%Y-%m-%d"), 
            "eps_est": "₹4.10", "rev_est": "₹180B", "time": "After Market", "sentiment": "Bullish"
        },
        {
            "id": 17, "ticker": "COIN", "name": "Coinbase Global",
            "date": (today + timedelta(days=28)).strftime("%Y-%m-%d"), 
            "eps_est": "$1.10", "rev_est": "$3B", "time": "After Market", "sentiment": "Strong Bull"
        }
    ]
    return data