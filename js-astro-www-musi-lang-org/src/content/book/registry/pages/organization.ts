import type { RawBookPageDefinition } from "../types";

export const organizationPages = [
	{
		id: "files",
		partId: "organization",
		path: "/docs/book/organization/files",
		aliases: [
			"/docs/language/organization/files",
			"/learn/language/organization/files",
		],
		sourcePath: "content/musi-book/pages/organization/files.md",
		questions: [],
	},
	{
		id: "packages",
		partId: "organization",
		path: "/docs/book/organization/packages",
		aliases: [
			"/docs/language/organization/packages",
			"/learn/language/organization/packages",
		],
		sourcePath: "content/musi-book/pages/organization/packages.md",
		questions: [],
	},
	{
		id: "imports-and-exports",
		partId: "organization",
		path: "/docs/book/organization/imports-and-exports",
		aliases: [
			"/docs/language/organization/imports-and-exports",
			"/learn/language/organization/imports-and-exports",
		],
		sourcePath: "content/musi-book/pages/organization/imports-and-exports.md",
		questions: [],
	},
	{
		id: "standard-library",
		partId: "organization",
		path: "/docs/book/organization/standard-library",
		aliases: [
			"/docs/language/organization/standard-library",
			"/learn/language/organization/standard-library",
		],
		sourcePath: "content/musi-book/pages/organization/standard-library.md",
		questions: [],
	},
] satisfies readonly RawBookPageDefinition[];
