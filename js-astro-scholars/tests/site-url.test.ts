import { describe, expect, it } from "vitest";
import {
	buildAbsoluteUrl,
	buildCanonicalUrl,
	normalizeSiteUrl,
	withTrailingSlash,
} from "../src/lib/site-url";

describe("site URL helpers", () => {
	it("normalizes a configured site URL without a trailing slash", () => {
		expect(normalizeSiteUrl("https://example.edu/")).toBe("https://example.edu");
		expect(normalizeSiteUrl("https://example.edu////")).toBe("https://example.edu");
	});

	it("returns a site URL with exactly one trailing slash for Astro config", () => {
		expect(withTrailingSlash("https://example.edu")).toBe("https://example.edu/");
		expect(withTrailingSlash("https://example.edu/")).toBe("https://example.edu/");
	});

	it("builds absolute URLs for public paths and relative paths", () => {
		expect(buildAbsoluteUrl("/profile.svg", "https://example.edu/")).toBe(
			"https://example.edu/profile.svg",
		);
		expect(buildAbsoluteUrl("profile.svg", "https://example.edu/")).toBe(
			"https://example.edu/profile.svg",
		);
	});

	it("keeps external URLs unchanged", () => {
		expect(buildAbsoluteUrl("https://cdn.example.edu/profile.png", "https://example.edu/")).toBe(
			"https://cdn.example.edu/profile.png",
		);
	});

	it("builds canonical URLs without query parameters or fragments", () => {
		expect(
			buildCanonicalUrl(
				"/posts/research-note?ref=archive#methods",
				"https://example.edu/",
			),
		).toBe("https://example.edu/posts/research-note/");
		expect(buildCanonicalUrl("/", "https://example.edu")).toBe(
			"https://example.edu/",
		);
	});

	it("preserves file-like canonical paths", () => {
		expect(buildCanonicalUrl("/robots.txt", "https://example.edu")).toBe(
			"https://example.edu/robots.txt",
		);
	});
});
