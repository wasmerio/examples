---
title: "Ranges"
description: "Build endpoint values with range operators."
group: "Core expressions"
section: "Core expressions"
order: 10
slug: "ranges"
summary: "A range stores start and end information. Inclusivity belongs to the range value."
examples: "chapter-ranges"
---

# Ranges

A range describes a span between points. It can mean seats 1 to 10, pages 3 to 7, or a slice of an array.

{{snippet:chapter-ranges}}

## Endpoint shapes

The dots show the span. The `<` marks remove that endpoint from the range.

| Form     | Lower endpoint | Upper endpoint | Reads as              |
| -------- | -------------- | -------------- | --------------------- |
| `a..b`   | included       | included       | from `a` through `b`  |
| `a..<b`  | included       | excluded       | from `a` up to `b`    |
| `a<..b`  | excluded       | included       | after `a` through `b` |
| `a<..<b` | excluded       | excluded       | after `a` before `b`  |

```musi
let allSeats := 1..10;
let indexes := 0..<10;
let afterFirst := 1<..10;
let middleOnly := 1<..<10;
```

## Open bounds

A bound can be missing when the caller or collection supplies that side.

```musi
let fromStart := ..10;
let fromThree := 3..;
let beforeTen := ..<10;
```

Use open bounds for slices and filters where one side is obvious from the data.

A range is not the same as a loop. It is a value that stores bounds. Another function can decide how to walk those bounds.

Use names when the range has business meaning, such as `validSeats` or `morningHours`.
