---
title: "Mutation"
description: "Use `mut` when a place can change."
group: "Start"
section: "Start"
order: 7
slug: "mutation"
summary: "Mutation is visible. Reassignment writes to an existing mutable place."
examples: "chapter-mutation"
---

# Mutation

Most names should stay stable. When a place must change, mark it with `mut`.

{{snippet:chapter-mutation}}

`mut` is a warning sign for the reader. It says, "This place may hold a different value later."

Think of a stable name like a printed receipt. Think of a mutable name like a whiteboard total that changes while people add items.

Use mutation for small local steps. For larger changes, prefer making a new value with a clear name.

## Mutable places

Use `mut` when a name must be assigned again.

```musi
let count := mut 0;
count := count + 1;     -- 1
count := count + 1;     -- 2
```

The name `count` is a place. Each `:=` after the first writes a new value into that place.

## Prefer values first

Most code is easier to read when values do not change.

```musi
let count := 0;
let next := count + 1;      -- 1
let final := next + 1;      -- 2
```

Use mutation for loops, builders, and stateful algorithms. Use new names for simple transformations.
