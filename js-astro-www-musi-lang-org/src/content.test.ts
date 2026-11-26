import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { bookPages, bookParts, bookSections } from "./content/book/manifest";
import { contentCollections } from "./content/catalog";
import { exampleGroups } from "./content/examples/groups";
import { contentSnippets } from "./content/snippet-registry";
import { docSearchEntries } from "./docs";
import { renderedDocs, renderedSnippets } from "./generated-content";

const repoRoot = join(import.meta.dirname, "..");
const playgroundPagePath = join(
	repoRoot,
	"src",
	"site-pages",
	"playground",
	"page.tsx",
);
const siteHeadingPath = join(repoRoot, "src", "ui", "site-heading.tsx");
const unresolvedPlaceholderPattern = /\{\{(?:snippet|example|try|compare):/;
const checkedInternalLinkPattern = /^\/(?:learn|docs)\/(?:book|language)\b/;
const forbiddenMusiDocsPatterns: readonly RegExp[] = [
	/\b(?:true|false)\b/,
	/\bOption\.Option\b/,
	/\bResult\.Result\b/,
	/\bexport\s+data\b/,
	/^data\s+[A-Z]/m,
	/#\[/,
	/\$"/,
	/test\s+"/,
	/\bexpect\.equal\b/,
	/\)\s+where\s+[^:=\n]+:\s+[^=\n]/,
	/\beffect\s+[A-Z][A-Za-z0-9_]*\s*:=/,
	/\blet\s+name\s*:=\s*value\b/,
	/\bConfig\s*\{/,
	/@when\b/,
	/@known\b/,
	/\bend\s*;/,
	/\bnative\s+let\b/,
	/\bdata\s+Server\b/,
	/\bdata\s+Point\b/,
	/\bPoint\s+\{/,
	/:=\s*\{\s*\n\s*let\b/,
	/\bblock is an expression\b/i,
	/\bA block lets\b/,
	/\bvalue of the block\b/i,
	/\buse blocks\b/i,
	/\bexpression blocks\b/i,
];

function normalizedRoutePath(path: string) {
	return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

function renderedDocRoutePaths() {
	const paths = new Set<string>();
	for (const doc of renderedDocs) {
		paths.add(normalizedRoutePath(doc.path));
		paths.add(normalizedRoutePath(doc.canonicalPath));
		for (const alias of doc.aliases) {
			paths.add(normalizedRoutePath(alias));
		}
	}
	return paths;
}

function authoredSectionSourcePath(section: (typeof bookSections)[number]) {
	if (!("sourcePath" in section) || typeof section.sourcePath !== "string") {
		return null;
	}
	return section.sourcePath.startsWith("generated://")
		? null
		: section.sourcePath;
}

function localEvidencePath(path: string) {
	return path.startsWith("crates/") || path.startsWith("packages/std/")
		? null
		: join(repoRoot, path);
}

function isAllowedLocalEvidence(path: string) {
	return (
		path === "content/musi-book/examples/smoke.ms" ||
		path === "README.md" ||
		path === "package.json"
	);
}

describe("content generation", () => {
	it("renders book inventory into generated docs", () => {
		expect(renderedDocs.filter((doc) => doc.kind === "part")).toHaveLength(
			bookParts.length,
		);
		expect(renderedDocs.filter((doc) => doc.kind === "chapter")).toHaveLength(
			bookPages.length,
		);
		expect(
			contentCollections.some((collection) => collection.title === "Musi Book"),
		).toBe(true);
	});

	it("resolves generated docs routes and placeholders", () => {
		const routePaths = renderedDocRoutePaths();
		for (const page of bookPages) {
			expect(routePaths.has(normalizedRoutePath(page.path)), page.id).toBe(
				true,
			);
			expect(existsSync(join(repoRoot, page.sourcePath)), page.id).toBe(true);
		}
		expect(renderedDocs.map((doc) => doc.html).join("\n")).not.toMatch(
			unresolvedPlaceholderPattern,
		);
	});

	it("keeps Musi docs examples on supported syntax", () => {
		const docsSources = [
			...bookPages.map((page) => page.sourcePath),
			...bookParts.map((part) => part.sourcePath),
			...bookSections
				.map((section) => authoredSectionSourcePath(section))
				.filter((path): path is string => path !== null),
		];
		const authored = docsSources
			.map((sourcePath) => readFileSync(join(repoRoot, sourcePath), "utf8"))
			.join("\n");
		const generated = renderedDocs
			.map((doc) => `${doc.title}\n${doc.summary}\n${doc.html}`)
			.join("\n");
		const examples = [...contentSnippets, ...exampleGroups]
			.map((item) => item.sourceText)
			.join("\n");

		for (const pattern of forbiddenMusiDocsPatterns) {
			expect(authored, pattern.toString()).not.toMatch(pattern);
			expect(generated, pattern.toString()).not.toMatch(pattern);
			expect(examples, pattern.toString()).not.toMatch(pattern);
		}
	});

	it("builds searchable docs entries", () => {
		const valuesAndLet = docSearchEntries.find(
			(entry) => entry.path === "/learn/book/start/values-and-let",
		);

		expect(valuesAndLet?.title).toBe("Values and `let`");
		expect(valuesAndLet?.titleHtml).toBe("Values and <code>let</code>");
		expect(valuesAndLet?.summary.length).toBeGreaterThan(0);
		expect(valuesAndLet?.partTitle).toBe("Start");
	});

	it("renders inline Markdown inside generated heading anchors", () => {
		const valuesAndLet = renderedDocs.find(
			(doc) => doc.path === "/learn/book/start/values-and-let",
		);

		expect(valuesAndLet?.html).toContain(
			'<h2 id="let-form"><a href="#let-form"><code>let</code> form</a></h2>',
		);
	});

	it("documents Musi comment syntax", () => {
		const comments = renderedDocs.find(
			(doc) => doc.path === "/learn/book/start/comments",
		);
		const html = comments?.html ?? "";

		expect(html).toContain("<code>--</code>");
		expect(html).toContain("<code>/-</code>");
		expect(html).toContain("<code>---</code>");
		expect(html).toContain("<code>--!</code>");
		expect(html).toContain("<code>//</code>");
		expect(html).toContain("not comments");
	});

	it("renders snippets as light code blocks", () => {
		expect(renderedSnippets.homeSampleHtml).toContain(
			"github-light-high-contrast",
		);
		expect(renderedSnippets.homeSampleHtml).toContain(
			'<span style="color:#A0111F">let</span>',
		);
		for (const html of Object.values(renderedSnippets)) {
			expect(html).toContain("<pre");
			expect(html).not.toContain("mx-code-frame");
		}
	});

	it("renders Musi docs with the synced Shiki grammar", () => {
		const html = renderedDocs.map((doc) => doc.html).join("\n");
		expect(html).toContain('<span style="color:#A0111F">let</span>');
	});

	it("keeps page headings on the shared SiteHeading component", () => {
		const playgroundPage = readFileSync(playgroundPagePath, "utf8");
		expect(playgroundPage).toContain("SiteHeading");
		expect(playgroundPage).not.toContain("site-heading__body");

		const siteHeading = readFileSync(siteHeadingPath, "utf8");
		expect(siteHeading).toContain("site-heading__body");
	});

	it("keeps authored internal links routable", () => {
		const routePaths = renderedDocRoutePaths();
		const docsSources = [
			...bookPages.map((page) => page.sourcePath),
			...bookParts.map((part) => part.sourcePath),
			...bookSections
				.map((section) => authoredSectionSourcePath(section))
				.filter((path): path is string => path !== null),
		];

		for (const sourcePath of docsSources) {
			const source = readFileSync(join(repoRoot, sourcePath), "utf8");
			for (const match of source.matchAll(
				/\[[^\]\n]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
			)) {
				const href = match[1] ?? "";
				if (!checkedInternalLinkPattern.test(href)) {
					continue;
				}
				const [path = ""] = href.split("#", 1);
				expect(routePaths.has(normalizedRoutePath(path)), sourcePath).toBe(
					true,
				);
			}
		}
	});

	it("records usable evidence for examples", () => {
		for (const item of [...contentSnippets, ...exampleGroups]) {
			expect(item.evidence.path.length, item.id).toBeGreaterThan(0);
			expect(item.evidence.line, item.id).toBeGreaterThan(0);
			expect(
				item.evidence.path.startsWith("src/content/") ||
					item.evidence.path.startsWith("content/musi-book/pages/"),
				item.id,
			).toBe(false);
			if (item.evidence.path.startsWith("content/")) {
				expect(isAllowedLocalEvidence(item.evidence.path), item.id).toBe(true);
			}
			const absolutePath = localEvidencePath(item.evidence.path);
			if (absolutePath !== null) {
				expect(existsSync(absolutePath), item.id).toBe(true);
			}
		}
	});

	it("does not vendor compiler or stdlib sources into the website", () => {
		expect(existsSync(join(repoRoot, "crates"))).toBe(false);
		expect(existsSync(join(repoRoot, "packages", "std"))).toBe(false);
	});
});
