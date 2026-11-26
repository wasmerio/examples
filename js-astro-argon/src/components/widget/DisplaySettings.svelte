<script lang="ts">
import SvgIcon from "@components/icons/SvgIcon.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	getAvailableColorThemes,
	getDefaultColorTheme,
	getStoredColorTheme,
	setColorTheme,
} from "@utils/setting-utils";

const themeChoices = getAvailableColorThemes();
const defaultTheme = getDefaultColorTheme();
let currentTheme = getStoredColorTheme();

function toThemeName(theme: string): string {
	return theme
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function resetTheme() {
	currentTheme = defaultTheme;
}

function selectTheme(theme: string) {
	currentTheme = theme;
}

$: if (currentTheme) {
	setColorTheme(currentTheme);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed card card-compact display-panel-shell">
	<div class="card-body p-4 gap-3.5">
		<div class="flex flex-row gap-2 items-center justify-between">
			<div class="display-panel-title text-90">
				{i18n(I18nKey.themeColor)}
				<button aria-label="Reset to Default" class="btn btn-ghost btn-xs btn-square display-panel-reset-btn"
						class:opacity-0={currentTheme === defaultTheme}
						class:pointer-events-none={currentTheme === defaultTheme}
						on:click={resetTheme}>
					<SvgIcon name="rotateLeft" className="w-3.5 h-3.5"></SvgIcon>
				</button>
			</div>
			<div class="badge badge-sm display-panel-current-theme">
				{toThemeName(currentTheme)}
			</div>
		</div>
		<div class="grid grid-cols-2 gap-2">
			{#each themeChoices as theme}
				<button
					aria-label={`Apply ${theme} theme`}
					class="theme-option btn btn-ghost btn-sm display-panel-theme-option"
					class:current-theme-btn={currentTheme === theme}
					on:click={() => selectTheme(theme)}
				>
					<span class="theme-dot"></span>
					<span class="truncate">{toThemeName(theme)}</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.theme-option.current-theme-btn {
		background: var(--surface-muted-hover);
		color: var(--primary);
	}

	.theme-dot {
		width: 0.625rem;
		height: 0.625rem;
		border-radius: 9999px;
		background: var(--primary);
		opacity: 0.85;
		flex-shrink: 0;
	}
</style>
