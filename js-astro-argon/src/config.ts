import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

/**
 * Single source of truth for all site-level configuration.
 *
 * Modify this file when reusing the template:
 * - Site identity (title, subtitle, profile name)
 * - Public URLs (site/repo)
 * - Theme behavior
 * - Navbar/profile links
 * - License block and code highlight theme
 */
const siteUrl = "https://niyu.cc/";
const repoName = "Niyu";
const repoUrl = "https://github.com/zsancc/niyu";

/**
 * Global runtime/deploy settings used by Astro config and shared utilities.
 */
export const globalConfig = {
	// Public canonical URL of your site (recommended to end with "/").
	siteUrl,
	// Text shown in footer "Powered by ... & {repoName}".
	repoName,
	// Repository URL used in footer and default social links.
	repoUrl,
	// Fallback description for RSS when subtitle is empty.
	rssDescriptionFallback: "No description",
	// Astro base path. Keep "/" unless deploying under a sub-path.
	astroBase: "/",
	// Astro trailing slash strategy.
	astroTrailingSlash: "always" as const,
};

/**
 * Core site presentation config.
 */
export const siteConfig: SiteConfig = {
	// Main site title shown in navbar and browser title templates.
	title: "啾啾のBlog",
	// Subtitle used for SEO/description and some page metadata.
	subtitle: "啾啾のBlog",
	// Supported values: "zh_CN" | "en"
	lang: "zh_CN",
	themeColor: {
		// true: lock to defaultTheme and hide theme switching behavior.
		fixed: false,
		// Initial theme on first visit.
		defaultTheme: "argon",
		// Theme choices shown in theme switcher.
		themes: ["argon", "argon-dark", "winter", "nord", "silk", "lofi", "dracula"],
	},
	banner: {
		// Top banner image under navbar.
		enable: false,
		// Banner image path (relative to project/public handling rules).
		src: "assets/images/demo-banner.png",
		// Allowed values: "top" | "center" | "bottom"
		position: "center",
		credit: {
			// Whether to show banner credit text/link.
			enable: false,
			// Credit label text.
			text: "",
			// Source link of banner image.
			url: "",
		},
	},
	toc: {
		// Article table-of-contents switch.
		enable: true,
		// Heading depth in TOC: 1 | 2 | 3
		depth: 2,
	},
	// Optional favicon list. Leave [] to use defaults.
	// Example item: { src: "/favicon/favicon-light.png", theme: "light", sizes: "32x32" }
	favicon: [],
};

/**
 * Top navbar links.
 *
 * You can mix:
 * - Presets: LinkPreset.Home / Archive / About
 * - Custom links: { name, url, external }
 */
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{ name: "GitHub", url: repoUrl, external: true },
	],
};

/**
 * Sidebar profile card config.
 */
export const profileConfig: ProfileConfig = {
	// Avatar image displayed in profile card.
	avatar: "assets/images/demo-avatar.png",
	// Profile name shown in sidebar.
	name: "啾啾のBlog",
	// Profile short bio text.
	bio: "饿了吃，吃了拉，拉了还得饿；拉了饿，饿了吃，吃了还得拉",
	// Social links shown as icon buttons.
	// Icon value uses Iconify id, e.g. "fa6-brands:github".
	links: [
		{ name: "Twitter", icon: "fa6-brands:twitter", url: "https://twitter.com" },
		{ name: "Steam", icon: "fa6-brands:steam", url: "https://store.steampowered.com" },
		{ name: "GitHub", icon: "fa6-brands:github", url: repoUrl },
	],
};

/**
 * Per-post license block shown on post pages.
 */
export const licenseConfig: LicenseConfig = {
	// false = hide the entire license block.
	enable: false,
	// License text label.
	name: "CC BY-NC-SA 4.0",
	// License detail URL.
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

/**
 * Expressive Code theme (code blocks).
 * Choose a theme name supported by astro-expressive-code.
 */
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
