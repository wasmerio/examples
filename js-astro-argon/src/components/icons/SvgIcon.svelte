<script lang="ts">
export type LocalIconName =
	| "search"
	| "chevronRight"
	| "rotateLeft";

type IconSpec = {
	paths: string[];
};

const icons: Record<LocalIconName, IconSpec> = {
	search: {
		paths: ["M21 21l-4.35-4.35", "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"],
	},
	chevronRight: {
		paths: ["M9 5l7 7-7 7"],
	},
	rotateLeft: {
		paths: ["M3 12a9 9 0 1 0 2.64-6.36", "M3 4v4h4"],
	},
};

export let name: LocalIconName;
export let className = "w-5 h-5";

$: icon = icons[name];
</script>

{#if icon}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={`inline-block shrink-0 align-middle ${className}`}
		aria-hidden="true"
	>
		{#each icon.paths as path}
			<path d={path} />
		{/each}
	</svg>
{/if}
