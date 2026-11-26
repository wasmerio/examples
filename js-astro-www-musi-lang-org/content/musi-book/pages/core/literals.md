---
title: "Literals"
description: "Read numbers, strings, Boolean constructors, records, arrays, tuples, and templates."
group: "Core expressions"
section: "Core expressions"
order: 1
slug: "literals"
summary: "Literals create values directly. They do not call another name."
examples: "chapter-literals"
---

# Literals

A literal writes a value directly in code. It does not call another name. `42`, `"ready"`, `[1, 2]`, and `{ port := 8080 }` are literals.

{{snippet:chapter-literals}}

## Scalar values

Use scalar values for one small value. `Bool` values are data constructors, not lowercase keywords.

| Source    | Kind                 | Use it for                   |
| --------- | -------------------- | ---------------------------- |
| `42`      | `Int` style number   | counts, ports, offsets       |
| `3.5`     | `Float` style number | ratios and measurements      |
| `"ready"` | `String`             | user-facing or protocol text |
| `.True`   | `Bool` value         | enabled, allowed, present    |
| `.False`  | `Bool` value         | disabled, blocked, missing   |
| `0 = 0`   | `Bool` expression    | a comparison that produces `.True` |
| `0 = 1`   | `Bool` expression    | a comparison that produces `.False` |

Boolean values are often produced by checks. Write the check that proves the value, such as `port > 0`, when the rule matters. Use `.True` and `.False` when the value itself is the point.

## Structured literals

Arrays keep ordered values. Records keep named fields. Tuples keep a fixed group where position is the point.

```musi
let values := [1, 2, 3];
let point := { x := 3, y := 4 };
let pair := ("port", 8080);
let unit := ();
```

A record field uses `:=` because the field receives a value. A later field can use spread to copy another record, then replace one field.

```musi
let securePoint := { ...point, secure := 0 = 0 };
```

## Data constructors

Constructors for `data` variants start with a dot. The variant name is the literal-like part; the data type gives it meaning.

```musi
let Port := data {
  | Configured(Int)
  | Default
};

let configured : Port := .Configured(8080);
let fallback : Port := .Default;
```

Use constructors when the value has a closed set of shapes. Use records when field names are the important shape.

## Syntax literals

Syntax values use `quote` when code itself is the data.

```musi
let label := "port";
let generated := quote (x + #(delta));
```

Keep literal-heavy code readable: give a name to a value when the number, text, or shape has business meaning.
