import type { CollectionEntry, render } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Page = CollectionEntry<'pages'>;
export type RenderedContent = Awaited<ReturnType<typeof render>>;
