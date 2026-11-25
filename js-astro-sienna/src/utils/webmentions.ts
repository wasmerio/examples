import * as fs from "node:fs";
import type { WebmentionsCache, WebmentionsChildren, WebmentionsFeed } from "@/types";

const DOMAIN = import.meta.env.SITE;
const API_TOKEN = import.meta.env.WEBMENTION_API_KEY;
const CACHE_DIR = ".data";
const filePath = `${CACHE_DIR}/webmentions.json`;
const validWebmentionTypes = ["like-of", "mention-of", "in-reply-to"];

const hostName = new URL(DOMAIN).hostname;

let warnedMissingToken = false;

async function fetchWebmentions(timeFrom: string | null, perPage = 1000) {
	if (!DOMAIN) {
		if (!warnedMissingToken) {
			console.warn("[webmentions] No site URL configured in astro.config.ts");
			warnedMissingToken = true;
		}
		return null;
	}

	if (!API_TOKEN) {
		if (!warnedMissingToken) {
			console.warn("[webmentions] WEBMENTION_API_KEY not set in .env — skipping fetch");
			warnedMissingToken = true;
		}
		return null;
	}

	let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${API_TOKEN}&sort-dir=up&per-page=${perPage}`;
	if (timeFrom) url += `&since=${encodeURIComponent(timeFrom)}`;

	const res = await fetch(url);
	if (!res.ok) return null;
	return (await res.json()) as WebmentionsFeed;
}

/** Merge cached and fresh webmentions, deduplicating by `wm-id`. */
function mergeWebmentions(a: WebmentionsCache, b: WebmentionsFeed): WebmentionsChildren[] {
	return Array.from(
		[...a.children, ...b.children]
			.reduce((map, obj) => map.set(obj["wm-id"], obj), new Map())
			.values(),
	);
}

export function filterWebmentions(webmentions: WebmentionsChildren[]) {
	return webmentions.filter((webmention) => {
		if (!validWebmentionTypes.includes(webmention["wm-property"])) return false;

		// `mention-of` and `in-reply-to` without body text aren't meaningful to render.
		if (webmention["wm-property"] === "mention-of" || webmention["wm-property"] === "in-reply-to") {
			return webmention.content && webmention.content.text !== "";
		}

		return true;
	});
}

function writeToCache(data: WebmentionsCache) {
	if (!fs.existsSync(CACHE_DIR)) {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
	}
	fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getFromCache(): WebmentionsCache {
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(data);
	}
	return {
		lastFetched: null,
		children: [],
	};
}

async function getAndCacheWebmentions() {
	const cache = getFromCache();
	const mentions = await fetchWebmentions(cache.lastFetched);

	if (mentions) {
		mentions.children = filterWebmentions(mentions.children);
		const webmentions: WebmentionsCache = {
			lastFetched: new Date().toISOString(),
			children: mergeWebmentions(cache, mentions),
		};

		writeToCache(webmentions);
		return webmentions;
	}

	return cache;
}

let webMentions: WebmentionsCache;

export async function getWebmentionsForUrl(url: string) {
	if (!webMentions) webMentions = await getAndCacheWebmentions();

	return webMentions.children.filter((entry) => entry["wm-target"] === url);
}
