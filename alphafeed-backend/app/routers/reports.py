from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
from datetime import datetime
from app.storage.report_generator import generate_portfolio_pdf, REPORT_DIR
# We import the portfolio logic to get fresh data
from app.routers.portfolio import get_portfolio 

router = APIRouter()

@router.get("/")
def list_reports():
    """Lists all generated PDF reports."""
    files = []
    if os.path.exists(REPORT_DIR):
        for f in os.listdir(REPORT_DIR):
            if f.endswith(".pdf"):
                path = os.path.join(REPORT_DIR, f)
                stats = os.stat(path)
                files.append({
                    "name": f,
                    "created": datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M'),
                    "size": f"{round(stats.st_size / 1024, 1)} KB"
                })
    return sorted(files, key=lambda x: x['created'], reverse=True)

@router.post("/generate")
def create_report():
    """Generates a new PDF based on current portfolio data."""
    data = get_portfolio() # Fetch live data
    filename = generate_portfolio_pdf(data)
    return {"status": "success", "filename": filename}

@router.get("/download/{filename}")
def download_report(filename: str):
    """Downloads a specific file."""
    file_path = os.path.join(REPORT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/pdf', filename=filename)
    return {"error": "File not found"}