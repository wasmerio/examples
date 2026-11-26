---
title: "Records"
description: "Group named fields in one value."
group: "Data"
section: "Data"
order: 1
slug: "records"
summary: "A record keeps related values together and names each field."
examples: "chapter-records"
---

# Records

A record groups named fields. Use it when field names are the important part of the value.

{{snippet:chapter-records}}

## Build and update records

```musi
let point := { x := 3, y := 4 };
let moved := { ...point, y := 9 };
```

Field values use `:=`. Spread `...point` copies fields from another record before the later fields replace or add values.

## Read fields

```musi
let x := point.x;
let y := moved.y;
```

A field read should be boring. If many records share behavior, use a function or shape instead of repeating field logic everywhere.

## Records versus data

Use a record for a product shape: all listed fields exist together. Use `data` for a sum shape: exactly one variant exists at a time.

## Record field operator

Record literals use `:=` for each field because each field receives a value.

```musi
let point := { x := 3, y := 4 };
```

Use `.` to read a field:

```musi
let x := point.x;
```

If a field name is not clear, rename the field. Do not rely on a comment to explain a bad field name.
