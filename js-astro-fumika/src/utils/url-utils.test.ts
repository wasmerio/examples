import { describe, expect, it, vi } from "vitest";
import {
	getCategoryUrl,
	getDir,
	getPostUrlBySlug,
	getTagUrl,
	pathsEqual,
	siteUrl,
	url,
} from "./url-utils";

// Mock site configuration
vi.mock("@/config", () => ({
	siteConfig: { lang: "zh_CN" },
}));

// Mock translation module
vi.mock("@i18n/translation", () => ({
	getTranslation: vi.fn(() => ({
		uncategorized: "Uncategorized",
	})),
}));

// Mock environment variables
vi.stubEnv("SITE", "https://example.com");

describe("url-utils", () => {
	beforeEach(() => {
		vi.stubEnv("BASE_URL", "/");
	});

	// pathsEqual(path1: string, path2: string)
	describe("pathsEqual", () => {
		it("should return true for identical paths", () => {
			expect(pathsEqual("/blog", "/blog")).toBe(true);
		});

		it("should handle trailing slashes and without slash", () => {
			expect(pathsEqual("/blog/", "/blog")).toBe(true);
			expect(pathsEqual("blog", "blog")).toBe(true);
		});

		it("should handle casing", () => {
			expect(pathsEqual("/BLOG/", "/blog/")).toBe(true);
		});

		it("should return false for different paths", () => {
			expect(pathsEqual("/blog", "/about")).toBe(false);
		});
	});

	// url(path: string, lang?: string)
	describe("url", () => {
		it("should return the base path for default language", () => {
			expect(url("/test/")).toBe("/test/");
			expect(url("/test/", "zh_CN")).toBe("/test/");
		});

		it("should handle the language prefix for non-default languages", () => {
			expect(url("/test/", "en")).toBe("/en/test/");
			expect(url("/test/", "zh_TW")).toBe("/zh-TW/test/");
		});

		it("should handle multiple slashes in paths", () => {
			expect(url("///test///")).toBe("/test/");
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(url("////test///", "zh_TW")).toBe("/blog/zh-TW/test/");
			});
		});
	});

	// getPostUrlBySlug(slug: string, lang?: string)
	describe("getPostUrlBySlug", () => {
		it("should return the correct post URL structure", () => {
			expect(getPostUrlBySlug("my-post")).toBe("/posts/my-post/");
			expect(getPostUrlBySlug("my-post", "zh_CN")).toBe("/posts/my-post/");
			expect(getPostUrlBySlug("my-post", "zh_TW")).toBe(
				"/zh-TW/posts/my-post/",
			);
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(getPostUrlBySlug("my-post", "zh_TW")).toBe(
					"/blog/zh-TW/posts/my-post/",
				);
			});
		});
	});

	// getTagUrl(tag: string, lang?: string)
	describe("getTagUrl", () => {
		it("should return the archive URL if tag is empty", () => {
			expect(getTagUrl("")).toBe("/archive/");
			expect(getTagUrl("", "zh_CN")).toBe("/archive/");
			expect(getTagUrl("", "zh_TW")).toBe("/zh-TW/archive/");
		});

		it("should handle encoded tags properly for URLs", () => {
			expect(getTagUrl("Web Dev")).toBe("/archive/?tag=Web%20Dev");
			expect(getTagUrl("Rust/C++")).toBe("/archive/?tag=Rust%2FC%2B%2B");
		});

		it("should handle surrounding whitespace from tags", () => {
			expect(getTagUrl("  ts  ")).toBe("/archive/?tag=ts");
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(getTagUrl("js", "zh_TW")).toBe("/blog/zh-TW/archive/?tag=js");
			});
		});
	});

	// getCategoryUrl(category: string | null, lang?: string)
	describe("getCategoryUrl", () => {
		it("should handle uncategorized posts correctly", () => {
			expect(getCategoryUrl("Uncategorized", "zh_CN")).toBe(
				"/archive/?uncategorized=true",
			);
			expect(getCategoryUrl(null, "en")).toBe(
				"/en/archive/?uncategorized=true",
			);
			expect(getCategoryUrl("  ", "zh_TW")).toBe(
				"/zh-TW/archive/?uncategorized=true",
			);
		});

		it("should handle encoded category names properly", () => {
			expect(getCategoryUrl("Web Dev", "zh_CN")).toBe(
				"/archive/?category=Web%20Dev",
			);
			expect(getCategoryUrl("Rust/C++", "zh_TW")).toBe(
				"/zh-TW/archive/?category=Rust%2FC%2B%2B",
			);
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(getCategoryUrl("astro", "zh_TW")).toBe(
					"/blog/zh-TW/archive/?category=astro",
				);
			});
		});
	});

	// getDir(path: string)
	describe("getDir", () => {
		it("should return the directory path", () => {
			expect(getDir("posts/2026/hello.md")).toBe("posts/2026/");
			expect(getDir("root-file.md")).toBe("/");
		});

		it("should handle Windows-style backslashes", () => {
			expect(getDir("posts\\subfolder\\file.md")).toBe("posts/subfolder/");
		});

		it("should return root slash for empty or invalid paths", () => {
			expect(getDir("")).toBe("/");
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(getDir("posts/meow")).toBe("posts/");

				expect(getDir("/en/posts/meow")).toBe("/en/posts/");
			});
		});
	});

	// siteUrl (path = "")
	describe("siteUrl", () => {
		it("should return the input path if it is already a full URL", () => {
			const https = "https://google.com";
			expect(siteUrl(https)).toBe(https);

			const http = "http://localhost:4321";
			expect(siteUrl(http)).toBe(http);
		});

		it("should handle a full absolute URL correctly", () => {
			expect(siteUrl("/posts/hello")).toBe("https://example.com/posts/hello");
		});

		it("should handle slashes cleanly when joining parts", () => {
			const path = "/posts///my-post/";
			expect(siteUrl(path)).toBe("https://example.com/posts/my-post/");
		});

		it("should return the site root if path is empty", () => {
			expect(siteUrl("")).toBe("https://example.com/");
		});

		describe("custom BASE_URL", () => {
			it("should handle custom BASE_URL correctly", () => {
				vi.stubEnv("BASE_URL", "/blog/");

				expect(siteUrl("/posts/hello")).toBe(
					"https://example.com/blog/posts/hello",
				);

				expect(siteUrl("/posts///")).toBe("https://example.com/blog/posts/");

				vi.stubEnv("BASE_URL", "/");
			});
		});
	});
});
