import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { Marked, Renderer, type Tokens } from "marked";
import { createHighlighter, type LanguageRegistration } from "shiki";
import {
	bookPages,
	bookParts,
	bookSections,
} from "../src/content/book/manifest";
import { tryBlocks } from "../src/content/book/try-registry";
import { exampleGroups } from "../src/content/examples/groups";
import { contentSnippets } from "../src/content/snippet-registry";

const repoRoot = join(import.meta.dir, "..");
const generatedDocsPath = join(
	repoRoot,
	"src",
	"generated",
	"rendered-docs.json",
);
const generatedSnippetsPath = join(
	repoRoot,
	"src",
	"generated",
	"rendered-snippets.json",
);
const grammarPath = join(
	repoRoot,
	"src",
	"content",
	"grammars",
	"musi.tmLanguage.json",
);

const themeName = "github-light-high-contrast";
const supportedPlaceholderPattern =
	/\{\{\s*(snippet|example|try):([\w-]+)\s*\}\}/g;
const integerPattern = /^-?\d+$/;
const leadingNewlinePattern = /^\n+/;
const firstMarkdownHeadingPattern = /^#\s+(.+?)\s*#*\s*$/;
const frontmatterLinePattern = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/;
const frontmatterKeys = [
	"title",
	"description",
	"group",
	"section",
	"order",
	"slug",
	"summary",
] as const;

type FrontmatterKey = (typeof frontmatterKeys)[number];
type FrontmatterValue = string | number;
type MarkdownFrontmatter = Partial<Record<FrontmatterKey, FrontmatterValue>>;

interface MarkdownDoc {
	sourcePath: string;
	frontmatter: MarkdownFrontmatter;
	body: string;
}

interface GeneratedHeading {
	depth: number;
	id: string;
	text: string;
}

interface GeneratedDoc {
	locale: "en";
	id: string;
	kind: "part" | "section" | "chapter";
	parentId: string | null;
	depth: number;
	treePath: string[];
	childIds: string[];
	partId: string;
	partTitle: string;
	partTitleHtml: string;
	sectionId: string | null;
	sectionTitle: string | null;
	sectionTitleHtml: string | null;
	path: string;
	canonicalPath: string;
	aliases: string[];
	questions: { label: string; href: string }[];
	title: string;
	titleHtml: string;
	description: string;
	descriptionHtml: string;
	group: string;
	section: string;
	order: number;
	slug: string;
	summary: string;
	summaryHtml: string;
	headings: GeneratedHeading[];
	html: string;
}

interface GeneratedSnippets {
	homeSampleHtml: string;
	installCurlHtml: string;
	installPowershellHtml: string;
	installCargoHtml: string;
	quickstartHtml: string;
}

interface DocMetadata {
	title: string;
	description: string;
	group: string;
	section: string;
	order: number;
	slug: string;
	summary: string;
}

interface RenderedContent {
	html: string;
	headings: GeneratedHeading[];
}

type MusiGrammar = LanguageRegistration & { aliases?: string[] };

interface BaseDocSeed {
	id: string;
	kind: GeneratedDoc["kind"];
	parentId: string | null;
	partId: string;
	sectionId: string | null;
	path: string;
	aliases: readonly string[];
	questions: readonly { labels: Record<"en", string> }[];
	metadata: DocMetadata;
	rendered: RenderedContent;
}

type PartDocSeed = BaseDocSeed & { kind: "part"; sectionId: null };
type SectionDocSeed = BaseDocSeed & { kind: "section" };
type ChapterDocSeed = BaseDocSeed & { kind: "chapter" };
type DocSeed = PartDocSeed | SectionDocSeed | ChapterDocSeed;

function normalizePath(path: string) {
	if (path === "/") {
		return path;
	}
	return path.endsWith("/") ? path.slice(0, -1) : path;
}

function toLearnPath(path: string) {
	if (!path.startsWith("/docs/")) {
		return normalizePath(path);
	}
	return normalizePath(`/learn/${path.slice("/docs/".length)}`);
}

function toDocsPath(path: string) {
	if (!path.startsWith("/learn/")) {
		return normalizePath(path);
	}
	return normalizePath(`/docs/${path.slice("/learn/".length)}`);
}

