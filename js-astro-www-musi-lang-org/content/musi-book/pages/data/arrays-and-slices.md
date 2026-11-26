---
title: "Arrays and slices"
description: "Hold ordered values and work with a window of them."
group: "Data"
section: "Data"
order: 2
slug: "arrays-and-slices"
summary: "Arrays keep values in order. Slices let code talk about part of that order."
examples: "chapter-arrays-and-slices"
---

# Arrays and slices

Arrays keep ordered values. Slice helpers from the standard library copy, join, and extend those values.

{{snippet:chapter-arrays-and-slices}}

## Array literals

```musi
let values := [1, 2, 3];
let extended := [0, ...values, 4];
```

Array spread uses `...` to copy existing items into a new array literal.

## Stdlib collection helpers

```musi
let Slice := import "@std/collections/slice";
let values := [1, 2, 3];
Slice.concat[Int](values, [4]);
```

Use helpers when the operation has a name. Use literals for small, obvious values.

## Ranges and indexes

Ranges describe bounds. Index and slice operations decide how those bounds apply to an array.

```musi
let firstThree := 0..<3;
```

Keep indexes named when the number has meaning, such as `headerRows` or `previewLimit`.
