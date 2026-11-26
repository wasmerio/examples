export interface BookPartDefinition {
	id: string;
	path: string;
	sourcePath: string;
	aliases?: string[];
}

export interface BookSectionDefinition {
	id: string;
	partId: string;
	parentId?: string;
	path: string;
	aliases?: string[];
	title: string;
	description: string;
	group: string;
	section: string;
	order: number;
	slug: string;
	summary: string;
	sourcePath?: string;
}

export interface BookPageQuestion {
	labels: Record<"en", string>;
}

export interface BookPageDefinition {
	id: string;
	partId: string;
	sectionId: string | null;
	path: string;
	aliases: string[];
	sourcePath: string;
	questions: BookPageQuestion[];
}

export type RawBookPageDefinition = Omit<BookPageDefinition, "sectionId">;
