import feedparser
from datetime import datetime
from pathlib import Path
import json

RAW_NEWS_DIR = Path("data/raw/news")
RAW_NEWS_DIR.mkdir(parents=True, exist_ok=True)

RSS_SOURCES = [

    # ---------------- INDIA ----------------
    "https://www.moneycontrol.com/rss/marketreports.xml",
    "https://www.moneycontrol.com/rss/buzzingstocks.xml",
    "https://www.moneycontrol.com/rss/latestnews.xml",
    "https://www.moneycontrol.com/rss/technicals.xml",
    "https://www.moneycontrol.com/rss/mostpopular.xml",
    "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
    "https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms",
    "https://economictimes.indiatimes.com/markets/forex/rssfeeds/2146843.cms",
    "https://economictimes.indiatimes.com/markets/commodities/rssfeeds/2146844.cms",
    "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",
    "https://www.financialexpress.com/market/feed/",
    "https://www.financialexpress.com/industry/feed/",
    "https://www.livemint.com/rss/markets",
    "https://www.livemint.com/rss/industry",
    "https://www.business-standard.com/rss/markets-106.rss",
    "https://www.business-standard.com/rss/finance-101.rss",
    "https://www.thehindubusinessline.com/markets/feeder/default.rss",
    "https://www.thehindubusinessline.com/markets/stock-markets/feeder/default.rss",
    "https://www.ndtvprofit.com/feed",
    "https://www.bqprime.com/feeds/markets.rss",

    # ---------------- GLOBAL ----------------
    "https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL,MSFT,GOOG",
    "https://feeds.finance.yahoo.com/rss/2.0/headline?s=NVDA,TSLA",
    "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC,^IXIC",
    "https://www.investing.com/rss/news.rss",
    "https://www.investing.com/rss/stock_market_news.rss",
    "https://www.investing.com/rss/economic_calendar.rss",
    "https://www.marketwatch.com/feeds/topstories",
    "https://www.marketwatch.com/feeds/markets",
    "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    "https://feeds.a.dj.com/rss/RSSWSJD.xml",
    "https://www.ft.com/?format=rss",
    "https://www.ft.com/companies?format=rss",
    "https://www.reuters.com/finance/markets/rss",
    "https://www.reuters.com/business/finance/rss",
    "https://www.reuters.com/technology/rss",
    "https://www.coindesk.com/arc/outboundfeeds/rss/",
    "https://cryptonews.com/news/feed",
    "https://news.bitcoin.com/feed/",
]

def fetch_rss_articles():
    articles = []

    for url in RSS_SOURCES:
        feed = feedparser.parse(url)

        for entry in feed.entries:
            articles.append({
                "id": entry.get("id", entry.get("link")),
                "title": entry.get("title", "").strip(),
                "summary": entry.get("summary", "").strip(),
                "link": entry.get("link"),
                "published": entry.get("published", ""),
                "source": url,
                "fetched_at": datetime.utcnow().isoformat()
            })

    filename = RAW_NEWS_DIR / f"news_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"Fetched {len(articles)} articles")
    print(f"Saved to {filename}")

    return filename


if __name__ == "__main__":
    fetch_rss_articles()
