/**
 * Type tests, checked by `pnpm check` (tsconfig.json includes this file): what the model lets a page and a source do.
 */
import type { HiddenField, Honeypot } from "@astronomic/ui/components/Form.astro";
import type { NewsletterOptions, PostQuery, ProjectQuery, Settings } from "../../src/content/model.ts";

// The post query knows its keys.
export const byCategory: PostQuery = { category: "design", tag: "maps", series: "ridgeline", sort: "date-asc" };
// @ts-expect-error an unknown key is not a post query
export const unknownKey: PostQuery = { author: "rowan-ellery" };
// @ts-expect-error category is a slug, not a term
export const notASlug: PostQuery = { category: { slug: "design", label: "Design" } };
// @ts-expect-error posts sort by date or title only
export const badSort: PostQuery = { sort: "order" };
export const featured: ProjectQuery = { featured: true };
// @ts-expect-error projects filter on featured only
export const byYear: ProjectQuery = { year: 2024 };

// Settings need the person's name and headline.
export const plain: Settings = { title: "Vesper", name: "Rowan Ellery", headline: "Hello", socials: [] };
// @ts-expect-error no name
export const noName: Settings = { title: "Vesper", headline: "Hello", socials: [] };
// @ts-expect-error no headline
export const noHeadline: Settings = { title: "Vesper", name: "Rowan Ellery", socials: [] };
// @ts-expect-error a social link names its icon
export const noIcon: Settings = { ...plain, socials: [{ label: "GitHub", href: "https://github.com/rowan" }] };

// The newsletter: an action string plus the kit form's options, which the kit form takes as they are.
export const newsletter: Settings = {
	...plain,
	newsletterAction: "https://example.com/newsletter/subscribe",
	newsletterOptions: { emailName: "EMAIL", honeypot: { name: "_hp" }, hiddenFields: [{ name: "tag", value: "site" }], nameField: true, nameName: "FNAME" },
};
export const kitFields: { honeypot?: Honeypot; hiddenFields?: HiddenField[] } = newsletter.newsletterOptions!;
// @ts-expect-error the action is its own setting, not an option
export const actionInOptions: NewsletterOptions = { action: "https://example.com/newsletter/subscribe" };
// @ts-expect-error the tone is the layout's, not a setting
export const toneInOptions: NewsletterOptions = { tone: "band" };

// The config group is reserved and optional; it takes only known ids, and a page switch on its own.
export const withConfig: Settings = { ...plain, config: { accent: "moss", pages: { speaking: false } } };
// @ts-expect-error an unknown accent
export const badAccent: Settings = { ...plain, config: { accent: "teal" } };
// @ts-expect-error an unknown page
export const badPage: Settings = { ...plain, config: { pages: { blog: false } } };
