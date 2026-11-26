import fs from 'node:fs';
import path from 'node:path';
import { Site } from '../config';

const contentDir = './src/content';

/**
 * Minimal frontmatter extractor — reads only `hidden` and `slug` from the
 * YAML block at the top of a markdown file.  This avoids pulling in
 * `gray-matter` at config-parse time (where Astro's Content Collection API
 * is not yet available).
 */
function extractFrontmatter(raw: string): Record<string, unknown> {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) {
		return {};
	}
	const data: Record<string, unknown> = {};
	for (const line of match[1].split('\n')) {
		const sep = line.indexOf(':');
		if (sep === -1) {
			continue;
		}
		const key = line.slice(0, sep).trim();
		const value = line.slice(sep + 1).trim();
		if (key === 'hidden') {
			data.hidden = value === 'true';
		} else if (key === 'slug') {
			data.slug = value.replace(/^['"]|['"]$/g, '');
		}
	}
	return data;
}

async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) {
			yield* walk(entry);
		} else if (d.isFile()) {
			yield entry;
		}
	}
}

export interface MarkdownEntry {
	url: URL;
	file: { data: Record<string, unknown> };
}

export async function getMarkdownEntries(): Promise<MarkdownEntry[]> {
	const entries: MarkdownEntry[] = [];
	for await (const filePath of walk(contentDir)) {
		const ext = path.extname(filePath);
		if (ext !== '.md' && ext !== '.mdx') {
			continue;
		}
		const raw = await fs.promises.readFile(filePath, 'utf8');
		const data = extractFrontmatter(raw);
		const slug = (data.slug as string) ?? path.basename(filePath, ext);
		entries.push({
			url: new URL(`/posts/${slug}`, Site),
			file: { data },
		});
	}
	return entries;
}
