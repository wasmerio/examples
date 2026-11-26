/**
 * Scholar Pages - Type Definitions
 * ================================
 * Type definitions for site configuration.
 */

export interface SocialLink {
	/** Display label for the social link */
	label: string;
	/** Full URL to your profile */
	href: string;
	/** UnoCSS icon class. Find icons at: https://icones.js.org */
	icon?: string;
}

export interface NavLink {
	/** URL path for the navigation link */
	href: string;
	/** Display label for the navigation link */
	label: string;
}

export interface Affiliation {
	/** Your role/title at this institution */
	role: string;
	/** Name of the department */
	department?: string;
	/** Name of the institution */
	institution: string;
	/** URL to the institution or department page */
	url?: string;
}

export interface SiteConfig {
	// --- Basic Information ---
	title: string;
	author: string;
	description?: string;
	/** Production site URL used for canonical, Open Graph, and sitemap URLs */
	siteUrl: string;
	/** BCP 47 language code used by the document and structured data */
	language: string;
	/** Open Graph locale, for example en_US or zh_CN */
	locale: string;
	/** Default Open Graph image path or URL */
	ogImage?: string;
	/** Accessible description for the default Open Graph image */
	ogImageAlt: string;
	/** Optional Open Graph image width in pixels */
	ogImageWidth?: number;
	/** Optional Open Graph image height in pixels */
	ogImageHeight?: number;
	favicon: string;
	keywords: string[];
	// --- Academic Profile ---
	affiliations: Affiliation[];
	researchInterests: string[];
	// --- Links & Navigation ---
	socialLinks: SocialLink[];
	navLinks: NavLink[];
	// --- Footer ---
	footer: {
		copyright: string;
		/** Show social profile links on the left side of the footer */
		showProfileLinks: boolean;
		/** Include the configured author name in the copyright line */
		showAuthor: boolean;
	};
	// --- Hero Section ---
	hero: {
		headline: string;
		subheadline: string;
		profileAlt: string;
		profileImage: string;
		/** Optional: Profile image height in pixels (default: 160) */
		profileImageHeight?: number;
		/** Optional: Profile image width in pixels (default: 160) */
		profileImageWidth?: number;
		statusBadge?: string;
	};
	// --- Page Titles and Descriptions ---
	pageTitles: {
		about: { title: string; description?: string };
		researches: { title: string; description?: string };
		projects: { title: string; description?: string };
		teaching: { title: string; description?: string };
		posts: { title: string; description?: string };
	};
	// --- Home Page Blocks ---
	homeBlocks: {
		hero: { enabled: boolean };
		showcase: { enabled: boolean; title?: string; description?: string };
		publications: { enabled: boolean; title: string; description?: string };
		posts: { enabled: boolean; title: string; description?: string };
	};
}
