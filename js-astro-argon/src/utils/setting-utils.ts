const COLOR_THEME_STORAGE_KEY = "color-theme";
const FALLBACK_THEME = "winter";
const DARK_THEME_NAME_PATTERN =
	/(dark|night|dracula|dim|business|black|abyss|luxury|forest|synthwave)/i;

function getConfigCarrier(): HTMLElement | null {
	return document.getElementById("config-carrier");
}

export function getDefaultColorTheme(): string {
	return getConfigCarrier()?.dataset.theme?.trim() || FALLBACK_THEME;
}

export function getAvailableColorThemes(): string[] {
	const fromConfig = getConfigCarrier()?.dataset.themes ?? "";
	const configuredThemes = fromConfig
		.split(",")
		.map((theme) => theme.trim())
		.filter(Boolean);

	const defaultTheme = getDefaultColorTheme();
	const uniqueThemes = Array.from(new Set(configuredThemes));
	if (!uniqueThemes.includes(defaultTheme)) {
		uniqueThemes.unshift(defaultTheme);
	}
	return uniqueThemes.length > 0 ? uniqueThemes : [FALLBACK_THEME];
}

export function applyColorTheme(theme: string): void {
	document.documentElement.setAttribute("data-theme", theme);
	const isDarkTheme = DARK_THEME_NAME_PATTERN.test(theme);
	document.documentElement.classList.toggle("dark", isDarkTheme);
}

export function getStoredColorTheme(): string {
	const storedTheme = localStorage.getItem(COLOR_THEME_STORAGE_KEY)?.trim();
	const availableThemeSet = new Set(getAvailableColorThemes());
	if (storedTheme && availableThemeSet.has(storedTheme)) {
		return storedTheme;
	}
	return getDefaultColorTheme();
}

export function setColorTheme(theme: string): void {
	const availableThemeSet = new Set(getAvailableColorThemes());
	const safeTheme = availableThemeSet.has(theme)
		? theme
		: getDefaultColorTheme();
	localStorage.setItem(COLOR_THEME_STORAGE_KEY, safeTheme);
	applyColorTheme(safeTheme);
}
