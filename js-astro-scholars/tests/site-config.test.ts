import { describe, expect, test } from "vitest";
import { defineSiteConfig } from "../src/config/site";

describe("site configuration defaults", () => {
	test("completes the concise public configuration", () => {
		const config = defineSiteConfig({
			author: "Ada Scholar",
			siteUrl: "https://example.edu",
			hero: {
				headline: "Research that travels.",
				subheadline: "A concise academic biography.",
			},
		});

		expect(config.title).toBe("Ada Scholar | Academic Portfolio");
		expect(config.description).toBe("A concise academic biography.");
		expect(config.hero.profileAlt).toBe("Portrait of Ada Scholar");
		expect(config.hero.profileImage).toBe("/profile.svg");
		expect(config.language).toBe("en");
		expect(config.locale).toBe("en_US");
		expect(config.ogImageAlt).toBe("Portrait of Ada Scholar");
		expect(config.ogImageWidth).toBe(160);
		expect(config.ogImageHeight).toBe(160);
		expect(config.navLinks).toHaveLength(5);
		expect(config.pageTitles.researches.title).toBe("Publications");
		expect(config.homeBlocks.hero.enabled).toBe(true);
		expect(config.homeBlocks.publications.enabled).toBe(true);
		expect(config.homeBlocks.posts.enabled).toBe(true);
		expect(config.footer.showProfileLinks).toBe(false);
		expect(config.footer.showAuthor).toBe(true);
	});

	test("preserves focused overrides without requiring the full schema", () => {
		const config = defineSiteConfig({
			author: "Ada Scholar",
			siteUrl: "https://example.edu",
			hero: {
				headline: "Research that travels.",
				subheadline: "A concise academic biography.",
				statusBadge: "Available for collaboration",
			},
			pageTitles: {
				projects: { description: "Open research infrastructure." },
			},
			homeBlocks: {
				hero: { enabled: false },
				posts: { enabled: false },
			},
			footer: {
				showProfileLinks: true,
				showAuthor: false,
			},
		});

		expect(config.hero.statusBadge).toBe("Available for collaboration");
		expect(config.pageTitles.projects.title).toBe("Projects");
		expect(config.pageTitles.projects.description).toBe(
			"Open research infrastructure.",
		);
		expect(config.homeBlocks.hero.enabled).toBe(false);
		expect(config.homeBlocks.publications.enabled).toBe(true);
		expect(config.homeBlocks.posts.enabled).toBe(false);
		expect(config.footer.showProfileLinks).toBe(true);
		expect(config.footer.showAuthor).toBe(false);
	});
});
