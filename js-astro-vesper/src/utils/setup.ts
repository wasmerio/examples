/**
 * The setup reader: the one place that turns the settings (the newsletter, the CV, the collage) into what pages show,
 * and the setup check a normal build runs.
 *
 * - `siteSettings(content)`: the settings every page and the layout read (never `content.settings()` directly), with
 *   the test-only VESPER_SETTINGS override applied.
 * - `newsletterState(settings, { origin, live })`: the newsletter card's form (the kit SignupForm's props, with
 *   site-path hidden values made absolute on the public origin and dropped on the placeholder origin), or "Follow by
 *   RSS". A placeholder action never reaches a visitor's data: a demo form on a site that is not live, no form on one
 *   that is.
 * - `cvHref(settings)`: the Download CV link, or none.
 * - `collageState(photos)`: "none" (no photos), "ok" (4, 5 or 6) or "invalid" (any other count: no band).
 * - `setupProblems(settings, ...)` and `checkSetup(problems, ...)`: the check. A broken setup stops a static build and
 *   an EmDash dev server; a placeholder address stops them too unless `sampleContent` is on and the site is not live
 *   (the demo); a `[[fill in: …]]` marker stops them unless `sampleContent` is on, whatever the address; warnings are
 *   printed. A production server checks nothing (each reader above fails closed instead), and nothing is ever rendered
 *   on a page.
 *
 * Plain Node loads this file (the unit tests), so it imports nothing Node cannot load.
 */
import { plainRichText } from "@astronomic/theme-core/conformance";
import { isSitePath } from "../content/links";
import type { MenuItem } from "@astronomic/content";
import type { NewsletterOptions, Settings } from "../content/model";
import { strings } from "../theme.strings";
import { getConfig } from "./config";
import { hostedDemo, hostOf, isPlaceholderEmail, isPlaceholderLink, isPlaceholderUrl, isPlaceholderValue, liveServer, placeholderHost, type SetupMode, setupMode, warnOnce } from "./placeholders";
import { identityChanged, placeholderGate, type SiteIdentity } from "@astronomic/content/placeholder-gate";

export { hostedDemo, isPlaceholderEmail, type SetupMode, setupMode };

/** Who the sample content says the site is (content/site.json): while the name is this, placeholders only warn. The sample has no phone, so the name alone counts. */
export const SAMPLE_IDENTITY: SiteIdentity = { name: "Rowan Ellery" };

/**
 * The settings that say who the site is: the person's name and the site title (both "Rowan Ellery" in the sample). The
 * identity has changed when either differs from the sample's: the one that changed is the name the gate compares and
 * prints (the name, when both did).
 */
export const identityOf = (settings: Pick<Settings, "name"> & Partial<Pick<Settings, "title">>): SiteIdentity => ({
	name: settings.title === undefined || identityChanged(SAMPLE_IDENTITY, { name: settings.name }) ? settings.name : settings.title,
});

/** astro.config.mjs's `site` when SITE_URL is not set: a placeholder, never a real address. */
export const PLACEHOLDER_ORIGIN = "https://example.com";

// ---------------------------------------------------------------------------
// Links

// A path on this site (isSitePath, src/content/links.ts): one leading slash, no whitespace, backslash (browsers read
// `\` as `/`, so `/\evil.com` would leave the site) or control character.

function httpsUrl(value: string): URL | undefined {
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.hostname ? url : undefined;
	} catch {
		return undefined;
	}
}

/** True for a value a link setting accepts: an `https:` URL or a site path (`/files/cv.pdf`). The check and the readers share it. */
export const isLinkValue = (value: unknown): value is string => typeof value === "string" && value !== "" && (isSitePath(value) || !!httpsUrl(value));

/** The sites a profile link goes to. The home page of one, with no username, is the demo's link, not anyone's profile. */
const PROFILE_HOSTS = new Set([
	"behance.net",
	"bsky.app",
	"codepen.io",
	"dribbble.com",
	"facebook.com",
	"github.com",
	"gitlab.com",
	"instagram.com",
	"linkedin.com",
	"mastodon.social",
	"medium.com",
	"pinterest.com",
	"reddit.com",
	"threads.com",
	"threads.net",
	"tiktok.com",
	"twitch.tv",
	"twitter.com",
	"x.com",
	"youtube.com",
]);

