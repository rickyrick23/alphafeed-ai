<script>
  export let label = "";
  export let value = "";
  export let delta = "";
  export let hint = "";
</script>

<div class="card">
  <div class="label">{label}</div>

  <div class="value">
    {value}
    {#if delta}
      <span class="delta">{delta}</span>
    {/if}
  </div>

  <div class="hint">{hint}</div>
</div>

<style>
.card {
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  opacity: .8;
}

.value {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  gap: 8px;
  align-items: center;
}

.delta {
  color: #4effa3;
  font-size: 14px;
}

.hint {
  font-size: 12px;
  opacity: .6;
}
</style>
