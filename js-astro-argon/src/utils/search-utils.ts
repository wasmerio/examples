import { type CollectionEntry, getCollection } from "astro:content";
import { postIdToSlug } from "@utils/content-utils";
import { getPostUrlBySlug } from "@utils/url-utils";

export type SearchIndexItem = {
	url: string;
	title: string;
	description: string;
	tags: string[];
	category: string;
	content: string;
};

const SEARCH_CONTENT_MAX_LENGTH = 12000;

function normalizeSearchContent(content: string | undefined): string {
	return (content ?? "").replace(/\s+/g, " ").trim().slice(0, SEARCH_CONTENT_MAX_LENGTH);
}

function compareByPublishedDesc(
	a: CollectionEntry<"posts">,
	b: CollectionEntry<"posts">,
): number {
	return new Date(a.data.published) > new Date(b.data.published) ? -1 : 1;
}

function toSearchIndexItem(post: CollectionEntry<"posts">): SearchIndexItem {
	return {
		url: getPostUrlBySlug(postIdToSlug(post.id)),
		title: post.data.title,
		description: post.data.description ?? "",
		tags: post.data.tags ?? [],
		category:
			typeof post.data.category === "string" ? post.data.category.trim() : "",
		content: normalizeSearchContent(post.body),
	};
}

export async function getSearchIndexItems(options?: {
	includeDraft?: boolean;
}): Promise<SearchIndexItem[]> {
	const includeDraft = options?.includeDraft ?? !import.meta.env.PROD;
	const posts = await getCollection("posts", ({ data }) =>
		includeDraft ? true : data.draft !== true,
	);
	return posts.sort(compareByPublishedDesc).map(toSearchIndexItem);
}
