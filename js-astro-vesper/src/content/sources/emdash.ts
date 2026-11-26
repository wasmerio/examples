/**
 * The EmDash source: maps EmDash collections into the Vesper model.
 * Schema and demo content: seed/seed.json (`pnpm seed:emdash`). Setup: emdash.setup.mjs.
 *
 * EmDash has no object fields, so the settings EmDash's site settings lack live in a one-entry `profile` collection
 * with flat fields (the newsletter's options are `newsletter_action`, `newsletter_email_name`, `newsletter_honeypot`,
 * `newsletter_name_field`, `newsletter_name_name` and the `newsletter_hidden` repeater), and lists are repeaters.
 * Collection and field slugs use underscores: EmDash allows no hyphens.
 *
 * A post's category, tags and series are taxonomies. A post has one category and one series at most: with two, the
 * first (A to Z by label) is kept and conformance reports the post. Every list is sorted in memory with the shared
 * rules (src/content/rules.ts), never by EmDash's SQL order, which differs; post queries filter in memory too.
 *
 * Every link the CMS holds (the socials, the menus, a project's, talk's, uses item's, job's or collage photo's link,
 * the CV file and the newsletter's action) goes through the shared check in src/content/links.ts before it enters
 * the model: a refused one is left out, and the setup check reports it in `astro dev`.
 */
import { type ContentContext, type ContentImage, defineAdapter, type SearchHit, type SiteParts } from "@astronomic/content";
import { emdashCollection, emdashComponents, emdashHooks, emdashRenderers, emdashSite } from "@astronomic/content/emdash";
import { byLabelTaxonomies } from "@astronomic/theme-core/content";
import type {
	CollagePhoto,
	Job,
	Model,
	NewsletterOptions,
	Page,
	Post,
	PostQuery,
	Project,
	ProjectQuery,
	Settings,
	SocialLink,
	Talk,
	UsesItem,
} from "../model";
import { checkedAction, checkedHref, checkedLinks, checkedMenu, socialIcon } from "../links";
import { oneTerm } from "../terms";
import { compareCollage, compareJobs, comparePages, comparePosts, compareProjects, compareTalks, compareUses, matchPost } from "../rules";
import { keptHits, listPageHits, ownListHit, SEARCH_COLLECTIONS, SEARCH_WINDOW, search as searchLimits, searchCollection, searchHref, searchSummary } from "../search";
import { getConfig } from "../../utils/config";
import { linkOn } from "../../utils/routes";

type Row = Record<string, unknown>;

/** Text or undefined: EmDash stores empty fields as "" or null. */
const text = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
/** A date field (an ISO string, or a Date) or undefined. */
const date = (v: unknown) => {
	const d = v instanceof Date ? v : typeof v === "string" && v.trim() !== "" ? new Date(v) : undefined;
	return d && !Number.isNaN(d.getTime()) ? d : undefined;
};
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const rows = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
/** Booleans are stored as 0/1; `where` needs a string. */
const flag = (b: boolean | undefined) => (b === undefined ? undefined : b ? "1" : "0");
/** An image with an empty alt: a decorative one, whatever the media library says. */
const decorative = (img: ContentImage | undefined) => (img ? { ...img, alt: "" } : undefined);

const posts = emdashCollection<Post, PostQuery>({
	collection: "posts",
	taxonomies: ["category", "tag", "series"],
	// A post's taxonomies: filtered in memory, so every key filters the same way in every source.
	filter: matchPost,
	sort: comparePosts,
	map: async (e, h) => ({
		slug: e.id,
		title: text(e.data.title) ?? e.id,
		date: e.data.publishedAt ?? undefined,
		updated: date(e.data.updated),
		summary: text(e.data.summary)?.trim(),
		thumbnail: h.image(e.data.thumbnail),
		category: oneTerm(h.terms("category"), `post "${e.id}".category`),
		tags: h.terms("tag"),
		series: oneTerm(h.terms("series"), `post "${e.id}".series`),
		body: h.richText(e.data.content),
		ref: h.ref(),
		edit: h.edit({ title: "title", summary: "summary", thumbnail: "thumbnail", body: "content" }),
		seo: await h.seo(),
	}),
});

const projects = emdashCollection<Project, ProjectQuery>({
	collection: "projects",
	where: (q) => ({ featured: flag(q.featured) }),
	sort: compareProjects,
	map: async (e, h) => ({
		slug: e.id,
		title: text(e.data.title) ?? e.id,
		summary: text(e.data.summary),
		image: h.image(e.data.image),
		// Logos are decorative (hidden from screen readers), so their alt is empty, as in the Markdown source.
		logo: decorative(h.image(e.data.logo)),
		link: checkedHref(e.data.link, `projects "${e.id}".link`),
		year: num(e.data.year),
		featured: Boolean(e.data.featured),
		order: num(e.data.order),
		body: h.richText(e.data.content),
		ref: h.ref(),
		edit: h.edit({ title: "title", summary: "summary", image: "image", logo: "logo", link: "link", body: "content" }),
		seo: await h.seo(),
	}),
});

