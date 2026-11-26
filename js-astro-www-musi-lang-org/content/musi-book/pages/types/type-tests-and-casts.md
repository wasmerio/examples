---
title: "Type tests and casts"
description: "Check or assert a type at an edge."
group: "Types"
section: "Types"
order: 6
slug: "type-tests-and-casts"
summary: "Type tests ask about a type. Casts assert a type."
examples: "chapter-type-tests-and-casts"
---

# Type tests and casts

Type tests ask whether a value has a type. Casts state that a value should be treated as a type.

{{snippet:chapter-type-tests-and-casts}}

## Test with `:?`

```musi
let value := 42;
let isInt := value :? Int;
```

The result is `Bool`. Use it before a branch when runtime shape matters.

## Cast with `:?>`

```musi
let value := 42;
let number := value :?> Int;
```

A cast is stronger than a test. Use it only when the program has already proved the shape.

## Bits and numeric conversion

The standard library uses casts for bit-width helpers.

```musi
let Bits := import "@std/bits";
let byte := Bits.fromNat8(10 :?> Nat);
```

Keep conversions close to the boundary that needs them.
