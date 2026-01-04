<script lang="ts">
  export let value = 0;
  export let duration = 600;
  let display = 0;

  $: animate();

  async function animate() {
    const start = display;
    const diff = value - start;
    const steps = 24;

    for (let i = 0; i <= steps; i++) {
      await new Promise(r => setTimeout(r, duration / steps));
      display = start + diff * (i / steps);
    }
  }
</script>

<span>{display.toFixed(2)}</span>
