/**
 * Build-time content collections for the Markdown source. Data lives in `content/` at the project root. Images live
 * in `content/media/` and are referenced by relative path. Each entry's slug is its file name.
 *
 * A post's `category`, `tags` and `series` are term slugs from content/taxonomies.json; a post has one category and
 * one series at most. A post, a project and a page may set `seo:` (its title, description, image and canonical for
 * the head; src/content/seo.ts) and `noindex: true`.
 */
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { altForImages, altText, requiredAlt } from "./content/alt";
import { seoSchema } from "./content/seo";

const term = z.object({ slug: z.string(), label: z.string() });
const menuItem: z.ZodType<{ label: string; href: string; target?: string; children?: unknown[] }> = z.lazy(() =>
	z.object({
		label: z.string(),
		href: z.string(),
		target: z.string().optional(),
		children: z.array(menuItem).optional(),
	}),
);
const markdown = (dir: string) => glob({ pattern: "**/*.md", base: `./content/${dir}` });
const order = z.number().int().optional();
const year = z.number().int().optional();
/** Hide from search engines: robots noindex, left out of the sitemap and the search index. */
const noindex = z.boolean().optional();
const draft = z.boolean().default(false);

export const collections = {
	posts: defineCollection({
		loader: markdown("posts"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				date: z.coerce.date(),
				/** The last real change, shown as "Updated <date>" when it is on a later day than `date`. */
				updated: z.coerce.date().optional(),
				summary: z.string().optional(),
				thumbnail: image().optional(),
				thumbnailAlt: altText.optional(),
				/** One category slug. */
				category: z.string().optional(),
				/** Tag slugs. */
				tags: z.array(z.string()).default([]),
				/** One series slug. */
				series: z.string().optional(),
				draft,
				noindex,
				seo: seoSchema(image()),
			}).superRefine(altForImages([["thumbnail", "thumbnailAlt"]])),
	}),
	projects: defineCollection({
		loader: markdown("projects"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				summary: z.string().optional(),
				image: image().optional(),
				imageAlt: altText.optional(),
				/** The small mark on the home Projects card. */
				logo: image().optional(),
				logoAlt: z.string().optional(),
				/** The live site or the repo. */
				link: z.string().optional(),
				year,
				featured: z.boolean().default(false),
				order,
				draft,
				noindex,
				seo: seoSchema(image()),
			}).superRefine(altForImages([["image", "imageAlt"]])),
	}),
	/** Talks have no page of their own: a file holds only frontmatter. */
	talks: defineCollection({
		loader: markdown("talks"),
		schema: z.object({
			title: z.string(),
			event: z.string(),
			date: z.coerce.date(),
			place: z.string().optional(),
			summary: z.string().optional(),
			video: z.string().optional(),
			slides: z.string().optional(),
			order,
			draft,
		}),
	}),
	uses: defineCollection({
		loader: markdown("uses"),
		schema: ({ image }) =>
			z.object({
				/** The heading the item sits under ("Desk", "Camera bag"). */
				group: z.string(),
				name: z.string(),
				note: z.string().optional(),
				link: z.string().optional(),
				/** Show the link as a button. */
				linkButton: z.boolean().optional(),
				/** The link's words. Empty: its address. */
				linkLabel: z.string().optional(),
				/** A photo under the group's heading: the group takes the first one its items have, in order. */
				groupImage: image().optional(),
				groupImageAlt: altText.optional(),
				order,
				draft,
			}).superRefine(altForImages([["groupImage", "groupImageAlt"]])),
	}),
	jobs: defineCollection({
		loader: markdown("jobs"),
		schema: ({ image }) =>
			z.object({
				company: z.string(),
				role: z.string(),
				start: z.number().int(),
				/** Leave out for a current job ("Now"). */
				end: year,
				logo: image().optional(),
				logoAlt: z.string().optional(),
				link: z.string().optional(),
				order,
				draft,
			}),
	}),
	/** The collage band's photos, in `order`. 0, 4, 5 or 6 of them. */
	collage: defineCollection({
		loader: markdown("collage"),
		schema: ({ image }) =>
			z.object({
				image: image(),
				alt: requiredAlt,
				/** The Field notes caption: "Crater Lake, OR". */
				place: z.string().optional(),
				year,
				/** The Trail map label: "42.94° N · 7,100 ft". */
				geo: z.string().optional(),
				/** Makes the photo a link. */
				link: z.string().optional(),
				order,
				draft,
			}),
	}),
	pages: defineCollection({
		loader: markdown("pages"),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				summary: z.string().optional(),
				image: image().optional(),
				imageAlt: altText.optional(),
				/** A short line under the photo. */
				imageCaption: z.string().optional(),
				draft,
				noindex,
				seo: seoSchema(image()),
			}).superRefine(altForImages([["image", "imageAlt"]])),
	}),
	/** One entry per taxonomy: `{ id: "category", terms: [...] }`. */
	taxonomies: defineCollection({
		loader: file("content/taxonomies.json", {
			parser: (text) => Object.entries(JSON.parse(text)).map(([id, terms]) => ({ id, terms })),
		}),
		schema: z.object({ terms: z.array(term) }),
	}),
	/** One entry per menu: `primary` and `footer`. */
	menus: defineCollection({
		loader: file("content/menus.json", {
			parser: (text) => Object.entries(JSON.parse(text)).map(([id, items]) => ({ id, items })),
		}),
		schema: z.object({ items: z.array(menuItem) }),
	}),
	/** A single entry with id "site". */
	site: defineCollection({
		loader: file("content/site.json", {
			parser: (text) => [{ id: "site", ...JSON.parse(text) }],
		}),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				tagline: z.string().optional(),
				logo: image().optional(),
				logoAlt: z.string().optional(),
				name: z.string(),
				role: z.string().optional(),
				/** Empty: initials. */
				avatar: image().optional(),
				avatarAlt: z.string().optional(),
				/** The intro's h1. May hold one *emphasis* marker. */
				headline: z.string(),
				bio: z.string().optional(),
				/** `icon`: instagram, github, linkedin, bluesky, mastodon, youtube, email, rss or website. Empty: website. */
				socials: z.array(z.object({ label: z.string(), href: z.string(), icon: z.string().optional() })).default([]),
				/**
				 * The Now page's name, such as "Status": the nav's and the footer's links to /now, the home page's Now chip,
				 * and the page's title when content/pages has no now.md. Empty: "Now". The address stays /now.
				 */
				nowLabel: z.string().optional(),
				/** One plain line under the intro. Empty: no line. */
				nowStatus: z.string().optional(),
				nowUpdated: z.coerce.date().optional(),
				nowPlace: z.string().optional(),
				/** Where the newsletter form posts (your newsletter service). Empty: the card becomes "Follow by RSS". */
				newsletterAction: z.string().optional(),
				/** The form's field names, hidden fields and spam trap, as your service wants them. */
				newsletterOptions: z
					.object({
						emailName: z.string().optional(),
						honeypot: z.object({ name: z.string() }).optional(),
						hiddenFields: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
						nameField: z.boolean().optional(),
						nameName: z.string().optional(),
					})
					.optional(),
				newsletterNote: z.string().optional(),
				/** The CV file: a site path in public/ ("/files/cv.pdf") or a full URL. Empty: no Download CV. */
				cvFile: z.string().optional(),
				/** The demo's sample content: allows placeholders and shows the footer note. */
				sampleContent: z.boolean().optional(),
			}),
	}),
};