function lastPathSegment(path: string) {
	const normalized = normalizePath(path);
	const index = normalized.lastIndexOf("/");
	return index === -1 ? normalized : normalized.slice(index + 1);
}

function uniquePaths(paths: readonly string[]) {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const path of paths) {
		const normalized = normalizePath(path);
		if (seen.has(normalized)) {
			continue;
		}
		seen.add(normalized);
		result.push(normalized);
	}
	return result;
}

function slugifyText(text: string) {
	const base = text
		.toLowerCase()
		.trim()
		.replace(/[`'"’"“”]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
	return base.length > 0 ? base : "section";
}

function stripMatchingFirstHeading(markdown: string, title: string) {
	const firstLineEnd = markdown.indexOf("\n");
	const firstLine =
		firstLineEnd === -1 ? markdown : markdown.slice(0, firstLineEnd);
	const match = firstLine.match(firstMarkdownHeadingPattern);
	if (!match) {
		return markdown;
	}

	const [, heading] = match;
	if (slugifyText(heading) !== slugifyText(title)) {
		return markdown;
	}

	return firstLineEnd === -1
		? ""
		: markdown.slice(firstLineEnd + 1).replace(leadingNewlinePattern, "");
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function parseFrontmatterValue(rawValue: string) {
	const trimmed = rawValue.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	if (integerPattern.test(trimmed)) {
		return Number.parseInt(trimmed, 10);
	}
	return trimmed;
}

function parseMarkdownDoc(source: string, sourcePath: string): MarkdownDoc {
	const normalized = source.replaceAll("\r\n", "\n");
	if (!normalized.startsWith("---\n")) {
		throw new Error(`${sourcePath}: missing frontmatter opening fence`);
	}
	const frontmatterEndIndex = normalized.indexOf("\n---\n", 4);
	if (frontmatterEndIndex === -1) {
		throw new Error(`${sourcePath}: missing frontmatter closing fence`);
	}

	const frontmatterBlock = normalized.slice(4, frontmatterEndIndex);
	const frontmatter: MarkdownFrontmatter = {};
	for (const line of frontmatterBlock.split("\n")) {
		if (line.trim().length === 0) {
			continue;
		}

		const match = line.match(frontmatterLinePattern);
		if (!match) {
			throw new Error(`${sourcePath}: invalid frontmatter line \`${line}\``);
		}

		const [, rawKey, rawValue] = match;
		const key = rawKey as FrontmatterKey;
		if (frontmatterKeys.includes(key)) {
			frontmatter[key] = parseFrontmatterValue(rawValue);
		}
	}

	return {
		sourcePath,
		frontmatter,
		body: normalized
			.slice(frontmatterEndIndex + 5)
			.replace(leadingNewlinePattern, ""),
	};
}

async function loadMarkdownDoc(sourcePath: string): Promise<MarkdownDoc> {
	return parseMarkdownDoc(
		await readFile(join(repoRoot, sourcePath), "utf8"),
		sourcePath,
	);
}

function metadataFromFrontmatter(
	frontmatter: MarkdownFrontmatter,
	sourcePath: string,
): DocMetadata {
	const title = frontmatter.title;
	const description = frontmatter.description;
	const group = frontmatter.group;
	const section = frontmatter.section;
	const order = frontmatter.order;
	const slug = frontmatter.slug;
	const summary = frontmatter.summary;

	if (typeof title !== "string") {
		throw new Error(`${sourcePath}: frontmatter \`title\` must be string`);
	}
	if (typeof description !== "string") {
		throw new Error(
			`${sourcePath}: frontmatter \`description\` must be string`,
		);
	}
	if (typeof group !== "string") {
		throw new Error(`${sourcePath}: frontmatter \`group\` must be string`);
	}
	if (typeof section !== "string") {
		throw new Error(`${sourcePath}: frontmatter \`section\` must be string`);
	}
	if (typeof order !== "number" || !Number.isInteger(order)) {
		throw new Error(`${sourcePath}: frontmatter \`order\` must be integer`);
	}
	if (typeof slug !== "string") {
		throw new Error(`${sourcePath}: frontmatter \`slug\` must be string`);
	}
	if (typeof summary !== "string") {
		throw new Error(`${sourcePath}: frontmatter \`summary\` must be string`);
	}

	return {
		title,
		description,
		group,
		section,
		order,
		slug,
		summary,
	};
}

