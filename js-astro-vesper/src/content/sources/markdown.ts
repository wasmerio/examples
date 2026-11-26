/**
 * The Markdown source: maps the files in `content/` into the Vesper model. Collections are defined in
 * src/content.config.ts.
 *
 * A post's category, tags and series are term slugs; their labels come from content/taxonomies.json. Queries filter
 * and sort in memory with the shared rules (src/content/rules.ts).
 *
 * Every link a file sets (the socials, the menus, a project's, talk's, uses item's, job's or collage photo's link,
 * the CV file and the newsletter's action) goes through the shared check in src/content/links.ts before it enters
 * the model: a refused one is left out, and the setup check reports it.
 */
import { getEntry } from "astro:content";
import { defineAdapter, type SiteParts } from "@astronomic/content";
import { markdownKit, toImage, type MarkdownEntry, type MarkdownHelpers } from "@astronomic/content/markdown";
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
import { markdownSeo } from "../seo";
import {
	compareCollage,
	compareJobs,
	comparePages,
	comparePosts,
	compareProjects,
	compareTalks,
	compareUses,
	matchFeatured,
	matchPost,
} from "../rules";

/** One config: `h.terms()` and `taxonomies.list()` read the same collection. */
const md = markdownKit();
const ref = (e: MarkdownEntry) => ({ source: "markdown", collection: e.collection, id: e.id });
/** The frontmatter's `seo:` block and `noindex: true` as the entry's SEO (src/content/seo.ts). */
const seoOf = (e: MarkdownEntry, h: MarkdownHelpers) => markdownSeo(e.data, (image: ImageMetadata | undefined) => h.image(image)?.src);
/** Text or undefined: an empty string counts as none. */
const text = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? v : undefined);
/** One term of `taxonomy` for a slug, or undefined. */
const termOf = async (slug: string | undefined, taxonomy: string, h: MarkdownHelpers) =>
	slug ? (await h.terms([slug], taxonomy))[0] : undefined;

const posts = md.collection<Post, PostQuery>({
	collection: "posts",
	map: async (e, h) => ({
		slug: e.id,
		title: e.data.title,
		date: e.data.date,
		updated: e.data.updated,
		summary: text(e.data.summary),
		thumbnail: h.image(e.data.thumbnail, e.data.thumbnailAlt),
		category: await termOf(e.data.category, "category", h),
		tags: await h.terms(e.data.tags, "tag"),
		series: await termOf(e.data.series, "series", h),
		body: h.richText(e),
		ref: ref(e),
		seo: seoOf(e, h),
	}),
	filter: matchPost,
	sort: comparePosts,
});

const projects = md.collection<Project, ProjectQuery>({
	collection: "projects",
	map: (e, h) => ({
		slug: e.id,
		title: e.data.title,
		summary: text(e.data.summary),
		image: h.image(e.data.image, e.data.imageAlt),
		logo: h.image(e.data.logo, e.data.logoAlt ?? ""),
		link: checkedHref(e.data.link, `projects "${e.id}".link`),
		year: e.data.year,
		featured: e.data.featured,
		order: e.data.order,
		body: h.richText(e),
		ref: ref(e),
		seo: seoOf(e, h),
	}),
	filter: matchFeatured,
	sort: compareProjects,
});

const talks = md.collection<Talk>({
	collection: "talks",
	map: (e) => ({
		slug: e.id,
		title: e.data.title,
		event: e.data.event,
		date: e.data.date,
		place: text(e.data.place),
		summary: text(e.data.summary),
		video: checkedHref(e.data.video, `talks "${e.id}".video`),
		slides: checkedHref(e.data.slides, `talks "${e.id}".slides`),
		order: e.data.order,
		ref: ref(e),
	}),
	sort: compareTalks,
});

const uses = md.collection<UsesItem>({
	collection: "uses",
	map: (e, h) => ({
		slug: e.id,
		group: e.data.group,
		name: e.data.name,
		note: text(e.data.note),
		link: checkedHref(e.data.link, `uses "${e.id}".link`),
		linkButton: e.data.linkButton || undefined,
		linkLabel: text(e.data.linkLabel)?.trim(),
		groupImage: h.image(e.data.groupImage, e.data.groupImageAlt),
		order: e.data.order,
		ref: ref(e),
	}),
	sort: compareUses,
});