/** True for a profile site's home page (`https://github.com`). The owner's own site, at its root, is a fine link: it is not on the list. */
export const isBareProfileLink = (value: string) => {
	const url = httpsUrl(value);
	return !!url && url.pathname === "/" && !url.search && !url.hash && PROFILE_HOSTS.has(url.hostname.toLowerCase().replace(/^www\./, ""));
};

/** Schemes a hidden value is judged as a link for, even with no host (`javascript:x`, `mailto:a@b.c`). */
const LINK_SCHEMES = ["http", "https", "javascript", "data", "mailto", "ftp", "file", "vbscript"];

/**
 * True for a hidden value that reads as a link: it starts with `//`, starts with a known scheme, or parses as a URL
 * with a host (`foo://host/x`). Plain values with a colon (`12:30`, `tag:news`) and plain ids do not.
 */
const looksLikeLink = (value: string) => {
	const v = value.trim();
	if (v.startsWith("//")) return true;
	const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(v)?.[1]?.toLowerCase();
	if (scheme && LINK_SCHEMES.includes(scheme)) return true;
	return hostOf(v) !== "";
};

const sameOrigin = (a: string, b: string) => {
	try {
		return new URL(a).origin === new URL(b).origin;
	} catch {
		return false;
	}
};

// ---------------------------------------------------------------------------
// Live or not

/**
 * True for an address where the site is really being put live: not the placeholder (SITE_URL not set, as in a first
 * look at the theme) and not this machine.
 */
export function isRealOrigin(origin: string | undefined): boolean {
	if (!origin) return false;
	try {
		const { hostname } = new URL(origin);
		return !placeholderHost(hostname) && !["localhost", "127.0.0.1", "[::1]"].includes(hostname);
	} catch {
		return false;
	}
}

/**
 * True for a site that is really live: not the hosted demo, and at a real address. A production server counts whatever
 * its address says: it runs no check, and may not know its address (no SITE_URL, behind a proxy), and a real visitor's
 * email must never be dropped as a demo's.
 */
export const siteIsLive = (origin: string, server = setupMode === "production", root?: string) => !hostedDemo(root) && (server || isRealOrigin(origin));

// ---------------------------------------------------------------------------
// Forms

type FormSetting = { action: string };

/** True for a form that only pretends: a placeholder address on a site that is not live (siteIsLive). */
export const isDemoForm = (form: FormSetting, live: boolean) => !live && isPlaceholderUrl(form.action);

/**
 * What a form's sending needs. A demo form (isDemoForm) "posts" to a data URL: the kit's script gets a JSON answer in the
 * browser and takes its success path (the field checked, the form reset, the demo's words in the status), and no request
 * leaves the page. With no script nothing is sent either: some browsers stay on the page, and some open the data URL,
 * whose body holds the same words. Any other form is left as it is. A live site never gets here with a placeholder
 * address (sendableForm).
 */
export const formSending = (form: FormSetting, live: boolean): { action: string; enhance?: "fetch"; successText?: string } =>
	isDemoForm(form, live)
		? { action: `data:application/json,${encodeURIComponent(JSON.stringify({ note: strings.newsletter.demoSent }))}`, enhance: "fetch", successText: strings.newsletter.demoSent }
		: { action: form.action };

/**
 * The form a page may draw. On a live site, none on a placeholder address: example.com is a real server, and a visitor's
 * email must never go there, script or no script. The page then shows what it shows with no form.
 */
export const sendableForm = <F extends FormSetting>(form: F | undefined, live: boolean): F | undefined => (form && live && isPlaceholderUrl(form.action) ? undefined : form);

/**
 * The settings for a live server: a newsletter form on a placeholder address gone, as if it were never set, and a
 * placeholder hidden value gone from a real form (a `redirect` would send the visitor to example.com), each with one line
 * in the log.
 */