function normalizeLanguage(language: string) {
	const normalized = language.trim().toLowerCase();
	switch (normalized) {
		case "musi":
		case "music":
			return "musi";
		case "sh":
		case "shell":
		case "zsh":
		case "console":
			return "bash";
		case "c++":
			return "cpp";
		case "c#":
			return "csharp";
		case "ps":
		case "ps1":
			return "powershell";
		case "plaintext":
		case "plain":
		case "txt":
			return "text";
		default:
			return normalized.length > 0 ? normalized : "text";
	}
}

class HeadingSlugger {
	private readonly seen = new Map<string, number>();

	slug(text: string) {
		const base = slugifyText(text);
		const count = this.seen.get(base) ?? 0;
		this.seen.set(base, count + 1);
		return count === 0 ? base : `${base}-${count}`;
	}
}

function buildAliases(
	canonicalPath: string,
	primaryPath: string,
	extraAliases: readonly string[],
) {
	const aliases: string[] = [toDocsPath(canonicalPath), canonicalPath];
	const candidates = [primaryPath, ...extraAliases];
	for (const candidate of candidates) {
		aliases.push(candidate);
		if (candidate.startsWith("/docs/")) {
			aliases.push(toLearnPath(candidate));
		}
	}
	return uniquePaths(aliases);
}

function chapterCanonicalPath(
	chapter: ChapterDocSeed,
	sectionCanonicalPath: string,
) {
	const basePath = toLearnPath(chapter.path);
	if (basePath.startsWith(`${sectionCanonicalPath}/`)) {
		return basePath;
	}
	return normalizePath(`${sectionCanonicalPath}/${lastPathSegment(basePath)}`);
}

function compareByOrderThenTitle(left: DocSeed, right: DocSeed) {
	if (left.metadata.order !== right.metadata.order) {
		return left.metadata.order - right.metadata.order;
	}
	const titleComparison = left.metadata.title.localeCompare(
		right.metadata.title,
	);
	if (titleComparison !== 0) {
		return titleComparison;
	}
	return left.id.localeCompare(right.id);
}

