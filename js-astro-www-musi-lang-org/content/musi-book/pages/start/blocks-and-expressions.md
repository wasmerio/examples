---
title: "Blocks and expressions"
description: "Use parentheses to run steps and return one value."
group: "Start"
section: "Start"
order: 6
slug: "blocks-and-expressions"
summary: "Use parenthesized sequence expressions for local steps, and braces for structural forms."
examples: "chapter-blocks-and-expressions"
---

# Blocks and expressions

A sequence expression lets you do a few local steps and still give back one value.

It uses parentheses. Do not use braces for this. Braces belong to records and named forms such as `data`, `effect`, `shape`, `given`, `answer`, `quote`, and `unsafe`.

{{snippet:chapter-blocks-and-expressions}}

The names inside the sequence are local. They are like notes on a small notepad. They help with one task, then they go away.

The final expression is the value of the sequence. This makes a sequence useful inside a larger expression.

Use a sequence when one line becomes crowded. Give the small steps names, then return the value you wanted.

## Sequence value

The final expression in a sequence becomes the sequence value.

```musi
let doubled := (
  let input := 21;
  input * 2         -- 42
);
```

`doubled` receives `42`. The helper name `input` stays inside the sequence.

## Semicolons

Use semicolons between statements in a sequence expression.

```musi
let value := (
  let base := 40;
  base + 2          -- 42
);
```

The final expression may be the returned value of the sequence.
