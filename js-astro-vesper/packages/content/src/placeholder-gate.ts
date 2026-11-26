/**
 * The placeholder gate: one rule, the same in every theme, for a build that still holds placeholders (decision 0019).
 *
 * A theme's own setup check finds the placeholders: forms, hidden values or emails on `example.com` (the sample's
 * addresses, which reach no one), and unfilled sample markers. With sample content on, the check lets them through with
 * a warning (addresses only while the site is not live), so a buyer's first look and the hosted demo build. This gate
 * adds one stop on top: once the buyer has made the site their own (the business name or phone is no longer the
 * sample's), what is left stops a static build or `astro dev`, even with no SITE_URL. A real business going up with dead
 * forms would lose jobs and never know.
 *
 * - The hosted demo, and a site that still has the sample's identity: unchanged, warnings only.
 * - `ASTRONOMIC_ALLOW_PLACEHOLDERS=1` lets a stopped build run, with a loud warning. It is never the default, and it is
 *   read from the build's environment only (a setup check runs in a build or `astro dev`, never per request).
 * - A live site: the theme's check already stops placeholder addresses there, with no bypass, so the gate looks at the
 *   markers alone (a real SITE_URL must not let a marker through that the no-SITE_URL build stops).
 *
 * No imports: Node-loadable, safe in any runtime.
 *
 * ## How a theme adopts it
 *
 * 0. The theme needs a build-time setup check first: a `checkSetup` that a static build and `astro dev` run (Vega and
 *    Apogee: src/utils/setup.ts, run from src/utils/setup-check.ts by the middleware). Its own check stops placeholder
 *    addresses on a live site (a real SITE_URL), on any identity and with no bypass, before the gate runs.
 * 1. Define the sample identity once, beside the setup check: `export const SAMPLE_IDENTITY: SiteIdentity = { name:
 *    "<the sample business name>", phone: "<the sample phone>" }`, from the theme's own sample settings. A theme whose
 *    sample has no phone (Vesper, Dispatch) leaves `phone` out: the gate then compares the name alone.
 * 2. Say which settings hold the identity (`identityOf(settings)`: the business name and phone a buyer edits).
 * 3. In the theme's `checkSetup`, after it works out what would stop the build, call `placeholderGate` with the
 *    theme's name, its marker syntax and grep word, the placeholders and markers it would otherwise only warn about,
 *    the identities, whether this is the hosted demo (`hostedDemo()`), whether the site is live, and the site's origin.
 *    On `stop`, add `gate.stop` to the error's parts and count `gate.count` in the problems; on `bypassed`, print
 *    `gate.warning` (it lists what is left) in place of the usual placeholder and marker blocks. To gate addresses only,
 *    pass `markers: []` (one line).
 * 4. Delete any copy of this rule the theme had. Keep the theme's own finders (what counts as a placeholder there).
 * 5. Test it in the theme: sample identity gives a warning; a changed identity with placeholders stops; a changed
 *    identity with markers stops at a real address too; the same with the bypass builds with the warning; no
 *    placeholders passes. Add one line on the stop and the bypass to the theme's buyer docs, where they talk about
 *    placeholders and SITE_URL.
 */

/** The environment switch that lets a stopped build run anyway. Only the value `1` turns it on. */
export const ALLOW_PLACEHOLDERS_ENV = "ASTRONOMIC_ALLOW_PLACEHOLDERS";

/** Who the site says it is: the business name and phone a buyer changes first. */
export type SiteIdentity = { name?: string; phone?: string };

/** The name as compared: trimmed, spaces folded, any case. */
const plainName = (name: string | undefined) => (name ?? "").trim().replace(/\s+/g, " ").toLowerCase();

/** The phone as compared: its digits, with a leading US country code dropped, so `+1 (303) 555-0140` is `(303) 555-0140`. */
const plainPhone = (phone: string | undefined) => {
	const digits = (phone ?? "").replace(/\D/g, "");
	return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
};

/** True when the site is no longer the sample's: its name or its phone differs from the sample's (an empty one differs too). */
export function identityChanged(sample: SiteIdentity, current: SiteIdentity): boolean {
	if (plainName(current.name) !== plainName(sample.name)) return true;
	return sample.phone !== undefined && plainPhone(current.phone) !== plainPhone(sample.phone);
}

