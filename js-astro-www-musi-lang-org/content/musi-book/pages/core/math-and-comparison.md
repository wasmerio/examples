---
title: "Math and comparison"
description: "Use arithmetic operators for numbers and comparison operators for ordering."
group: "Core expressions"
section: "Core expressions"
order: 5
slug: "math-and-comparison"
summary: "`+`, `-`, `*`, `/`, and `%` compute numbers. `<`, `<=`, `>`, and `>=` compare them."
---

# Math and comparison

Math operators produce numbers. Comparison operators produce Booleans.

## Arithmetic

Use these operators with numeric values:

| Operator | Meaning            | Example        |
| -------- | ------------------ | -------------- |
| `+`      | add                | `2 + 3`        |
| `-`      | subtract or negate | `10 - 4`, `-1` |
| `*`      | multiply           | `6 * 7`        |
| `/`      | divide             | `20 / 5`       |
| `%`      | remainder          | `10 % 3`       |

```musi
let subtotal := 20 + 5;
let discounted := subtotal - 3;
let doubled := discounted * 2;
let bucket := doubled % 10;
```

Use names for intermediate values when the formula is part of the program meaning.

## Ordering

Use ordering operators when you need a `Bool` result. Passing comparisons produce `.True`; failing comparisons produce `.False`.

| Operator | Meaning               |
| -------- | --------------------- |
| `<`      | less than             |
| `<=`     | less than or equal    |
| `>`      | greater than          |
| `>=`     | greater than or equal |

```musi
let port := 8080;
let aboveReserved := port >= 1024;
let withinMaximum := port <= 65535;
let valid := aboveReserved and withinMaximum;
```

## Precedence

Multiplication, division, and remainder bind tighter than addition and subtraction.

```musi
let value := 2 + 3 * 4;
let grouped := (2 + 3) * 4;
```

`value` is `14`. `grouped` is `20`.

Use parentheses when the grouping carries meaning, even when the parser would choose the same order.
