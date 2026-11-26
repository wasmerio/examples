import { getPostSlug, getPostsForLocale } from "@/data/post";
import { localizedPath, messages } from "@/i18n/config";
import { siteConfig } from "@/site-config";
import { absoluteUrl } from "@/utils/path";
import rss from "@astrojs/rss";

export const GET = async () => {
	const posts = await getPostsForLocale("zh");

	return rss({
		title: `${siteConfig.title} · ${messages.zh.posts}`,
		description: messages.zh.homeDescription,
		site: absoluteUrl(localizedPath("zh", "/"), import.meta.env.SITE),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishDate,
			link: `posts/${getPostSlug(post)}/`,
		})),
	});
};
