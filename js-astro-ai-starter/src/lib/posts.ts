import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(): Promise<Post[]> {
	const all = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function readingTime(body: string | undefined): number {
	const words = (body || '').replace(/[`*_#>\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 220));
}

export function tagSlug(tag: string): string {
	return tag.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}

export function formatDate(d: Date): string {
	return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
