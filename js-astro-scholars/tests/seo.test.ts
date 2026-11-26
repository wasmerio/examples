import { describe, expect, it } from "vitest";
import { defineSiteConfig } from "../src/config/site";
import { buildStructuredData, getTwitterHandle } from "../src/lib/seo";

const config = defineSiteConfig({
	author: "Ada Scholar",
	siteUrl: "https://example.edu",
	hero: {
		headline: "Research that travels.",
		subheadline: "A concise academic biography.",
	},
	affiliations: [
		{
			role: "Professor",
			institution: "Example University",
		},
	],
	researchInterests: ["Open scholarship"],
	socialLinks: [
		{
			label: "Twitter",
			href: "https://x.com/ada_scholar",
		},
		{
			label: "Email",
			href: "mailto:ada@example.edu",
		},
	],
});

describe("SEO helpers", () => {
	it("extracts a Twitter or X handle from profile links", () => {
		expect(getTwitterHandle(config.socialLinks)).toBe("@ada_scholar");
		expect(
			getTwitterHandle([
				{ label: "Share", href: "https://twitter.com/intent/tweet" },
			]),
		).toBeUndefined();
	});

	it("builds linked Person, WebSite, article, image, and breadcrumb data", () => {
		const structuredData = buildStructuredData({
			siteConfig: config,
			canonicalUrl: "https://example.edu/posts/open-research/",
			pageTitle: "Open research",
			description: "A practical note.",
			imageUrl: "https://example.edu/social-card.png",
			imageWidth: 1200,
			imageHeight: 630,
			schemaType: "BlogPosting",
			publishedAt: "2026-07-23T00:00:00.000Z",
			tags: ["open science", "methods"],
			breadcrumbs: [
				{ name: "Home", url: "https://example.edu/" },
				{ name: "Blog", url: "https://example.edu/posts/" },
				{
					name: "Open research",
					url: "https://example.edu/posts/open-research/",
				},
			],
		});

		expect(structuredData["@context"]).toBe("https://schema.org");
		expect(structuredData["@graph"]).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					"@type": "Person",
					name: "Ada Scholar",
					jobTitle: "Professor",
				}),
				expect.objectContaining({
					"@type": "BlogPosting",
					headline: "Open research",
					keywords: "open science, methods",
				}),
				expect.objectContaining({
					"@type": "BreadcrumbList",
				}),
			]),
		);
		const breadcrumb = structuredData["@graph"].find(
			(item) => item?.["@type"] === "BreadcrumbList",
		) as { itemListElement?: unknown[] } | undefined;
		expect(breadcrumb?.itemListElement).toHaveLength(3);
	});
});
