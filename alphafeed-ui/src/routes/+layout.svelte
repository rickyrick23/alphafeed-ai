<script lang="ts">
	import { page } from '$app/stores';

	const navItems = [
		{ label: 'Dashboard', path: '/' },
		{ label: 'Market AI Chat', path: '/market-ai-chat' },
		{ label: 'Daily Briefings', path: '/daily-briefings' },
		{ label: 'SEC Filings', path: '/sec-filings' },
		{ label: 'Sector Performance', path: '/sector-performance' },
		{ label: 'Alerts Hub', path: '/alerts-hub' }
	];

	// Returns TRUE when route is active
	const isActive = (path: string, current: string) =>
		current === path || current.startsWith(path + '/');
</script>

<div class="app-shell">
	<aside class="sidebar glass">
		<header class="logo">
			<span class="dot"></span>
			AlphaFeed AI
		</header>

		<nav>
			{#each navItems as item}
				<a
					href={item.path}
					class:selected={isActive(item.path, $page.url.pathname)}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>

	<main class="content">
		<slot />
	</main>
</div>

<style>
	:root {
		--surface: #0d111c;
		--panel: #0f1629;
		--accent: #4dd9ff;
		--accent-glow: rgba(77, 217, 255, 0.4);
		--text: #dbe4ff;
	}

	.app-shell {
		display: grid;
		grid-template-columns: 280px 1fr;
		height: 100vh;
		background: var(--surface);
		color: var(--text);
	}

	/* Glass Sidebar */
	.sidebar.glass {
		background: linear-gradient(180deg, rgba(13, 17, 28, 0.9), rgba(8, 10, 18, 0.95));
		border-right: 1px solid rgba(77, 217, 255, 0.15);
		box-shadow: inset -1px 0 12px rgba(0, 0, 0, 0.4);
		padding: 18px;
		display: flex;
		flex-direction: column;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 1.1rem;
		letter-spacing: 0.4px;
	}

	.logo .dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 10px var(--accent-glow);
		margin-right: 10px;
	}

	/* Navigation */
	nav {
		margin-top: 18px;
		display: grid;
		gap: 6px;
	}

	nav a {
		padding: 10px 12px;
			border-radius: 10px;
		text-decoration: none;
		color: #b6c2e2;
		font-size: 0.9rem;
		transition: 0.25s ease;
	}

	nav a:hover {
		background: rgba(77, 217, 255, 0.12);
		color: white;
		box-shadow: 0 0 8px rgba(77, 217, 255, 0.25);
		transform: translateX(2px);
	}

	nav a.selected {
		background: rgba(77, 217, 255, 0.22);
		color: white;
		border: 1px solid rgba(77, 217, 255, 0.35);
		box-shadow: 0 0 14px rgba(77, 217, 255, 0.4);
	}

	/* Main content */
	.content {
		overflow-y: auto;
		padding: 18px 22px;
	}
</style>
