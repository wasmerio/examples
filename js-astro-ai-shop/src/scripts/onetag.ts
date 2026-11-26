// Loads the OneTag AI SDK on first use, so it costs nothing until a visitor uses the Ask box.
// The key comes from PUBLIC_ONETAG_KEY (see .env.example for how to get one with a single curl).
// Public by design: it ships in the HTML like an analytics ID and can only spend this account's allowance.
declare global {
	interface Window {
		onetag?: any;
	}
}

let loading: Promise<any> | null = null;

// The shared demo key. This file only uses it on localhost, so the Ask box works right after
// `npm run dev`. Its small daily budget is shared by everyone: a deployed store needs its own key.
const DEMO_KEY = 'ot_demo000000000000000000000';
const isLocal = () => /^(|localhost|127\.0\.0\.1|\[::1\]|.+\.localhost)$/.test(location.hostname);

export function loadOneTag(): Promise<any> {
	if (window.onetag) return Promise.resolve(window.onetag);
	if (loading) return loading;
	const cfg = document.documentElement.dataset;
	loading = new Promise((resolve, reject) => {
		const s = document.createElement('script');
		s.src = (cfg.onetagSite || 'https://onetagai.com') + '/v1.js';
		const own = cfg.onetagKey && !/^YOUR_/i.test(cfg.onetagKey) ? cfg.onetagKey : '';
		s.dataset.key = own || (isLocal() ? DEMO_KEY : '');
		// Names this theme in OneTag AI's usage counts. Not sent anywhere else.
		s.dataset.via = 'astro-ai-shop';
		if (!own && isLocal()) console.info('[astro-ai-shop] No OneTag AI key set: using the shared demo key, which this theme only uses on localhost. Put your own free key in .env as PUBLIC_ONETAG_KEY before you deploy.');
		s.onload = () => resolve(window.onetag);
		s.onerror = () => {
			loading = null;
			reject(Object.assign(new Error('Could not load the AI script.'), { code: 'network' }));
		};
		document.head.append(s);
	});
	return loading;
}

export const MESSAGES: Record<string, string> = {
	no_key: 'Ask AI is not set up on this store yet (no OneTag AI key). The answers you need may be in the specs and questions on this page, or email the store.',
	bad_key: 'Ask AI is not set up correctly on this store (the OneTag AI key was not accepted).',
	quota_exceeded: 'This store has used up its AI allowance for now. Email the store instead.',
	paused: 'The AI service is paused for today. Try again after 00:00 UTC.',
	rate_limited: 'Too many questions in one minute. Give it a moment.',
	too_large: 'That question is too long.',
	network: 'Could not reach the AI service. Check your connection and try again.',
	upstream: 'The AI provider had a problem. Try again in a few seconds.',
	aborted: 'Stopped.',
};

export const describe = (e: any) => MESSAGES[e?.code] || e?.message || 'Something went wrong.';
