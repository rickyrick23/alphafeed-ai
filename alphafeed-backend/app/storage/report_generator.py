from fpdf import FPDF
import os
from datetime import datetime

# Ensure the reports folder exists
REPORT_DIR = os.path.join(os.getcwd(), "data", "reports")
os.makedirs(REPORT_DIR, exist_ok=True)

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'AlphaFeed AI - Financial Analysis Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_portfolio_pdf(portfolio_data):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # 1. TITLE & DATE
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, f"Portfolio Snapshot: {datetime.now().strftime('%Y-%m-%d')}", 0, 1)
    pdf.ln(5)

    # 2. SUMMARY METRICS
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, f"Total Net Worth: ${portfolio_data.get('net_worth', 0):,}", 0, 1)
    pdf.cell(0, 10, f"Portfolio Health Score: {portfolio_data.get('health_score', 0)}/10", 0, 1)
    pdf.cell(0, 10, f"AI Risk Warning: {portfolio_data.get('risk_warning', 'None')}", 0, 1)
    pdf.ln(10)

    # 3. HOLDINGS TABLE HEADER
    pdf.set_font("Arial", "B", 10)
    pdf.set_fill_color(200, 220, 255)
    pdf.cell(40, 10, "Ticker", 1, 0, 'C', 1)
    pdf.cell(30, 10, "Qty", 1, 0, 'C', 1)
    pdf.cell(40, 10, "Price", 1, 0, 'C', 1)
    pdf.cell(40, 10, "Value", 1, 0, 'C', 1)
    pdf.cell(40, 10, "Risk Level", 1, 1, 'C', 1)

    # 4. HOLDINGS ROWS
    pdf.set_font("Arial", size=10)
    for asset in portfolio_data.get("holdings", []):
        pdf.cell(40, 10, str(asset.get("ticker")), 1)
        pdf.cell(30, 10, str(asset.get("qty")), 1)
        pdf.cell(40, 10, f"${asset.get('price', 0)}", 1)
        pdf.cell(40, 10, f"${asset.get('value', 0):,}", 1)
        pdf.cell(40, 10, str(asset.get("risk_level")), 1, 1)

    # 5. SAVE FILE
    filename = f"Portfolio_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(REPORT_DIR, filename)
    pdf.output(filepath)
    
    return filename