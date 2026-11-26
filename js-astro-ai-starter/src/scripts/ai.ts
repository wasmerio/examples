import { loadOnetag, errorText, hasKey } from './onetag';

export { hasKey, errorText };

export type AskOptions = { stream?: (delta: string) => void; json?: boolean; system?: string; history?: { role: 'user' | 'assistant'; content: string }[]; maxTokens?: number; signal?: AbortSignal };

// One call, with the SDK loaded on demand. Throws an Error with .code for the UI to translate.
export async function ask(prompt: string, input?: unknown, options: AskOptions = {}): Promise<any> {
	let sdk;
	try {
		sdk = await loadOnetag();
	} catch (e: any) {
		const err: any = new Error(e?.message || 'network');
		err.code = e?.message || 'network';
		throw err;
	}
	return sdk.ask(prompt, input, options);
}

// Session cache so the same request does not spend tokens twice while the reader is here.
export function cached<T>(key: string, make: () => Promise<T>): Promise<T> {
	try {
		const hit = sessionStorage.getItem('ai:' + key);
		if (hit) return Promise.resolve(JSON.parse(hit));
	} catch (e) {}
	return make().then((v) => {
		try { sessionStorage.setItem('ai:' + key, JSON.stringify(v)); } catch (e) {}
		return v;
	});
}

export function hashText(s: string): string {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
	return (h >>> 0).toString(36);
}

// Block elements of an article that carry prose. Code and its wrappers are left alone.
export function proseBlocks(root: HTMLElement): HTMLElement[] {
	const out: HTMLElement[] = [];
	for (const el of root.querySelectorAll<HTMLElement>('p, h2, h3, h4, li, blockquote > p, td, th, figcaption')) {
		if (el.closest('pre, code, .no-translate, [data-ai-ui]')) continue;
		if (el.matches('li') && el.querySelector('p, li')) continue;
		if (el.matches('blockquote > p') && out.includes(el)) continue;
		if (!el.textContent || !el.textContent.trim()) continue;
		out.push(el);
	}
	return out;
}

// Rewrites every prose block in place (translation or plain-English), in batches, keeping inline tags.
export async function rewriteBlocks(root: HTMLElement, instruction: string, onProgress?: (done: number, total: number) => void): Promise<void> {
	const blocks = proseBlocks(root);
	if (!root.dataset.original) root.dataset.original = root.innerHTML;
	const batches: HTMLElement[][] = [];
	let cur: HTMLElement[] = []; let size = 0;
	for (const b of blocks) {
		const len = b.innerHTML.length;
		if (cur.length && size + len > 6000) { batches.push(cur); cur = []; size = 0; }
		cur.push(b); size += len;
	}
	if (cur.length) batches.push(cur);
	let done = 0;
	for (const batch of batches) {
		const payload = { blocks: batch.map((b) => b.innerHTML) };
		const res = await ask(
			instruction + ' You receive JSON {"blocks": [html, ...]}. Return JSON {"blocks": [...]} with exactly the same number of items in the same order. Keep every HTML tag, attribute, link and inline <code> exactly as given; change only the human-readable text. Do not add or remove items.',
			payload,
			{ json: true, maxTokens: 4000 },
		);
		const out = Array.isArray(res?.blocks) ? res.blocks : null;
		if (!out || out.length !== batch.length) throw Object.assign(new Error('bad_json'), { code: 'bad_json' });
		batch.forEach((b, i) => { b.innerHTML = String(out[i]).replace(/<script[\s\S]*?<\/script>/gi, ''); });
		done += batch.length;
		onProgress?.(done, blocks.length);
	}
}

export function restoreBlocks(root: HTMLElement): void {
	if (root.dataset.original) { root.innerHTML = root.dataset.original; }
}

export function copyText(text: string, button?: HTMLElement): void {
	navigator.clipboard?.writeText(text).then(() => {
		if (!button) return;
		const old = button.textContent; button.textContent = 'Copied';
		setTimeout(() => (button.textContent = old), 1200);
	});
}
