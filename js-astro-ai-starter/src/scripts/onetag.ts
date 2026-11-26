// Loads the OneTag SDK the first time an AI feature is used, so pages ship no extra script by default.
// The key and site come from data attributes on <html>, set by the layout from src/config.ts.
// This key is designed to be public: it ships in the HTML like an analytics ID and can only spend this account's allowance.
declare global {
	interface Window {
		onetag?: { ask: (prompt: string, input?: unknown, options?: Record<string, unknown>) => Promise<any>; OneTagError: any };
	}
}

let loading: Promise<NonNullable<Window['onetag']>> | null = null;

// The shared demo key. It answers on localhost only by this file's choice, so the AI features work
// right after `npm run dev`. Its small daily budget is shared by everyone: a deployed site needs its own key.
const DEMO_KEY = 'ot_demo000000000000000000000';
const isLocal = () => /^(|localhost|127\.0\.0\.1|\[::1\]|.+\.localhost)$/.test(location.hostname);

function ownKey(): string {
	const key = document.documentElement.dataset.onetagKey || '';
	return key.length > 0 && !/^YOUR_/i.test(key) ? key : '';
}

// True when the AI features can answer: the site has its own key, or this is localhost.
export function hasKey(): boolean {
	return ownKey() !== '' || isLocal();
}

export function loadOnetag(): Promise<NonNullable<Window['onetag']>> {
	if (window.onetag) return Promise.resolve(window.onetag);
	if (loading) return loading;
	const root = document.documentElement.dataset;
	if (!hasKey()) return Promise.reject(new Error('no_key'));
	loading = new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = (root.onetagSite || 'https://onetagai.com') + '/v1.js';
		s.dataset.key = ownKey() || DEMO_KEY;
		// Names this template in OneTag AI's usage counts. Not sent anywhere else.
		s.dataset.via = 'astro-ai-starter';
		if (!ownKey()) console.info('[astro-ai-starter] No OneTag AI key set: using the shared demo key, which this template only uses on localhost. Put your own free key in .env as PUBLIC_ONETAG_KEY before you deploy.');
		s.onload = () => (window.onetag ? resolve(window.onetag) : reject(new Error('sdk_missing')));
		s.onerror = () => reject(new Error('network'));
		document.head.appendChild(s);
	});
	return loading;
}

export const MESSAGES: Record<string, string> = {
	no_key: 'AI is not set up on this site yet: the owner needs to add a OneTag AI key.',
	quota_exceeded: 'This site has used its AI allowance for now.',
	rate_limited: 'Too many requests at once. Try again in a moment.',
	network: 'Could not reach the AI service. Check your connection and try again.',
	aborted: 'Stopped.',
};

export function errorText(e: any): string {
	const code = e?.code || e?.message;
	return MESSAGES[code] || 'Something went wrong. Try again.';
}

// The page's main text, for features that read the current post.
export function pageText(selector = 'article'): string {
	const el = document.querySelector<HTMLElement>(selector) || document.body;
	return (el.innerText || el.textContent || '').trim();
}
