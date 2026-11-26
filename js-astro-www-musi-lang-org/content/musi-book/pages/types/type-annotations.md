---
title: "Type annotations"
description: "Write the type when it helps the reader."
group: "Types"
section: "Types"
order: 1
slug: "type-annotations"
summary: "A type annotation says what kind of value a name should hold."
examples: "chapter-type-annotations"
---

# Type annotations

A type annotation says what kind of value belongs in a place.

{{snippet:chapter-type-annotations}}

Use annotations on exported names, important data, and places where a reader would have to guess.

You do not need to label every small local step. When the value is obvious, Musi can infer it.

Think of a type note like a label on a box. Label the boxes that leave the room.

## Where annotations help

Use annotations on values that form an interface.

```musi
let port : Int := 8080;
let twice (x : Int) : Int := x + x;
twice(port);
```

The annotation on `port` tells readers the value is a number. The parameter and return annotations on `twice` tell callers what they may pass and what they receive.

## Where annotations add noise

Small local expressions often explain themselves.

```musi
let port : Int := 8080;
let next := port + 1;   -- 8081
next;
```

`next` does not need a label when the expression already makes the type clear.
