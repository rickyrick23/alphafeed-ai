<header class="topbar">
  <div class="left">
    <div class="breadcrumb">Pages ▸ Dashboard</div>
  </div>

  <div class="right">
    <input type="text" placeholder="Global search (Cmd + K)" />

    <div class="avatar">
      DS
    </div>
  </div>
</header>

<style>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-soft);
  background: var(--bg-dark);
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

input {
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  padding: 10px 14px;
  border-radius: 12px;
  color: white;
  width: 260px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(140deg,#3c6aff,#7bf7ff);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
