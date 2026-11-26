---
title: "Reading Musi code"
description: "Scan names before details."
group: "Start"
section: "Start"
order: 3
slug: "reading-musi-code"
summary: "First find names, imports, exports, and final expressions. Then read each body."
examples: "chapter-reading-musi-code"
---

# Reading Musi code

Start by looking for names. A name is the handle you grab before reading the whole body.

{{snippet:chapter-reading-musi-code}}

## Scan names before details

Look for `let`, `export let`, and `import`. These forms tell you what the file gives to itself or to other files.

Do not start by reading every symbol. First make a map in your head. It is like reading street signs before choosing a route.

## Read bodies after names

After you know the names, read the bodies. The body after `:=` tells you how the value is made.

## Reading order

Start with names, then operators, then calls.

```musi
let port := 8080;
let valid := port >= 1024 and port <= 65535;
```

`port` has the value `8080`. `>=` checks the lower bound. `<=` checks the upper bound. `and` requires both checks.

## Parenthesized expressions

A sequence expression is a parenthesized group of expressions. The final expression is the value of the sequence.

```musi
let message := (
  let port := 8080;
  "port ready"
);
```

Read the sequence as a small nested expression.
