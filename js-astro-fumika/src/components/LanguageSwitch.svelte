<script lang="ts">
import { DEFAULT_LANG, SUPPORTED_LANG } from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { getTranslation, normalizeLang } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils";
import { onMount } from "svelte";
import { siteConfig } from "@/config";
import type { SupportedLang } from "@/types/config";

function getMatchedLang(
	pathSegment: string | undefined,
): SupportedLang | undefined {
	if (!pathSegment) return undefined;

	const normalizedSegment = normalizeLang(pathSegment);

	return SUPPORTED_LANG.find(
		(lang) => normalizeLang(lang) === normalizedSegment,
	);
}

function getRelativePathname(): string {
	const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
	let pathname = window.location.pathname;

	if (baseUrl && pathname.startsWith(baseUrl)) {
		pathname = pathname.slice(baseUrl.length);
	}

	return pathname || "/";
}

const configLang = getMatchedLang(siteConfig.lang) || DEFAULT_LANG;

let currentLang = $state<SupportedLang>(configLang);

onMount(() => {
	const pathname = getRelativePathname();
	const parts = pathname.split("/").filter(Boolean);
	const firstPath = parts[0];

	const matched = getMatchedLang(firstPath);

	if (matched) {
		currentLang = matched;
	} else {
		currentLang = configLang;
	}
});

function showPanel() {
	if (window.innerWidth < 1024) return;
	const panel = document.querySelector("#language-panel");
	if (panel) panel.classList.remove("float-panel-closed");
}

function hidePanel() {
	if (window.innerWidth < 1024) return;
	const panel = document.querySelector("#language-panel");
	if (panel) panel.classList.add("float-panel-closed");
}

function togglePanel() {
	const panel = document.querySelector("#language-panel");
	panel?.classList.toggle("float-panel-closed");
}

function setLang(targetLang: string) {
	if (targetLang === currentLang) return;

	const pathname = getRelativePathname();
	const search = window.location.search;
	const hash = window.location.hash;

	const parts = pathname.split("/").filter(Boolean);
	const firstPath = parts[0];

	const matchedCurrentPrefix = getMatchedLang(firstPath);
	const hasLangPrefix = !!matchedCurrentPrefix;

	let newParts = [...parts];
	if (hasLangPrefix) {
		if (targetLang === configLang) {
			newParts.shift();
		} else {
			newParts[0] = targetLang;
		}
	} else {
		if (targetLang !== configLang) {
			newParts.unshift(targetLang);
		}
	}

	let newPath = `/${newParts.join("/")}`;
	if (pathname.endsWith("/") && !newPath.endsWith("/")) {
		newPath += "/";
	}
	if (newPath === "//") newPath = "/";

	window.location.href = url(newPath) + search + hash;
}
</script>

<div class="relative z-50" onmouseleave={hidePanel} role="group">
	<button
		aria-label="Language"
		aria-haspopup="menu"
		aria-expanded={!document.querySelector("#language-panel")?.classList.contains("float-panel-closed")}
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
		id="language-switch"
		onclick={togglePanel}
		onmouseenter={showPanel}
	>
		<div class="absolute">
			<Icon icon="material-symbols:translate-rounded" class="text-[1.25rem]"></Icon>
		</div>
	</button>

	<div id="language-panel" class="absolute transition float-panel-closed top-11 -right-2 pt-5" role="menu">
		<div class="card-base float-panel p-2">
			{#each SUPPORTED_LANG as lang}
				<button
					class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
					role="menuitem"
					class:current-theme-btn={currentLang === lang}
					onclick={() => setLang(lang)}
				>
					{getTranslation(lang)[I18nKey.langName]}
				</button>
			{/each}
		</div>
	</div>
</div>