/** True when the build's environment sets `ASTRONOMIC_ALLOW_PLACEHOLDERS=1`. */
export function placeholdersAllowed(env: Record<string, string | undefined> | undefined = typeof process !== "undefined" ? process.env : undefined): boolean {
	return env?.[ALLOW_PLACEHOLDERS_ENV] === "1";
}

/** True for an origin no real site has (example.com and its kin, the `.example` domain), as astro.config.mjs gives when SITE_URL is not set. */
export function isPlaceholderOrigin(origin: string | undefined): boolean {
	try {
		const host = new URL(origin ?? "").hostname.replace(/\.$/, "");
		return /(^|\.)example(\.(com|org|net))?$/i.test(host);
	} catch {
		return false;
	}
}

export type PlaceholderGateInput = {
	/** The theme's name, for the first word of each line ("Vega"). */
	theme: string;
	/** The theme's marker as a buyer sees it (`[FILL IN: …]`) and the word to grep for (`FILL IN`). */
	marker: { syntax: string; grep: string };
	/** Placeholder addresses the theme's check would only warn about (forms, hidden values, emails, links). */
	placeholders: readonly string[];
	/** Unfilled sample markers the theme's check would only warn about. */
	markers?: readonly string[];
	/** The theme's sample identity, and the site's. */
	sample: SiteIdentity;
	identity: SiteIdentity;
	/** True in the hosted demo's copy. */
	demo: boolean;
	/** True for a live site: the theme's own check already stops placeholder addresses there, so only markers count. */
	live: boolean;
	/** The site's public origin: a placeholder one means SITE_URL is not set. */
	origin?: string;
	/** The build's environment. Default `process.env`. */
	env?: Record<string, string | undefined>;
};

export type PlaceholderGate =
	| { verdict: "pass" }
	| { verdict: "stop"; count: number; stop: string }
	| { verdict: "bypassed"; count: number; warning: string };

const list = (lines: readonly string[]) => lines.map((l) => `  - ${l}`).join("\n");

const who = (identity: SiteIdentity) => [identity.name?.trim() ? `"${identity.name.trim()}"` : "no name", identity.phone?.trim() || "no phone"].join(", ");

/** The lines the gate prints, shared so every theme says the same thing. */
export const gateText = {
	stop: ({ identity, addresses, markers, marker, siteUrlMissing }: { identity: SiteIdentity; addresses: number; markers: number; marker: PlaceholderGateInput["marker"]; siteUrlMissing: boolean }) =>
		[
			`Placeholders on your own site: the business name or phone is no longer the sample's (now ${who(identity)}), but some of the sample is still here.`,
			addresses ? `A form, link or email on example.com reaches no one, so visitors' messages would be lost: set each form's action to the address your form service gave you, and each email to an inbox you read.` : "",
			markers ? `Each ${marker.syntax} marker shows on its page as written: replace it with your real fact (find them with grep -rnF "${marker.grep}" content/).` : "",
			siteUrlMissing ? `SITE_URL is not set either, so the site does not know its own address yet: set it to your site's address.` : "",
			`To build anyway (a private preview only), set ${ALLOW_PLACEHOLDERS_ENV}=1.`,
		]
			.filter(Boolean)
			.join(" "),
	bypassed: (theme: string, count: number) =>
		`!!! ${theme} setup: ${ALLOW_PLACEHOLDERS_ENV}=1 is set, so this build keeps ${count} placeholder(s). Forms and email on them will NOT reach anyone. Do not put this build live. !!!`,
};

/**
 * The gate's verdict. `pass` when it has nothing to say (the demo, the sample's identity, nothing left); `stop` with the
 * block to add to the theme's error; `bypassed` with the loud warning to print, which lists what is left. On a live site
 * only the markers count: the theme's check stops the addresses there itself.
 */
export function placeholderGate({ theme, marker, placeholders, markers = [], sample, identity, demo, live, origin, env }: PlaceholderGateInput): PlaceholderGate {
	const addresses = live ? [] : placeholders;
	const left = [...addresses, ...markers];
	if (demo || !left.length || !identityChanged(sample, identity)) return { verdict: "pass" };
	if (placeholdersAllowed(env)) return { verdict: "bypassed", count: left.length, warning: `${gateText.bypassed(theme, left.length)}\n${list(left)}` };
	const siteUrlMissing = !origin || isPlaceholderOrigin(origin);
	return { verdict: "stop", count: left.length, stop: `${gateText.stop({ identity, addresses: addresses.length, markers: markers.length, marker, siteUrlMissing })}\n${list(left)}` };
}
