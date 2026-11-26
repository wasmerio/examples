---
title: "Callable arrows"
description: "Read `->`, `~>`, and `=>` in function and lambda shapes."
group: "Core expressions"
section: "Core expressions"
order: 9
slug: "callable-arrows"
summary: "`->` describes a callable type. `~>` describes an effectful callable. `=>` starts a lambda body."
---

# Callable arrows

Musi uses arrows when code describes or builds callable values.

## Callable type arrow `->`

Use `->` in a type when a value is callable.

```musi
let mapper : Int -> Int := \(value : Int) : Int => value + 1;
```

Read `Int -> Int` as "takes an `Int` and returns an `Int`."

## Effect arrow `~>`

Use `~>` for callable shapes that can perform effects.

```musi
let Pure := Int -> Int;
let Effectful := Int ~> Int;
Pure;
```

Read `Int ~> Int` as "takes an `Int`, may perform an effect, and returns an `Int`."

## Lambda body arrow `=>`

Use `=>` between a lambda header and its body.

```musi
let addOne := \(value : Int) : Int => value + 1;
```

The left side names parameters and the result type. The right side is the expression that produces the result.

## Pick the right arrow

| Arrow | Where it appears         | Meaning                  |
| ----- | ------------------------ | ------------------------ |
| `->`  | callable type            | pure callable shape      |
| `~>`  | effect signature or type | effectful callable shape |
| `=>`  | lambda expression        | body starts here         |
