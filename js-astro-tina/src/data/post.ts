import type { MDXPost } from "@/types";

import { siteConfig } from "@/site-config";

/** returns the date of the post based on option in siteConfig.sortPostsByUpdatedDate */
export function getPostSortDate(post: MDXPost) {
	return siteConfig.sortPostsByUpdatedDate && post.frontmatter.updatedDate !== undefined
		? new Date(post.frontmatter.updatedDate)
		: new Date(post.frontmatter.publishedDate);
}

/** sort post by date (by siteConfig.sortPostsByUpdatedDate), desc.*/
export function sortMDByDate(posts: MDXPost[]) {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: MDXPost[]) {
	return posts.reduce<Record<string, MDXPost[]>>((acc, post) => {
		const year = getPostSortDate(post).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year]?.push(post);
		return acc;
	}, {});
}
