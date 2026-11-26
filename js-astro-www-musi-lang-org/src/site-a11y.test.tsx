import { readFileSync } from "node:fs";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { routeForPath } from "./routes";
import { App } from "./site-app";

const rootLangPattern = /<html\s+lang=(?:\{route\.locale\}|"en")/;
const notFoundRoutePattern = /locale:\s*"en"/;

function render(path: string) {
	return renderToString(<App route={routeForPath(path)} />);
}

function countOccurrences(text: string, value: string) {
	return text.split(value).length - 1;
}

describe("site accessibility scaffolding", () => {
	it("keeps document shells rooted with English lang metadata", () => {
		const siteDocument = readFileSync(
			new URL("./layout/site-document.astro", import.meta.url),
			"utf8",
		);
		const notFoundDocument = readFileSync(
			new URL("./pages/404.astro", import.meta.url),
			"utf8",
		);

		expect(siteDocument).toMatch(rootLangPattern);
		expect(notFoundDocument).toMatch(notFoundRoutePattern);
	});

	it("renders app pages without nested html nodes", () => {
		for (const path of [
			"/",
			"/learn",
			"/install",
			"/community",
			"/playground",
		]) {
			const html = render(path);
			expect(html).not.toContain("<html");
			expect(html).toContain('href="#main-content"');
			expect(html).toContain("<main");
			expect(html).toContain("Skip to main content");
		}
	});

	it("renders docs pages with sidebar, search, and chapter tools", () => {
		const html = render("/learn/book/start/getting-started");

		expect(html).toContain("Documentation sections");
		expect(html).toContain("Chapter tools");
		expect(html).toContain("Chapter navigation");
		expect(html).toContain('data-docs-search="true"');
		expect(html).toContain("Search chapters");
		expect(html).toContain("docs-page-rail");
		expect(html).toContain("docs-sidebar-link");
		expect(countOccurrences(html, "On this page")).toBe(1);
	});

	it("renders portal and utility pages", () => {
		const home = render("/");
		const learn = render("/learn");
		const install = render("/install");
		const community = render("/community");
		const playground = render("/playground");

		expect(home).toContain("Read Musi Book");
		expect(home).toContain("Open install path");
		expect(learn).toContain("docs-search docs-search--panel");
		expect(install).toContain('<th scope="col">Command</th>');
		expect(install).toContain('data-code-tab-panel="curl"');
		expect(community).toContain("Open GitHub");
		expect(playground).toContain("Local install");
	});
});
