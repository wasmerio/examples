import renderedDocsJson from "./generated/rendered-docs.json";
import renderedSnippetsJson from "./generated/rendered-snippets.json";

export interface GeneratedHeading {
	depth: number;
	id: string;
	text: string;
}

export interface GeneratedDoc {
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

export interface GeneratedSnippets {
	homeSampleHtml: string;
	installCurlHtml: string;
	installPowershellHtml: string;
	installCargoHtml: string;
	quickstartHtml: string;
}

export const renderedSnippets = renderedSnippetsJson as GeneratedSnippets;
export const renderedDocs = renderedDocsJson as GeneratedDoc[];
