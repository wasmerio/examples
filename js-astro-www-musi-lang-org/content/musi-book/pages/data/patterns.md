---
title: "Patterns"
description: "Open data by shape."
group: "Data"
section: "Data"
order: 6
slug: "patterns"
summary: "Patterns let `match` read variants, fields, and simple values."
examples: "chapter-patterns"
---

# Patterns

Patterns read the shape of a value. They are most visible in `match` branches.

{{snippet:chapter-patterns}}

## Match constructors

```musi
let Port := data {
  | Configured(Int)
  | Default
};

let configured : Port := .Configured(8080);
match configured (
| .Configured(port) => port
| .Default => 3000
);
```

A constructor pattern starts with a dot. Names inside the pattern bind the carried values.

## Match named fields

Named variant fields can be read by name. Use `_` when the field exists but the branch does not need it.

```musi
let Port := data {
  | Configured(port : Int, secure : Bool)
  | Default
};

let configured : Port := .Configured(secure := .True, port := 8080);
match configured (
| .Configured(port, secure := _) => port
| .Default => 3000
);
```

Record-shaped data uses the normal record value shape. Use field access when you want one field after construction.

```musi
let Box[T] := data {
  value : T;
};

let boxedPort : Box[Int] := { value := 8080 };
boxedPort.value;
```

## Ignore values

Use `_` when a value is present but not needed.

```musi
match configured (
| .Configured(_) => 8080
| .Default => 3000
);
```

Do not bind a name you will not use. `_` tells the reader that the value is intentionally ignored.
