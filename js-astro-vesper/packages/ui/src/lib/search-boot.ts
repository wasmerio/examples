/**
 * What the Search shell's eager script needs, and nothing else: the selectors, the shortcut keys read from a dialog's
 * config block, the key hint and the key that pairs a button with its dialog. It runs on every page with a search
 * button, so it imports nothing: with the package's boot (`@astronomic-dev/search/boot`) it is the whole eager script, one
 * small file with no shared chunk (decision 0015, principle 7). lib/search-app.ts imports the selectors and
 * triggerKey from here; lib/search.ts holds the rest of the pure helpers, for the lazy apps.
 */

/** The kit's search buttons. The package's own boot skips them (they carry a data-search-ui of their own). */
export const TRIGGER = '[data-search-trigger][data-search-ui="kit"]';
/** The shell's dialog, one per index, types and group. */
export const DIALOG = "dialog[data-search-dialog]";

/**
 * A dialog's config block, read leniently for the boot: the site's default index and this dialog's keys. Anything
 * missing or malformed reads as the default index and no keys; the lazy app's parseConfig (lib/search.ts) is the
 * strict reader that reports a broken block.
 */
export function bootConfig(text: string | null | undefined): { index: string; keys: string[] } {
	let data: { index?: unknown; keys?: unknown } | null = null;
	try {
		data = JSON.parse(text ?? "null");
	} catch {
		// The lazy app reports it.
	}
	const index = typeof data?.index === "string" && data.index ? data.index : "default";
	const keys = Array.isArray(data?.keys) ? data.keys.filter((k): k is string => typeof k === "string") : [];
	return { index, keys };
}

const APPLE: Record<string, string> = { mod: "⌘", meta: "⌘", ctrl: "⌃", alt: "⌥", shift: "⇧" };
const OTHER: Record<string, string> = { mod: "Ctrl", meta: "Meta", ctrl: "Ctrl", alt: "Alt", shift: "Shift" };

/**
 * The key hint a field-style button shows (aria-hidden): the first shortcut key as the platform writes it, "⌘K" on
 * Apple platforms and "Ctrl K" elsewhere; "/" for a bare slash; "" with no keys.
 */
export function keyHint(keys: string[], apple: boolean): string {
	const spec = keys[0];
	if (!spec) return "";
	const parts = spec.split("+");
	let key = parts.pop() ?? "";
	if (key === "" && spec.endsWith("+")) {
		key = "+";
		parts.pop();
	}
	const names = apple ? APPLE : OTHER;
	const mods = parts.map((m) => (Object.hasOwn(names, m.toLowerCase()) ? names[m.toLowerCase()] : m));
	const shown = key.length === 1 ? key.toUpperCase() : key;
	return apple ? [...mods, shown].join("") : [...mods, shown].join(" ");
}

/** The key that pairs a button with its dialog: index, types and group (as the package's default dialog does). */
export function dialogKey(index: string, types: string, group: string): string {
	return [index, types, group].join("|");
}

type Attrs = { getAttribute(name: string): string | null };

/** A button's or a dialog's key, from its data-search-index, -types and -group; no index is the site's default. */
export function triggerKey(el: Attrs, defaultIndex: string): string {
	return dialogKey(el.getAttribute("data-search-index") || defaultIndex, el.getAttribute("data-search-types") ?? "", el.getAttribute("data-search-group") ?? "");
}
