#!/usr/bin/env node
// Fills in missing frontmatter for posts: description, tags, and takeaways (3 bullets).
// Usage: npm run ai:meta            (writes files)
//        npm run ai:meta -- --dry   (prints what it would write)
//        npm run ai:meta -- --takeaways   (also add takeaways to posts that have none)
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { ask, requireKey, splitFrontmatter, hasField, yamlString } from './lib.mjs';

requireKey();
const dry = process.argv.includes('--dry');
const wantTakeaways = process.argv.includes('--takeaways');
const dir = new URL('../src/content/blog/', import.meta.url);
const files = (await readdir(dir)).filter((f) => /\.mdx?$/.test(f));
let changed = 0;

for (const f of files) {
	const src = await readFile(new URL(f, dir), 'utf8');
	const { fm, body, raw } = splitFrontmatter(src);
	const need = { description: !hasField(fm, 'description'), tags: !hasField(fm, 'tags'), takeaways: wantTakeaways && !hasField(fm, 'takeaways') };
	if (!need.description && !need.tags && !need.takeaways) continue;
	const title = (fm.match(/^title:\s*(.*)$/m) || [])[1] || f;
	const res = await ask(
		'For this blog post, return JSON {"description": string, "tags": [string], "takeaways": [string]}. description: one or two sentences under 160 characters, specific, no hype. tags: 1 to 3 lowercase single words or hyphenated words a blog would use. takeaways: three short sentences a reader should remember, each under 100 characters.',
		`Title: ${title}\n\n${body.slice(0, 12000)}`,
		{ json: true, maxTokens: 400 },
	);
	let add = '';
	if (need.description && res.description) add += `description: ${yamlString(res.description)}\n`;
	if (need.tags && Array.isArray(res.tags) && res.tags.length) add += `tags: [${res.tags.map((t) => String(t).toLowerCase()).join(', ')}]\n`;
	if (need.takeaways && Array.isArray(res.takeaways) && res.takeaways.length) add += `takeaways:\n${res.takeaways.map((t) => '  - ' + yamlString(t)).join('\n')}\n`;
	if (!add) continue;
	console.log(`\n${f}\n${add.trimEnd()}`);
	if (!dry) {
		const next = raw ? `---\n${fm}\n${add}---\n${body}` : `---\n${add}---\n${body}`;
		await writeFile(new URL(f, dir), next);
	}
	changed++;
}
console.log(`\n${changed} file(s) ${dry ? 'would change' : 'updated'}.`);
