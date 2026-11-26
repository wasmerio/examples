import type { BookPartDefinition } from "./types";

export const bookParts = [
	{
		id: "start",
		path: "/docs/book/start",
		aliases: ["/docs/language/start", "/learn/language/start"],
		sourcePath: "content/musi-book/parts/start.md",
	},
	{
		id: "core",
		path: "/docs/book/core",
		aliases: ["/docs/language/core", "/learn/language/core"],
		sourcePath: "content/musi-book/parts/core.md",
	},
	{
		id: "data",
		path: "/docs/book/data",
		aliases: ["/docs/language/data", "/learn/language/data"],
		sourcePath: "content/musi-book/parts/data.md",
	},
	{
		id: "organization",
		path: "/docs/book/organization",
		aliases: ["/docs/language/organization", "/learn/language/organization"],
		sourcePath: "content/musi-book/parts/organization.md",
	},
	{
		id: "types",
		path: "/docs/book/types",
		aliases: ["/docs/language/types", "/learn/language/types"],
		sourcePath: "content/musi-book/parts/types.md",
	},
	{
		id: "abstractions",
		path: "/docs/book/abstractions",
		aliases: ["/docs/language/abstractions", "/learn/language/abstractions"],
		sourcePath: "content/musi-book/parts/abstractions.md",
	},
	{
		id: "effects-runtime",
		path: "/docs/book/effects-runtime",
		aliases: [
			"/docs/language/effects-runtime",
			"/learn/language/effects-runtime",
		],
		sourcePath: "content/musi-book/parts/effects-runtime.md",
	},
	{
		id: "advanced",
		path: "/docs/book/advanced",
		aliases: ["/docs/language/advanced", "/learn/language/advanced"],
		sourcePath: "content/musi-book/parts/advanced.md",
	},
] satisfies readonly BookPartDefinition[];
