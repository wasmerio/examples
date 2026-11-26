---
title: "Data definitions"
description: "Name variant data and record-shaped data."
group: "Data"
section: "Data"
order: 3
slug: "data-definitions"
summary: "`data` creates a type-shaped value. Variants use `|`. Record fields use `;`."
examples: "chapter-data-definitions"
---

# Data definitions

`data` names a type-shaped value. It can describe a closed set of variants or a named record shape.

{{snippet:chapter-data-definitions}}

## Define variants

Use `|` when each value is one case from a closed set.

```musi
let Port := data {
  | Configured(Int)
  | Default
};

let configured : Port := .Configured(8080);
let fallback : Port := .Default;
```

Use data definitions for states, events, parse results, and other values with a known list of cases.

## Match variants

```musi
let value := match configured (
| .Configured(port) => port
| .Default => 3000
);
```

Each branch explains one shape. Keep branch bodies small. Move large work into named functions.

## Define named records

Use fields without `|` when the type is one named record shape.

```musi
let Box[T] := data {
  value : T;
};

let boxedName : Box[String] := {
  value := "Nora"
};

boxedName.value;
```

The `data` definition names the record shape. The value still uses the normal record literal form, with `:=` for each field value. Field access uses `.`.

Record-shaped data is useful when the field set is stable and the type name matters at module boundaries.

## Named fields inside variants

A variant may carry named fields when the payload needs labels.

```musi
let Port := data {
  | Configured(port : Int, secure : Bool)
  | Default
};

let configured : Port := .Configured(secure := .True, port := 8080);
```

Named fields make construction order-independent. Do not mix positional and named field definitions inside one variant declaration.
