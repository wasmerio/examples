import { Platforms } from "./Types/types";

import type { Site, Author, Socials, NavEntry, Blog } from "./Types/types";

/**
 * @description This file contains the configuration for the Alkaline theme.
 * - There are quite a few settings, but they allow for a vast amount of automatization across the theme
 * @exports SITE - The site configuration object
 * @exports NAVIGATION - The navigation configuration object
 * @exports BLOG - The blog configuration object
 */

//  SITE socials - used for the site footer
// See: ./Types/types.ts for more info on author socials
export const socials: Socials[] = [
	{
		platform: "email",
		url: "alkaline@jaredtruscott.com",
	},
	{
		platform: "github",
		url: "https://github.com/TruJared/",
	},
	{
		platform: "web",
		url: "https://jaredmakes.com",
	},
	{
		platform: "bluesky",
		url: "https://bsky.app/profile/trujared.bsky.social",
	},
	{
		platform: "rss",
		url: "/feed.xml",
	}
];

// use in development to easily see all author socials at once, not useful in production, I suggest commenting this out in production
export const allSocials: Socials[] = Platforms.map((platform) => ({
	platform,
	url: `https://${platform}.com`,
	userName: `test_user_${platform}`,
}));


export const AUTHORS: Author[] = [
	// assumes that the 1st author has the same socials as the site - change if needed
	{
		id: 1,
		name: "Jared Truscott",
		socials: socials,
		email: 'jared@jaredmakes.com'
	},
	// example of a 2nd author with all socials - replace with your own author(s) or remove if not needed
	{
		id: 2,
		name: "Jeff Goldblum",
		socials: allSocials,
		email: null
	},
]

export const SITE: Site = {
	title: "Alkaline",
	showTitleBackground: true,
	faviconSrc: "/favicon.png", // in public directory
	url: "https://alkaline-theme.xyz",
	ogImage: "/og-image.webp", // in public directory
	author: AUTHORS[0].name, // Made with ❤️ by {your-name}
	description: "A Neutral Base For Your Next Creation",
	keywords: ["astro", "theme", "blog"],
	disableIndexing: false, // true for no indexing
	socials: socials,
	locale: "en_US",
	postsPerPage: 5,
	shikiConfig: {
		// ctrl+space for theme suggestions
		theme: "night-owl",
	},
	// I provide  Types for many of the top Google Fonts, edit or remove ./Types/google-fonts.d.ts to add/remove font types
	fonts: [
		{
			typeface: "serif",
			fontFamily: "SUSE",
			fontWeights: ["100..800"],
		},
		{
			typeface: "sans",
			fontFamily: "Roboto",
			fontWeights: ["100..900"],
			includeItalic: true,
		},
		{
			typeface: "mono",
			fontFamily: "Fira Code",
			fontWeights: [400, 500, 700],
		},
	],
	// Trouble with the fonts? It's likely because a font family name isn't EXACTLY correct or the font weights you're trying to fetch are not supported for that font family. For example, setting Fira Code with fontWeights: ["400...700"] will not work because Fira Code only supports 400, 500, and 700.
};

// TODO: "slug" is the more appropriate term  here but would require more changes throughout the theme

export const NAVIGATION: NavEntry[] = [
	{
		href: "/",
		text: "Home",
	},
	{
		href: "/elements",
		text: "Elements",
	},
	{
		href: "/features",
		text: "Features",
	},
	{
		href: "/blog",
		text: "Blog",
	},
	{
		href: "/tags",
		text: "Tags",
	},
	{
		href: "/faq",
		text: "FAQ",
	},
	{
		href: "/404",
		text: "404",
	},
];

export const BLOG: Blog = {
	title: "My Blog",
	author: AUTHORS[0].name,
	description: SITE.description || "",
	keywords: SITE.keywords,
	postsPerPage: SITE.postsPerPage,
};

// export the name(s) of the collections as a list - must match the name of the collection in the ./Types/types.ts file
export const COLLECTION_NAMES_LIST = ["blog"] as const;
