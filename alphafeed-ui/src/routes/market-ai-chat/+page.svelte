<script lang="ts">
	import { onDestroy } from 'svelte';
	import { chatHistory, type ChatMessage } from '$lib/stores/chatStore';

	let newMessage = '';
	let messages: ChatMessage[] = [];

	// subscribe to persistent chat store
	const unsub = chatHistory.subscribe((v) => (messages = v));
	onDestroy(unsub);

	async function sendMessage() {
		const text = newMessage.trim();
		if (!text) return;

		// add user message
		chatHistory.update((m) => [
			...m,
			{ user: 'human', text, time: new Date().toLocaleTimeString() }
		]);

		newMessage = '';

		try {
			// call Python FastAPI backend
			const res = await fetch('http://127.0.0.1:8000/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text })
			});

			const data = await res.json();

			// add assistant reply
			chatHistory.update((m) => [
				...m,
				{ user: 'assistant', text: data.reply, time: new Date().toLocaleTimeString() }
			]);
		} catch (err) {
			chatHistory.update((m) => [
				...m,
				{
					user: 'assistant',
					text: '⚠️ Backend not reachable. Make sure FastAPI is running.',
					time: new Date().toLocaleTimeString()
				}
			]);
		}
	}
</script>

<div class="chat-container">
	<h2>Market AI Chat</h2>
	<p class="subtitle">Ask questions about stocks, news, sectors & trends</p>

	<div class="chat-panel">
		{#if messages.length === 0}
			<div class="empty-state">
				<span class="icon">⚡</span>
				<p><strong>Ask anything like:</strong></p>
				<ul>
					<li>What is the sentiment on AAPL today?</li>
					<li>Summarize today’s market news</li>
					<li>Explain NVIDIA earnings in simple terms</li>
				</ul>
			</div>
		{/if}

		{#each messages as m}
			<div class="msg {m.user}">
				<div class="bubble">
					{@html m.text.replace(/\n/g, '<br>')}
					<div class="time">{m.time}</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="input-row">
		<input
			bind:value={newMessage}
			placeholder="Type your question..."
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button on:click={sendMessage}>Send</button>
	</div>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
	}

	.subtitle {
		opacity: 0.7;
		margin-bottom: 0.25rem;
	}

	.chat-panel {
		flex: 1;
		border: 1px solid #1e2a3a;
		 border-radius: 14px;
		padding: 1rem;
		overflow-y: auto;
		background: linear-gradient(145deg, #0d1220, #0b0f18);
	}

	.empty-state {
		text-align: center;
		opacity: 0.8;
		margin-top: 2rem;
	}

	.icon {
		font-size: 32px;
	}

	.msg {
		display: flex;
		margin-bottom: 10px;
	}

	.msg.human {
		justify-content: flex-end;
	}

	.msg.assistant {
		justify-content: flex-start;
	}

	.bubble {
		max-width: 60%;
		padding: 10px 14px;
		border-radius: 12px;
		white-space: pre-line;
	}

	.msg.human .bubble {
		background: #1b4fff;
		color: white;
		border-top-right-radius: 4px;
	}

	.msg.assistant .bubble {
		background: #0f1a2e;
		border: 1px solid #1f2c42;
		color: #cfd9ff;
		border-top-left-radius: 4px;
	}

	.time {
		font-size: 11px;
		opacity: 0.6;
		margin-top: 4px;
	}

	.input-row {
		display: flex;
		gap: 8px;
		margin-top: 6px;
	}

	input {
		flex: 1;
		border-radius: 10px;
		padding: 10px;
		border: 1px solid #1e2a3a;
		background: #0d1220;
		color: white;
	}

	button {
		padding: 10px 16px;
		border-radius: 10px;
		background: #1b4fff;
		border: none;
		color: white;
		cursor: pointer;
	}
</style>
