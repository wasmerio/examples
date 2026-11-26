import type { MDXPost } from "@/types";

import { siteConfig } from "@/site-config";
import rss from "@astrojs/rss";

const posts: MDXPost[] = Object.values(import.meta.glob("../posts/*.mdx", { eager: true }));

export const GET = async () =>
	rss({
		description: siteConfig.description,
		items: posts.map((post) => ({
			...(post.frontmatter.updatedDate
				? { customData: `<updated>${new Date(post.frontmatter.updatedDate).toString()}</updated>` }
				: {}),
			description: post.frontmatter.description,
			link: `posts/${post.frontmatter.slug}`,
			pubDate: new Date(post.frontmatter.publishedDate),
			title: post.frontmatter.title,
		})),
		site: import.meta.env.SITE,
		title: siteConfig.title,
	});
