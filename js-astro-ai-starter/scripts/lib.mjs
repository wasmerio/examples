// Shared by the build-time AI scripts: one call to OneTag AI from Node, with a content-hash cache in .ai-cache/
// so the same text never costs tokens twice (commit the cache if you want CI builds to be free).
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// This key is designed to be public: the same one that ships in the site's HTML. Free key: https://onetagai.com
const KEY = process.env.PUBLIC_ONETAG_KEY || (await readEnv('PUBLIC_ONETAG_KEY'));
const SITE = process.env.PUBLIC_ONETAG_SITE || 'https://onetagai.com';

async function readEnv(name) {
	try {
		const env = await readFile(new URL('../.env', import.meta.url), 'utf8');
		const m = env.match(new RegExp('^' + name + '=(.*)$', 'm'));
		return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
	} catch { return ''; }
}

export function requireKey() {
	if (!KEY || /^YOUR_/.test(KEY)) {
		console.error('No OneTag AI key. Put PUBLIC_ONETAG_KEY in .env (free key: https://onetagai.com).');
		process.exit(1);
	}
}

export async function ask(prompt, input, { json = false, maxTokens = 400, system } = {}) {
	const hash = createHash('sha256').update(JSON.stringify([prompt, input, json, system])).digest('hex').slice(0, 24);
	const dir = new URL('../.ai-cache/', import.meta.url);
	const file = new URL(hash + '.json', dir);
	if (existsSync(file)) return JSON.parse(await readFile(file, 'utf8')).value;
	const res = await fetch(SITE + '/v1/ask', {
		method: 'POST', headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ key: KEY, prompt, input: [{ type: 'text', text: typeof input === 'string' ? input : JSON.stringify(input) }], json, max_tokens: maxTokens, system }),
	});
	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(body?.error?.message || 'HTTP ' + res.status);
	let value = body.text;
	if (json) value = JSON.parse(String(value).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
	await mkdir(dir, { recursive: true });
	await writeFile(file, JSON.stringify({ prompt: prompt.slice(0, 80), value }, null, 2));
	return value;
}

// Minimal frontmatter split/join that keeps the body byte-for-byte.
export function splitFrontmatter(src) {
	const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	return m ? { fm: m[1], body: src.slice(m[0].length), raw: m[0] } : { fm: '', body: src, raw: '' };
}
export function hasField(fm, name) { return new RegExp('^' + name + '\\s*:', 'm').test(fm); }
export function yamlString(s) { return JSON.stringify(String(s)); }
