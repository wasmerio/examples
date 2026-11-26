import { LOCAL_SITE_URL, SITE_DESCRIPTION, SITE_TITLE } from "@/constants";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
	const blog = await getCollection("blogs");
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site ?? LOCAL_SITE_URL,
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: new Date(post.data.publishedDate),
			description: post.data.excerpt,
			author: post.data.author,
			categories: post.data.tags,
			link: `/blog/${post.slug}/`,
		})),
	});
}
