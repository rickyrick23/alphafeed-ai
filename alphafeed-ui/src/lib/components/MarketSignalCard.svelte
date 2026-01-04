<script lang="ts">
  export let ticker: string = "NVDA";
  export let conviction: string = "92% Conviction";
  export let title: string =
    "NVIDIA Announces New Blackwell Architecture Features";
  export let time: string = "2024-05-20 09:15";
  export let source: string = "TECHCRUNCH";
</script>

<div class="signal-card">
  <div class="top">
    <span class="badge ticker">{ticker}</span>
    <span class="badge conviction">{conviction}</span>
  </div>

  <div class="title">{title}</div>

  <div class="meta">
    <span>{time}</span>
    <span>•</span>
    <span>{source}</span>
  </div>
</div>

<style>
  .signal-card {
    background: #0f1629;
    border: 1px solid #223153;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .top {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .badge {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
  }

  .ticker {
    background: #12244a;
    color: #8fb5ff;
  }

  .conviction {
    background: #11361f;
    color: #57ff89;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    color: #e9eeff;
  }

  .meta {
    font-size: 11px;
    color: #9aa8c9;
    display: flex;
    gap: 6px;
  }
</style>
