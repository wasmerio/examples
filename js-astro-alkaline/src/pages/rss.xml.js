// Do not touch this file: This file generates the RSS feed for your blog. It pulls in all posts from the collections specified in COLLECTION_NAMES_LIST and formats them into an RSS feed.

import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE, BLOG } from "@config";
import { COLLECTION_NAMES_LIST } from "../alkaline.config";

export async function GET(context) {
	const allPosts = await Promise.all(
		COLLECTION_NAMES_LIST.map(async (collection) => {
			const posts = await getCollection(collection);
			return posts.map((post) => ({ ...post, collection }));
		})
	);

	const items = allPosts
		.flat()
		.filter((post) => !post.data?.draft)
		.sort(
			(a, b) =>
				new Date(b.data?.pubDatetime || 0).valueOf() -
				new Date(a.data?.pubDatetime || 0).valueOf()
		)
		.map((post) => ({
			title: post.data?.title || "Untitled",
			pubDate: post.data?.pubDatetime
				? new Date(post.data.pubDatetime)
				: new Date(),
			description: post.data?.description || "",
			link: `${context.site}${post.collection}/${post.id}/`,
		}));

	return rss({
		title: SITE.title,
		description: BLOG.description || SITE.description,
		site: context.site,
		items: items,
		customData: `<language>${SITE.locale || "en-us"}</language>`,
	});
}
