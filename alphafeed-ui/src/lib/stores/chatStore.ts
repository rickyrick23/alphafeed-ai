import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type ChatMessage = {
	user: 'human' | 'assistant';
	text: string;
	time: string;
};

// load from localStorage only in browser
const stored = browser
	? JSON.parse(localStorage.getItem('chat-history') || '[]')
	: [];

export const chatHistory = writable<ChatMessage[]>(stored);

// persist only in browser
if (browser) {
	chatHistory.subscribe((val) => {
		localStorage.setItem('chat-history', JSON.stringify(val));
	});
}