const talks = emdashCollection<Talk>({
	collection: "talks",
	sort: compareTalks,
	map: (e, h) => ({
		slug: e.id,
		title: text(e.data.title) ?? e.id,
		event: text(e.data.event) ?? "",
		// A required field: a missing one stays undefined, so the conformance check reports it.
		date: date(e.data.date) as Date,
		place: text(e.data.place),
		summary: text(e.data.summary),
		video: checkedHref(e.data.video, `talks "${e.id}".video`),
		slides: checkedHref(e.data.slides, `talks "${e.id}".slides`),
		order: num(e.data.order),
		ref: h.ref(),
		edit: h.edit({ title: "title", event: "event", place: "place", summary: "summary" }),
	}),
});

const uses = emdashCollection<UsesItem>({
	collection: "uses",
	sort: compareUses,
	map: (e, h) => ({
		slug: e.id,
		group: text(e.data.group) ?? "",
		name: text(e.data.name) ?? e.id,
		note: text(e.data.note),
		link: checkedHref(e.data.link, `uses "${e.id}".link`),
		linkButton: e.data.link_button ? true : undefined,
		linkLabel: text(e.data.link_label)?.trim(),
		groupImage: h.image(e.data.group_image),
		order: num(e.data.order),
		ref: h.ref(),
		edit: h.edit({ group: "group", name: "name", note: "note", linkLabel: "link_label", groupImage: "group_image" }),
	}),
});

const jobs = emdashCollection<Job>({
	collection: "jobs",
	sort: compareJobs,
	map: (e, h) => ({
		slug: e.id,
		company: text(e.data.company) ?? e.id,
		role: text(e.data.role) ?? "",
		// A required field: a missing one stays undefined, so the conformance check reports it.
		start: num(e.data.start) as number,
		end: num(e.data.end),
		logo: decorative(h.image(e.data.logo)),
		link: checkedHref(e.data.link, `jobs "${e.id}".link`),
		order: num(e.data.order),
		ref: h.ref(),
		edit: h.edit({ company: "company", role: "role", logo: "logo" }),
	}),
});

const collage = emdashCollection<CollagePhoto>({
	collection: "collage",
	sort: compareCollage,
	map: (e, h) => {
		const alt = text(e.data.alt)?.trim() ?? "";
		const image = h.image(e.data.image);
		return {
			slug: e.id,
			// The entry's own alt field wins over the media library's, so both sources describe the photo the same way.
			image: image ? { ...image, alt } : { src: "", alt },
			alt,
			place: text(e.data.place),
			year: num(e.data.year),
			geo: text(e.data.geo),
			link: checkedHref(e.data.link, `collage "${e.id}".link`),
			order: num(e.data.order),
			ref: h.ref(),
			edit: h.edit({ image: "image", alt: "alt", place: "place", geo: "geo" }),
		};
	},
});

const pages = emdashCollection<Page>({
	collection: "pages",
	sort: comparePages,
	map: async (e, h) => ({
		slug: e.id,
		title: text(e.data.title) ?? e.id,
		summary: text(e.data.summary),
		image: h.image(e.data.image),
		imageCaption: text(e.data.image_caption),
		body: h.richText(e.data.content),
		ref: h.ref(),
		edit: h.edit({ title: "title", summary: "summary", image: "image", imageCaption: "image_caption", body: "content" }),
		seo: await h.seo(),
	}),
});

/** The newsletter's options from the profile's flat fields; undefined when none is set. */
function newsletterOptionsOf(d: Row): NewsletterOptions | undefined {
	const emailName = text(d.newsletter_email_name)?.trim();
	const honeypot = text(d.newsletter_honeypot)?.trim();
	const nameName = text(d.newsletter_name_name)?.trim();
	const hiddenFields = rows(d.newsletter_hidden).flatMap((r) => (text(r.name) && text(r.value) ? [{ name: r.name as string, value: r.value as string }] : []));
	const out: NewsletterOptions = {
		...(emailName ? { emailName } : {}),
		...(honeypot ? { honeypot: { name: honeypot } } : {}),
		...(hiddenFields.length ? { hiddenFields } : {}),
		...(d.newsletter_name_field ? { nameField: true } : {}),
		...(nameName ? { nameName } : {}),
	};
	return Object.keys(out).length ? out : undefined;
}

/** The socials repeater: rows with a label, a link and an icon id. */
const socials = (v: unknown): SocialLink[] =>
	rows(v).flatMap((r) => (text(r.label) && text(r.href) ? [{ label: r.label as string, href: r.href as string, icon: socialIcon(r.icon) }] : []));

