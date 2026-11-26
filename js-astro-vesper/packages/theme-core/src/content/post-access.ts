/**
 * The public view of a post: one projection for every page, list, feed item, search hit and share card.
 *
 *   createThemeContent<Model, Settings, SourceModel>(source, DEFAULT_SETTINGS, {
 *   	output: import.meta.env.CONTENT_OUTPUT,
 *   	access: { canRead, collections: { posts: postAccess({ keep: ["tags"] }) } },
 *   });
 *
 * A readable post is the record (minus `preview` and `authorExcerpt`) with an excerpt, a description and a reading
 * time. A locked post is built from an allow list: `PublicPostFields`, the preview, its headings, and only the
 * record keys named in `keep`. Nothing it holds comes from the body except the preview: the excerpt and the SEO
 * description are the author's only when they are not copied from the body after the preview.
 *
 * Imports only types from @astronomic/content: plain Node can load it. withAccess runs the no-rich-text guard on
 * every locked view, kept keys included.
 */
import type { Access, AccessRule, ContentImage, EntryMeta, Locked, Preview, Readable, RichText, Seo } from "@astronomic/content";
import { decodeEntities, type OutlineItem } from "../outline.ts";
import { bodySignature, bodyText, makePreview, PREVIEW_BOUNDS, type PreviewBounds, previewBlocks, previewOutline, previewText, readingTime } from "./preview.ts";
import { trimSummary } from "./summary.ts";

/** `authorExcerpt`: only text the author wrote as the excerpt. A source map must never fill it from the body (the projection checks). */
export type PostRecord = EntryMeta & {
	slug: string;
	title: string;
	date?: Date;
	updated?: Date;
	authorExcerpt?: string;
	image?: ContentImage;
	body: RichText;
	access: Access;
	/** The author's preview. */
	preview?: string | RichText;
};

/** The SEO a locked post may carry: an allow list, the description checked against the body. */
export type PublicSeo = Pick<Seo, "title" | "description" | "image" | "canonical" | "noindex">;

export type PublicPostFields = {
	slug: string;
	title: string;
	access: Access;
	locked: boolean;
	excerpt?: string;
	description?: string;
	readingTime?: number;
	date?: Date;
	updated?: Date;
	image?: ContentImage;
	seo?: PublicSeo;
	ref?: EntryMeta["ref"];
};

export type ReadablePost<R extends PostRecord = PostRecord> = Readable<Omit<R, "preview" | "authorExcerpt">> & PublicPostFields & { locked: false };

/** Only PublicPostFields plus the record keys the theme names in `postAccess({ keep })`, and none of those may hold rich text. */
export type LockedPost<R extends PostRecord = PostRecord, K extends keyof R = never> = Locked<Pick<R, K>> &
	Omit<PublicPostFields, "ref"> & {
		locked: true;
		preview?: Preview;
		headings: OutlineItem[];
		/** None: a locked post's page must not give a source hook the entry's identity (EmDash would reload it). */
		ref?: never;
	};

export type PublicPost<R extends PostRecord = PostRecord, K extends keyof R = never> = ReadablePost<R> | LockedPost<R, K>;

/** Keys the projection sets or holds back itself: `keep` may not name them (it would restore the raw field). */
export const POST_OWNED_KEYS = [
	"slug",
	"title",
	"access",
	"locked",
	"reason",
	"excerpt",
	"authorExcerpt",
	"description",
	"readingTime",
	"date",
	"updated",
	"image",
	"seo",
	"ref",
	"edit",
	"body",
	"preview",
	"headings",
] as const;
export type PostOwnedKey = (typeof POST_OWNED_KEYS)[number];

const EXCERPT = 160;
const ACCESS = new Set<unknown>(["public", "members", "paid"]);
/** The same fail-closed rule as @astronomic/content's `accessOf` (this file imports only its types). */
const accessOf = (value: unknown): Access => (ACCESS.has(value) ? (value as Access) : "paid");

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);

/**
 * Case-insensitive; every whitespace-separated word of the query is in the text; an empty query matches nothing.
 * The same rule as withAccess's default match.
 */
export function publicMatch(text: string, query: string): boolean {
	const terms = words(query);
	if (!terms.length) return false;
	const hay = text.toLowerCase();
	return terms.every((t) => hay.includes(t));
}

