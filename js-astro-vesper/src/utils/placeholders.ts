/**
 * Placeholder addresses, and the guard for a live server's links and emails. The demo's project and talk links are on example.com,
 * which is a real server, so a live site must not send a visitor there.
 *
 * A static build or `astro dev` at a real address stops at the setup check first (src/utils/setup.ts), and a site that is not
 * live keeps what it has. A production server runs no check, so its readers leave these out: the sources for what they map
 * (`liveHref`), `siteSettings` for the settings. Each says so with one line in the log.
 *
 * Plain Node loads this file (the unit tests), so it imports nothing Node cannot load.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

export const hostOf = (value: string) => {
	try {
		return new URL(value).hostname;
	} catch {
		return "";
	}
};

/** True for example.com (the demo's), example.org and example.net with their subdomains, and for anything on the `.example` top-level domain. */
export const placeholderHost = (host: string) => /(^|\.)example(\.(com|org|net))?\.?$/i.test(host);

/** True for a URL on a placeholder host. */
export const isPlaceholderUrl = (value: string) => placeholderHost(hostOf(value));

/** True for an email address on a placeholder host, such as `name@example.com`. */
export const isPlaceholderEmail = (value: string) => placeholderHost(value.trim().split("@").at(-1) ?? "");

/** True for a link that goes to a placeholder host, by URL or by `mailto:`. */
export const isPlaceholderLink = (value: string) => (/^mailto:/i.test(value) ? isPlaceholderEmail(value.slice("mailto:".length).split("?")[0]) : isPlaceholderUrl(value));

/** True for a hidden value that holds a placeholder address: a link, or a plain email anywhere in it (`_cc: name@example.com`). */
export const isPlaceholderValue = (value: string) => isPlaceholderLink(value) || (value.match(/[^\s,;<>:]+@[^\s,;<>?]+/g) ?? []).some(isPlaceholderEmail);

/** "static": a static build; "dev": `astro dev`; "production": a server build's server. Plain Node (the unit tests) has no import.meta.env: there the mode is "production". */
export type SetupMode = "static" | "dev" | "production";

export const setupMode: SetupMode = typeof import.meta.env !== "object" ? "production" : import.meta.env.DEV ? "dev" : import.meta.env.CONTENT_OUTPUT === "static" ? "static" : "production";

/**
 * True in the hosted demo's copy: only it has the demo-brand folder (tooling/release/products.mjs leaves it out of every
 * buyer's copy). The demo is sample content at a real address, on purpose.
 */
export const hostedDemo = (root = process.cwd()) => existsSync(join(root, "src/demo-brand"));

/** True on a buyer's production server: it runs no setup check, and it always counts as live (siteIsLive). */
export const liveServer = (root?: string) => setupMode === "production" && !hostedDemo(root);

/** The lines said so far, so a page load does not repeat one. */
const warned = new Set<string>();
export const warnOnce = (line: string, warn: (text: string) => void = console.warn) => {
	if (warned.has(line)) return;
	warned.add(line);
	warn(line);
};

/** A link a page may draw: on a live server, none to a placeholder address. `where` names the place in the log. */
export function liveHref(href: string, where: string, warn?: (text: string) => void): string | undefined {
	if (!liveServer() || !isPlaceholderLink(href)) return href;
	warnOnce(`Vesper setup: ${where} goes to a placeholder address (${href}), so this live site leaves it out. Set a real address.`, warn);
	return undefined;
}
