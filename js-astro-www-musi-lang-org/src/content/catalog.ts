import { bookPages, bookParts, bookSections } from "./book/manifest";
import type { BookSectionDefinition } from "./book/registry/types";

export type ContentCollectionId = "book" | "reference";
export type ContentAudience = "beginner" | "reference";

export interface ContentCollection {
	id: ContentCollectionId;
	title: string;
	path: string;
	audience: ContentAudience;
}

export interface ContentEntry {
	id: string;
	collection: ContentCollectionId;
	path: string;
	aliases: readonly string[];
	sourcePath: string;
	partId: string;
	sectionId?: string;
}

function sectionSourcePath(section: BookSectionDefinition) {
	return section.sourcePath ?? `generated://book-sections/${section.id}.md`;
}

export const contentCollections = [
	{
		id: "book",
		title: "Musi Book",
		path: "/learn/book",
		audience: "beginner",
	},
	{
		id: "reference",
		title: "Language Reference",
		path: "/learn/book/advanced",
		audience: "reference",
	},
] satisfies readonly ContentCollection[];

export const contentEntries = [
	...bookParts.map((part) => ({
		id: part.id,
		collection: "book" as const,
		path: part.path,
		aliases: part.aliases ?? [],
		sourcePath: part.sourcePath,
		partId: part.id,
	})),
	...bookSections.map((section) => ({
		id: section.id,
		collection: "book" as const,
		path: section.path,
		aliases: section.aliases ?? [],
		sourcePath: sectionSourcePath(section),
		partId: section.partId,
		sectionId: section.id,
	})),
	...bookPages.map((page) => ({
		id: page.id,
		collection: "book" as const,
		path: page.path,
		aliases: page.aliases,
		sourcePath: page.sourcePath,
		partId: page.partId,
		sectionId: page.sectionId,
	})),
] satisfies readonly ContentEntry[];
