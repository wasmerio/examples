import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { getSite } from '../utils/consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const site = await getSite();
	return rss({
		title: site.title,
		description: site.description,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
