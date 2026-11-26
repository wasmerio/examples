/**
 * The RSS feed: the newest 50 posts, each with its summary (never the text) and its category. Posts hidden from
 * search engines are left out.
 */
import { feedItems, rssResponse } from "@astronomic/theme-core/feeds";
import { plainHeading } from "@astronomic/ui/lib/emphasis.ts";
import type { APIRoute } from "astro";
import { type Post, useContent } from "~/content";
import { strings } from "~/theme.strings";
import { siteOrigin } from "../utils/public-pages";
import { postHref } from "../utils/routes";
import { siteSettings } from "../utils/setup";

export const GET: APIRoute = async (context) => {
	const content = useContent();
	const [settings, { items: posts }] = await Promise.all([siteSettings(content), content.posts.list({ seo: true })]);
	const items = feedItems<Post, Post>(
		posts.filter((post) => !post.seo?.noindex),
		{
			item: (post) => ({
				title: plainHeading(post.title),
				path: postHref(post.slug),
				date: post.date,
				description: post.summary,
				categories: post.category ? [post.category.label] : [],
			}),
		},
	);
	return rssResponse({
		site: siteOrigin(context),
		title: strings.feed.title(settings.title),
		description: settings.tagline || strings.feed.description,
		items,
	});
};
