/**
 * schema.org structured data (JSON-LD) for a theme's pages: small builders that return plain objects, and
 * `jsonLdScript` for SeoHead. Every URL is absolute (`site` is the public origin). The site's WebSite and owner are
 * one node each, referenced by `@id` (`<origin>/#website`, `<origin>/#owner`). Builders read only the fields they
 * name: a post's body never reaches the output.
 */
import { latestDate } from "./date.ts";
import { absoluteUrl } from "./url.ts";

export type JsonLdNode = { "@type": string; "@id"?: string; [key: string]: unknown };
export type JsonLdGraph = { "@context": "https://schema.org"; "@graph": JsonLdNode[] };
type Site = string | URL;
type Ref = { "@id": string };

export type OwnerInput = {
	type: "Organization" | "Person";
	name: string;
	description?: string;
	legalName?: string;
	/** The site logo's src. No logo: no `logo` field (the share card is never the logo). */
	logo?: string;
	/** A person's photo, or an image for the organization. */
	image?: string;
	jobTitle?: string;
	email?: string;
	telephone?: string;
	/** One line, or the address lines (joined with ", "). */
	address?: string | readonly string[];
	sameAs?: readonly string[];
};

export type BlogPostingInput = {
	title: string;
	description?: string;
	image?: string;
	path: string;
	date?: Date;
	updated?: Date;
	/** Dispatch: "public" | "members" | "paid". Sets isAccessibleForFree (public only). Left out: no field. */
	access?: "public" | "members" | "paid";
	/** Each author as a Person (with a path, `@id` is `<url>#person`, as personNode); none: the owner. */
	authors?: readonly { name: string; path?: string }[];
	series?: { name: string; path?: string };
};

/** The site's two shared ids. A base path in `site` is dropped: the ids belong to the origin. */
export const siteIds = (site: Site) => {
	const origin = new URL(String(site)).origin;
	return { website: `${origin}/#website`, owner: `${origin}/#owner` };
};

const abs = (site: Site, value: string | undefined) => (value ? absoluteUrl(site, value) : undefined);
const ref = (id: string): Ref => ({ "@id": id });
const iso = (date: Date | undefined) => (date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined);
const empty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

/** Drops undefined, null, "" and [] at every level (false and 0 stay). */
function clean<T>(value: T): T {
	if (Array.isArray(value)) return value.map(clean).filter((v) => !empty(v)) as T;
	if (value && typeof value === "object" && !(value instanceof Date)) {
		const out: Record<string, unknown> = {};
		for (const [key, v] of Object.entries(value)) {
			const c = clean(v);
			if (!empty(c)) out[key] = c;
		}
		return out as T;
	}
	return value;
}

const node = (fields: JsonLdNode): JsonLdNode => clean(fields);

/** A page's own nodes: url, an `@id` with a fragment, and the site it is part of. */
const pageBase = (site: Site, type: string, path: string, fragment: string) => {
	const url = absoluteUrl(site, path);
	return { "@type": type, "@id": `${url}#${fragment}`, url, isPartOf: ref(siteIds(site).website) };
};