export function withoutPlaceholderForms<S extends Pick<Settings, "newsletterAction" | "newsletterOptions">>(settings: S, warn?: (text: string) => void): S {
	const action = settings.newsletterAction;
	if (!action) return settings;
	if (!sendableForm({ action }, true)) {
		const { newsletterAction: _action, newsletterOptions: _options, ...out } = settings;
		warnOnce(`Vesper setup: newsletterAction posts to a placeholder address (${action}), so this live site shows "Follow by RSS" instead of the form. Set a real address.`, warn);
		return out as S;
	}
	const options = settings.newsletterOptions;
	const placeholders = options?.hiddenFields?.filter((f) => isPlaceholderValue(f.value)) ?? [];
	if (!options || !placeholders.length) return settings;
	for (const field of placeholders) warnOnce(`Vesper setup: newsletterOptions.hiddenFields "${field.name}" holds a placeholder address (${field.value}), so this live site leaves that field out of the form. Set a real address.`, warn);
	return { ...settings, newsletterOptions: { ...options, hiddenFields: options.hiddenFields?.filter((f) => !isPlaceholderValue(f.value)) } };
}

/**
 * The settings for a live server: no social link on a placeholder address or at a profile site's home page (the demo's
 * `https://github.com`, which is no one's profile), and no CV on a placeholder address, each with one line in the log.
 */
export function withoutPlaceholderLinks<S extends Pick<Settings, "socials" | "cvFile">>(settings: S, warn?: (text: string) => void): S {
	const socials = settings.socials?.filter((social) => {
		if (isPlaceholderLink(social.href)) warnOnce(`Vesper setup: socials "${social.label}" goes to a placeholder address (${social.href}), so this live site leaves it out. Set a real address.`, warn);
		else if (isBareProfileLink(social.href)) warnOnce(`Vesper setup: socials "${social.label}" is the site's home page (${social.href}), not your profile, so this live site leaves it out. Set your profile's address.`, warn);
		else return true;
		return false;
	});
	const placeholderCv = !!settings.cvFile && isPlaceholderLink(settings.cvFile);
	if (placeholderCv) warnOnce(`Vesper setup: cvFile goes to a placeholder address (${settings.cvFile}), so this live site shows no Download CV link. Set a real address.`, warn);
	if (!placeholderCv && socials?.length === settings.socials?.length) return settings;
	const { cvFile, ...rest } = settings;
	return { ...rest, socials, ...(placeholderCv ? {} : { cvFile }) } as S;
}

// ---------------------------------------------------------------------------
// The newsletter

/** The kit SignupForm's props for the newsletter card. */
export type NewsletterProps = NewsletterOptions & { action: string; enhance?: "fetch"; successText?: string };

/**
 * "form": the card's signup form (`demo`: one that only pretends, formSending); "rss": no usable action, so the card
 * becomes "Follow by RSS" (never a broken form).
 */
export type NewsletterState = { kind: "form"; props: NewsletterProps; demo?: true } | { kind: "rss" };

/**
 * The newsletter card's state. A form needs an action that is an `https:` URL or a site path; anything else (none,
 * `http:`, `javascript:`) follows by RSS, so a production server, which never runs the check, fails closed. So does a
 * placeholder action on a live site (sendableForm; a caller that does not say counts as live). On a site that is not
 * live, a placeholder action is a demo form (formSending). A hidden field whose value is a site path (`/thanks`, where a
 * newsletter tool sends the reader) becomes an absolute URL on the public origin, which services need; on the
 * placeholder origin (SITE_URL not set) it is dropped. A hidden value that looks like a link but is not a valid one is
 * dropped too, and so is a placeholder address on a live site: a `redirect` must not send a visitor to example.com.
 */
