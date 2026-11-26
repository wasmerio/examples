/**
 * The Vesper content model. Plain types; every source maps into these (decision 0003). Each collection declares its
 * entry type and the queries pages may run.
 */
import type { ContentImage, EntryMeta, RichText, SiteSettings, Term } from "@astronomic/content";
import type { SignupFormOptions } from "@astronomic/ui/components/SignupForm.astro";
// Types only: plain Node unit tests do not load it.
import type { ConfigSettings } from "../utils/config";

export type Link = { label: string; href: string };
/** A labeled social link. `icon` names an icon in src/icons (an unknown id shows the Website icon). */
export type SocialLink = Link & { icon: string };

export type Post = EntryMeta & {
	slug: string;
	title: string;
	date?: Date;
	/** The last real change: "Updated <date>" in the article's meta line when it is on a later day than `date`. */
	updated?: Date;
	/** Plain text: the row excerpt and the meta description. */
	summary?: string;
	/** The row's thumbnail and the article's hero figure. */
	thumbnail?: ContentImage;
	/** One at most. */
	category?: Term;
	/** Sorted by label. */
	tags: Term[];
	/** One at most. A series post shows the other parts, oldest first. */
	series?: Term;
	body: RichText;
};
/** Default sort: newest first. `category`, `tag` and `series` are term slugs. */
export type PostQuery = { category?: string; tag?: string; series?: string; sort?: "date-desc" | "date-asc" | "title" };

export type Project = EntryMeta & {
	slug: string;
	title: string;
	/** Plain text, one line. */
	summary?: string;
	/** The card's and the project page's photo. */
	image?: ContentImage;
	/** The small mark on the home Projects card. */
	logo?: ContentImage;
	/** The live site or the repo. */
	link?: string;
	year?: number;
	featured: boolean;
	order?: number;
	body: RichText;
};
export type ProjectQuery = { featured?: boolean };

export type Talk = EntryMeta & {
	slug: string;
	title: string;
	event: string;
	date: Date;
	/** "Seattle, WA". */
	place?: string;
	/** Plain text: one or two lines under the title. */
	summary?: string;
	/** A link to the recording. */
	video?: string;
	/** A link to the slides. */
	slides?: string;
	order?: number;
};

export type UsesItem = EntryMeta & {
	slug: string;
	/** The heading the item sits under ("Desk", "Camera bag"). */
	group: string;
	name: string;
	/** Plain text. */
	note?: string;
	link?: string;
	/** Shows the link as a button, not a text link. */
	linkButton?: boolean;
	/** The link's words. Empty: "Visit the site" (src/theme.strings.ts). */
	linkLabel?: string;
	/**
	 * A photo for the item's group, shown under the group's heading. A group takes the first one its items have, in
	 * their order; a group with none has no photo.
	 */
	groupImage?: ContentImage;
	order?: number;
};

export type Job = EntryMeta & {
	slug: string;
	company: string;
	role: string;
	/** The first year. */
	start: number;
	/** The last year. Empty: "Now". */
	end?: number;
	logo?: ContentImage;
	link?: string;
	order?: number;
};

/** A collage photo. The layout owns its cut corner. */
export type CollagePhoto = EntryMeta & {
	slug: string;
	image: ContentImage;
	/** The photo's alt text (required). */
	alt: string;
	/** The Field notes caption: "Crater Lake, OR" and "2023". */
	place?: string;
	year?: number;
	/** The Trail map label: "42.94° N · 7,100 ft". */
	geo?: string;
	/** Makes the photo a link (and a tab stop). */
	link?: string;
	order?: number;
};

export type Page = EntryMeta & {
	slug: string;
	title: string;
	/** Plain text: the page's lead line and meta description. */
	summary?: string;
	/** The page's photo: the Now page's aside, the about page's portrait when there is no avatar. */
	image?: ContentImage;
	/** A short line under the photo, where the page shows one ("Last weekend’s walk, 9.4 miles."). */
	imageCaption?: string;
	body: RichText;
};

/** The newsletter's form options beyond the action: the kit's SignupForm options, no tone or class. */
export type NewsletterOptions = Pick<SignupFormOptions, "emailName" | "honeypot" | "hiddenFields" | "nameField" | "nameName">;

export type Settings = SiteSettings & {
	/** The person's name: the nav, the author box, the footer. */
	name: string;
	/** "Designer and developer". */
	role?: string;
	/** Empty: initials. */
	avatar?: ContentImage;
	/** The intro's h1. May hold one *emphasis* marker. */
	headline: string;
	/** Plain text: the intro's paragraph. */
	bio?: string;
	socials: SocialLink[];
	/**
	 * The Now page's name ("Status"): the nav's and the footer's links to /now, the chip on the home page's Now line,
	 * and the page's title when the pages collection has no `now` entry. Empty: "Now". The address stays /now.
	 */
	nowLabel?: string;
	/** One plain line under the intro. Empty: no line. */
	nowStatus?: string;
	/** The Now page's "Updated" date. */
	nowUpdated?: Date;
	/** "Bellingham, WA", after the date. */
	nowPlace?: string;
	/** Where the newsletter form posts. Empty: the card becomes "Follow by RSS". */
	newsletterAction?: string;
	newsletterOptions?: NewsletterOptions;
	/** "Join 2,140 readers." */
	newsletterNote?: string;
	/** A site path in public/ ("/files/cv.pdf") or a full URL. Empty: no Download CV. */
	cvFile?: string;
	/** The demo's sample content: allows placeholders and shows the footer note. */
	sampleContent?: boolean;
	/**
	 * Reserved for later CMS look choices. No source fills it in version 1: no seed field, no site.json key.
	 * getConfig() merges it over src/theme.config.ts when a source does.
	 */
	config?: ConfigSettings;
};

export type Model = {
	posts: { entry: Post; query: PostQuery };
	projects: { entry: Project; query: ProjectQuery };
	talks: { entry: Talk };
	uses: { entry: UsesItem };
	jobs: { entry: Job };
	collage: { entry: CollagePhoto };
	pages: { entry: Page };
};

/** Used when the source has no value. Every source's settings merge over these. */
export const DEFAULT_SETTINGS: Settings = { title: "Vesper", name: "Your Name", headline: "Your headline", socials: [] };
