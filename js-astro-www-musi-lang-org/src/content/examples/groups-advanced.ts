import type { ExampleGroup } from "./types";

export const advancedExampleGroups: readonly ExampleGroup[] = [
	{
		id: "attribute-catalog",
		title: "Attribute families at different edges",
		caption:
			"Attributes mean different things depending on whether a named part is foundation-owned, native-linked, or target-gated.",
		note: "Read them top to bottom as extra filters. First decide which edge the named part crosses, then pick only the attribute family that explains that edge directly.",
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
		id: "quote-metaprogramming",
		title: "Code as data template (metaprogramming)",
		caption:
			"Build or transform code structure itself, not only runtime values.",
		note: "When a language lacks first-shape quote/splice, the closest equivalent is often macros, AST builders, or plain code generators.",
		sourceText: "let addTemplate := quote (#(x) + #(delta));",
		evidence: {
			path: "crates/music_syntax/src/parser/tests.rs",
			line: 76,
		},
	},
	{
		id: "effect-handle",
		title: "Define, ask, and answer effects",
		caption:
			"Capture side-effect asks in one place, then resolve them through handlers.",
		note: "At small scale this can look like callback wiring, but at larger scale handlers keep policy at edges and reduce plumbing across call chains.",
		sourceText: `let Clock := effect {
  let tick () : Int;
};

let clockAnswer := answer Clock {
  tick(k) => resume 1;
};

handle Clock.tick() answer clockAnswer;`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 263,
		},
	},
	{
		id: "shape-given",
		title: "Shape constraints and given values",
		caption:
			"Define shared behavior once, then attach concrete implementations per type.",
		note: "Like one wall-socket standard with different appliance designs behind the plug. Declare one behavior form, then implement it per type.",
		sourceText: `let Eq[T] := shape {
  let (=) (a : T, b : T) : Bool;
};

let eqInt := given Eq[Int] {
  let (=) (a : Int, b : Int) : Bool := 0 = 0;
};`,
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 502,
		},
	},
	{
		id: "generic-constraint",
		title: "Generic rule with visible capability",
		caption:
			"Constrain polymorphic code to capabilities that must exist at call sites.",
		note: "Like requiring a driving license before renting a car: callers must provide the needed capability. Musi writes that requirement with a <code>where</code> clause after the result type annotation.",
		sourceText: "let same[A, B] (value : A) : A where A ~= B := value;",
		evidence: {
			path: "crates/music_sema/src/tests.rs",
			line: 901,
		},
	},
] as const;
