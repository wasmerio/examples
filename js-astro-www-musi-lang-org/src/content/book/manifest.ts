import { rawBookPages } from "./registry/pages";
import { bookParts } from "./registry/parts";
import { bookSections } from "./registry/sections";
import type { BookPageDefinition } from "./registry/types";

export type {
	BookPageDefinition,
	BookPageQuestion,
	BookPartDefinition,
	BookSectionDefinition,
} from "./registry/types";
export { bookParts, bookSections };

export const bookPages = rawBookPages.map((page) => ({
	...page,
	sectionId: null,
})) satisfies readonly BookPageDefinition[];