export function newsletterState(settings: Pick<Settings, "newsletterAction" | "newsletterOptions">, { origin, live = true }: { origin: string; live?: boolean }): NewsletterState {
	const action = settings.newsletterAction;
	if (!isLinkValue(action)) return { kind: "rss" };
	const form = sendableForm({ action }, live);
	if (!form) return { kind: "rss" };
	const options = settings.newsletterOptions ?? {};
	const placeholder = sameOrigin(origin, PLACEHOLDER_ORIGIN);
	const hiddenFields = (options.hiddenFields ?? []).flatMap((f) => {
		if (looksLikeLink(f.value) && !isLinkValue(f.value)) return [];
		if (live && isPlaceholderValue(f.value)) return [];
		if (!isSitePath(f.value)) return [f];
		return placeholder ? [] : [{ name: f.name, value: new URL(f.value, origin).href }];
	});
	const props: NewsletterProps = { ...formSending(form, live) };
	if (options.emailName) props.emailName = options.emailName;
	if (options.honeypot?.name) props.honeypot = options.honeypot;
	if (options.nameField !== undefined) props.nameField = options.nameField;
	if (options.nameName) props.nameName = options.nameName;
	if (hiddenFields.length) props.hiddenFields = hiddenFields;
	return isDemoForm(form, live) ? { kind: "form", props, demo: true } : { kind: "form", props };
}

// ---------------------------------------------------------------------------
// The CV and the collage

/** The Download CV link: the CV file when it is an `https:` URL or a site path, else none (fail closed). */
export const cvHref = (settings: Pick<Settings, "cvFile">): string | undefined => (isLinkValue(settings.cvFile) ? settings.cvFile : undefined);

/** The collage counts with a packed layout. */
export const COLLAGE_COUNTS: readonly number[] = [4, 5, 6];

/** "none": no photos (no band); "ok": 4, 5 or 6; "invalid": any other count (no band; the check stops a build on it). */
export type CollageState = "none" | "ok" | "invalid";

export function collageState(photos: readonly unknown[]): CollageState {
	if (photos.length === 0) return "none";
	return COLLAGE_COUNTS.includes(photos.length) ? "ok" : "invalid";
}

// ---------------------------------------------------------------------------
// The check

export type SetupProblems = { errors: string[]; placeholders: string[]; markers: string[]; warnings: string[] };

/** Honeypot names that browsers' autofill fills in, so real people would trip the trap (the kit's Honeypot doc). */
const AUTOFILL_NAMES = ["email", "name", "url", "phone"];
const MARKER = /\[\[fill in[^\]]*\]\]/gi;

/** The fields of the collections (src/content/model.ts) that hold free text, so the check scans them for markers. */
type MarkerField = "title" | "summary" | "imageCaption" | "event" | "place" | "group" | "name" | "note" | "linkLabel" | "company" | "role" | "alt" | "geo";
type MarkerEntry = { slug: string; body?: { format: string; value: unknown } } & Partial<Record<MarkerField, string>>;

/**
 * Every setup problem. `photos`: the collage collection; `pages`, `posts`, `projects`, `talks`, `uses`, `jobs`: the
 * other collections (`photos` and these are scanned for `[[fill in: …]]` markers); `publicFile(path)`: whether a site
 * path is a file in public/; `links`: the content links
 * the sources refused (src/content/links.ts, linkProblems()); `icons`: the theme's social icon ids (src/icons/), when
 * known; `menus`: the menus by name (the layout's primary and footer), when known; `entries`: the posts, projects and
 * pages by name ("posts/<slug>"), for their SEO canonical (only the Markdown source lists it; EmDash's needs a request);
 * `contentLinks`: the links of the projects, talks, uses items, jobs and collage photos, each with its place.
 *
 * - errors: a collage count that is not 0, 4, 5 or 6; a `cvFile` site path with no file; a newsletter action or CV
 *   file that is neither `https:` nor a site path; a hidden value that looks like a link but is not a valid one; a
 *   honeypot name autofill knows; each refused content link.
 * - placeholders: the newsletter action, a hidden value, the CV file, a social link, a menu link or an entry's SEO
 *   canonical on a placeholder host (example.com, example.org, example.net, `.example`); a social link to a profile
 *   site's home page, with no username (the demo's profile links); a project's, talk's, uses item's, job's or collage
 *   photo's link on a placeholder host.
 * - markers: the `[[fill in: …]]` markers in the free text of the content, each with its entry ("projects/<slug>"): a
 *   page's, post's or project's title, summary and body; a page's image caption; a talk's title, event, place and
 *   summary; a uses item's group, name, note and link words; a job's company and role; a collage photo's alt text,
 *   place and geo label.
 * - warnings: a social link's unknown icon (it shows the Website icon); the config's warnings (an unknown id in
 *   `settings.config`).
 */
