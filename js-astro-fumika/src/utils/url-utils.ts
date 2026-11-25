import I18nKey from "@i18n/i18nKey";
import { getTranslation } from "@i18n/translation";
import { siteConfig } from "@/config";

const CONFIG_BASE_LANG = siteConfig.lang.replace("_", "-");

export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function url(path: string, lang?: string): string {
	const activeLang = lang ? lang.replace("_", "-") : CONFIG_BASE_LANG;

	const prefix = activeLang === CONFIG_BASE_LANG ? "" : `/${activeLang}`;

	return joinUrl("", import.meta.env.BASE_URL, `${prefix}${path}`);
}

export function getPostUrlBySlug(slug: string, lang?: string): string {
	return url(`/posts/${slug}/`, lang);
}

export function getTagUrl(tag: string, lang?: string): string {
	if (!tag) return url("/archive/", lang);
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`, lang);
}

export function getCategoryUrl(category: string | null, lang?: string): string {
	const activeLang = lang || CONFIG_BASE_LANG;
	const localizedUncategorized =
		getTranslation(activeLang)[I18nKey.uncategorized];

	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === localizedUncategorized.toLowerCase()
	) {
		return url("/archive/?uncategorized=true", lang);
	}

	return url(`/archive/?category=${encodeURIComponent(category.trim())}`, lang);
}

export function getDir(path: string): string {
	const normalizedPath = path.replace(/\\/g, "/");
	const lastSlashIndex = normalizedPath.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return normalizedPath.substring(0, lastSlashIndex + 1);
}

export const siteUrl = (path = ""): string => {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;

	const site = import.meta.env.SITE;
	const base = import.meta.env.BASE_URL || "/";

	const cleanSite = site.endsWith("/") ? site.slice(0, -1) : site;
	const cleanBase = base.startsWith("/") ? base.slice(1) : base;
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;

	const fullUrl = `${cleanSite}/${cleanBase}/${cleanPath}`;

	return fullUrl.replace(/([^:]\/)\/+/g, "$1");
};
