import type { APIContext } from 'astro';
import { site } from '../config';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const origin = context.site!.origin;
	const parts = [`# ${site.name}\n\n${site.description}\n`];
	for (const p of posts) {
		parts.push(`\n---\n\n# ${p.data.title}\n\nURL: ${origin}${base}/blog/${p.id}/\nDate: ${p.data.date.toISOString().slice(0, 10)}\n\n${p.body || ''}\n`);
	}
	return new Response(parts.join(''), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