export function setupProblems(
	settings: Settings,
	{
		photos,
		pages,
		posts = [],
		projects = [],
		talks = [],
		uses = [],
		jobs = [],
		publicFile,
		links = [],
		icons,
		menus = {},
		entries = [],
		contentLinks = [],
	}: {
		photos: readonly MarkerEntry[];
		pages: readonly MarkerEntry[];
		posts?: readonly MarkerEntry[];
		projects?: readonly MarkerEntry[];
		talks?: readonly MarkerEntry[];
		uses?: readonly MarkerEntry[];
		jobs?: readonly MarkerEntry[];
		publicFile: (path: string) => boolean;
		links?: string[];
		icons?: readonly string[];
		menus?: Record<string, readonly MenuItem[]>;
		entries?: readonly { at: string; seo?: { canonical?: string } }[];
		contentLinks?: readonly { at: string; href?: string }[];
	},
): SetupProblems {
	const errors: string[] = [];
	const placeholders: string[] = [];
	const markers: string[] = [];
	const warnings: string[] = [];

	const link = (key: string, value: string | undefined) => {
		if (!value) return;
		if (!isLinkValue(value)) errors.push(`${key}: "${value}" is neither an https: URL nor a site path (/…).`);
		else if (isPlaceholderUrl(value)) placeholders.push(`${key}: ${value}`);
	};

	if (collageState(photos) === "invalid")
		errors.push(`collage: ${photos.length} photo(s). The band needs 0, 4, 5 or 6 photos (with none there is no band). Add or remove photos in the collage collection.`);

	if (settings.newsletterAction) {
		link("newsletterAction", settings.newsletterAction);
		const options = settings.newsletterOptions ?? {};
		const honeypot = options.honeypot?.name;
		if (honeypot && AUTOFILL_NAMES.includes(honeypot.trim().toLowerCase()))
			errors.push(`newsletterOptions.honeypot: "${honeypot}" is a name browsers fill in, so real people would trip the trap. Use the service's own name (such as _hp or _gotcha).`);
		for (const field of options.hiddenFields ?? []) {
			if (looksLikeLink(field.value) && !isLinkValue(field.value))
				errors.push(`newsletterOptions.hiddenFields "${field.name}": "${field.value}" looks like a link but is neither an https: URL nor a site path (/…).`);
			else if (isPlaceholderValue(field.value)) placeholders.push(`newsletterOptions.hiddenFields "${field.name}": ${field.value}`);
		}
	}

	if (settings.cvFile) {
		link("cvFile", settings.cvFile);
		if (isSitePath(settings.cvFile) && !publicFile(settings.cvFile)) errors.push(`cvFile: "${settings.cvFile}" is not a file in public/.`);
	}

	errors.push(...links);

	for (const [i, social] of (settings.socials ?? []).entries()) {
		if (isPlaceholderLink(social.href)) placeholders.push(`socials[${i}] (${social.label}): ${social.href}`);
		else if (isBareProfileLink(social.href)) placeholders.push(`socials[${i}] (${social.label}): ${social.href} (the site's home page, not your profile)`);
	}
	const menuLinks = (items: readonly MenuItem[], at: string) => {
		for (const [i, item] of items.entries()) {
			if (isPlaceholderLink(item.href)) placeholders.push(`${at}[${i}] (${item.label}): ${item.href}`);
			if (item.children) menuLinks(item.children, `${at}[${i}].children`);
		}
	};
	for (const [name, items] of Object.entries(menus)) menuLinks(items, `menus.${name}`);
	for (const { at, href } of contentLinks) if (href && isPlaceholderLink(href)) placeholders.push(`${at}: ${href}`);
	for (const { at, seo } of entries) if (seo?.canonical && isPlaceholderUrl(seo.canonical)) placeholders.push(`${at} seo.canonical: ${seo.canonical}`);

	const findMarkers = (at: string, text: string | undefined) => {
		for (const marker of text?.match(MARKER) ?? []) markers.push(`${at}: ${marker}`);
	};
	const scan = (collection: string, items: readonly MarkerEntry[], fields: readonly MarkerField[]) => {
		for (const item of items) {
			const at = `${collection}/${item.slug}`;
			for (const field of fields) findMarkers(at, item[field]);
			if (item.body) findMarkers(at, plainRichText(item.body));
		}
	};
	scan("pages", pages, ["title", "summary", "imageCaption"]);
	scan("posts", posts, ["title", "summary"]);
	scan("projects", projects, ["title", "summary"]);
	scan("talks", talks, ["title", "event", "place", "summary"]);
	scan("uses", uses, ["group", "name", "note", "linkLabel"]);
	scan("jobs", jobs, ["company", "role"]);
	scan("collage", photos, ["alt", "place", "geo"]);

	if (icons) {
		for (const [i, social] of (settings.socials ?? []).entries()) {
			if (social.icon && !icons.includes(social.icon))
				warnings.push(`socials[${i}] (${social.label}): the icon "${social.icon}" is not one of the theme's (${icons.join(", ")}); it shows the Website icon.`);
		}
	}

	warnings.push(...getConfig(settings).warnings);
	return { errors, placeholders, markers, warnings };
}

