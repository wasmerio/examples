<script lang="ts">
import Giscus from "@giscus/svelte";
import { getHue } from "@utils/setting-utils.ts";
import { onDestroy, onMount } from "svelte";
import { commentConfig } from "@/config";

if (!commentConfig.giscus) {
	throw new Error("Giscus comments are not configured");
}

interface Props {
	lang?: string;
}
let { lang }: Props = $props();

const giscus = commentConfig.giscus;

let hue = $state(getHue());
let mode = $state("light");

let giscus_base = $state<string | null>(null);
let giscus_dark = $state<string | null>(null);
let giscus_light = $state<string | null>(null);
let giscus_iframe = $state<HTMLIFrameElement | null>(null);

function formatGiscusLang(lang?: string): string {
	if (!lang) return giscus.lang || "en";
	const langMap: Record<string, string> = {
		"zh-cn": "zh-CN",
		"zh-hans": "zh-CN",
		"zh-tw": "zh-TW",
		"zh-hant": "zh-TW",
		"pt-br": "pt-BR",
	};
	return langMap[lang.toLowerCase()] || lang.toLowerCase();
}

let currentLang = $derived(formatGiscusLang(lang));

let theme = $derived.by(() => {
	if (giscus.theme !== "reactive") {
		return giscus.theme || mode;
	}
	if (!giscus_base || !giscus_dark || !giscus_light) {
		return mode;
	}
	const hue_style = `main { --hue: ${hue}; }`;
	const css =
		mode === "dark"
			? hue_style + giscus_dark + giscus_base
			: hue_style + giscus_light + giscus_base;
	return `data:text/css;base64,${btoa(css)}`;
});

const observer =
	typeof MutationObserver !== "undefined"
		? new MutationObserver(() => {
				const new_hue = getHue();
				const new_mode = document.documentElement.classList.contains("dark")
					? "dark"
					: "light";
				if (hue !== new_hue || mode !== new_mode) {
					hue = new_hue;
					mode = new_mode;
					updateGiscusTheme();
				}
			})
		: null;

onMount(async () => {
	mode = document.documentElement.classList.contains("dark") ? "dark" : "light";

	if (giscus.theme === "reactive") {
		try {
			const [baseModule, darkModule, lightModule] = await Promise.all([
				import("@styles/giscus-base.css?raw"),
				import("@styles/giscus-dark.css?raw"),
				import("@styles/giscus-light.css?raw"),
			]);
			giscus_base = baseModule.default;
			giscus_dark = darkModule.default;
			giscus_light = lightModule.default;
		} catch (error) {
			console.error("Failed to load giscus styles:", error);
		}

		findGiscusIframe();
		observer?.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "style"],
		});
	}
});

onDestroy(() => {
	observer?.disconnect();
});

function findGiscusIframe(retries = 0, maxRetries = 10) {
	giscus_iframe = document
		.getElementById("comments")
		?.shadowRoot?.querySelector("iframe") as HTMLIFrameElement;
	if (!giscus_iframe && retries < maxRetries) {
		setTimeout(
			() => findGiscusIframe(retries + 1, maxRetries),
			100 * 1.5 ** retries,
		);
	}
}

function updateGiscusTheme(retries = 0, maxRetries = 10) {
	if (!giscus_iframe?.contentWindow) {
		if (retries < maxRetries) {
			setTimeout(
				() => updateGiscusTheme(retries + 1, maxRetries),
				100 * 1.5 ** retries,
			);
		}
		return;
	}
	const message = {
		giscus: {
			setConfig: {
				theme,
				lang: currentLang,
			},
		},
	};
	giscus_iframe.contentWindow.postMessage(message, "https://giscus.app");
}
</script>

<Giscus
  id="comments"
  repo={giscus.repo}
  repoId={giscus.repoId}
  category={giscus.category}
  categoryId={giscus.categoryId}
  mapping={giscus.mapping}
  term={giscus.term ? giscus.term : ""}
  strict={giscus.strict}
  reactionsEnabled={giscus.reactionsEnabled}
  emitMetadata={giscus.emitMetadata}
  inputPosition={giscus.inputPosition}
  theme={theme}
  lang={currentLang}
  loading={giscus.loading}
>
</Giscus>