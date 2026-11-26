export const themeNames = ["warm", "custom"] as const;

export type MachinesTheme = (typeof themeNames)[number];
export type ClassValue = string | false | null | undefined;

export function classNames(...values: ClassValue[]): string {
	return values.filter(Boolean).join(" ");
}

export function mx(block: string, ...modifiers: ClassValue[]): string {
	return classNames(
		`mx-${block}`,
		...modifiers.map((modifier) =>
			modifier ? `mx-${block}--${modifier}` : undefined,
		),
	);
}

export const componentGroups = [
	{
		name: "Visual primitives",
		items: [
			"panel",
			"section",
			"card",
			"tile",
			"groupbox",
			"action-card",
			"message",
			"table",
			"button",
			"field",
			"list",
			"range",
			"progress",
			"meter",
			"code-frame",
		],
	},
	{
		name: "Astro wrappers",
		items: [
			"root",
			"shell",
			"nav-tabs",
			"sidebar-layout",
			"post",
			"data-table",
			"list",
			"progress-bar",
			"meter-bar",
		],
	},
	{
		name: "Preact widgets",
		items: [
			"tabs",
			"code-tabs",
			"disclosure",
			"drawer",
			"slider",
			"progress-bar",
			"meter-bar",
			"live-filter",
		],
	},
] as const;
