---
title: "Dot-calls"
description: "Use dot syntax when the left value is the receiver."
group: "Core expressions"
section: "Core expressions"
order: 14
slug: "dot-calls"
summary: "A receiver call keeps the value being acted on at the front."
examples: "chapter-methods"
---

# Dot-calls

A dot-call keeps the main value on the left. This helps a chain read from the thing being changed or inspected.

{{snippet:chapter-methods}}

## Define a receiver function

```musi
let (self : Int).abs () : Int := self;
let one := 1;
one.abs();
```

`self` is the value before the dot. The call `one.abs()` reads as "call `abs` on `one`."

## Stdlib receiver helpers

The standard library also exposes receiver helpers for common data types.

```musi
let option := import "@std/option";
let value := option.someOf[Int](42);
let port := value.unwrapOr[Int](0);
```

Use receiver calls when they improve reading. Use a normal function call when the operation does not clearly belong to the left value.

## Receiver definition

The receiver appears before the dot in the definition:

```musi
let (self : Int).abs () : Int := self;
```

The call places the value in that receiver slot:

```musi
let one := 1;
one.abs();
```

Do not use dot-calls to hide unrelated work. The operation should read as behavior of the receiver.
