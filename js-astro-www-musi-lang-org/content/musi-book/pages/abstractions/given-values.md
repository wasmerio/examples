---
title: "Given values"
description: "Provide behavior for one type."
group: "Abstractions"
section: "Abstractions"
order: 2
slug: "given-values"
summary: "A given value says how a type follows a shape."
examples: "chapter-given-values"
---

# Given values

A given value provides a shape implementation for a concrete type.

{{snippet:chapter-given-values}}

## Implement a shape

```musi
export let intEq := given Eq[Int] {
  let eq (left : Int, right : Int) : Bool := left = right;
};
```

The given value is evidence that `Int` can satisfy `Eq`.

## Given value shape

A given value names the shape and the type argument: `given Eq[Int]`. The body provides the members that the shape requires.

For `Eq[Int]`, the body provides `eq`. The implementation can use normal integer equality because both parameters are `Int`.

## Keep implementation local

Put a given value near the type or near the shape module. Readers should not need to search the whole package to find how a type satisfies a shape.

## Keep policy in the given

If two modules disagree about equality, ordering, or formatting, keep that decision in the given value instead of hiding it in call sites.

## Name givens by behavior and type

Names like `eqInt` or `ordPort` make logs, errors, and docs easier to read.
