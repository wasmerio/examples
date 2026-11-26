/**
 * Entries to the plain props the theme's components and the kit parts take (decision 0003): a page maps an entry
 * here and passes the result, never the entry. Only the fields a part shows, and no undefined keys, reach the markup.
 *
 * Plain Node loads this file (scripts/units/view.test.mjs): type imports, the rules and src/utils only.
 */
import type { UiImage } from "@astronomic/ui/lib/image.ts";
import type { ContentImage } from "@astronomic/content";
import type { CollagePhoto, Job, Post, Project, Talk, UsesItem } from "../content/model";
import { groupUses, jobYears } from "../content/rules";
import { strings } from "../theme.strings";
import { postHref, projectHref } from "./routes";

/** Copies the keys that hold a value. */
function defined<T extends object>(o: T): T {
	return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

/** A photo as a plain URL, for a kit part with no image component. */
export function toUiImage(img: ContentImage | undefined): UiImage | undefined {
	if (!img) return undefined;
	return defined({ src: img.src, alt: img.alt, width: img.width, height: img.height });
}

/** How many tile colors there are for a mark with no logo (--v-tile-1 … --v-tile-6 in vesper.css). */
export const TILES = 6;

/** A mark's tile color, 1 to TILES: the same name always gets the same one. */
export function tileOf(name: string): number {
	let sum = 0;
	for (const ch of name) sum = (sum * 31 + (ch.codePointAt(0) ?? 0)) % 9973;
	return (sum % TILES) + 1;
}

/** A mark's letters when it has no logo: the first two letters of the first word, the first upper case ("Sw"). */
export function initialsOf(name: string): string {
	const [first = ""] = name.trim().split(/\s+/);
	const [a = "", b = ""] = [...first];
	return a.toUpperCase() + b.toLowerCase();
}

/** A row in a post list (PostRow): the category as its label, the thumbnail for the cut square beside it. */
export type PostRowItem = {
	slug: string;
	href: string;
	title: string;
	date?: Date;
	category?: string;
	summary?: string;
	thumbnail?: ContentImage;
};

export function toPostRow(p: Post): PostRowItem {
	return defined({ slug: p.slug, href: postHref(p.slug), title: p.title, date: p.date, category: p.category?.label, summary: p.summary, thumbnail: p.thumbnail });
}

/** A mark: a logo image, else the initials on a tile color. */
export type Mark = { logo?: ContentImage; initials: string; tile: number };

/** A job in the Work card and on the about page. */
export type WorkRow = Mark & { company: string; role: string; years: string; href?: string };

export function toWorkRow(job: Job, nowLabel: string): WorkRow {
	return defined({ company: job.company, role: job.role, years: jobYears(job, nowLabel), href: job.link, logo: job.logo, initials: initialsOf(job.company), tile: tileOf(job.company) });
}

/** A project in the home Projects card. */
export type ProjectItem = Mark & { href: string; title: string; summary?: string };

export function toProjectItem(p: Project): ProjectItem {
	return defined({ href: projectHref(p.slug), title: p.title, summary: p.summary, logo: p.logo, initials: initialsOf(p.title), tile: tileOf(p.title) });
}

/** A photo in the collage band. The layout picks its cut corner; `href` makes it a link (and a tab stop). */
export type CollageItem = { slug: string; image: ContentImage; alt: string; place?: string; year?: number; geo?: string; href?: string };

export function toCollagePhoto(c: CollagePhoto): CollageItem {
	return defined({ slug: c.slug, image: c.image, alt: c.alt, place: c.place, year: c.year, geo: c.geo, href: c.link });
}

/** A project on /projects and under "More projects": its photo, mark, line, year and outside link. */
export type ProjectCardItem = Mark & { slug: string; href: string; title: string; summary?: string; year?: number; image?: ContentImage; link?: { href: string; label: string } };

export function toProjectCard(p: Project): ProjectCardItem {
	return defined({
		slug: p.slug,
		href: projectHref(p.slug),
		title: p.title,
		summary: p.summary,
		year: p.year,
		image: p.image,
		link: p.link ? { href: p.link, label: strings.projects.hasLink } : undefined,
		logo: p.logo,
		initials: initialsOf(p.title),
		tile: tileOf(p.title),
	});
}

/** A talk on /speaking. */
export type TalkItem = { slug: string; title: string; event: string; date: Date; place?: string; summary?: string; video?: string; slides?: string };

export function toTalk(t: Talk): TalkItem {
	return defined({ slug: t.slug, title: t.title, event: t.event, date: t.date, place: t.place, summary: t.summary, video: t.video, slides: t.slides });
}

/** Talks in rule order (newest first) grouped by their year (UTC), the years in the order they first appear. */
export function talksByYear<T extends { date: Date }>(talks: readonly T[]): { year: number; talks: T[] }[] {
	const years = new Map<number, T[]>();
	for (const talk of talks) {
		const year = talk.date.getUTCFullYear();
		const list = years.get(year);
		if (list) list.push(talk);
		else years.set(year, [talk]);
	}
	return [...years].map(([year, list]) => ({ year, talks: list }));
}

/** A uses item: the name, its note, and the link (its words, else its address; a button or a text link) when it has one. */
export type UsesRow = { slug: string; name: string; note?: string; link?: { href: string; label: string; button?: true } };

/** A uses group: its heading, its id (the jump links' target), its photo when an item gives it one, and its items. */
export type UsesGroup = { group: string; id: string; image?: ContentImage; items: UsesRow[] };

/** An id from a group's name: "Camera bag" → "uses-camera-bag" (letters and digits, the rest a hyphen). */
export function usesGroupId(group: string): string {
	const slug = group
		.normalize("NFKD")
		.replace(/\p{M}+/gu, "")
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/^-+|-+$/g, "");
	return `uses-${slug || "group"}`;
}

/**
 * The uses items in their groups (rules.ts `groupUses`), each item a plain row. Each group gets a stable id from its
 * name (a second group whose name gives the same id gets "-2", and so on) and the first group photo its items have.
 */
export function toUsesGroups(items: readonly UsesItem[]): UsesGroup[] {
	const seen = new Map<string, number>();
	return groupUses(items).map(({ group, items: list }) => {
		const base = usesGroupId(group);
		const n = (seen.get(base) ?? 0) + 1;
		seen.set(base, n);
		return defined({
			group,
			id: n === 1 ? base : `${base}-${n}`,
			image: list.find((u) => u.groupImage)?.groupImage,
			items: list.map((u) =>
				defined({
					slug: u.slug,
					name: u.name,
					note: u.note,
					link: u.link ? defined({ href: u.link, label: u.linkLabel?.trim() || strings.uses.visit, button: u.linkButton ? (true as const) : undefined }) : undefined,
				}),
			),
		});
	});
}
