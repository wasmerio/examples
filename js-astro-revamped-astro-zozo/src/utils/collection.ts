import { type CollectionEntry, getCollection, render } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export function getPostRouteSlug(post: PostEntry) {
	return post.data.slug ?? post.id;
}

export async function findPostByRouteSlug(slug: string) {
	const posts = await getCollection('posts');
	return posts.find((post) => getPostRouteSlug(post) === slug);
}

export async function getPosts(hidden?: boolean, sortByDate?: 'asc' | 'desc') {
	let allPosts = await getCollection('posts', ({ data }) => {
		if (typeof hidden === 'boolean') {
			return hidden ? data.hidden === true : data.hidden !== true;
		}
		return true;
	});
	if (sortByDate !== undefined) {
		const dir = sortByDate === 'asc' ? 1 : -1;
		allPosts = allPosts.sort((a, b) => {
			const aDate = a.data.lastmod ?? a.data.date;
			const bDate = b.data.lastmod ?? b.data.date;
			if (!aDate) return -dir;
			if (!bDate) return dir;
			return dir * (aDate.valueOf() - bDate.valueOf());
		});
	}
	return allPosts;
}

export { render };
