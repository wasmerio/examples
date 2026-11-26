export type NavTheme = "light" | "dark" | "transparent";

export const navThemeClasses: Record<NavTheme, string> = {
	transparent: "bg-transparent text-white",
	light:
		"border-b border-brand-dark/10 bg-[var(--ui-bg-page)]/95 text-brand-dark shadow-sm backdrop-blur-md",
	dark: "bg-brand-dark text-white",
};
