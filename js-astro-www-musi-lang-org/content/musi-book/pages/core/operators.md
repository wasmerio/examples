---
title: "Operators"
description: "Read Musi operators by family instead of memorizing one long list."
group: "Core expressions"
section: "Core expressions"
order: 3
slug: "operators"
summary: "`:=` writes, `=` compares, arrows describe callables, and pipelines pass values forward."
examples: "chapter-operators"
---

# Operators

Musi uses visible operators for binding, math, comparison, logic, type checks, callable types, ranges, access, and pipelines. Learn them by family. Each family has one job.

{{snippet:chapter-operators}}

## Operator families

| Family                 | Operators                                     | Chapter                                                             |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| Bind and compare       | `:=`, `=`, `/=`                               | [Assignment and equality](/learn/book/core/assignment-and-equality) |
| Math and ordering      | `+`, `-`, `*`, `/`, `%`, `<`, `<=`, `>`, `>=` | [Math and comparison](/learn/book/core/math-and-comparison)         |
| Logic and integer bits | `and`, `or`, `xor`, `not`, `shl`, `shr`       | [Logic and bits](/learn/book/core/logic-and-bits)                   |
| Flow and access        | `                                             | >`, `.`, `.[index]`                                                 | [Pipelines and access](/learn/book/core/pipelines-and-access) |
| Types                  | `:`, `:?`, `:?>`, type constraints            | [Type operators](/learn/book/core/type-operators)                   |
| Callable shapes        | `->`, `~>`, `=>`                              | [Callable arrows](/learn/book/core/callable-arrows)                 |
| Ranges                 | `..`, `..<`, `<..`, `<..<`                    | [Ranges](/learn/book/core/ranges)                                   |

## Reading rule

Read the operator before reading the surrounding expression:

```musi
let next := port + 1;
let ok := next >= 1024 and next <= 65535;
```

`:=` binds `next`. `+` computes a new number. `>=` and `<=` compare bounds. `and` requires both comparisons to pass.

If a line uses more than one family and becomes hard to scan, split the line:

```musi
let next := port + 1;
let aboveReserved := next >= 1024;
let belowMaximum := next <= 65535;
let ok := aboveReserved and belowMaximum;
```
