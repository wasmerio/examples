<script lang="ts">
import { DARK_MODE, DEFAULT_MODE, LIGHT_MODE } from "@constants/constants.ts";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
let mode: LIGHT_DARK_MODE = $state(DEFAULT_MODE);

onMount(() => {
	mode = getStoredTheme();
	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

	const handleSchemeChange = () => {
		applyThemeToDocument(mode);
	};

	darkModePreference.addEventListener("change", handleSchemeChange);
	return () => {
		darkModePreference.removeEventListener("change", handleSchemeChange);
	};
});

function toggleScheme() {
	const currentIndex = seq.indexOf(mode);
	const nextMode = seq[(currentIndex + 1) % seq.length];
	mode = nextMode;
	setTheme(nextMode);
}
</script>

<div class="relative z-50" role="menu" tabindex="-1">
  <button
    aria-label="Light/Dark Mode"
    role="menuitem"
    class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
    id="scheme-switch"
    onclick={toggleScheme}
  >
    <div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
      <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
    </div>
    <div class="absolute" class:opacity-0={mode !== DARK_MODE}>
      <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
    </div>
  </button>
</div>
