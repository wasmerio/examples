---
title: "Callable types"
description: "Describe values that can be called."
group: "Types"
section: "Types"
order: 4
slug: "callable-types"
summary: "Callable types describe functions and effectful calls."
examples: "chapter-callable-types"
---

# Callable types

Some values can be called. A callable type describes what input they take and what output they give.

{{snippet:chapter-callable-types}}

A plain arrow is for normal callable work. An effectful arrow is for work that may ask for outside help.

Callable types are useful when a function receives another function. They tell the reader what kind of rule may be passed in.

Use clear parameter names around callable values. The type says the shape. The names say the story.

## Plain callable type

`Int -> Int` describes a callable value that takes one `Int` and returns one `Int`.

```musi
let Pure := Int -> Int;
Pure;
```

Use a plain arrow for ordinary callable values.

## Effectful callable type

`Int ~> Int` describes a callable value that may perform an effect.

```musi
let Effectful := Int ~> Int;
Effectful;
```

Use an effectful arrow only when the callable shape needs outside work.
