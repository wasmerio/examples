#!/usr/bin/env node
// Writes alt text for images in posts that have none: ![](path) → ![alt text](path).
// Images are read from disk next to the post or from src/assets and public; remote images are skipped.
// Usage: npm run ai:alt   or   npm run ai:alt -- --dry
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { requireKey } from './lib.mjs';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';

requireKey();
const dry = process.argv.includes('--dry');
// This key is designed to be public: the same one that ships in the site's HTML.
const KEY = process.env.PUBLIC_ONETAG_KEY || (await readFile(new URL('../.env', import.meta.url), 'utf8').catch(() => '')).match(/^PUBLIC_ONETAG_KEY=(.*)$/m)?.[1]?.trim();
const SITE = 'https://onetagai.com';
const root = fileURLToPath(new URL('..', import.meta.url));
const dir = path.join(root, 'src/content/blog');
const files = (await readdir(dir)).filter((f) => /\.mdx?$/.test(f));
let changed = 0;

function resolveImage(ref, postFile) {
	if (/^https?:/.test(ref)) return null;
	const candidates = [path.resolve(dir, ref), path.join(root, 'src/assets', ref.replace(/^~\/assets\//, '')), path.join(root, 'public', ref.replace(/^\//, ''))];
	return candidates.find((p) => existsSync(p)) || null;
}

async function describe(file, context) {
	const data = await readFile(file);
	const hash = createHash('sha256').update(data).digest('hex').slice(0, 24);
	const cacheDir = path.join(root, '.ai-cache'); const cacheFile = path.join(cacheDir, 'alt-' + hash + '.json');
	if (existsSync(cacheFile)) return JSON.parse(await readFile(cacheFile, 'utf8')).value;
	const ext = path.extname(file).slice(1).toLowerCase(); const mime = ext === 'jpg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : 'image/' + ext;
	const res = await fetch(SITE + '/v1/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: KEY, prompt: 'Write alt text for this image as used in the blog post described. One sentence under 125 characters, no "image of", describe what matters for the post.', input: [{ type: 'text', text: 'Post context: ' + context }, { type: 'image', data_url: `data:${mime};base64,${data.toString('base64')}` }], max_tokens: 60 }) });
	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(body?.error?.message || 'HTTP ' + res.status);
	await mkdir(cacheDir, { recursive: true }); await writeFile(cacheFile, JSON.stringify({ value: body.text }));
	return body.text;
}

for (const f of files) {
	let src = await readFile(path.join(dir, f), 'utf8');
	const title = (src.match(/^title:\s*(.*)$/m) || [])[1] || f;
	const re = /!\[\s*\]\(([^)\s]+)(\s+"[^"]*")?\)/g;
	let m; const edits = [];
	while ((m = re.exec(src))) {
		const file = resolveImage(m[1], f);
		if (!file) { console.log(`${f}: skip ${m[1]} (not found locally)`); continue; }
		const alt = (await describe(file, title)).trim().replace(/[\[\]]/g, '');
		edits.push({ from: m[0], to: `![${alt}](${m[1]}${m[2] || ''})` });
		console.log(`${f}: ${m[1]} → "${alt}"`);
	}
	if (!edits.length) continue;
	for (const e of edits) src = src.replace(e.from, e.to);
	if (!dry) await writeFile(path.join(dir, f), src);
	changed++;
}
console.log(`\n${changed} file(s) ${dry ? 'would change' : 'updated'}.`);
