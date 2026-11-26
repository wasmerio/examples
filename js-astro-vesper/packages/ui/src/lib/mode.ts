/**
 * Light and dark mode for a site: ModeToggle's logic and its inline no-flash script, modeScript (decision 0013: tokens own the
 * look, so a mode is one attribute). Three modes: `system` (the default: no `data-theme` on <html>, the reader's
 * system setting decides through `prefers-color-scheme`), `light` and `dark` (`data-theme="light"` or `"dark"` on
 * <html>, which every preset's dark rules read). The choice is saved in localStorage as MODE_KEY, the key the
 * design system pages use too, so both agree. Storage can be blocked (a private window, a strict browser): every
 * read and write is wrapped, and the page still follows the system.
 *
 * A base mode, for a theme that opens in light or dark rather than following the system: `modeScriptFor(base)` sets
 * `data-theme` to the base when nothing is saved, and the switch (ModeToggle's `base`) treats the base as the own look
 * a press back clears to. The base is the default for every function here, "system", so a site without one works as
 * before. modeScriptFor records a light or dark base on window (MODE_BASE_GLOBAL), so after a ClientRouter swap the
 * switch's script keeps the base even on a page with no switch.
 */

export type Mode = "system" | "light" | "dark";

/** The localStorage key. The same as the design system pages' switch (system/mode.ts). */
export const MODE_KEY = "aui-theme";

/** A saved value as a mode: only "light" and "dark" pin one; anything else (nothing saved, junk) is the system. */
export function parseMode(value: unknown): Mode {
	return value === "light" || value === "dark" ? value : "system";
}

/** The saved mode, or the base ("system" by default) when nothing is saved or storage is blocked. */
export function savedMode(storage: Pick<Storage, "getItem"> | undefined, base: Mode = "system"): Mode {
	let mode: Mode = "system";
	try {
		mode = parseMode(storage?.getItem(MODE_KEY));
	} catch {}
	return mode === "system" ? base : mode;
}

/** Saves a mode; the base ("system" by default) removes the key, as it is the look with nothing saved. Fails quietly when storage is blocked. */
export function saveMode(storage: Pick<Storage, "setItem" | "removeItem"> | undefined, mode: Mode, base: Mode = "system"): void {
	try {
		if (mode === base || mode === "system") storage?.removeItem(MODE_KEY);
		else storage?.setItem(MODE_KEY, mode);
	} catch {}
}

/** True when the page shows dark: a pinned mode wins, else the system setting. */
export function isDark(mode: Mode, systemDark: boolean): boolean {
	return mode === "system" ? systemDark : mode === "dark";
}

/**
 * The mode after one press of the toggle: the other look. When that look is the base's own look (the system's, by
 * default), the mode goes back to the base, so a reader who flips twice is back where the site opens: with the
 * system base, one button reaches all three modes and a later change of the system setting then shows; with a light
 * or dark base, the page opens in that look again.
 */
export function nextMode(mode: Mode, systemDark: boolean, base: Mode = "system"): Mode {
	const wantDark = !isDark(mode, systemDark);
	return wantDark === isDark(base, systemDark) ? base : wantDark ? "dark" : "light";
}

/** Sets or removes `data-theme` on the root element. */
export function applyMode(root: { dataset: DOMStringMap }, mode: Mode): void {
	if (mode === "system") delete root.dataset.theme;
	else root.dataset.theme = mode;
}

/**
 * The no-flash script for a base mode, for the page's <head>, inline: `<script is:inline set:html={modeScriptFor("light")} />`. It
 * applies the saved mode before the first paint, else the base (a light or dark base sets `data-theme`; the system
 * base sets nothing), so a reader who chose dark never sees a light page first. Pass the same base to ModeToggle.
 * Plain ES5, no module, no dependency.
 */
export function modeScriptFor(base: Mode): string {
	const key = JSON.stringify(MODE_KEY);
	if (base === "system") return `(function(){try{var m=localStorage.getItem(${key});if(m==="light"||m==="dark")document.documentElement.setAttribute("data-theme",m)}catch(e){}})();`;
	return `(function(){var m=${JSON.stringify(base)};window.${MODE_BASE_GLOBAL}=m;try{var s=localStorage.getItem(${key});if(s==="light"||s==="dark")m=s}catch(e){}document.documentElement.setAttribute("data-theme",m)})();`;
}

/**
 * The window property where modeScriptFor records a light or dark base (the system base records nothing, so
 * modeScript stays as it was). It outlives a ClientRouter page swap, so the switch's script knows the base on a page
 * that has no switch.
 */
export const MODE_BASE_GLOBAL = "__auiModeBase";

/** The page's base: the one modeScriptFor recorded, else the switch's own (data-mode-base), else the system. */
export function pageBase(win: object | undefined, toggle?: { dataset: DOMStringMap } | null): Mode {
	const recorded = parseMode((win as Record<string, unknown> | undefined)?.[MODE_BASE_GLOBAL]);
	return recorded === "system" ? parseMode(toggle?.dataset.modeBase) : recorded;
}

/**
 * The no-flash script with the system base, for the page's <head>, inline: `<script is:inline set:html={modeScript} />`: it applies
 * the saved mode before the first paint, so a reader who chose dark never sees a light page first.
 */
export const modeScript = modeScriptFor("system");
