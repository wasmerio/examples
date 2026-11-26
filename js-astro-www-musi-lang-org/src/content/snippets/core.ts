import type { ContentSnippet } from "./types";

export const coreSnippets = [
	{
		id: "first-file",
		language: "musi",
		sourceText: `let total := 42;
total;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 3,
		},
	},
	{
		id: "first-function",
		language: "musi",
		sourceText: `let twice (x : Int) : Int := x + x;
twice(21);`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 5,
		},
	},
	{
		id: "music-direct",
		language: "bash",
		sourceText: `music check index.ms
music build index.ms
music run index.seam`,
		evidence: {
			path: "README.md",
			line: 131,
		},
	},
	{
		id: "let-binding",
		language: "musi",
		sourceText: `let port := 8080;
port;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 24,
		},
	},
	{
		id: "mutable-value",
		language: "musi",
		sourceText: `let counter := mut 1;
counter := 2;
counter;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1212,
		},
	},
	{
		id: "sequence",
		language: "musi",
		sourceText: `(
  let base := 8000;
  base + 80
);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 148,
		},
	},
	{
		id: "case-port",
		language: "musi",
		sourceText: `let Port := data {
  | Configured(port : Int)
  | Default
};

let port : Port := .Configured(port := 8080);
match port (
| .Configured(port) => port
| .Default => 3000
);`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1586,
		},
	},
	{
		id: "recursive-case",
		language: "musi",
		sourceText: `let rec loop (x : Int) : Int :=
  match x (
  | 0 => 0
  | _ => loop(x - 1)
  );`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1004,
		},
	},
	{
		id: "import-std-root",
		language: "musi",
		sourceText: `let Std := import "@std";
let Option := Std.option;
let Result := Std.result;`,
		evidence: {
			path: "packages/std/std.ms",
			line: 2,
		},
	},
	{
		id: "types-basic",
		language: "musi",
		sourceText: `let port : Int := 8080;
let identityFn[T] (input : T) : T := input;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 354,
		},
	},
	{
		id: "types-apply",
		language: "musi",
		sourceText: "identityFn[Int](port);",
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1094,
		},
	},
	{
		id: "data-port",
		language: "musi",
		sourceText: `let Port := data {
  | Configured(port : Int)
  | Default
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1586,
		},
	},
	{
		id: "data-port-value",
		language: "musi",
		sourceText: "let port : Port := .Configured(port := 8080);",
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1590,
		},
	},
	{
		id: "data-port-case",
		language: "musi",
		sourceText: `match port (
| .Configured(value) => value
| .Default => 3000
);`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1591,
		},
	},
	{
		id: "record-array",
		language: "musi",
		sourceText: `let point := { x := 3, y := 4 };
let values := [1, 2, 3];`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 80,
		},
	},
	{
		id: "spread-record-array",
		language: "musi",
		sourceText: `let point3 := { ...point, z := 5 };
let extended := [0, ...values];`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1525,
		},
	},
	{
		id: "operators-literals-basic",
		language: "musi",
		sourceText: `let port := 8080;
let label := "ready";
let next := port + 1;
let same := next = port + 1;
let capped := port <= 9000;
let masked := 1 shl 3;`,
		evidence: {
			path: "crates/music_resolve/src/resolver/expr/operators.rs",
			line: 1,
		},
	},
	{
		id: "ranges-basic",
		language: "musi",
		sourceText: `let closed := 0..10;
let halfOpen := 0..<10;
closed;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 239,
		},
	},
	{
		id: "receiver-method",
		language: "musi",
		sourceText: "let (self : Int).abs () : Int := self;",
		evidence: {
			path: "crates/music_resolve/src/tests.rs",
			line: 118,
		},
	},
	{
		id: "receiver-method-call",
		language: "musi",
		sourceText: `let one := 1;
one.abs();`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 510,
		},
	},
	{
		id: "slice-helpers",
		language: "musi",
		sourceText: `let Slice := import "@std/collections/slice";
Slice.concat[Int]([1], [2, 3]);`,
		evidence: {
			path: "packages/std/collections/slice.ms",
			line: 8,
		},
	},
	{
		id: "export-import",
		language: "musi",
		sourceText: `export let total := 42;
let Local := import "./index.ms";
Local.total;`,
		evidence: {
			path: "crates/music_sema/src/checker/surface/exports.rs",
			line: 607,
		},
	},
	{
		id: "type-inference",
		language: "musi",
		sourceText: `let port : Int := 8080;
let next := port + 1;
next;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 32,
		},
	},
	{
		id: "effect-console",
		language: "musi",
		sourceText: `let Clock := effect {
  let tick () : Int;
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 317,
		},
	},
	{
		id: "ask-console",
		language: "musi",
		sourceText: "ask Clock.tick();",
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 317,
		},
	},
	{
		id: "handle-console",
		language: "musi",
		sourceText: `let clockAnswer := answer Clock {
  tick(k) => resume 1;
};

handle Clock.tick() answer clockAnswer;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 331,
		},
	},
	{
		id: "require-signature",
		language: "musi",
		sourceText: `let nextTick () : Int require { Clock } :=
  ask Clock.tick();`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1444,
		},
	},
	{
		id: "shape-eq",
		language: "musi",
		sourceText: `let Eq[T] := shape {
  let (=) (a : T, b : T) : Bool;
  law reflexive (x : T) := 0 = 0;
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 503,
		},
	},
	{
		id: "given-eq-int",
		language: "musi",
		sourceText: `let eqInt := given Eq[Int] {
  let (=) (a : Int, b : Int) : Bool := 0 = 0;
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 506,
		},
	},
	{
		id: "native-puts",
		language: "musi",
		sourceText: 'native "c" let puts (msg : CString) : Int;',
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 70,
		},
	},
	{
		id: "attr-link-native",
		language: "musi",
		sourceText: '@link(name := "c") native "c" let puts (msg : CString) : Int;',
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 78,
		},
	},
	{
		id: "quote-expr",
		language: "musi",
		sourceText: "quote (x + 1);",
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 76,
		},
	},
	{
		id: "quote-block",
		language: "musi",
		sourceText: `quote {
  x;
};`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 77,
		},
	},
	{
		id: "quote-without-meta",
		language: "musi",
		sourceText: `let addOne (x : Int) : Int := x + 1;
let addTwo (x : Int) : Int := x + 2;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 215,
		},
	},
	{
		id: "quote-with-meta",
		language: "musi",
		sourceText: `let addTemplate := quote (x + #(delta));
let addOneSyntax := quote (#(x) + 1);
let addTwoSyntax := quote (#(x) + 2);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 215,
		},
	},
	{
		id: "install-curl",
		language: "bash",
		sourceText:
			"curl -fsSL https://raw.githubusercontent.com/musi-lang/musi/main/install.sh | sh",
		evidence: {
			path: "README.md",
			line: 61,
		},
	},
	{
		id: "install-powershell",
		language: "powershell",
		sourceText:
			'powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/musi-lang/musi/main/install.ps1 | iex"',
		evidence: {
			path: "README.md",
			line: 67,
		},
	},
	{
		id: "install-cargo",
		language: "bash",
		sourceText: `git clone https://github.com/musi-lang/musi.git
cd musi
cargo install --locked --force --path crates/music
cargo install --locked --force --path crates/musi`,
		evidence: {
			path: "README.md",
			line: 84,
		},
	},
	{
		id: "foundation-import",
		language: "musi",
		sourceText: `let Core := import "musi:core";
Core;`,
		evidence: {
			path: "crates/musi_foundation/src/lib.rs",
			line: 9,
		},
	},
	{
		id: "runtime-import",
		language: "musi",
		sourceText: `let Runtime := import "musi:time";
Runtime.envGet("HOME");`,
		evidence: {
			path: "packages/std/env.ms",
			line: 2,
		},
	},
	{
		id: "quickstart",
		language: "bash",
		sourceText: `musi init hello
cd hello
musi check
musi test`,
		evidence: {
			path: "crates/musi/src/main.rs",
			line: 1,
		},
	},
	{
		id: "package-commands",
		language: "bash",
		sourceText: `musi run
musi check
musi build
musi test`,
		evidence: {
			path: "README.md",
			line: 131,
		},
	},
	{
		id: "stdlib-option-import",
		language: "musi",
		sourceText: `option.someOf[Int](8080)
  |> option.unwrapOr[Int](3000);`,
		evidence: {
			path: "packages/std/option.ms",
			line: 6,
		},
	},
	{
		id: "stdlib-result-import",
		language: "musi",
		sourceText: `result.ok[Int, String](8080)
  |> result.unwrapOr[Int, String](3000);`,
		evidence: {
			path: "packages/std/result.ms",
			line: 6,
		},
	},
	{
		id: "stdlib-testing-import",
		language: "musi",
		sourceText: `let Testing := import "@std/testing";

export let test () :=
  Testing.it("adds values", Testing.toBe(1 + 2, 3));`,
		evidence: {
			path: "packages/std/__tests__/option.test.ms",
			line: 4,
		},
	},
	{
		id: "chapter-getting-started",
		language: "bash",
		sourceText: `curl -fsSL https://raw.githubusercontent.com/musi-lang/musi/main/install.sh | sh
music check index.ms
musi init hello`,
		evidence: {
			path: "README.md",
			line: 61,
		},
	},
	{
		id: "chapter-reading-musi-code",
		language: "musi",
		sourceText: `let option := import "@std/option";
let Option := option.Option;

let Receipt := data {
  | Receipt(table : Int, total : Int)
};

let emptyReceipt := option.noneOf[Receipt]();

export let receiptForTable (table : Int) : Option[Receipt] :=
  option.someOf[Receipt](.Receipt(table := table, total := 0));`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 32,
		},
	},
	{
		id: "chapter-first-program",
		language: "musi",
		sourceText: `let total := 42;
total;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 3,
		},
	},
	{
		id: "chapter-values-and-let",
		language: "musi",
		sourceText: `let port := 8080;
let nextPort := port + 1;
nextPort;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 24,
		},
	},
	{
		id: "chapter-comments",
		language: "musi",
		sourceText: `-- Keep this default aligned with local examples.
--- Default port used by local examples.
export let defaultPort : Int := 8080;

/-
  Block comments can contain nested notes.
  /- Nested note. -/
-/
let nextPort := defaultPort + 1;
nextPort;`,
		evidence: {
			path: "crates/music_syntax/src/lexer/tests.rs",
			line: 97,
		},
	},
	{
		id: "chapter-blocks-and-expressions",
		language: "musi",
		sourceText: `(
  let base := 8000;
  let offset := 80;
  base + offset
);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 84,
		},
	},
	{
		id: "chapter-mutation",
		language: "musi",
		sourceText: `let counter := mut 1;
counter := counter + 1;
counter;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1212,
		},
	},
	{
		id: "chapter-literals",
		language: "musi",
		sourceText: `let port := 8080;
let label := "ready";
let enabled : Bool := .True;
label;`,
		evidence: {
			path: "crates/musi_project/src/tests.rs",
			line: 706,
		},
	},
	{
		id: "chapter-operators",
		language: "musi",
		sourceText: `let port := 8080;
let next := port + 1;
let same := next = 8081;
let capped := next <= 9000;`,
		evidence: {
			path: "crates/music_resolve/src/resolver/expr/operators.rs",
			line: 1,
		},
	},
	{
		id: "chapter-ranges",
		language: "musi",
		sourceText: `let closed := 0..10;
let halfOpen := 0..<10;
halfOpen;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 239,
		},
	},
	{
		id: "chapter-functions",
		language: "musi",
		sourceText: `let render (port : Int, secure : Bool) : Int := port;
let positional := render(8080, 0 = 0);
let labeled := render(secure := 0 = 0, port := 8080);
labeled;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 5,
		},
	},
	{
		id: "named-callable-values",
		language: "musi",
		sourceText: `let render (port : Int, secure : Bool) : Int := port;

let f := render;
f(secure := 0 = 0, port := 8080);

let g : (Int, Bool) -> Int := render;
g(8080, 0 = 0);

let h : (host : Int, tls : Bool) -> Int := render;
h(host := 8080, tls := 0 = 0);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 316,
		},
	},
	{
		id: "chapter-calls",
		language: "musi",
		sourceText: `let greet (name : String) : String := name;
let message := greet("Musi");
message;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 5,
		},
	},
	{
		id: "chapter-methods",
		language: "musi",
		sourceText: `let (self : Int).abs () : Int := self;
let one := 1;
one.abs();`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 510,
		},
	},
	{
		id: "chapter-records",
		language: "musi",
		sourceText: `let point := { x := 3, y := 4 };
let moved := { ...point, y := 9 };
moved;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1192,
		},
	},
	{
		id: "chapter-arrays-and-slices",
		language: "musi",
		sourceText: `let Slice := import "@std/collections/slice";
let values := [1, 2, 3];
Slice.concat[Int](values, [4]);`,
		evidence: {
			path: "packages/std/collections/slice.ms",
			line: 8,
		},
	},
	{
		id: "chapter-patterns",
		language: "musi",
		sourceText: `let Port := data {
  | Configured(port : Int, secure : Bool)
  | Default
};

let configured : Port := .Configured(secure := .True, port := 8080);
match configured (
| .Configured(port, secure := _) => port
| .Default => 3000
);`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1574,
		},
	},
	{
		id: "chapter-option-and-result",
		language: "musi",
		sourceText: `let option := import "@std/option";
let result := import "@std/result";
let Option := option.Option;
let Result := result.Result;

let findPort () : Option[Int] := option.someOf[Int](8080);

let parsePort () : Result[Int, String] :=
  result.ok[Int, String](8080);

parsePort();`,
		evidence: {
			path: "packages/std/option.ms",
			line: 1,
		},
	},
	{
		id: "chapter-files",
		language: "musi",
		sourceText: `let total := 42;
total;`,
		evidence: {
			path: "content/musi-book/examples/smoke.ms",
			line: 3,
		},
	},
	{
		id: "chapter-packages",
		language: "bash",
		sourceText: `musi init hello
cd hello
musi check
musi test`,
		evidence: {
			path: "crates/musi/src/main.rs",
			line: 1,
		},
	},
	{
		id: "chapter-imports-and-exports",
		language: "musi",
		sourceText: `export let total := 42;
let option := import "@std/option";
let Local := import "./index.ms";
Local.total;`,
		evidence: {
			path: "crates/music_sema/src/checker/surface/exports.rs",
			line: 607,
		},
	},
	{
		id: "chapter-type-annotations",
		language: "musi",
		sourceText: `let port : Int := 8080;
let twice (x : Int) : Int := x + x;
twice(port);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 354,
		},
	},
	{
		id: "chapter-type-inference",
		language: "musi",
		sourceText: `let port : Int := 8080;
let next := port + 1;
next;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 32,
		},
	},
	{
		id: "chapter-shapes",
		language: "musi",
		sourceText: `export let Eq [T] := shape {
  let eq (left : T, right : T) : Bool;
  law reflexive (value : T) := eq(value, value);
  law symmetric (left : T, right : T) := eq(left, right) = eq(right, left);
};`,
		evidence: {
			path: "packages/std/cmp.ms",
			line: 9,
		},
	},
	{
		id: "chapter-given-values",
		language: "musi",
		sourceText: `export let intEq :=
  given Eq[Int] {
  let eq (left : Int, right : Int) : Bool := left = right;
};`,
		evidence: {
			path: "packages/std/cmp.ms",
			line: 112,
		},
	},
	{
		id: "chapter-laws",
		language: "musi",
		sourceText: `export let Eq [T] := shape {
  let eq (left : T, right : T) : Bool;
  law reflexive (value : T) := eq(value, value);
  law symmetric (left : T, right : T) := eq(left, right) = eq(right, left);
};`,
		evidence: {
			path: "packages/std/cmp.ms",
			line: 9,
		},
	},
	{
		id: "chapter-effects",
		language: "musi",
		sourceText: `let Clock := effect {
  let tick () : Int;
};

ask Clock.tick();`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 317,
		},
	},
	{
		id: "chapter-requirements",
		language: "musi",
		sourceText: `let nextTick () : Int require { Clock } :=
  ask Clock.tick();`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1444,
		},
	},
	{
		id: "chapter-errors-and-recovery",
		language: "musi",
		sourceText: `let option := import "@std/option";
let result := import "@std/result";

let Printer := effect {
  let printReceipt (text : String) : Unit;
};

let coupon := option.noneOf[Int]();
let charge := result.err[Int, String]("card declined");
ask Printer.printReceipt("receipt");`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 787,
		},
	},
	{
		id: "chapter-handlers",
		language: "musi",
		sourceText: `let clockAnswer := answer Clock {
  tick(k) => resume 1;
};

handle Clock.tick() answer clockAnswer;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 331,
		},
	},
	{
		id: "chapter-foundation",
		language: "musi",
		sourceText: `let Core := import "musi:core";
Core;`,
		evidence: {
			path: "crates/musi_foundation/src/lib.rs",
			line: 9,
		},
	},
	{
		id: "chapter-runtime",
		language: "musi",
		sourceText: `let env := import "@std/env";
let home := env.key("HOME");
env.get(home);`,
		evidence: {
			path: "packages/std/env.ms",
			line: 2,
		},
	},
	{
		id: "chapter-stdlib",
		language: "musi",
		sourceText: `let option := import "@std/option";
option.someOf[Int](8080)
  |> option.unwrapOr[Int](3000);`,
		evidence: {
			path: "packages/std/option.ms",
			line: 6,
		},
	},
	{
		id: "chapter-attributes",
		language: "musi",
		sourceText: `@link(name := "c")
native "c" let puts (msg : CString) : Int;

@target(os := "linux")
native "c" let clock_gettime (id : Int, out : CPtr) : Int;`,
		evidence: {
			path: "crates/musi_fmt/src/tests.rs",
			line: 924,
		},
	},
	{
		id: "chapter-native",
		language: "musi",
		sourceText: 'native "c" let puts (msg : CString) : Int;',
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 70,
		},
	},
	{
		id: "native-safe-wrapper",
		language: "musi",
		sourceText: `native "c" let puts (message : CString) : Int;

export let printLine (message : CString) : Int := unsafe {
  puts(message);
};`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 419,
		},
	},
	{
		id: "chapter-quote-and-syntax",
		language: "musi",
		sourceText: `let addTemplate := quote (x + #(delta));
let addOneSyntax := quote (#(x) + 1);
addOneSyntax;`,
		evidence: {
			path: "crates/music_syntax/src/parser/forms/atoms.rs",
			line: 215,
		},
	},
	{
		id: "chapter-testing",
		language: "musi",
		sourceText: `let Testing := import "@std/testing";

export let test () :=
  Testing.it("adds values", Testing.toBe(1 + 2, 3));`,
		evidence: {
			path: "packages/std/__tests__/option.test.ms",
			line: 4,
		},
	},
	{
		id: "chapter-running-and-tooling",
		language: "bash",
		sourceText: `music check index.ms
musi check
musi test`,
		evidence: {
			path: "README.md",
			line: 131,
		},
	},
	{
		id: "chapter-tuples-and-unit",
		language: "musi",
		sourceText: `let status := (8080, "ready");
let empty := ();
status;`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 148,
		},
	},
	{
		id: "chapter-lambdas",
		language: "musi",
		sourceText: `let twice := \\(x : Int) : Int => x + x;
twice(21);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 270,
		},
	},
	{
		id: "chapter-indexing-and-fields",
		language: "musi",
		sourceText: `let point := { x := 3, y := 4 };
let values := [10, 20, 30];
let x := point.x;
let first := values.[0];
x + first;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 643,
		},
	},
	{
		id: "chapter-data-definitions",
		language: "musi",
		sourceText: `let Port := data {
  | Configured(port : Int, secure : Bool)
  | Default
};

let Settings := data {
  port : Int := 3000;
  label : String;
};

let Box[T] := data {
  value : T;
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 657,
		},
	},
	{
		id: "chapter-callable-types",
		language: "musi",
		sourceText: `let Pure := Int -> Int;
let Effectful := Int ~> Int;
Pure;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1708,
		},
	},
	{
		id: "chapter-type-tests-and-casts",
		language: "musi",
		sourceText: `let value := 42;
let isInt := value :? Int;
let same := value :?> Int;
same;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1985,
		},
	},
	{
		id: "chapter-forall-types",
		language: "musi",
		sourceText: `let identityFn[T] (input : T) : T := input;
let identityType := forall (T : Type) -> T -> T;

identityFn[Int](8080);`,
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 354,
		},
	},
	{
		id: "chapter-dependent-types",
		language: "musi",
		sourceText: `let Vec[T, n : Nat] := data {
  | Nil() -> Vec[T, 0]
  | Cons(head : T, tail : Vec[T, n]) -> Vec[T, n + 1]
};

partial let parsePort(text : String) : Int := 0;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 1725,
		},
	},
	{
		id: "chapter-templates-and-splices",
		language: "musi",
		sourceText: `let port := 8080;
let label := \`port $\{port}\`;
label;`,
		evidence: {
			path: "crates/music_syntax/src/lexer/tests.rs",
			line: 195,
		},
	},
] satisfies readonly ContentSnippet[];
