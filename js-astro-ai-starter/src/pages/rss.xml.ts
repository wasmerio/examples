import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
	const posts = await getPosts();
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	return rss({
		title: site.name,
		description: site.description,
		site: context.site!,
		items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `${base}/blog/${p.id}/` })),
	});
}
