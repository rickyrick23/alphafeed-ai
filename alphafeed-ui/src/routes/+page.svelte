<script lang="ts">
  import StatCard from '$lib/components/StatCard.svelte';
  import ChartPlaceholder from '$lib/components/ChartPlaceholder.svelte';
  import MarketSignalCard from '$lib/components/MarketSignalCard.svelte';
</script>

<div class="page-header">
  <div class="breadcrumbs">
    <span>Pages</span> › <strong>Dashboard</strong>
  </div>
</div>

<h2>Dashboard</h2>

<!-- ====== METRIC CARDS ====== -->
<div class="stats-grid">
  <StatCard title="Market Sentiment" value="78%" change="+12%" subtitle="Optimistic" />
  <StatCard title="Active Alerts" value="14" change="-2" subtitle="Last 24h" />
  <StatCard title="Volatility Index" value="16.4" change="-5.2%" subtitle="Low Range" />
  <StatCard title="Data Points Processed" value="1.2M" change="+18%" subtitle="Real-time" />
</div>

<!-- ====== MAIN LAYOUT (Chart + Signal Stream) ====== -->
<div class="two-column">

  <!-- LEFT — CHART -->
  <div class="left">
    <ChartPlaceholder />
  </div>

  <!-- RIGHT — SIGNAL STREAM -->
  <div class="right">
    <div class="panel-header">
      <h3>Market Signal Stream</h3>
      <span class="updated">Live Feed</span>
    </div>

    <div class="signal-panel">
      <div class="signal-scroll">
        <MarketSignalCard />
        <MarketSignalCard
          ticker="AAPL"
          conviction="78% Conviction"
          title="Apple Faces Fresh Antitrust Scrutiny in EU"
          time="2024-05-20 10:30"
          source="BLOOMBERG"
        />
        <MarketSignalCard
          ticker="TSLA"
          conviction="81% Conviction"
          title="Tesla Rallies as Delivery Numbers Beat Estimates"
          time="2024-05-20 09:48"
          source="REUTERS"
        />
        <MarketSignalCard
          ticker="HDFCBANK"
          conviction="69% Conviction"
          title="HDFC Bank Reports Strong Q3 Credit Growth"
          time="2024-05-20 08:55"
          source="MONEYCONTROL"
        />
      </div>
    </div>
  </div>
</div>

<!-- ====== BOTTOM SECTION ====== -->
<h3 class="section-title">Market Heat & Trends</h3>

<div class="bottom-grid">
  <div class="trend-card">
    🔥 Top Gainers Today
    <ul>
      <li>INFY — +3.8%</li>
      <li>RELIANCE — +2.5%</li>
      <li>TCS — +2.1%</li>
    </ul>
  </div>

  <div class="trend-card">
    🚨 Top Losers Today
    <ul>
      <li>ADANIPORTS — −4.2%</li>
      <li>HINDALCO — −3.1%</li>
      <li>ONGC — −2.6%</li>
    </ul>
  </div>

  <div class="trend-card">
    📊 Sector Momentum
    <ul>
      <li>IT — Bullish</li>
      <li>Banking — Neutral</li>
      <li>Energy — Bearish</li>
    </ul>
  </div>
</div>

<style>
  h2 { margin-top: 8px; margin-bottom: 10px; }

  .page-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;
  }

  .breadcrumbs { color: #9aa6c1; font-size: 14px; }

  /* ===== TOP METRIC GRID ===== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 8px;
  }

  /* ===== TWO COLUMN LAYOUT ===== */
  .two-column {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 18px;
    margin-top: 18px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .updated { font-size: 11px; color: #8da1ce; }

  /* ===== SIGNAL STREAM PANEL ===== */
  .signal-panel {
    background: #0f1629;
    border: 1px solid #223153;
    border-radius: 14px;
    padding: 10px;
    height: 360px;
    display: flex;
    flex-direction: column;
  }

  .signal-scroll {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-right: 4px;
  }

  .signal-scroll::-webkit-scrollbar { width: 6px; }
  .signal-scroll::-webkit-scrollbar-thumb {
    background: #2f3f63; border-radius: 6px;
  }

  /* ===== BOTTOM CARDS ===== */
  .section-title {
    margin-top: 18px;
    margin-bottom: 8px;
    color: #cfd8ff;
  }

  .bottom-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .trend-card {
    background: #0f1629;
    border: 1px solid #223153;
    border-radius: 14px;
    padding: 14px;
    font-size: 14px;
    color: #dfe6ff;
  }

  .trend-card ul {
    margin-top: 6px;
    opacity: .85;
  }
</style>
