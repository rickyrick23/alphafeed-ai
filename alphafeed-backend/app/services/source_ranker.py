TRUSTED_SOURCES = {

# --- TIER 1 (95+) ---
"reuters.com": 95,
"bloomberg.com": 95,
"wsj.com": 94,
"ft.com": 94,
"economist.com": 93,
"sec.gov": 98,
"federalreserve.gov": 98,
"worldbank.org": 97,
"imf.org": 97,
"bis.org": 97,
"oecd.org": 97,

# --- TIER 2 (90+) ---
"cnbc.com": 90,
"marketwatch.com": 90,
"investopedia.com": 90,
"nasdaq.com": 90,
"nytimes.com": 92,
"forbes.com": 90,
"fortune.com": 90,
"morningstar.com": 90,
"seekingalpha.com": 88,
"benzinga.com": 88,

# --- INDIA ---
"moneycontrol.com": 88,
"livemint.com": 88,
"economictimes.com": 88,
"business-standard.com": 88,
"thehindubusinessline.com": 88,
"ndtvprofit.com": 87,
"bqprime.com": 87,
"cnbctv18.com": 87,
"zeebiz.com": 86,
"financialexpress.com": 86,

# --- CRYPTO ---
"coindesk.com": 85,
"cointelegraph.com": 85,
"cryptoslate.com": 83,
"decrypt.co": 83,
"coinmarketcap.com": 85,
"coingecko.com": 85,
"news.bitcoin.com": 80,
"cryptonews.com": 80,

# --- COMMODITIES ---
"kitco.com": 88,
"metal.com": 85,
"mining.com": 85,
"oilprice.com": 85,
"platts.com": 90,
"argusmedia.com": 90,
"eia.gov": 95,
"iea.org": 95,
"worldoil.com": 85,
"energyvoice.com": 83,

# --- FOREX ---
"fxstreet.com": 85,
"forexlive.com": 85,
"dailyfx.com": 87,
"oanda.com": 90,
"ig.com": 90,
"tradingeconomics.com": 90,

# --- STOCK EXCHANGES ---
"nseindia.com": 98,
"bseindia.com": 98,
"nyse.com": 98,
"nasdaq.com": 98,
"lse.co.uk": 98,
"hkex.com.hk": 98,
"eurex.com": 97,

# --- BANKS ---
"jpmorgan.com": 95,
"goldmansachs.com": 95,
"morganstanley.com": 95,
"hsbc.com": 94,
"barclays.com": 94,
"ubs.com": 94,
"credit-suisse.com": 93,

# --- DATA PROVIDERS ---
"refinitiv.com": 97,
"factset.com": 97,
"snpglobal.com": 97,
"moody's.com": 97,
"fitchratings.com": 97,

# --- GLOBAL MEDIA ---
"bbc.com": 90,
"aljazeera.com": 88,
"apnews.com": 88,
"theguardian.com": 88,
"washingtonpost.com": 90
}

LOW_TRUST = [
"medium","substack","wordpress","blogspot",
"reddit","twitter","telegram","youtube",
"facebook","quora","discord"
]


def score_source(url: str) -> int:
    url = url.lower()

    for domain, score in TRUSTED_SOURCES.items():
        if domain in url:
            return score

    if any(x in url for x in LOW_TRUST):
        return 35

    return 60   # unknown source
