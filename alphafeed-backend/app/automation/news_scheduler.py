from apscheduler.schedulers.background import BackgroundScheduler
from app.ingestion.rss_ingestor import fetch_rss_articles
from app.nlp.processor import process_file
from app.storage.index_builder import index_file
import time

def job():
    print("🔄 Auto news refresh started...")
    
    raw_file = fetch_rss_articles()
    processed_file = process_file(raw_file)
    index_file(processed_file)
    
    print("✅ Pipeline completed")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(job, 'interval', minutes=5)
    scheduler.start()
    
    print("⏰ Scheduler running (every 5 mins)")

    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        scheduler.shutdown()
