---
title: "Shapes"
description: "Name shared behavior."
group: "Abstractions"
section: "Abstractions"
order: 1
slug: "shapes"
summary: "A shape says which behavior a type must provide."
examples: "chapter-shapes"
---

# Shapes

A shape names behavior that different types can provide.

{{snippet:chapter-shapes}}

## Define required behavior

```musi
export let Eq [T] := shape {
  let eq (left : T, right : T) : Bool;

  law reflexive (value : T) := eq(value, value);
  law symmetric (left : T, right : T) := eq(left, right) = eq(right, left);
};
```

The shape says what must exist. It does not say which fields a type has.

## Keep shapes small

A small shape is easy to satisfy and easy to test. Split unrelated behavior into separate shapes.

Good shape names describe capability: `Eq`, `Ord`, `Printable`, `Serializable`.

## Shapes are contracts

Code that asks for a shape can call the behavior from that shape without knowing the concrete type.

## Shape members

Shape members are required operations. In `Eq`, the required operation is `eq`. Any given value for `Eq[Int]`, `Eq[String]`, or another type must provide that operation.

Laws live next to the required operation. They explain behavior callers rely on: equality should be reflexive and symmetric.
