import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from "@i18n/sections";
import { defaultLang } from "@i18n/ui";

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: site.title[defaultLang],
		description: site.description[defaultLang],
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
