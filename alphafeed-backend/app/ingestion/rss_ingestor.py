import feedparser
from datetime import datetime
from pathlib import Path
import json
import hashlib

RAW_NEWS_DIR = Path("data/raw/news")
RAW_NEWS_DIR.mkdir(parents=True, exist_ok=True)

FEEDS_FILE = Path("data/sources/rss_feeds.json")


def load_feed_list():
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        feeds = json.load(f)

    # flatten categories into one list
    urls = []
    for _, group in feeds.items():
        urls.extend(group)

    return list(set(urls))  # remove duplicates


def normalize_id(entry):
    base = entry.get("id") or entry.get("link") or entry.get("title", "")
    return hashlib.md5(base.encode("utf-8")).hexdigest()


def fetch_rss_articles():
    feeds = load_feed_list()
    print(f"Fetching from {len(feeds)} RSS sources ...")

    seen_ids = set()
    articles = []

    for url in feeds:
        feed = feedparser.parse(url)
        print(f" → {url} ({len(feed.entries)} items)")

        for entry in feed.entries:
            uid = normalize_id(entry)
            if uid in seen_ids:
                continue

            seen_ids.add(uid)

            articles.append({
                "id": uid,
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

    print(f"\nSaved {len(articles)} unique articles → {filename}")
    return filename


if __name__ == "__main__":
    fetch_rss_articles()
