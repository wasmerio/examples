import type { MDXInstance } from "astro";

export interface SiteConfig {
	author: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
	description: string;
	lang: string;
	ogLocale: string;
	sortPostsByUpdatedDate: boolean;
	title: string;
}

export interface PaginationLink {
	srLabel?: string;
	text?: string;
	url: string;
}

export interface SiteMeta {
	articleDate?: string | undefined;
	description?: string;
	ogImage?: string | undefined;
	title: string;
}

export interface PostFrontmatter {
	description: string;
	draft: boolean;
	minutesRead: string;
	publishedDate: string;
	slug: string;
	title: string;
	updatedDate?: string;
}

export type MDXPost = MDXInstance<PostFrontmatter>;
