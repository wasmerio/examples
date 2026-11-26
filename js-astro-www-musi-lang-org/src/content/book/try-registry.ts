export interface TryBlock {
	id: string;
	title: string;
	steps: string[];
}

export const tryBlocks = [
	{
		id: "getting-started",
		title: "Try it",
		steps: [
			"Install Rust and libffi.",
			"Build Musi from source.",
			"Run `music check index.ms` once `music` is on PATH.",
		],
	},
	{
		id: "first-program",
		title: "Try it",
		steps: [
			"Create `index.ms`.",
			"Bind one value with `let`.",
			"Run it with `music check index.ms`.",
		],
	},
	{
		id: "files-packages-and-entry",
		title: "Try it",
		steps: [
			"Create a package with `musi init hello`.",
			"Open the generated entry and test files.",
			"Run `musi check` and `musi test` from the package root.",
		],
	},
	{
		id: "imports-and-packages",
		title: "Try it",
		steps: [
			"Import `@std/option` in one file.",
			"Bind the module with `let`.",
			"Call one exported function from it.",
		],
	},
	{
		id: "expressions-and-bindings",
		title: "Try it",
		steps: [
			"Write two `let` bindings.",
			"Add a `match` expression under them.",
			"Read the file top to bottom and check the final result.",
		],
	},
	{
		id: "operators-and-literals",
		title: "Try it",
		steps: [
			"Make one record literal and one array literal.",
			"Apply one operator expression.",
			"Create one spread-based update.",
		],
	},
	{
		id: "functions-and-calls",
		title: "Try it",
		steps: [
			"Write one function with `let`.",
			"Call it with one argument.",
			"Add `let rec` and check recursive flow.",
		],
	},
	{
		id: "data-and-pattern-matching",
		title: "Try it",
		steps: [
			"Define a `data` type with two cases.",
			"Construct one value.",
			"Match it with `match ...`.",
		],
	},
	{
		id: "records-arrays-and-mutation",
		title: "Try it",
		steps: [
			"Create one record value.",
			"Create one array value.",
			"Build a new value with spread syntax.",
		],
	},
	{
		id: "types",
		title: "Try it",
		steps: [
			"Add a type annotation to one binding.",
			"Add a generic parameter to one function.",
			"Apply that generic explicitly.",
		],
	},
	{
		id: "shapes-given-values-and-laws",
		title: "Try it",
		steps: [
			"Define one shape.",
			"Add one given value for `Int`.",
			"Call the behavior through the shape API.",
		],
	},
	{
		id: "effects-and-handlers",
		title: "Try it",
		steps: [
			"Define one effect with one operation.",
			"Perform that operation.",
			"Handle it and use `resume` once.",
		],
	},
	{
		id: "quote-and-syntax",
		title: "Try it",
		steps: [
			"Write one `quote` expression.",
			"Splice one value into it.",
			"Compare the quoted code with duplicated handwritten code.",
		],
	},
	{
		id: "attributes-and-native",
		title: "Try it",
		steps: [
			"Declare one `native` binding.",
			"Add one attribute to it.",
			"Keep the named part small and clear.",
		],
	},
	{
		id: "foundation-and-standard-library",
		title: "Try it",
		steps: [
			"Import one `@std` module.",
			"Import one `musi:*` module.",
			"Write down which one belongs in app code.",
		],
	},
	{
		id: "testing-and-running",
		title: "Try it",
		steps: [
			"Create one `*.test.ms` file.",
			"Export a `test` binding.",
			"Run `musi test` and `music check index.ms`.",
		],
	},
	{
		id: "common-questions",
		title: "Try it",
		steps: [
			"Pick one question from this page.",
			"Follow its linked chapter.",
			"Add the shown syntax to a scratch file.",
		],
	},
] satisfies readonly TryBlock[];

export function tryBlockById(id: string) {
	return tryBlocks.find((block) => block.id === id);
}
