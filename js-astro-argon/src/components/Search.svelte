<script lang="ts">
import SvgIcon from "@components/icons/SvgIcon.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

type LocalSearchEntry = {
	url: string;
	title: string;
	description: string;
	tags: string[];
	category: string;
	content?: string;
};
export let localIndex: LocalSearchEntry[] = [];

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let localSearchIndex: LocalSearchEntry[] = Array.isArray(localIndex)
	? localIndex
	: [];

const escapeHtml = (text: string): string =>
	text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const escapeRegExp = (text: string): string =>
	text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightKeyword = (text: string, keyword: string): string => {
	const safeText = escapeHtml(text);
	if (!keyword) return safeText;
	const pattern = new RegExp(`(${escapeRegExp(keyword)})`, "ig");
	return safeText.replace(pattern, "<mark>$1</mark>");
};

const buildLocalExcerpt = (item: LocalSearchEntry, query: string): string => {
	const normalizedQuery = query.trim().toLowerCase();
	const content = (item.content ?? "").trim();
	if (content && normalizedQuery) {
		const index = content.toLowerCase().indexOf(normalizedQuery);
		if (index >= 0) {
			const start = Math.max(0, index - 36);
			const end = Math.min(content.length, index + normalizedQuery.length + 64);
			const context = `${start > 0 ? "..." : ""}${content.slice(start, end)}${end < content.length ? "..." : ""}`;
			return highlightKeyword(context, query);
		}
	}

	const base =
		item.description?.trim() ||
		item.tags?.join(" ") ||
		item.category?.trim() ||
		item.title;
	return highlightKeyword(base, query);
};

const searchLocalIndex = (query: string): SearchResult[] => {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [];

	const matched = localSearchIndex
		.filter((item) => {
			const haystack = [
				item.title,
				item.description,
				item.category,
				item.content ?? "",
				...(Array.isArray(item.tags) ? item.tags : []),
			]
				.join(" ")
				.toLowerCase();
			return haystack.includes(normalized);
		})
		.slice(0, 40);

	return matched.map((item) => ({
		url: item.url,
		meta: { title: item.title },
		excerpt: buildLocalExcerpt(item, query),
	}));
};

const loadLocalSearchIndex = async () => {
	try {
		const response = await fetch(url("/search-index.json"));
		if (!response.ok) {
			throw new Error(`Failed to fetch local search index: ${response.status}`);
		}
		const data = (await response.json()) as LocalSearchEntry[];
		localSearchIndex = Array.isArray(data) ? data : [];
	} catch (error) {
		console.error("Failed to load local search index:", error);
		localSearchIndex = [];
	}
};

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");

	if (panel && !panel.classList.contains("float-panel-closed")) {
		setTimeout(() => {
			const input = document.getElementById(
				"search-input",
			) as HTMLInputElement | null;
			input?.focus();
		}, 20);
	}
};

const openPanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.remove("float-panel-closed");
};

const search = async (text: string): Promise<void> => {
	const keyword = text.trim();
	if (!keyword || !initialized) {
		result = [];
		isSearching = false;
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else {
			if (localSearchIndex.length === 0) {
				await loadLocalSearchIndex();
			}
			searchResults = searchLocalIndex(keyword);
		}

		result = searchResults;
	} catch (error) {
		console.error("Search error:", error);
		result = [];
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = async () => {
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";

		if (
			(import.meta.env.DEV || !pagefindLoaded) &&
			localSearchIndex.length === 0
		) {
			await loadLocalSearchIndex();
		}

		initialized = true;
	};
	const handleInitialize = () => {
		void initializeSearch();
	};

	if (import.meta.env.DEV) {
		void initializeSearch();
	} else {
		document.addEventListener("pagefindready", handleInitialize);
		document.addEventListener("pagefindloaderror", handleInitialize);

		setTimeout(() => {
			if (!initialized) void initializeSearch();
		}, 2000);
	}

	return () => {
		if (!import.meta.env.DEV) {
			document.removeEventListener("pagefindready", handleInitialize);
			document.removeEventListener("pagefindloaderror", handleInitialize);
		}
	};
});

$: if (initialized) {
	(async () => {
		await search(keyword);
	})();
}
</script>

<div id="search-bar" class="hidden md:flex relative items-center">
	<button
		on:click={togglePanel}
		aria-label="Search Panel"
		id="search-switch"
	class="btn btn-ghost scale-animation normal-case rounded-2xl h-10 min-h-10 w-[9.8rem] lg:w-[10.6rem] px-3.5 border-none shadow-none justify-start
		bg-(--surface-soft)/72 hover:bg-(--surface-soft-hover) active:bg-(--surface-soft-active)
		text-(--nav-item-fg) active:scale-95"
	>
		<SvgIcon name="search" className="w-4 h-4 text-30"></SvgIcon>
		<span class="ml-2 text-[0.84rem] font-medium text-30">{i18n(I18nKey.search)}</span>
	</button>

	<div
		id="search-panel"
		class="float-panel float-panel-closed search-panel absolute w-[28rem] max-w-[calc(100vw-2rem)]
		top-[calc(100%+0.55rem)] right-0 z-70 shadow-2xl rounded-[16px] p-2"
	>
		<label
			id="search-bar-inside"
			class="input input-ghost h-11 w-full rounded-xl border-none shadow-none
			bg-(--surface-muted-hover) focus-within:bg-(--surface-muted-hover)"
		>
			<SvgIcon name="search" className="w-5 h-5 pointer-events-none transition text-30"></SvgIcon>
			<input
				id="search-input"
				placeholder={i18n(I18nKey.search)}
				bind:value={keyword}
				on:focus={openPanel}
				class="grow text-sm text-50"
			/>
		</label>

		{#if !isSearching && keyword && result.length === 0}
			<div class="px-3 py-2 text-sm text-50">No results</div>
		{/if}

		{#each result as item}
			<a
				href={item.url}
				class="transition first-of-type:mt-2 group block rounded-xl text-lg px-3 py-2
				hover:bg-(--surface-muted-hover) active:bg-(--surface-muted-active)"
			>
				<div class="transition text-90 inline-flex font-bold group-hover:text-(--primary)">
					{item.meta.title}<SvgIcon name="chevronRight" className="transition w-3 h-3 translate-x-1 my-auto text-(--primary)"></SvgIcon>
				</div>
				<div class="transition text-sm text-50">
					{@html item.excerpt}
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.search-panel {
		max-height: calc(100vh - 100px);
		overflow-y: auto;
	}
</style>
