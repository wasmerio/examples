---
title: "Values and `let`"
description: "Bind names with `let` and export public names."
group: "Start"
section: "Start"
order: 5
slug: "values-and-let"
summary: "`let` gives a name to a value. `export let` makes the name public."
examples: "chapter-values-and-let"
---

# Values and `let`

`let` gives a value a name. Use the name when the same idea appears again.

{{snippet:chapter-values-and-let}}

A private `let` belongs to the file. `export let` is like putting a label on a shelf that other files can reach.

Use short names for local steps. Use clearer names for exported values. A reader from another file only sees the exported name first.

If the value may change later, do not use plain `let`. Use `mut` so the changing place is visible.

## `let` form

The basic form is:

```musi
let total := 42;
```

The name goes on the left. The value-producing expression goes on the right.

```musi
let retries := 3;
let label := "ready";
let enabled : Bool := .True;
```

Use `:=` for binding. Use `=` only for comparison.

## Type annotations

Add a type when it documents a boundary.

```musi
let port : Int := 8080;
let label : String := "ready";
```
