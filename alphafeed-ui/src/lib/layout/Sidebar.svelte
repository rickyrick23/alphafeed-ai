<script>
  export let active = "Dashboard";
</script>

<aside class="sidebar">
  <div class="logo">
    <span class="icon">🟦</span>
    <h1>AlphaFeed AI</h1>
  </div>

  <nav>
    <button class:selected={active === "Dashboard"}>Dashboard</button>
    <button>Market AI Chat</button>
    <button>Daily Briefings</button>
    <button>SEC Filings</button>

    <div class="section">Portfolio Tracking</div>
    <button>Sector Performance</button>
    <button>Alerts Hub</button>

    <div class="section">System</div>
    <button>Settings</button>
  </nav>
</aside>

<style>
.sidebar {
  width: 260px;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-soft);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

nav button {
  width: 100%;
  padding: 12px;
  background: transparent;
  border-radius: 12px;
  border: 1px solid transparent;
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

nav button:hover {
  background: var(--bg-panel-hover);
  border-color: var(--border-soft);
}

nav button.selected {
  background: linear-gradient(180deg, #1b2d55, #122143);
  border-color: rgba(100,150,255,.4);
  color: white;
  box-shadow: 0 0 10px rgba(90,150,255,0.4);
}

.section {
  opacity: .6;
  margin-top: 10px;
  font-size: 12px;
}
</style>
