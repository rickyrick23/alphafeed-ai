from fpdf import FPDF
import os
from datetime import datetime

REPORT_DIR = os.path.join(os.path.dirname(__file__), "files")
if not os.path.exists(REPORT_DIR):
    os.makedirs(REPORT_DIR)

class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'AlphaFeed Investment Report', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_portfolio_pdf(portfolio_data):
    pdf = PDFReport()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Timestamp
    pdf.cell(200, 10, txt=f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.ln(10)
    
    # Summary
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Portfolio Summary", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Total Value: ${portfolio_data.get('total_value', 0)}", ln=True)
    pdf.cell(200, 10, txt=f"Daily Change: {portfolio_data.get('daily_change', 0)}%", ln=True)
    
    pdf.ln(10)
    
    # Positions Table
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Active Positions", ln=True)
    pdf.ln(5)
    
    # Table Header
    pdf.set_font("Arial", 'B', 10)
    pdf.cell(40, 10, "Ticker", 1)
    pdf.cell(40, 10, "Qty", 1)
    pdf.cell(40, 10, "Avg Price", 1)
    pdf.cell(40, 10, "Value", 1)
    pdf.ln()
    
    # Table Rows
    pdf.set_font("Arial", size=10)
    positions = portfolio_data.get('positions', [])
    if not positions:
        pdf.cell(160, 10, "No active positions found.", 1, ln=True)
    else:
        for pos in positions:
            pdf.cell(40, 10, str(pos.get('ticker', 'N/A')), 1)
            pdf.cell(40, 10, str(pos.get('shares', 0)), 1)
            pdf.cell(40, 10, f"${pos.get('avg_price', 0)}", 1)
            pdf.cell(40, 10, f"${pos.get('current_value', 0)}", 1)
            pdf.ln()

    # Save
    filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath = os.path.join(REPORT_DIR, filename)
    pdf.output(filepath)
    
    return filename