import type { APIContext } from 'astro';
import { site } from '../config';
import { getPosts } from '../lib/posts';

// Index of the site for AI tools and for the site's own "Ask the blog" fallback and "Read next".
export async function GET(context: APIContext) {
	const posts = await getPosts();
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const origin = context.site!.origin;
	const lines = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		`Author: ${site.author.name}. ${site.author.bio}`,
		'',
		'## Posts',
		'',
		...posts.map((p) => `- [${p.data.title}](${origin}${base}/blog/${p.id}/): ${p.data.description}${p.data.tags.length ? ` (${p.data.tags.join(', ')})` : ''}`),
		'',
		'## Full text',
		'',
		`- [llms-full.txt](${origin}${base}/llms-full.txt): every post in one file`,
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
