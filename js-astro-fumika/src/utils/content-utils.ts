import { type CollectionEntry, getCollection } from "astro:content";
import { DEFAULT_LANG, SUPPORTED_LANG } from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { getTranslation } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "@/config";
import type { GetSortedPosts } from "@/types/config";

const CONFIG_BASE_LANG = siteConfig.lang.replace("_", "-");

export type EnrichedPost = CollectionEntry<"posts"> & {
	data: CollectionEntry<"posts">["data"] & {
		actualLang: string;
		isFallback: boolean;
		nextSlug?: string;
		nextTitle?: string;
		prevSlug?: string;
		prevTitle?: string;
	};
};

export function normalizeLangTag(lang: string): string {
	return lang.toLowerCase().replace("_", "-");
}

function parsePostId(id: string) {
	const parts = id.split("/");
	if (parts.length > 1) {
		const firstPathNormalized = normalizeLangTag(parts[0]);

		const matchedLang = (SUPPORTED_LANG as readonly string[]).find(
			(supported) => normalizeLangTag(supported) === firstPathNormalized,
		);

		if (matchedLang) {
			return {
				logicalSlug: parts.slice(1).join("/"),
				lang: matchedLang,
			};
		}
	}

	return {
		logicalSlug: id,
		lang: DEFAULT_LANG,
	};
}

async function getResolvedPostsForLang(
	targetLang?: string,
): Promise<EnrichedPost[]> {
	const activeLang = normalizeLangTag(targetLang || CONFIG_BASE_LANG);

	const defaultLang = normalizeLangTag(DEFAULT_LANG);

	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const groups: Record<string, CollectionEntry<"posts">[]> = {};

	for (const post of allPosts) {
		const { logicalSlug } = parsePostId(post.id);
		if (!groups[logicalSlug]) {
			groups[logicalSlug] = [];
		}
		groups[logicalSlug].push(post);
	}

	const resolvedPosts: EnrichedPost[] = [];

	for (const logicalSlug in groups) {
		const variants = groups[logicalSlug];

		let chosen = variants.find(
			(v) => normalizeLangTag(parsePostId(v.id).lang) === activeLang,
		);

		if (!chosen) {
			chosen = variants.find(
				(v) => normalizeLangTag(parsePostId(v.id).lang) === defaultLang,
			);
		}

		if (!chosen) {
			for (const supported of SUPPORTED_LANG) {
				chosen = variants.find(
					(v) =>
						normalizeLangTag(parsePostId(v.id).lang) ===
						normalizeLangTag(supported),
				);
				if (chosen) break;
			}
		}

		if (chosen) {
			const { lang: actualLang } = parsePostId(chosen.id);

			const enrichedPost: EnrichedPost = {
				...chosen,
				id: logicalSlug,
				data: {
					...chosen.data,
					actualLang,
					isFallback: normalizeLangTag(actualLang) !== activeLang,
				},
			};
			resolvedPosts.push(enrichedPost);
		}
	}

	return resolvedPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}

export async function getSortedPosts(lang?: string): Promise<GetSortedPosts[]> {
	const sorted = await getResolvedPostsForLang(lang);

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type PostForList = {
	slug: string;
	data: Omit<CollectionEntry<"posts">["data"], "category"> & {
		category: string | undefined;
		actualLang: string;
		isFallback: boolean;
	};
};

export async function getSortedPostsList(
	lang?: string,
): Promise<PostForList[]> {
	const sortedFullPosts = await getResolvedPostsForLang(lang);

	return sortedFullPosts.map((post) => {
		const { category, ...restData } = post.data;

		return {
			slug: post.id,
			data: {
				...restData,
				category: category ?? undefined,
				actualLang: post.data.actualLang,
				isFallback: post.data.isFallback,
			},
		};
	});
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(lang?: string): Promise<Tag[]> {
	const postForLang = await getResolvedPostsForLang(lang);

	const countMap: { [key: string]: number } = {};
	postForLang.forEach((post) => {
		if (post.data.tags) {
			post.data.tags.forEach((tag: string) => {
				if (!countMap[tag]) {
					countMap[tag] = 0;
				}
				countMap[tag]++;
			});
		}
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(lang?: string): Promise<Category[]> {
	const postForLang = await getResolvedPostsForLang(lang);
	const activeLang = lang || CONFIG_BASE_LANG;

	const count: { [key: string]: number } = {};

	postForLang.forEach((post) => {
		if (!post.data.category) {
			const ucKey = getTranslation(activeLang)[I18nKey.uncategorized];
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName = post.data.category.trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c, lang),
		});
	}
	return ret;
}