const jobs = md.collection<Job>({
	collection: "jobs",
	map: (e, h) => ({
		slug: e.id,
		company: e.data.company,
		role: e.data.role,
		start: e.data.start,
		end: e.data.end,
		logo: h.image(e.data.logo, e.data.logoAlt ?? ""),
		link: checkedHref(e.data.link, `jobs "${e.id}".link`),
		order: e.data.order,
		ref: ref(e),
	}),
	sort: compareJobs,
});

const collage = md.collection<CollagePhoto>({
	collection: "collage",
	map: (e, h) => ({
		slug: e.id,
		image: h.image(e.data.image, e.data.alt),
		alt: e.data.alt,
		place: text(e.data.place),
		year: e.data.year,
		geo: text(e.data.geo),
		link: checkedHref(e.data.link, `collage "${e.id}".link`),
		order: e.data.order,
		ref: ref(e),
	}),
	sort: compareCollage,
});

const pages = md.collection<Page>({
	collection: "pages",
	map: (e, h) => ({
		slug: e.id,
		title: e.data.title,
		summary: text(e.data.summary),
		image: h.image(e.data.image, e.data.imageAlt),
		imageCaption: text(e.data.imageCaption),
		body: h.richText(e),
		ref: ref(e),
		seo: seoOf(e, h),
	}),
	sort: comparePages,
});

/** The newsletter options with the empty ones left out; undefined when none is set. */
function newsletterOptionsOf(o: NewsletterOptions | undefined): NewsletterOptions | undefined {
	if (!o) return undefined;
	const honeypot = text(o.honeypot?.name)?.trim();
	const hiddenFields = (o.hiddenFields ?? []).filter((f) => text(f.name) && text(f.value));
	const out: NewsletterOptions = {
		...(text(o.emailName) ? { emailName: o.emailName!.trim() } : {}),
		...(honeypot ? { honeypot: { name: honeypot } } : {}),
		...(hiddenFields.length ? { hiddenFields } : {}),
		...(o.nameField ? { nameField: true } : {}),
		...(text(o.nameName) ? { nameName: o.nameName!.trim() } : {}),
	};
	return Object.keys(out).length ? out : undefined;
}

/** content/site.json: the person, the socials, the Now status, the newsletter and the CV. Empty strings count as none. */
const settings: NonNullable<SiteParts<Settings>["settings"]> = {
	async get() {
		const entry = (await getEntry("site", "site")) as MarkdownEntry | undefined;
		if (!entry) return {};
		const { logo, logoAlt, avatar, avatarAlt, newsletterAction, newsletterOptions, cvFile, ...rest } = entry.data;
		const action = checkedAction(newsletterAction, "settings.newsletterAction");
		// The icon id trimmed, "website" when empty, as in the EmDash source.
		const socials = (rest.socials as (Omit<SocialLink, "icon"> & { icon?: string })[] | undefined)?.map((s) => ({ ...s, icon: socialIcon(s.icon) }));
		return {
			...rest,
			tagline: text(rest.tagline),
			role: text(rest.role),
			bio: text(rest.bio),
			nowLabel: text(rest.nowLabel)?.trim(),
			nowStatus: text(rest.nowStatus)?.trim(),
			nowPlace: text(rest.nowPlace),
			newsletterNote: text(rest.newsletterNote),
			socials: checkedLinks(socials, "settings.socials"),
			logo: toImage(logo, logoAlt ?? rest.title ?? ""),
			avatar: toImage(avatar, avatarAlt ?? rest.name ?? ""),
			newsletterAction: action,
			// Options without an action are no form.
			newsletterOptions: action ? newsletterOptionsOf(newsletterOptions) : undefined,
			cvFile: checkedHref(cvFile, "settings.cvFile"),
		} as Partial<Settings>;
	},
};

export default defineAdapter<Model, Settings>()({
	name: "markdown",
	collections: { posts, projects, talks, uses, jobs, collage, pages },
	// Every menu item's link checked, at every level (src/content/links.ts).
	menus: { get: async (name, ctx) => checkedMenu(await md.site.menus.get(name, ctx), `menu "${name}"`) },
	settings,
	// Terms A to Z by label in every source, whatever order the file keeps.
	taxonomies: byLabelTaxonomies(md.site.taxonomies),
	renderers: md.renderers,
});