const block = (heading: string, lines: string[]) => `${heading}\n${lines.map((l) => `  - ${l}`).join("\n")}`;

/**
 * Stops the build (throws) on errors, on placeholder addresses and on markers, each as below; prints one warning block
 * with the warnings and the allowed placeholders and markers. In production mode it does nothing: EmDash settings are
 * checked in dev only, and a live page never fails on its settings. A marker has no fallback: an entry published on a live
 * server shows it, as an EmDash build renders no page and so never reaches this check.
 *
 * With `sampleContent` on, a marker only warns, whatever the address: the owner chose to build with the page unfilled.
 * With it off, a marker stops the build and names the entry.
 *
 * `sampleContent` allows placeholder addresses only while the site is not `live`: a copy of the theme going up at its
 * real address with the demo's example.com form would take no signups. The hosted demo is not `live` (siteIsLive).
 *
 * The shared placeholder gate (@astronomic/content/placeholder-gate, decision 0019) then stops what `sampleContent` would
 * allow (on a live site, the markers) once the name is no longer the sample's (`identity`, SAMPLE_IDENTITY), even with no
 * SITE_URL; `ASTRONOMIC_ALLOW_PLACEHOLDERS=1` lets that build run with a loud warning. The hosted demo (`demo`) only warns.
 */