async function createRenderer() {
	const snippetById = new Map(
		contentSnippets.map((snippet) => [snippet.id, snippet]),
	);
	const exampleById = new Map(exampleGroups.map((group) => [group.id, group]));
	const tryBlockById = new Map(tryBlocks.map((block) => [block.id, block]));
	const grammarSource = await readFile(grammarPath, "utf8");
	const musiGrammar = JSON.parse(grammarSource) as MusiGrammar;
	const grammarAliases = Array.isArray(musiGrammar.aliases)
		? musiGrammar.aliases.filter(
				(alias): alias is string => typeof alias === "string",
			)
		: [];
	const musiLanguage: LanguageRegistration = {
		...musiGrammar,
		name: "musi",
		aliases: [
			...new Set(
				[...grammarAliases, "Musi", "music"].filter(
					(alias) => alias !== "musi",
				),
			),
		],
	};

	const highlighter = await createHighlighter({
		themes: [themeName],
		langs: [
			musiLanguage,
			"bash",
			"powershell",
			"c",
			"cpp",
			"csharp",
			"go",
			"java",
			"javascript",
			"typescript",
			"lua",
			"python",
			"rust",
			"text",
		],
	});
	const loadedLanguages = new Set(highlighter.getLoadedLanguages());
	if (!loadedLanguages.has("musi")) {
		throw new Error("Shiki failed to load synced Musi grammar as `musi`");
	}

	function highlightCode(sourceText: string, language: string) {
		const normalizedLanguage = normalizeLanguage(language);
		if (loadedLanguages.has(normalizedLanguage)) {
			return highlighter.codeToHtml(sourceText, {
				theme: themeName,
				lang: normalizedLanguage,
			});
		}
		if (normalizedLanguage === "musi") {
			throw new Error(
				"Shiki Musi grammar is not loaded; refusing plaintext fallback",
			);
		}
		return highlighter.codeToHtml(sourceText, {
			theme: themeName,
			lang: "text",
		});
	}

	function codeFrame(html: string) {
		return `<div class="mx-code-frame"><section class="mx-code-frame__content">${html}</section></div>`;
	}

	function renderSnippetPlaceholder(id: string, sourcePath: string) {
		const snippet = snippetById.get(id);
		if (!snippet) {
			throw new Error(
				`${sourcePath}: unknown snippet placeholder id \`${id}\``,
			);
		}
		return codeFrame(highlightCode(snippet.sourceText, snippet.language));
	}

	function renderExamplePlaceholder(id: string, sourcePath: string) {
		const example = exampleById.get(id);
		if (!example) {
			throw new Error(
				`${sourcePath}: unknown example placeholder id \`${id}\``,
			);
		}
		return codeFrame(highlightCode(example.sourceText, "musi"));
	}

	function renderTryPlaceholder(id: string, sourcePath: string) {
		const tryBlock = tryBlockById.get(id);
		if (!tryBlock) {
			throw new Error(`${sourcePath}: unknown try placeholder id \`${id}\``);
		}
		const steps = tryBlock.steps
			.map((step) => `<li>${escapeHtml(step)}</li>`)
			.join("");
		return `<aside class="mx-doc-try"><p><strong>${escapeHtml(tryBlock.title)}</strong></p><ol>${steps}</ol></aside>`;
	}

	function replacePlaceholders(markdown: string, sourcePath: string) {
		return markdown.replace(
			supportedPlaceholderPattern,
			(rawMatch, kind: string, id: string) => {
				switch (kind) {
					case "snippet":
						return renderSnippetPlaceholder(id, sourcePath);
					case "example":
						return renderExamplePlaceholder(id, sourcePath);
					case "try":
						return renderTryPlaceholder(id, sourcePath);
					default:
						throw new Error(
							`${sourcePath}: unsupported placeholder \`${rawMatch}\``,
						);
				}
			},
		);
	}

	function renderInlineMarkdown(markdown: string) {
		const inlineParser = new Marked({ gfm: true });
		return inlineParser.parseInline(markdown) as string;
	}

	function renderMarkdown(
		markdown: string,
		sourcePath: string,
	): RenderedContent {
		const resolvedMarkdown = replacePlaceholders(markdown, sourcePath);
		const headings: GeneratedHeading[] = [];
		const slugger = new HeadingSlugger();
		const renderer = new Renderer();

		renderer.code = ({ text, lang }) => highlightCode(text, lang ?? "text");
		renderer.heading = ({ depth, text }: Tokens.Heading) => {
			const headingText = text.trim();
			const headingId = slugger.slug(headingText);
			if (depth >= 2) {
				headings.push({
					depth,
					id: headingId,
					text: headingText,
				});
			}
			// Preserve inline code in heading links while keeping slug text stable.
			return `<h${depth} id="${headingId}"><a href="#${headingId}">${renderInlineMarkdown(headingText)}</a></h${depth}>`;
		};

		const parser = new Marked({ gfm: true, renderer });
		const html = parser.parse(resolvedMarkdown) as string;
		return {
			html,
			headings,
		};
	}

	return {
		highlightCode,
		renderInlineMarkdown,
		renderMarkdown,
	};
}

function buildPartSeeds(renderer: Awaited<ReturnType<typeof createRenderer>>) {
	return Promise.all(
		bookParts.map(async (part): Promise<PartDocSeed> => {
			const markdownDoc = await loadMarkdownDoc(part.sourcePath);
			const metadata = metadataFromFrontmatter(
				markdownDoc.frontmatter,
				markdownDoc.sourcePath,
			);
			return {
				id: part.id,
				kind: "part",
				parentId: null,
				partId: part.id,
				sectionId: null,
				path: part.path,
				aliases: part.aliases ?? [],
				questions: [],
				metadata,
				rendered: renderer.renderMarkdown(
					stripMatchingFirstHeading(markdownDoc.body, metadata.title),
					markdownDoc.sourcePath,
				),
			};
		}),
	);
}

