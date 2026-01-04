<script lang="ts">
  export let title: string;
  export let value: string;
  export let change: string;
  export let subtitle: string;
</script>

<div class="card">
  <div class="header">
    <span class="title">{title}</span>
  </div>

  <div class="value-row">
    <span class="value">{value}</span>
    <span class="change" class:positive={change.startsWith('+')} class:negative={change.startsWith('-')}>
      {change}
    </span>
  </div>

  <div class="subtitle">{subtitle}</div>
</div>

<style>
  .card {
    background: #0f1629;
    border: 1px solid #23304d;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 14px;
    color: #a9b4cc;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 6px;
  }

  .value {
    font-size: 26px;
    font-weight: 700;
    color: #ffffff;
  }

  .change {
    font-size: 14px;
    font-weight: 600;
  }

  .positive {
    color: #43ff9c;
  }

  .negative {
    color: #ff6b6b;
  }

  .subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: #7f8aad;
  }
</style>
