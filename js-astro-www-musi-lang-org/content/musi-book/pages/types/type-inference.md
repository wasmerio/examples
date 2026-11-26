---
title: "Type inference"
description: "Let Musi read clear types from values."
group: "Types"
section: "Types"
order: 2
slug: "type-inference"
summary: "Musi can infer many local types from the expression on the right."
examples: "chapter-type-inference"
---

# Type inference

Musi can often see a type from the value itself. `42` points to a number. `"Ada"` points to text.

{{snippet:chapter-type-inference}}

Inference keeps small local code quiet. The reader can focus on the value instead of repeated labels.

Use type annotations when an inferred type would be surprising, too wide, or important to an exported name.

Good code balances both. Too many labels feel noisy. Too few labels make a public API hard to trust.

## Local inference

Musi can infer a local name from the expression that creates it.

```musi
let port : Int := 8080;
let next := port + 1;
next;
```

`next` follows from `port + 1`. A reader can see the type without another annotation.

## Public edges

Inference is helpful inside a function. Public edges should be clearer.

```musi
let twice (x : Int) : Int := x + x;
```

The parameter type protects callers. The result type tells them what the function promises.