function buildSectionSeeds(
	renderer: Awaited<ReturnType<typeof createRenderer>>,
) {
	return Promise.all(
		bookSections.map(async (section): Promise<SectionDocSeed> => {
			const parentId =
				"parentId" in section && typeof section.parentId === "string"
					? section.parentId
					: section.partId;
			const sourcePath =
				"sourcePath" in section && typeof section.sourcePath === "string"
					? section.sourcePath
					: null;
			if (sourcePath && !sourcePath.startsWith("generated://")) {
				const markdownDoc = await loadMarkdownDoc(sourcePath);
				const metadata = metadataFromFrontmatter(
					markdownDoc.frontmatter,
					markdownDoc.sourcePath,
				);
				return {
					id: section.id,
					kind: "section",
					parentId,
					partId: section.partId,
					sectionId: section.id,
					path: section.path,
					aliases: section.aliases ?? [],
					questions: [],
					metadata,
					rendered: renderer.renderMarkdown(
						stripMatchingFirstHeading(markdownDoc.body, metadata.title),
						markdownDoc.sourcePath,
					),
				};
			}

			const metadata: DocMetadata = {
				title: section.title,
				description: section.description,
				group: section.group,
				section: section.section,
				order: section.order,
				slug: section.slug,
				summary: section.summary,
			};

			return {
				id: section.id,
				kind: "section",
				parentId,
				partId: section.partId,
				sectionId: section.id,
				path: section.path,
				aliases: section.aliases ?? [],
				questions: [],
				metadata,
				rendered: {
					html: `<p>${renderer.renderInlineMarkdown(section.description)}</p>`,
					headings: [],
				},
			};
		}),
	);
}

function buildChapterSeeds(
	renderer: Awaited<ReturnType<typeof createRenderer>>,
) {
	return Promise.all(
		bookPages.map(async (page): Promise<ChapterDocSeed> => {
			const markdownDoc = await loadMarkdownDoc(page.sourcePath);
			const metadata = metadataFromFrontmatter(
				markdownDoc.frontmatter,
				markdownDoc.sourcePath,
			);
			return {
				id: page.id,
				kind: "chapter",
				parentId: page.sectionId ?? page.partId,
				partId: page.partId,
				sectionId: page.sectionId,
				path: page.path,
				aliases: page.aliases,
				questions: page.questions,
				metadata,
				rendered: renderer.renderMarkdown(
					stripMatchingFirstHeading(markdownDoc.body, metadata.title),
					markdownDoc.sourcePath,
				),
			};
		}),
	);
}

