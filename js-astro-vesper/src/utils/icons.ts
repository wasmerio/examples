/**
 * Picks one icon's markup from the theme's set (Icon.astro): the named icon when the set has it as its own entry,
 * else the Website icon. The lookup checks own entries only, so an id such as `constructor` or `__proto__` (a buyer's
 * typo, or a value from the CMS) shows the Website icon instead of an inherited value that is not markup.
 *
 * Plain Node loads this file (the unit tests).
 */
export function iconSvg(icons: Record<string, string>, name: string): string {
	return Object.hasOwn(icons, name) ? icons[name] : icons.website;
}
