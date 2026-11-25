<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { onMount } from "svelte";
import config from "$config";
import i18nit from "$i18n";

let { locale }: { locale: string } = $props();

let path: string = $state("");

const currentPath = () => (path = window.location.pathname.slice(`/${locale === config.i18n.defaultLocale ? "" : locale}`.length) || "/");

onMount(() => {
	// Initialize the current path
	currentPath();

	/** Register route update hook */
	const register = () => window.swup?.hooks.on("content:replace", currentPath);

	// Register the hook immediately if swup is already enabled, otherwise wait for the enable event
	window.swup ? register() : document.addEventListener("swup:enable", register, { once: true });
});
</script>

{#each config.i18n.locales as target}
	<a data-no-swup href={getRelativeLocaleUrl(target, path)} lang={target} aria-current={locale === target ? "page" : undefined} class={locale === target ? "font-bold sm:bg-primary sm:text-background pointer-events-none" : ""}>{i18nit(target)("language")}</a>
{/each}
