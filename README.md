# AlphaFeed AI

AlphaFeed AI is a modern financial intelligence platform combining a Next.js frontend with a powerful FastAPI backend. It provides real-time market data, AI-driven insights, and portfolio management tools.

# Tech Stack

frontend
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS & Framer Motion
- Recharts & Lightweight Charts

backend
- Python 3.11+
- FastAPI
- Uvicorn (ASGI Server)
- yfinance (Market Data)
- Pandas (Data Processing)
- FPDF (Report Generation)
- Groq SDK (AI Inference)

# System Architecture

The AlphaFeed AI system is built on a high-performance, three-layer architecture designed for real-time financial analysis.

## 1. Real-Time Data Engine
Feature: Live Market Ingestion
Values are fetched in real-time using the yfinance library, which connects directly to global exchanges (NSE, BSE, NYSE, NASDAQ).
- Granularity: 15-minute intervals for intraday data, daily for historicals.
- Processing: Pandas DataFrames are used to clean, normalize, and calculate technical indicators (SMA, RSI) on the fly before they reach the frontend.

## 2. AI & Intelligence Layer (Groq + Llama 3.3)
Feature: Instant Market Reasoning
We utilize the Groq LPU (Language Processing Unit) to achieve sub-second inference speeds.
- Service: app/services/mistral_llm.py
- Model: Llama-3.3-70b-versatile (hosted on Groq).
- Logic: The system constructs a "Context Window" containing recent news and price action, then prompts the LLM to act as a quantitative analyst. It outputs structured JSON containing sentiment scores, executive summaries, and risk assessments.
- Why Groq?: Traditional CPU/GPU inference is too slow for real-time trading dashboards. Groq allows us to generate full reports in under 500ms.

## 3. Financial Reporting Module
Feature: PDF Generation
The system bypasses HTML-to-PDF converters and uses FPDF to programmatically draw reports. This ensures strict typing and zero rendering errors, producing investment-grade documents with headers, tables, and summaries.

# Prerequisites

Ensure you have the following installed on your system:
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- pip and npm

# Installation

Follow these steps to set up the project on a new system.

## Backend Setup

1. Open a terminal and navigate to the backend directory:
   cd alphafeed-backend

2. Create a virtual environment (recommended):
   python -m venv venv

   - Windows: venv\Scripts\activate
   - Mac/Linux: source venv/bin/activate

3. Install the required Python dependencies:
   pip install -r requirements.txt

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   cd alphafeed-web

2. Install the Node.js dependencies:
   npm install

# Running the System

You need to run both the backend and frontend servers simultaneously.

## 1. Start the Backend Server

Inside the `alphafeed-backend` directory, run:
python -m uvicorn app.main:app --reload

The API will be available at: http://localhost:8000
API Documentation (Swagger UI): http://localhost:8000/docs

## 2. Start the Frontend Application

Inside the `alphafeed-web` directory, run:
npm run dev

The web application will be accessible at: http://localhost:3000

# Project Structure

- alphafeed-backend/
  - app/
    - main.py: **Entry Point**. Initializes FastAPI, configures CORS, and mounts all routers.
    - models.py: Shared Pydantic models for request/response validation.
    - routers/              # API Endpoints
        - market.py: Real-time stock data (Macro, Candles, Sentiment) via yfinance.
        - auth.py: Handles "Connect Terminal" login logic (Mock JWT).
        - reports.py: Manages PDF generation/listing/downloading.
        - portfolio.py: Asset management (Add/List positions).
        - verifier.py: "Source Verifier" logic (Deep deep analysis properties).
        - intelligence.py: AI reasoning endpoints (Context-aware answers).
        - news.py, alerts.py, screener.py: Support modules for respective features.
    - services/             # Core Business Logic & AI
        - mistral_llm.py: **The Brain**. Connects to Groq to run Llama-3.3-70b/Mistral models for market reasoning.
        - groq_llm.py: Groq SDK integration wrapper.
        - response_schema.py: Defines strict JSON schemas for LLM outputs.
        - router.py, intent_detector.py: Helpers for query routing.
    - storage/
        - report_generator.py: FPDF logic to draw PDF reports pixel-perfectly.
        - files/: Directory where generated PDFs are saved.
    - nlp/
        - processor.py: Basic text preprocessing (TextBlob integration).

- alphafeed-web/
  - src/app/                # Next.js 16 App Directory (Routing)
    - page.tsx: **Landing Dashboard**. The main command center UI.
    - login/page.tsx: "Connect Terminal" authentication screen.
    - reports/page.tsx: Lists generated PDFs and provides download links.
    - portfolio/page.tsx: Asset management UI (Add/View holdings).
    - verifier/page.tsx: URL source verification tool.
    - intelligence/page.tsx: "Ask AlphaFeed" AI interface.
    - charts/page.tsx: Dedicated charting view.
    - screener/, alerts/, analysis/: Support pages.
  - src/components/         # Reusable UI Elements
    - standard UI components (Buttons, Cards, Inputs).
  - src/lib/
    - api.ts: Centralized Axios instance for backend communication.
  - package.json: Dependencies (framer-motion, recharts, lightweight-charts).

# Features

- Real-Time Market Data: Live stock prices and candlestick charts via yfinance.
- AI Intelligence: Context-aware market analysis.
- Portfolio Management: Add assets and track performance.
- PDF Reports: Generate and download professional investment summaries.
- Source Verification: Analyze news sources for bias and credibility.
