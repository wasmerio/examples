import { renderedDocs } from "./generated-content";
import type { Locale } from "./lib/site-copy";
import { pageTitle } from "./lib/site-meta";
import type { AppRoute } from "./routes";

export interface DocHeading {
	depth: number;
	id: string;
	text: string;
}

export interface DocPage {
	id: string;
	kind: "part" | "section" | "chapter";
	parentId: string | null;
	depth: number;
	treePath: string[];
	childIds: string[];
	title: string;
	description: string;
	descriptionHtml: string;
	group: string;
	section: string;
	order: number;
	slug: string;
	summary: string;
	summaryHtml: string;
	headings: DocHeading[];
	html: string;
	path: string;
	canonicalPath: string;
	aliases: string[];
	partId: string;
	partTitle: string;
	partTitleHtml: string;
	sectionId: string | null;
	sectionTitle: string | null;
	sectionTitleHtml: string | null;
	titleHtml: string;
	questions: { label: string; href: string }[];
	locale: Locale;
}

export interface DocPart {
	id: string;
	title: string;
	titleHtml: string;
	summaryHtml: string;
	path: string;
	sections: DocPage[];
	chapters: DocPage[];
	locale: Locale;
}

interface DocGroup {
	group: string;
	groupHtml: string;
	path: string;
	summaryHtml: string;
	pages: DocPage[];
	locale: Locale;
}

const localizedDocs = renderedDocs as DocPage[];

const docsById = new Map<string, DocPage>();
const docsByPath = new Map<string, DocPage>();
for (const page of localizedDocs) {
	docsById.set(page.id, page);
	docsByPath.set(page.path, page);
	for (const alias of page.aliases) {
		docsByPath.set(alias, page);
	}
}

function docPartOrder(page: DocPage) {
	const part = localizedDocs.find(
		(candidate) => candidate.kind === "part" && candidate.id === page.partId,
	);
	return part?.order ?? page.order;
}

function docSectionOrder(page: DocPage) {
	if (!page.sectionId) {
		return 0;
	}
	const section = localizedDocs.find(
		(candidate) =>
			candidate.kind === "section" && candidate.id === page.sectionId,
	);
	return section?.order ?? page.order;
}

function compareDocs(left: DocPage, right: DocPage) {
	const partDelta = docPartOrder(left) - docPartOrder(right);
	if (partDelta !== 0) {
		return partDelta;
	}
	const sectionDelta = docSectionOrder(left) - docSectionOrder(right);
	if (sectionDelta !== 0) {
		return sectionDelta;
	}
	if (left.order !== right.order) {
		return left.order - right.order;
	}
	return left.title.localeCompare(right.title);
}

const childrenByParentId = new Map<string, DocPage[]>();
for (const page of localizedDocs) {
	if (!page.parentId) {
		continue;
	}
	const children = childrenByParentId.get(page.parentId) ?? [];
	children.push(page);
	childrenByParentId.set(page.parentId, children);
}
for (const children of childrenByParentId.values()) {
	children.sort(compareDocs);
}

const partDocs = localizedDocs
	.filter((page) => page.kind === "part")
	.sort(compareDocs);
const sectionDocs = localizedDocs
	.filter((page) => page.kind === "section")
	.sort(compareDocs);
const chapterDocs = localizedDocs
	.filter((page) => page.kind === "chapter")
	.sort(compareDocs);

export const docsPages = chapterDocs;
export const docLandingPages = localizedDocs.filter(
	(page) => page.kind === "part" || page.kind === "section",
);

function descendantChapters(rootId: string): DocPage[] {
	const chapters: DocPage[] = [];
	const walk = (id: string) => {
		for (const child of childrenByParentId.get(id) ?? []) {
			if (child.kind === "chapter") {
				chapters.push(child);
				continue;
			}
			walk(child.id);
		}
	};
	walk(rootId);
	return chapters;
}

export const docParts = partDocs.map((part) => {
	const children = childrenByParentId.get(part.id) ?? [];
	return {
		id: part.id,
		title: part.title,
		titleHtml: part.titleHtml,
		summaryHtml: part.summaryHtml,
		path: part.path,
		sections: children.filter((child) => child.kind === "section"),
		chapters: descendantChapters(part.id),
		locale: part.locale,
	} satisfies DocPart;
});

