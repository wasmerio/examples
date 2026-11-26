import rss from "@astrojs/rss";
import { siteConfig } from "../config";
import { getCollection } from "astro:content";
import { filterPublishedPosts } from "../utils/posts";

export async function GET(context) {
	const collection = "blog";
	// id,slug,body,collection,data,render
	const blog = filterPublishedPosts(await getCollection(collection));
	return rss({
		// `<title>` field in output xml
		title: siteConfig.title,
		// `<description>` field in output xml
		description: siteConfig.description || siteConfig.slogan,
		// Pull in your project "site" from the endpoint context
		// https://docs.astro.build/en/reference/api-reference/#site
		site: context.site,
		// Array of `<item>`s in output xml
		// See "Generating items" section for examples using content collections and glob imports
		items: blog.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			link: new URL(`/blog/${post.id}/`, context.site).href,
			pubDate: post.data.date,
			content: post.body,
		})),
	});
}
