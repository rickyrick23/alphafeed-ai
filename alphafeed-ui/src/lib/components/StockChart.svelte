<script>
  import { onMount } from "svelte";

  export let ticker = "AAPL";
  export let price = "$184.52";
  export let change = "+2.45%";
  export let period = "1D";

  let buttons = ["1D","5D","1M","6M","YTD","1Y"];

  let ApexChart = null;

  // static demo values (UI-only for now)
  let series = [
    { name: "Price", data: [178.3,179.1,180.5,182.2,181.6,183.9,184.5] }
  ];

  let options = {
    chart: { type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.6, opacityTo: 0.1, stops: [0,90,100] }
    },
    colors: ["#6bb6ff"],
    grid: { borderColor: "#1f2b3a" },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { style: { colors: "#9fb4d1" } } },
    tooltip: { theme: "dark" }
  };

  function setRange(p) {
    period = p;
  }

  onMount(async () => {
    const m = await import("svelte-apexcharts");
    ApexChart = m.default;
  });
</script>

<div class="card">
  <header class="head">
    <div class="title">
      <h3>{ticker} <span>Intraday {period}</span></h3>
      <div class="price">{price} <span class="chg">{change}</span></div>
    </div>

    <div class="ranges">
      {#each buttons as p}
        <button class:active={p === period} on:click={() => setRange(p)}>
          {p}
        </button>
      {/each}
    </div>
  </header>

  <div class="chart">
    {#if ApexChart}
      <ApexChart {options} {series} height="280" />
    {/if}
  </div>
</div>

<style>
/* styling stays same */
</style>