function buildGeneratedDocs(
	partSeeds: PartDocSeed[],
	sectionSeeds: SectionDocSeed[],
	chapterSeeds: ChapterDocSeed[],
	renderInlineMarkdown: (value: string) => string,
): GeneratedDoc[] {
	const allSeeds: DocSeed[] = [...partSeeds, ...sectionSeeds, ...chapterSeeds];
	const seedById = new Map(allSeeds.map((seed) => [seed.id, seed]));

	const canonicalPathById = new Map<string, string>();
	for (const part of partSeeds) {
		canonicalPathById.set(part.id, toLearnPath(part.path));
	}
	for (const section of sectionSeeds) {
		canonicalPathById.set(section.id, toLearnPath(section.path));
	}
	for (const chapter of chapterSeeds) {
		const parentPath = canonicalPathById.get(
			chapter.sectionId ?? chapter.partId,
		);
		if (!parentPath) {
			throw new Error(`missing parent path for chapter \`${chapter.id}\``);
		}
		canonicalPathById.set(
			chapter.id,
			chapterCanonicalPath(chapter, parentPath),
		);
	}

	const childrenByParentId = new Map<string, string[]>();
	for (const seed of allSeeds) {
		if (!seed.parentId) {
			continue;
		}
		const children = childrenByParentId.get(seed.parentId) ?? [];
		children.push(seed.id);
		childrenByParentId.set(seed.parentId, children);
	}
	for (const [parentId, childIds] of childrenByParentId) {
		childIds.sort((leftId, rightId) => {
			const left = seedById.get(leftId);
			const right = seedById.get(rightId);
			if (!(left && right)) {
				return leftId.localeCompare(rightId);
			}
			return compareByOrderThenTitle(left, right);
		});
		childrenByParentId.set(parentId, childIds);
	}

	const depthById = new Map<string, number>();
	const treePathById = new Map<string, string[]>();
	const resolving = new Set<string>();

	function resolveDepth(id: string): number {
		const existing = depthById.get(id);
		if (existing !== undefined) {
			return existing;
		}
		if (resolving.has(id)) {
			throw new Error(`cycle detected in doc tree at \`${id}\``);
		}
		resolving.add(id);
		const seed = seedById.get(id);
		if (!seed) {
			throw new Error(`missing seed for \`${id}\``);
		}
		let depth = 0;
		let treePath = [id];
		if (seed.parentId) {
			const parentDepth = resolveDepth(seed.parentId);
			const parentPath = treePathById.get(seed.parentId);
			if (!parentPath) {
				throw new Error(`missing tree path for parent \`${seed.parentId}\``);
			}
			depth = parentDepth + 1;
			treePath = [...parentPath, id];
		}
		depthById.set(id, depth);
		treePathById.set(id, treePath);
		resolving.delete(id);
		return depth;
	}

	for (const seed of allSeeds) {
		resolveDepth(seed.id);
	}

	const partTitleById = new Map(
		partSeeds.map((part) => [part.id, part.metadata.title]),
	);
	const partTitleHtmlById = new Map(
		partSeeds.map((part) => [
			part.id,
			renderInlineMarkdown(part.metadata.title),
		]),
	);
	const sectionTitleById = new Map(
		sectionSeeds.map((section) => [section.id, section.metadata.title]),
	);
	const sectionTitleHtmlById = new Map(
		sectionSeeds.map((section) => [
			section.id,
			renderInlineMarkdown(section.metadata.title),
		]),
	);

	function resolvePartDisplay(seed: DocSeed) {
		if (seed.kind === "part") {
			return {
				partTitle: seed.partId,
				partTitleHtml: renderInlineMarkdown(seed.metadata.title),
			};
		}
		const partTitle = partTitleById.get(seed.partId) ?? seed.partId;
		return {
			partTitle,
			partTitleHtml:
				partTitleHtmlById.get(seed.partId) ?? renderInlineMarkdown(partTitle),
		};
	}

	function resolveSectionDisplay(seed: DocSeed) {
		if (seed.kind === "part" || !seed.sectionId) {
			return {
				sectionTitle: null,
				sectionTitleHtml: null,
			};
		}
		return {
			sectionTitle: sectionTitleById.get(seed.sectionId) ?? null,
			sectionTitleHtml: sectionTitleHtmlById.get(seed.sectionId) ?? null,
		};
	}

	function buildQuestionLinks(seed: DocSeed, canonicalPath: string) {
		return seed.questions.map((question) => {
			const label = question.labels.en;
			return {
				label,
				href: `${canonicalPath}#${slugifyText(label)}`,
			};
		});
	}

	return allSeeds.map((seed) => {
		const canonicalPath = canonicalPathById.get(seed.id);
		if (!canonicalPath) {
			throw new Error(`missing canonical path for \`${seed.id}\``);
		}
		const depth = depthById.get(seed.id);
		const treePath = treePathById.get(seed.id);
		if (depth === undefined || !treePath) {
			throw new Error(`missing tree metadata for \`${seed.id}\``);
		}
		const { partTitle, partTitleHtml } = resolvePartDisplay(seed);
		const { sectionTitle, sectionTitleHtml } = resolveSectionDisplay(seed);

		return {
			locale: "en",
			id: seed.id,
			kind: seed.kind,
			parentId: seed.parentId,
			depth,
			treePath,
			childIds: [...(childrenByParentId.get(seed.id) ?? [])],
			partId: seed.partId,
			partTitle,
			partTitleHtml,
			sectionId: seed.sectionId,
			sectionTitle,
			sectionTitleHtml,
			path: canonicalPath,
			canonicalPath,
			aliases: buildAliases(canonicalPath, seed.path, seed.aliases),
			questions: buildQuestionLinks(seed, canonicalPath),
			title: seed.metadata.title,
			titleHtml: renderInlineMarkdown(seed.metadata.title),
			description: seed.metadata.description,
			descriptionHtml: renderInlineMarkdown(seed.metadata.description),
			group: seed.metadata.group,
			section: seed.metadata.section,
			order: seed.metadata.order,
			slug: seed.metadata.slug,
			summary: seed.metadata.summary,
			summaryHtml: renderInlineMarkdown(seed.metadata.summary),
			headings: seed.rendered.headings,
			html: seed.rendered.html,
		} satisfies GeneratedDoc;
	});
}

