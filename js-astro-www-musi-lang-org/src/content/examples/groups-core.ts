import type { ExampleGroup } from "./types";

export const coreExampleGroups: readonly ExampleGroup[] = [
	{
		id: "home-intro",
		title: "Small Musi file",
		caption:
			"Start with one value, one function, and one final result. This matches Musi's beginner path.",
		note: "Musi reads top to bottom. Bind values with <code>let</code>, define small functions the same way, then end with the result you want.",
		sourceText: `let base := 21;

let twice (x : Int) : Int := x + x;

let reply := twice(base);
reply;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 5,
		},
	},
	{
		id: "option-fallback",
		title: "Fallback value from an optional result",
		caption:
			"One value may be present or missing. Musi does this with the real stdlib <code>Option</code> family.",
		note: "Think of a spare house key: if the usual key exists, use it; otherwise use the backup. Musi writes that choice with constructors and <code>match</code>.",
		sourceText: `let option := import "@std/option";

let port := option.someOf[Int](8080)
  |> option.unwrapOr[Int](3000);`,
		evidence: {
			path: "packages/std/option.ms",
			line: 6,
		},
	},
	{
		id: "double-function",
		title: "Small function that doubles a number",
		caption:
			"Same small task across multiple languages. Musi keeps it as an expression-oriented <code>let</code> binding.",
		note: "Like doubling a recipe: same operation, different kitchens. Musi keeps the function as a normal binding so it reads like other definitions.",
		sourceText: `let twice (x : Int) : Int := x + x;

let total := twice(21);`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 5,
		},
	},
	{
		id: "import-stdlib",
		title: "Import a standard library module",
		caption:
			"Import the standard library, then reach the family you need. Musi keeps stdlib access visible through <code>@std</code>.",
		note: "Like checking out a toolbox before work: import once, then use the tools by name. In Musi, imports are values you can pass around.",
		sourceText: `let option := import "@std/option";

let value := option.someOf[Int](1);`,
		evidence: {
			path: "packages/std/option.ms",
			line: 2,
		},
	},
	{
		id: "testing-entry",
		title: "Single package test entry",
		caption:
			"A small test entry should read like ordinary code. Musi uses <code>export let test ()</code> inside <code>*.test.ms</code> files.",
		note: "Think smoke detector checks: small, repeatable, and run regularly. Musi discovers these by file name and runs them with <code>musi test</code>.",
		sourceText: `let Testing := import "@std/testing";
export let test () := Testing.it("adds values", Testing.toBe(1 + 2, 3));`,
		evidence: {
			path: "packages/std/__tests__/option.test.ms",
			line: 4,
		},
	},
	{
		id: "data-named-record",
		title: "Named record data definition",
		caption:
			"Use named fields directly in a <code>data</code> definition, then construct values from that form.",
		note: "Like filling out a passport form: named boxes with known defaults. This form keeps field meaning visible in the type itself.",
		sourceText: `let user := {
  name := "Ada",
  age := 0,
};

let nextYear := { ...user, age := user.age + 1 };`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 643,
		},
	},
	{
		id: "record-array-spread",
		title: "Record and array spread updates",
		caption:
			"Build structured values, spread them, and update selected fields in one expression flow.",
		note: "Like copying a form and editing only one line instead of rewriting everything. Spread/update keeps the unchanged parts intact and keeps changed fields visible.",
		sourceText: `let xs := [1, 2];
let ys := [0, ...xs, 3];

let p := { x := 1, y := 2 };
let q := { ...p, y := 9 };`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1192,
		},
	},
] as const;
