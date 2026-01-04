<script lang="ts">
  export let title: string;
  export let subtitle: string = "";
  export let value: string = "";
  export let delta: string = "";
</script>

<div class="card">
  <div class="card-header">
    <span class="title">{title}</span>
    {#if subtitle}
      <span class="subtitle">{subtitle}</span>
    {/if}
  </div>

  <div class="value-row">
    <span class="value">{value}</span>

    {#if delta}
      <span class="delta" class:positive={delta.startsWith('+')} class:negative={delta.startsWith('-')}>
        {delta}
      </span>
    {/if}
  </div>
</div>

<style>
  .card {
    background: linear-gradient(145deg, #0f1729, #0b111f);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 18px;
    min-height: 110px;

    transition: all .25s ease;
    box-shadow: 0 0 0 rgba(0,0,0,0);
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,.35);
    border-color: rgba(120,190,255,.35);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    opacity: .85;
    font-size: 12px;
    letter-spacing: .4px;
  }

  .title { color: #bcd2ff; }
  .subtitle { color: #8aa2c9; }

  .value-row {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .value {
    font-size: 26px;
    font-weight: 700;
    color: #f0f6ff;
  }

  .delta {
    font-size: 13px;
    font-weight: 600;
  }

  .positive { color: #2fe66b; }
  .negative { color: #ff6875; }
</style>