/** Profile links for `sameAs`: absolute http(s) URLs only, once each; feeds (`*.xml`), mailto and relative links are dropped. */
export function sameAs(links: readonly { href?: string }[]): string[] {
	const out = new Set<string>();
	for (const { href } of links) {
		if (!href || !/^https?:\/\//i.test(href)) continue;
		try {
			if (new URL(href).pathname.toLowerCase().endsWith(".xml")) continue;
		} catch {
			continue;
		}
		out.add(href);
	}
	return [...out];
}

/** The site owner (an Organization or a Person), one node at `<origin>/#owner`. */
export function ownerNode(site: Site, o: OwnerInput): JsonLdNode {
	return node({
		"@type": o.type,
		"@id": siteIds(site).owner,
		name: o.name,
		legalName: o.legalName,
		description: o.description,
		url: `${new URL(String(site)).origin}/`,
		logo: abs(site, o.logo),
		image: abs(site, o.image),
		jobTitle: o.jobTitle,
		email: o.email,
		telephone: o.telephone,
		address: typeof o.address === "string" ? o.address : o.address?.filter(Boolean).join(", "),
		sameAs: o.sameAs ? [...o.sameAs] : undefined,
	});
}

/** The site's WebSite node (published by the owner) and the owner node. Every page carries both. */
export function siteGraph(site: Site, s: { name: string; description?: string; owner: OwnerInput }): JsonLdNode[] {
	const ids = siteIds(site);
	const website = node({
		"@type": "WebSite",
		"@id": ids.website,
		name: s.name,
		url: `${new URL(String(site)).origin}/`,
		description: s.description,
		publisher: ref(ids.owner),
	});
	return [website, ownerNode(site, s.owner)];
}

export function webPageNode(site: Site, p: { type?: "WebPage" | "AboutPage" | "ContactPage"; path: string; name: string; description?: string }): JsonLdNode {
	return node({ ...pageBase(site, p.type ?? "WebPage", p.path, "webpage"), name: p.name, description: p.description });
}

export function collectionPageNode(site: Site, p: { path: string; name: string; description?: string }): JsonLdNode {
	return node({ ...pageBase(site, "CollectionPage", p.path, "webpage"), name: p.name, description: p.description });
}

/** A person; with a path, `@id` is `<url>#person`. `worksFor` points at the owner. */
export function personNode(
	site: Site,
	p: { name: string; path?: string; jobTitle?: string; image?: string; description?: string; sameAs?: readonly string[]; worksFor?: boolean },
): JsonLdNode {
	const url = abs(site, p.path);
	return node({
		"@type": "Person",
		"@id": url ? `${url}#person` : undefined,
		name: p.name,
		url,
		jobTitle: p.jobTitle,
		image: abs(site, p.image),
		description: p.description,
		sameAs: p.sameAs ? [...p.sameAs] : undefined,
		worksFor: p.worksFor ? ref(siteIds(site).owner) : undefined,
	});
}

/** A page about one person; `person` is its main entity (the node, or a reference to it). */
export function profilePageNode(site: Site, p: { path: string; name: string; person: JsonLdNode | Ref }): JsonLdNode {
	return node({ ...pageBase(site, "ProfilePage", p.path, "webpage"), name: p.name, mainEntity: p.person });
}

/** The questions the page shows, as a FAQPage. No questions: none. */
export function faqPageNode(site: Site, p: { path: string; name: string; items: readonly { question: string; answer: string }[] }): JsonLdNode | undefined {
	const items = p.items.filter((i) => i.question && i.answer);
	if (!items.length) return undefined;
	return node({
		...pageBase(site, "FAQPage", p.path, "faq"),
		name: p.name,
		mainEntity: items.map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
	});
}

/** A service the owner provides. */
export function serviceNode(site: Site, p: { name: string; path: string; description?: string; image?: string }): JsonLdNode {
	const url = absoluteUrl(site, p.path);
	return node({
		"@type": "Service",
		"@id": `${url}#service`,
		name: p.name,
		url,
		description: p.description,
		image: abs(site, p.image),
		provider: ref(siteIds(site).owner),
	});
}

/** A piece of work (a project or case study) the owner made. */
export function creativeWorkNode(site: Site, p: { name: string; path: string; description?: string; image?: string; date?: Date }): JsonLdNode {
	const url = absoluteUrl(site, p.path);
	return node({
		"@type": "CreativeWork",
		"@id": `${url}#work`,
		name: p.name,
		url,
		description: p.description,
		image: abs(site, p.image),
		datePublished: iso(p.date),
		creator: ref(siteIds(site).owner),
	});
}

/**
 * A post. Reads only the fields of `BlogPostingInput`: never a body, so a locked post's text cannot reach the page.
 * dateModified is the later of the publish and update dates; isAccessibleForFree comes from the post's access.
 */
export function blogPostingNode(site: Site, p: BlogPostingInput): JsonLdNode {
	const ids = siteIds(site);
	const url = absoluteUrl(site, p.path);
	const published = iso(p.date);
	// An author with a page has the @id of that page's Person (personNode), so the two are one person.
	const authors = (p.authors ?? []).filter((a) => a.name).map((a) => {
		const at = abs(site, a.path);
		return { "@type": "Person", "@id": at ? `${at}#person` : undefined, name: a.name, url: at };
	});
	return node({
		"@type": "BlogPosting",
		"@id": `${url}#article`,
		headline: p.title,
		description: p.description,
		image: abs(site, p.image),
		url,
		mainEntityOfPage: url,
		datePublished: published,
		dateModified: published ? iso(latestDate(p.date, p.updated)) : undefined,
		author: authors.length ? authors : ref(ids.owner),
		publisher: ref(ids.owner),
		isPartOf: p.series?.name ? { "@type": "CreativeWorkSeries", name: p.series.name, url: abs(site, p.series.path) } : undefined,
		isAccessibleForFree: p.access === undefined ? undefined : p.access === "public",
	});
}

export const jsonLdGraph = (nodes: readonly (JsonLdNode | undefined)[]): JsonLdGraph => ({
	"@context": "https://schema.org",
	"@graph": nodes.filter((n): n is JsonLdNode => !!n),
});

/** The script's text: JSON with every "<" as < (as EmDash's page/metadata.ts), so no value can close the script. */
export const jsonLdScript = (graph: JsonLdGraph | JsonLdNode): string => JSON.stringify(graph).replace(/</g, "\\u003c");