function readSnippetById(id: string) {
	const snippet = contentSnippets.find((candidate) => candidate.id === id);
	if (!snippet) {
		throw new Error(`missing snippet \`${id}\``);
	}
	return snippet;
}

function readExampleById(id: string) {
	const group = exampleGroups.find((candidate) => candidate.id === id);
	if (!group) {
		throw new Error(`missing example group \`${id}\``);
	}
	return group;
}

function buildGeneratedSnippets(
	highlightCode: (sourceText: string, language: string) => string,
): GeneratedSnippets {
	return {
		homeSampleHtml: highlightCode(
			readExampleById("home-intro").sourceText,
			"musi",
		),
		installCurlHtml: highlightCode(
			readSnippetById("install-curl").sourceText,
			readSnippetById("install-curl").language,
		),
		installPowershellHtml: highlightCode(
			readSnippetById("install-powershell").sourceText,
			readSnippetById("install-powershell").language,
		),
		installCargoHtml: highlightCode(
			readSnippetById("install-cargo").sourceText,
			readSnippetById("install-cargo").language,
		),
		quickstartHtml: highlightCode(
			readSnippetById("quickstart").sourceText,
			readSnippetById("quickstart").language,
		),
	};
}

async function writeIfChanged(path: string, nextValue: string) {
	let previousValue = "";
	try {
		previousValue = await readFile(path, "utf8");
	} catch {
		previousValue = "";
	}
	if (previousValue === nextValue) {
		return false;
	}
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, nextValue, "utf8");
	return true;
}

async function verifyUpToDate(path: string, expectedValue: string) {
	let currentValue = "";
	try {
		currentValue = await readFile(path, "utf8");
	} catch {
		currentValue = "";
	}
	return currentValue === expectedValue;
}

async function main() {
	const checkOnly = process.argv.includes("--check");
	const renderer = await createRenderer();
	const [partSeeds, sectionSeeds, chapterSeeds] = await Promise.all([
		buildPartSeeds(renderer),
		buildSectionSeeds(renderer),
		buildChapterSeeds(renderer),
	]);
	const generatedDocs = buildGeneratedDocs(
		partSeeds,
		sectionSeeds,
		chapterSeeds,
		renderer.renderInlineMarkdown,
	);
	const generatedSnippets = buildGeneratedSnippets(renderer.highlightCode);
	const renderedDocsJson = `${JSON.stringify(generatedDocs, null, "\t")}\n`;
	const renderedSnippetsJson = `${JSON.stringify(generatedSnippets, null, "\t")}\n`;

	if (checkOnly) {
		const [docsUpToDate, snippetsUpToDate] = await Promise.all([
			verifyUpToDate(generatedDocsPath, renderedDocsJson),
			verifyUpToDate(generatedSnippetsPath, renderedSnippetsJson),
		]);
		if (!(docsUpToDate && snippetsUpToDate)) {
			const staleFiles = [
				docsUpToDate ? null : "src/generated/rendered-docs.json",
				snippetsUpToDate ? null : "src/generated/rendered-snippets.json",
			].filter((path): path is string => path !== null);
			throw new Error(
				`generated content is stale: ${staleFiles.join(", ")}. Run \`bun run generate:content\`.`,
			);
		}
		console.log("generated content is up to date");
		return;
	}

	const [docsChanged, snippetsChanged] = await Promise.all([
		writeIfChanged(generatedDocsPath, renderedDocsJson),
		writeIfChanged(generatedSnippetsPath, renderedSnippetsJson),
	]);

	if (!(docsChanged || snippetsChanged)) {
		console.log("generated content already up to date");
		return;
	}

	const changedFiles = [
		docsChanged ? "src/generated/rendered-docs.json" : null,
		snippetsChanged ? "src/generated/rendered-snippets.json" : null,
	].filter((path): path is string => path !== null);

	console.log(`generated content updated: ${changedFiles.join(", ")}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