/** The one-entry `profile` collection: the settings EmDash's site settings have no keys for. */
const profile = emdashCollection<{ slug: string } & Partial<Settings>>({
	collection: "profile",
	map: (e, h) => {
		const d = e.data;
		const action = checkedAction(d.newsletter_action, "settings.newsletterAction");
		const avatar = h.image(d.avatar);
		return {
			slug: e.id,
			name: text(d.name),
			role: text(d.role),
			avatar,
			headline: text(d.headline),
			bio: text(d.bio),
			// EmDash's site `social` setting has fixed keys, so links live here.
			socials: checkedLinks(socials(d.socials), "settings.socials"),
			nowLabel: text(d.now_label)?.trim(),
			nowStatus: text(d.now_status)?.trim(),
			nowUpdated: date(d.now_updated),
			nowPlace: text(d.now_place),
			newsletterAction: action,
			// Options without an action are no form.
			newsletterOptions: action ? newsletterOptionsOf(d) : undefined,
			newsletterNote: text(d.newsletter_note),
			cvFile: checkedHref(d.cv_file, "settings.cvFile"),
			sampleContent: d.sample_content === undefined || d.sample_content === null ? undefined : Boolean(d.sample_content),
		};
	},
});

const site = emdashSite({
	search: {
		collections: Object.values(SEARCH_COLLECTIONS),
		limit: SEARCH_WINDOW,
		href: (collection, slug) => searchHref(collection, slug),
	},
});

/** The model collection that holds a searched collection's entries. */
const searched = { posts, projects, pages } as const;

/**
 * EmDash's hit snippet is the matched field, often the title again, so each hit's summary comes from its own entry
 * (src/content/search.ts), and its collection is the model's name, as in every source. EmDash is asked for
 * `SEARCH_WINDOW` hits; a hit on an optional page that is off (the config) and an entry hidden from search engines are
 * left out, as a static build indexes neither, before the list is cut, so they never crowd out a hit the page can
 * show. Then /speaking and /uses, one hit each when they match (listPageHits), so a server build finds what a static
 * build finds.
 */
async function searchSite(q: string, ctx?: ContentContext): Promise<SearchHit[]> {
	const [found, talkList, usesList, speakingPage, usesPage, siteSettings] = await Promise.all([
		site.search?.(q, ctx),
		talks.list(undefined, ctx),
		uses.list(undefined, ctx),
		pages.get("speaking", ctx),
		pages.get("uses", ctx),
		settings.get(ctx),
	]);
	const { config } = getConfig(siteSettings);
	const on = (href: string) => linkOn(href, config);
	// /speaking and /uses: one hit each after the entries, as a static build indexes them, worded by their pages
	// entries when there are some (src/content/search.ts).
	const pageHits = listPageHits(q, { talks: talkList.items, uses: usesList.items, pages: { speaking: speakingPage, uses: usesPage } }).filter((hit) => on(hit.href));
	// The pages entries that only word a list page are not hits of their own.
	const hits = (found ?? []).filter((hit) => !ownListHit(hit));
	const entries = await keptHits(hits, {
		on,
		max: searchLimits.fetch,
		keep: async (hit) => {
			const name = searchCollection(hit.collection);
			if (!name) return hit;
			// A hit whose entry fails to load keeps its place in the results, without a summary.
			const entry = await searched[name].get(hit.slug, ctx).catch(() => undefined);
			if (entry?.seo?.noindex) return undefined;
			return { ...hit, collection: name, excerpt: entry ? searchSummary(name, entry as Parameters<typeof searchSummary>[1]) : undefined };
		},
	});
	return [...entries, ...pageHits].slice(0, searchLimits.fetch);
}

/** Title and tagline from site settings; the rest from the `profile` entry. */
const settings: NonNullable<SiteParts<Settings>["settings"]> = {
	async get(ctx) {
		const [base, details] = await Promise.all([site.settings?.get(ctx), profile.get("profile", ctx)]);
		const { slug: _slug, ...rest } = details ?? { slug: "" };
		return { ...rest, ...base } as Partial<Settings>;
	},
};

export default defineAdapter<Model, Settings>()({
	name: "emdash",
	collections: { posts, projects, talks, uses, jobs, collage, pages },
	settings,
	// Every menu item's link checked, at every level (src/content/links.ts).
	menus: { get: async (name, ctx) => checkedMenu(await site.menus?.get(name, ctx), `menu "${name}"`) },
	// Terms A to Z by label in every source, whatever order the database keeps.
	taxonomies: byLabelTaxonomies(site.taxonomies),
	search: searchSite,
	renderers: emdashRenderers,
	hooks: emdashHooks,
	components: emdashComponents,
});