export const docGroups = docParts.map((part) => {
	const pages = childrenByParentId.get(part.id) ?? [];
	return {
		group: part.title,
		groupHtml: part.titleHtml,
		path: part.path,
		summaryHtml: part.summaryHtml,
		pages,
		locale: part.locale,
	} satisfies DocGroup;
});

export const docQuestionIndex: Array<{
	label: string;
	href: string;
	pageTitle: string;
	partTitle: string;
	locale: Locale;
}> = [];

for (const page of chapterDocs) {
	for (const question of page.questions) {
		docQuestionIndex.push({
			label: question.label,
			href: question.href,
			pageTitle: page.title,
			partTitle: page.partTitle,
			locale: page.locale,
		});
	}
}

export interface DocSearchEntry {
	id: string;
	title: string;
	titleHtml: string;
	path: string;
	summary: string;
	partTitle: string;
	partTitleHtml: string;
	sectionTitle: string | null;
	sectionTitleHtml: string | null;
	kind: DocPage["kind"];
	questions: string[];
	searchText: string;
}

export const docSearchEntries: DocSearchEntry[] = localizedDocs.map((page) => {
	const questions = page.questions.map((question) => question.label);
	const searchText = [
		page.title,
		page.summary,
		page.description,
		page.partTitle,
		page.sectionTitle ?? "",
		page.kind,
		...questions,
	]
		.join(" ")
		.toLowerCase();
	return {
		id: page.id,
		title: page.title,
		titleHtml: page.titleHtml,
		path: page.path,
		summary: page.summary,
		partTitle: page.partTitle,
		partTitleHtml: page.partTitleHtml,
		sectionTitle: page.sectionTitle,
		sectionTitleHtml: page.sectionTitleHtml,
		kind: page.kind,
		questions,
		searchText,
	};
});

export function docForPath(pathname: string) {
	return docsByPath.get(pathname);
}

export function docChildren(id: string) {
	return [...(childrenByParentId.get(id) ?? [])];
}

export function docBreadcrumb(id: string) {
	const page = docsById.get(id);
	if (!page) {
		return [];
	}
	const chain = page.treePath
		.map((nodeId) => docsById.get(nodeId))
		.filter((node): node is DocPage => Boolean(node));
	return chain;
}

const chapterTraversal: DocPage[] = [];
const chapterIndexById = new Map<string, number>();

function walkChapterTraversal(rootId: string) {
	for (const child of childrenByParentId.get(rootId) ?? []) {
		if (child.kind === "chapter") {
			chapterIndexById.set(child.id, chapterTraversal.length);
			chapterTraversal.push(child);
			continue;
		}
		walkChapterTraversal(child.id);
	}
}

for (const part of partDocs) {
	walkChapterTraversal(part.id);
}

export function docNeighbors(id: string) {
	const index = chapterIndexById.get(id);
	if (index === undefined) {
		return {};
	}
	return {
		previous: chapterTraversal[index - 1],
		next: chapterTraversal[index + 1],
	};
}

export function pagesForPart(partId: string) {
	return descendantChapters(partId);
}

export function docsRoutes(): AppRoute[] {
	const routes: AppRoute[] = [];
	for (const page of localizedDocs) {
		routes.push({
			id: `docs:${page.id}`,
			label: page.title,
			path: page.path,
			title: pageTitle(page.title),
			description: page.description,
			kind: "doc",
			docSlug: page.id,
			canonicalPath: page.canonicalPath,
			locale: page.locale,
			section: "learn",
		});
		for (const alias of [...new Set(page.aliases)]) {
			if (alias === page.path) {
				continue;
			}
			routes.push({
				id: `docs-alias:${page.id}:${alias}`,
				label: page.title,
				path: alias,
				title: pageTitle(page.title),
				description: page.description,
				kind: "doc",
				docSlug: page.id,
				canonicalPath: page.canonicalPath,
				locale: page.locale,
				section: "learn",
			});
		}
	}
	return routes;
}

export const docSections = sectionDocs;
