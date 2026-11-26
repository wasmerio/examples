import type { RawBookPageDefinition } from "../types";

export const abstractionsPages = [
	{
		id: "shapes",
		partId: "abstractions",
		path: "/docs/book/abstractions/shapes",
		aliases: [
			"/docs/language/abstractions/shapes",
			"/learn/language/abstractions/shapes",
		],
		sourcePath: "content/musi-book/pages/abstractions/shapes.md",
		questions: [],
	},
	{
		id: "given-values",
		partId: "abstractions",
		path: "/docs/book/abstractions/given-values",
		aliases: [
			"/docs/language/abstractions/given-values",
			"/learn/language/abstractions/given-values",
		],
		sourcePath: "content/musi-book/pages/abstractions/given-values.md",
		questions: [],
	},
	{
		id: "laws",
		partId: "abstractions",
		path: "/docs/book/abstractions/laws",
		aliases: [
			"/docs/language/abstractions/laws",
			"/learn/language/abstractions/laws",
		],
		sourcePath: "content/musi-book/pages/abstractions/laws.md",
		questions: [],
	},
	{
		id: "contextual-capabilities",
		partId: "abstractions",
		path: "/docs/book/abstractions/contextual-capabilities",
		aliases: [
			"/docs/language/abstractions/contextual-capabilities",
			"/learn/language/abstractions/contextual-capabilities",
		],
		sourcePath:
			"content/musi-book/pages/abstractions/contextual-capabilities.md",
		questions: [],
	},
] satisfies readonly RawBookPageDefinition[];