export function checkSetup(
	problems: SetupProblems,
	{ sampleContent, live = false, mode, warn = console.warn, identity = SAMPLE_IDENTITY, demo = false, origin, env }: { sampleContent?: boolean; live?: boolean; mode: SetupMode; warn?: (text: string) => void; identity?: SiteIdentity; demo?: boolean; origin?: string; env?: Record<string, string | undefined> },
) {
	if (mode === "production") return;
	const addressesAllowed = !!sampleContent && !live;
	// To gate addresses only, pass `markers: []` here.
	const gate = placeholderGate({ theme: "Vesper", marker: { syntax: "[[fill in: …]]", grep: "fill in" }, placeholders: addressesAllowed ? problems.placeholders : [], markers: sampleContent ? problems.markers : [], sample: SAMPLE_IDENTITY, identity, demo, live, origin, env });
	const stop = [...problems.errors, ...(addressesAllowed ? [] : problems.placeholders), ...(sampleContent ? [] : problems.markers)];
	if (stop.length || gate.verdict === "stop") {
		const parts = [];
		if (gate.verdict === "stop") parts.push(gate.stop);
		if (problems.errors.length) parts.push(block("Broken settings and links:", problems.errors));
		if (!addressesAllowed && problems.placeholders.length)
			parts.push(block(sampleContent ? "Sample addresses on a real site (a form on one takes no signups; SITE_URL is your real address, so replace each with a real one):" : "Placeholders to replace with real addresses (allowed only while sampleContent is on, before the site has its real address):", problems.placeholders));
		if (!sampleContent && problems.markers.length) parts.push(block("Unfilled [[fill in: …]] markers (for each one, fill it in, or turn sampleContent on to build anyway):", problems.markers));
		throw new Error(`Vesper setup: ${stop.length + (gate.verdict === "stop" ? gate.count : 0)} problem(s).\n${parts.join("\n")}`);
	}
	const parts = [];
	const bypassed = gate.verdict === "bypassed";
	if (bypassed) parts.push(gate.warning);
	if (problems.warnings.length) parts.push(block("Warnings:", problems.warnings));
	if (!bypassed && problems.placeholders.length) parts.push(block("Placeholders (allowed while sampleContent is on; replace them before you launch):", problems.placeholders));
	if (!bypassed && problems.markers.length) parts.push(block("Unfilled [[fill in: …]] markers (allowed while sampleContent is on; the page shows each one until you fill it in):", problems.markers));
	if (parts.length) warn(`Vesper setup:\n${parts.join("\n")}`);
}

// ---------------------------------------------------------------------------
// VESPER_SETTINGS (test only)

/**
 * The settings VESPER_SETTINGS may set (test builds only). `config` is not one: the look
 * choices have their own test override, VESPER_CONFIG (src/utils/config.ts).
 */
const TEST_KEYS = ["name", "avatar", "role", "socials", "nowLabel", "nowStatus", "nowUpdated", "nowPlace", "newsletterAction", "newsletterOptions", "newsletterNote", "cvFile", "sampleContent"] as const;

/** Vite replaces `import.meta.env.VESPER_SETTINGS` in a build (astro.config.mjs); plain Node reads the environment. */
const testOverride = () => (typeof import.meta.env === "object" ? import.meta.env.VESPER_SETTINGS : globalThis.process?.env?.VESPER_SETTINGS);

/**
 * The settings with VESPER_SETTINGS over them (test only: JSON such as {"avatar":null,"sampleContent":false}). Only
 * the keys in TEST_KEYS; `null` clears one; any other key, or text that is not a JSON object, stops the build.
 */
export function withTestSettings(settings: Settings, raw: string | undefined = testOverride()): Settings {
	if (!raw) return settings;
	let extra: unknown;
	try {
		extra = JSON.parse(raw);
	} catch {
		throw new Error(`VESPER_SETTINGS is not JSON: ${raw}`);
	}
	if (!extra || typeof extra !== "object" || Array.isArray(extra)) throw new Error(`VESPER_SETTINGS is not a JSON object: ${raw}`);
	const out: Record<string, unknown> = { ...settings };
	for (const [key, value] of Object.entries(extra)) {
		if (!(TEST_KEYS as readonly string[]).includes(key)) throw new Error(`VESPER_SETTINGS: "${key}" cannot be set. Use ${TEST_KEYS.join(", ")}.`);
		if (value === null) delete out[key];
		else out[key] = key === "nowUpdated" && typeof value === "string" ? new Date(value) : value;
	}
	return out as Settings;
}

/** One line for the build's output and the dev server's log while VESPER_SETTINGS is set, so it is never baked in silently. */
export function testSettingsNotice(raw: string | undefined = testOverride()): string | undefined {
	return raw ? `VESPER_SETTINGS is set (test only): ${raw}. Unset it before you build the real site.` : undefined;
}

/** The site's settings, as every page and the layout read them: the source's, with the test-only override. */
export async function siteSettings(content: { settings(): Promise<Settings> }): Promise<Settings> {
	const settings = withTestSettings(await content.settings());
	// A production server runs no check and always counts as live (siteIsLive). A static build or `astro dev` at a real address stops at the check first.
	return liveServer() ? withoutPlaceholderLinks(withoutPlaceholderForms(settings)) : settings;
}
