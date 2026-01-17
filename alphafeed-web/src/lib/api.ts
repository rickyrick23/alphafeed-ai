const API_URL = "http://127.0.0.1:8000/api";

// --- 1. STOCK DATA ---
export async function fetchStockPrice(ticker: string) {
  try {
    const response = await fetch(`${API_URL}/stock/${ticker}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error);
    return null;
  }
}

export async function fetchMarketBatch(tickers: string[]) {
  const promises = tickers.map(ticker => fetchStockPrice(ticker));
  return await Promise.all(promises);
}

// --- 2. MACRO VIEW (Nifty, Gold, Oil) ---
export async function fetchMacroView() {
    try {
        const response = await fetch(`${API_URL}/macro`);
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return [];
    }
}

// --- 3. SYSTEM STATUS ---
export async function fetchSystemStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) throw new Error("Offline");
        return await response.json();
    } catch (error) {
        return { status: "Offline", latency: "---" };
    }
}

// --- 4. SOURCE VERIFIER (NLP Engine) ---
export async function verifySourceText(text: string) {
    try {
        const response = await fetch(`${API_URL}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return null;
    }
}

// --- 5. EARNINGS CALENDAR ---
export async function fetchEarningsCalendar() {
    try {
        const response = await fetch(`${API_URL}/calendar`);
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return [];
    }
}

// --- 6. ALERTS & SIGNALS ---
export async function fetchAlerts() {
    try {
        const response = await fetch(`${API_URL}/alerts`);
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function createAlert(alert: { ticker: string, condition: string, price: number }) {
    try {
        const response = await fetch(`${API_URL}/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert),
        });
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function deleteAlert(id: number) {
    try {
        await fetch(`${API_URL}/alerts/${id}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        return false;
    }
}

// --- 7. PORTFOLIO ENGINE ---
export async function fetchPortfolio() {
    try {
        const response = await fetch(`${API_URL}/portfolio`);
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return { holdings: [], total_value: 0, health_score: 0 };
    }
}

export async function addTrade(trade: { ticker: string, qty: number, avg_price: number }) {
    try {
        const response = await fetch(`${API_URL}/portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trade),
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding trade:", error);
        return null;
    }
}

// --- 8. LIVE NEWS (Marketaux) ---
export async function fetchLiveNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        return await response.json();
    } catch (error) {
        console.error("News fetch error:", error);
        return [];
    }
}

// --- 9. DEEP SCREENER ---
export async function runScreener(filters: any) {
    try {
        const response = await fetch(`${API_URL}/screener`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters),
        });
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        console.error("Screener error:", error);
        return [];
    }
}

// --- 10. SAVED REPORTS (New Feature) ---
export async function fetchReports() {
    try {
        const response = await fetch(`${API_URL}/reports`);
        if (!response.ok) throw new Error("Failed");
        return await response.json();
    } catch (error) {
        return [];
    }
}

export async function generateReport() {
    try {
        const response = await fetch(`${API_URL}/reports/generate`, { method: 'POST' });
        return await response.json();
    } catch (error) {
        return null;
    }
}

export function getDownloadUrl(filename: string) {
    return `${API_URL}/reports/download/${filename}`;
}