/** Words in a comparable form: lower case, letters and digits only (Markdown marks, punctuation and spacing ignored). */
/** Accents removed (café → cafe), so a copy typed without them is still found. */
const unaccented = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "");
const tokens = (text: string): string[] => unaccented(text).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const joined = (words: readonly string[]) => ` ${words.join(" ")} `;
/** How many words in a row count as copied. */
const RUN = 8;
const CUT = /(…|\.\.\.)\s*$/;
/** Words that must remain when the possibly cut last word is left out (without an ellipsis). */
const MIN_UNCUT = 8;
/** The separator-free backstop: window length, and the shortest text compared whole. */
const FLAT_RUN = 40;
const FLAT_MIN = 24;
/** Lower-case letters and digits only. */
const squashed = (text: string) => unaccented(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
/** Markdown marks removed, inside words too (`get_user` → `getuser`), as a plain-text excerpt does. */
const unmarked = (text: string) => text.replace(/[*_~`]/g, "");

/**
 * The body's comparison forms, indexed once per body: every run of 8 words (`grams`) and a hash of every
 * 40-character separator-free window (`hashes`, checked against the text on a hit), so a long body costs one pass.
 */
type BodyForms = { tokens: string[]; flat: string[]; grams: Set<string>; hashes: Set<number> };

/** A hash of `text.slice(at, at + FLAT_RUN)`. */
function windowHash(text: string, at: number): number {
	let h = 0;
	for (let i = at; i < at + FLAT_RUN; i++) h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0;
	return h;
}

/** 31^(FLAT_RUN - 1), for the rolling hash. */
const TOP = (() => {
	let p = 1;
	for (let i = 1; i < FLAT_RUN; i++) p = Math.imul(p, 31);
	return p;
})();
type Shown = { tokens: string; flat: string };

/**
 * True when `text` is copied from the body beyond what the preview shows: some run of 8 words of it (or all of
 * it, when shorter) is in the body text and not in the preview text. A trailing "…" or "..." marks a cut copy
 * (Agency's `h.excerpt`); the last word is also compared left out, as it may be cut. The body side is all of its
 * text (`allBodyText`), not only its prose. Checked as written and as plain text
 * (Markdown marks and link targets removed). With no preview, any run found in the body counts.
 */
function copiedFromBody(text: string, body: BodyForms, shown: Shown): boolean {
	const plain = previewBlocks(text)
		.map((b) => b.text)
		.join(" ");
	const cut = CUT.test(text.trim());
	const decoded = decodeEntities(text);
	const variants = [text, decoded, plain, unmarked(strippedSource(decoded))];
	for (const variant of variants) {
		const all = tokens(variant.replace(CUT, ""));
		// The last word may be cut mid-word: also compare without it, after an ellipsis or when 8 words remain
		// (an honest excerpt is not cut down to a phrase any body may hold).
		const forms = all.length > 1 && (cut || all.length - 1 >= MIN_UNCUT) ? [all, all.slice(0, -1)] : [all];
		for (const words of forms) {
			const n = Math.min(RUN, words.length);
			for (let i = 0; n > 0 && i + n <= words.length; i++) {
				const run = joined(words.slice(i, i + n));
				const inBody = n === RUN ? body.grams.has(run) : body.tokens.some((b) => b.includes(run));
				if (inBody && !shown.tokens.includes(run)) return true;
			}
		}
	}
	// Backstop, free of separators: letters and digits only, so a copy that joined or split words differently
	// (marks deleted inside words, odd punctuation) is still found. Windows of 40 characters; a shorter text of at
	// least 24 is compared whole. A cut last word is a prefix in this form, so it needs no special case.
	for (const variant of variants) {
		const flat = squashed(variant.replace(CUT, ""));
		const size = flat.length >= FLAT_RUN ? FLAT_RUN : flat.length >= FLAT_MIN ? flat.length : 0;
		for (let i = 0; size > 0 && i + size <= flat.length; i++) {
			if (size === FLAT_RUN && !body.hashes.has(windowHash(flat, i))) continue;
			const run = flat.slice(i, i + size);
			if (!shown.flat.includes(run) && body.flat.some((b) => b.includes(run))) return true;
		}
	}
	return false;
}

/** Raw Markdown or MDX with link targets, image syntax, tags and components removed, their text kept. */
function strippedSource(md: string): string {
	return md
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/!\[[^\]]*\]\[[^\]]*\]/g, " ")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
		.replace(/<[^>]*>/g, "");
}

/**
 * The body as token strings for the copy check, in several forms, so a copy made either way is found: the raw
 * source (all of it: lists, quotes, code, component children), the source with link targets, images and tags
 * removed (a plain-text copy of marked-up prose), the same with every Markdown mark removed, the prose text (`bodyText`), and every string of a structured
 * body (Portable Text). HTML: with tags removed, joined and spaced.
 */
function bodyForms(body: RichText): BodyForms {
	const forms = [allBodyText(body), bodyText(body)];
	const v = body.value as unknown;
	if (body.format === "markdown") {
		const stripped = strippedSource(forms[0]);
		forms.push(stripped, unmarked(stripped));
	}
	if (body.format === "html" && typeof v === "string") forms.push(decodeEntities(v.replace(/<[^>]*>/g, "")));
	// Entities decoded too: a Markdown body may write `A&amp;B` where a copy says `A&B`.
	const all = [...new Set([...forms, ...forms.map(decodeEntities)])];
	const words = all.map(tokens);
	const flat = [...new Set(all.map(squashed))];
	const grams = new Set<string>();
	for (const w of words) for (let i = 0; i + RUN <= w.length; i++) grams.add(joined(w.slice(i, i + RUN)));
	const hashes = new Set<number>();
	for (const f of flat) {
		if (f.length < FLAT_RUN) continue;
		let h = windowHash(f, 0);
		hashes.add(h);
		for (let i = 1; i + FLAT_RUN <= f.length; i++) {
			h = (Math.imul(h - Math.imul(f.charCodeAt(i - 1), TOP), 31) + f.charCodeAt(i + FLAT_RUN - 1)) | 0;
			hashes.add(h);
		}
	}
	return { tokens: [...new Set(words.map(joined))], flat, grams, hashes };
}

/** Per body object: its forms, and each text's copied-or-not answer for a given preview. */
const memo = new WeakMap<object, { signature: string; forms: BodyForms; answers: Map<string, boolean> }>();

/** The body's memo, rebuilt when the body no longer says what it said (changed in place). */
function bodyMemo(body: RichText) {
	const signature = bodySignature(body);
	let m = memo.get(body);
	if (!m || m.signature !== signature) memo.set(body, (m = { signature, forms: bodyForms(body), answers: new Map() }));
	return m;
}

const SKIP_KEYS = new Set(["_type", "_key", "style", "listItem", "marks", "markDefs", "level"]);

/**
 * Every piece of text a body holds, for the copy check: the raw Markdown or MDX source (lists, quotes, code and
 * component children included), every string of every Portable Text block (spans, list items, alt text, code),
 * HTML with only its tags removed. Wider than `bodyText`, which keeps prose only.
 */
function allBodyText(body: RichText): string {
	const v = body.value as unknown;
	if (body.format === "markdown") {
		const md = v as { body?: unknown } | string | undefined;
		return typeof md === "string" ? md : typeof md?.body === "string" ? md.body : "";
	}
	if (body.format === "html" && typeof v === "string") return decodeEntities(v.replace(/<[^>]*>/g, " "));
	const out: string[] = [];
	const seen = new WeakSet<object>();
	const stack: unknown[] = [v];
	while (stack.length) {
		const x = stack.pop();
		if (typeof x === "string") out.push(x);
		else if (x && typeof x === "object" && !seen.has(x)) {
			seen.add(x);
			if (Array.isArray(x)) stack.push(...x);
			else for (const [k, child] of Object.entries(x)) if (!SKIP_KEYS.has(k)) stack.push(child);
		}
	}
	return out.reverse().join(" ");
}

function lockedSeo(seo: Seo | undefined, copied: (text: string) => boolean): PublicSeo | undefined {
	if (!seo) return undefined;
	const out: PublicSeo = {};
	if (seo.title !== undefined) out.title = seo.title;
	if (seo.image !== undefined) out.image = seo.image;
	if (seo.canonical !== undefined) out.canonical = seo.canonical;
	if (seo.noindex !== undefined) out.noindex = seo.noindex;
	if (seo.description !== undefined && !copied(seo.description)) out.description = seo.description;
	return Object.keys(out).length ? out : undefined;
}

/** Copies only defined values. */
function defined<T extends object>(obj: T): T {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/**
 * The access rule for a post collection. `keep`: extra record keys a locked view keeps (e.g. "tags", "authors");
 * withAccess's guard refuses any that holds rich text or a body. `bounds`: the preview bounds. `wpm`: reading speed.
 */
export function postAccess<R extends PostRecord, K extends Exclude<keyof R, PostOwnedKey> = never>(
	opts: { keep?: readonly K[]; bounds?: PreviewBounds; wpm?: number } = {},
): AccessRule<R, PublicPost<R, K>> {
	const { keep = [], bounds = PREVIEW_BOUNDS, wpm } = opts;
	const owned = keep.filter((k) => (POST_OWNED_KEYS as readonly PropertyKey[]).includes(k));
	if (owned.length) throw new Error(`postAccess: keep may not name ${owned.map(String).join(", ")} (the projection owns these keys).`);
	return {
		access: (record) => record.access,
		project(record, state) {
			const access = accessOf(record.access);
			if (!state.locked) {
				const { preview: _preview, authorExcerpt, ...rest } = record;
				const first = previewBlocks(record.body).find((b) => b.type === "paragraph");
				const excerpt = authorExcerpt ?? (first ? trimSummary(first.text, EXCERPT) : undefined);
				return {
					...rest,
					access,
					locked: false,
					excerpt,
					description: record.seo?.description || excerpt,
					readingTime: readingTime(bodyText(record.body), wpm),
				} as unknown as ReadablePost<R>;
			}
			const preview = state.showPreview ? makePreview({ author: record.preview, body: record.body }, bounds) : undefined;
			const known = bodyMemo(record.body);
			const shownText = previewText(preview);
			const shown: Shown = { tokens: joined(tokens(shownText)), flat: squashed(shownText.replace(CUT, "")) };
			const copied = (text: string) => {
				const key = `${shown.flat}\u0000${text}`;
				let answer = known.answers.get(key);
				if (answer === undefined) known.answers.set(key, (answer = copiedFromBody(text, known.forms, shown)));
				return answer;
			};
			const own = record.authorExcerpt !== undefined && !copied(record.authorExcerpt) ? record.authorExcerpt : undefined;
			const firstShown = preview?.blocks.find((b) => b.type === "paragraph");
			const excerpt = own ?? (firstShown ? trimSummary(firstShown.text, EXCERPT) : undefined);
			const seo = lockedSeo(record.seo, copied);
			const kept: Record<string, unknown> = {};
			for (const k of keep) if (record[k] !== undefined) kept[k as string] = record[k];
			return {
				...kept,
				...defined({
					slug: record.slug,
					title: record.title,
					access,
					excerpt,
					description: seo?.description || excerpt,
					date: record.date,
					updated: record.updated,
					image: record.image,
					seo,
					preview,
				}),
				locked: true,
				reason: state.reason,
				headings: previewOutline(preview),
			} as unknown as LockedPost<R, K>;
		},
		matches: (view, q) => publicMatch([view.title, view.excerpt ?? "", view.locked ? previewText(view.preview) : ""].join(" "), q),
		toHit: (view, hit) => ({
			collection: hit.collection,
			slug: view.slug,
			title: view.title,
			excerpt: view.excerpt,
			href: hit.href,
			// The cover image is a public field of every view, locked or not.
			...(view.image ? { image: view.image } : {}),
		}),
	};
}

/** The share card and Open Graph fields of a post, from its public view. */
export function postShare(post: PublicPost): { title: string; description?: string; image?: string; imageAlt?: string; type: "article" } {
	return defined({
		title: post.seo?.title ?? post.title,
		description: post.description,
		image: post.seo?.image ?? post.image?.src,
		imageAlt: post.seo?.image ? undefined : post.image?.alt,
		type: "article" as const,
	});
}
