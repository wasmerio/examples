/**
 * Scholar Pages - primary configuration
 *
 * Start here for identity, profile, links, and page introductions.
 * Publications, CV records, projects, courses, and posts live in src/data
 * and src/content so this file stays quick to scan.
 */
import { defineSiteConfig } from "./src/config/site";

export const siteConfig = defineSiteConfig({
	// Required: the four values most sites should personalize first.
	author: "Mira Latticewell",
	siteUrl: "https://astro-theme-scholars.pages.dev",
	hero: {
		headline:
			"Fictional research on learning systems, shared archives, and humane web infrastructure.",
		subheadline:
			"Mira Latticewell is an entirely fictional scholar created to demonstrate this academic portfolio theme.",
		profileImage: "/profile.svg",
		profileAlt: "Abstract illustration representing the fictional researcher Mira Latticewell",
		statusBadge: "Fictional demo profile",
	},

	// Common profile and discovery settings.
	description:
		"An entirely fictional academic profile demonstrating the Scholar Pages Astro theme.",
	keywords: [
		"synthetic learning environments",
		"fictional archives",
		"humane web infrastructure",
		"academic website",
		"demo profile",
	],
	// Optional social-preview overrides:
	// language: "en",
	// locale: "en_US",
	// ogImage: "/social-card.png", // Prefer a 1200 × 630 raster image.
	// ogImageAlt: "Scholar name - academic portfolio",
	// ogImageWidth: 1200,
	// ogImageHeight: 630,
	affiliations: [
		{
			role: "Fictional Associate Professor",
			department: "School of Imaginary Systems",
			institution: "Northstar Commons University (fictional)",
		},
	],
	researchInterests: [
		"Synthetic Learning Environments",
		"Speculative Interfaces",
		"Fictional Archives",
		"Imaginary Civic Systems",
	],
	socialLinks: [
		{
			label: "Sample repository",
			href: "https://example.com/mira-latticewell/repository",
			icon: "i-mdi:github",
		},
		{
			label: "Sample notes",
			href: "https://example.com/mira-latticewell/notes",
			icon: "i-mdi:bookshelf",
		},
		{
			label: "Sample archive",
			href: "https://example.com/mira-latticewell/archive",
			icon: "i-mdi:tag-outline",
		},
	],

	// Footer display: links are hidden by default for a quieter academic layout.
	footer: {
		showProfileLinks: false, // Set true to show the social links above in the footer.
		showAuthor: true, // Set false to show the copyright line without the author name.
	},

	// Optional: omit any entry to use the concise academic default copy.
	pageTitles: {
		about: {
			description:
				"A fictional academic background created solely to demonstrate profile, experience, service, and award layouts.",
		},
		researches: {
			description:
				"Fictional publications attributed to Mira Latticewell for demonstrating scholarly records and citation tools.",
		},
		projects: {
			description:
				"Fictional research tools and imaginary infrastructure projects created for this theme demo.",
		},
		teaching: {
			description:
				"Fictional courses showing how teaching records, terms, and materials appear in the theme.",
		},
		posts: {
			description:
				"Fictional notes from the Mira Latticewell demo profile.",
		},
	},

	// Homepage composition: switch off any block you do not want to display.
	homeBlocks: {
		hero: { enabled: true },
		showcase: {
			enabled: true,
			title: "Fictional Initiatives",
			description: "Imaginary systems and prototype research infrastructure",
		},
		publications: {
			enabled: true,
			description: "Selected fictional publications",
		},
		posts: { enabled: true, description: "Notes from a fictional practice" },
	},
});

export default siteConfig;
