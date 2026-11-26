import type { RawBookPageDefinition } from "../types";

export const dataPages = [
	{
		id: "records",
		partId: "data",
		path: "/docs/book/data/records",
		aliases: ["/docs/language/data/records", "/learn/language/data/records"],
		sourcePath: "content/musi-book/pages/data/records.md",
		questions: [],
	},
	{
		id: "arrays-and-slices",
		partId: "data",
		path: "/docs/book/data/arrays-and-slices",
		aliases: [
			"/docs/language/data/arrays-and-slices",
			"/learn/language/data/arrays-and-slices",
		],
		sourcePath: "content/musi-book/pages/data/arrays-and-slices.md",
		questions: [],
	},
	{
		id: "indexing-and-fields",
		partId: "data",
		path: "/docs/book/data/indexing-and-fields",
		aliases: [
			"/docs/language/data/indexing-and-fields",
			"/learn/language/data/indexing-and-fields",
		],
		sourcePath: "content/musi-book/pages/data/indexing-and-fields.md",
		questions: [],
	},
	{
		id: "data-definitions",
		partId: "data",
		path: "/docs/book/data/data-definitions",
		aliases: [
			"/docs/language/data/data-definitions",
			"/learn/language/data/data-definitions",
		],
		sourcePath: "content/musi-book/pages/data/data-definitions.md",
		questions: [],
	},
	{
		id: "patterns",
		partId: "data",
		path: "/docs/book/data/patterns",
		aliases: ["/docs/language/data/patterns", "/learn/language/data/patterns"],
		sourcePath: "content/musi-book/pages/data/patterns.md",
		questions: [],
	},
	{
		id: "option-and-result",
		partId: "data",
		path: "/docs/book/data/option-and-result",
		aliases: [
			"/docs/language/data/option-and-result",
			"/learn/language/data/option-and-result",
		],
		sourcePath: "content/musi-book/pages/data/option-and-result.md",
		questions: [],
	},
] satisfies readonly RawBookPageDefinition[];
