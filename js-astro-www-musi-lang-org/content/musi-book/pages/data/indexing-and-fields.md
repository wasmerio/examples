---
title: "Indexing and fields"
description: "Read a field or an ordered item."
group: "Data"
section: "Data"
order: 4
slug: "indexing-and-fields"
summary: "Dot access reads a field. Indexed access reads by position."
examples: "chapter-indexing-and-fields"
---

# Indexing and fields

Use field access when the value has names. Use index access when the value has order.

{{snippet:chapter-indexing-and-fields}}

`point.x` reads the `x` field. `values.[0]` reads the first item in an ordered value.

A field is like a named drawer. An index is like a numbered slot. Names are safer when the meaning matters.

Check what should happen when an index is outside the available items. Real programs meet empty lists.

## Field access

Use a dot for named data.

```musi
let server := { host := "localhost", port := 8080 };
let host := server.host;
let port := server.port;
```

Field names carry meaning. Prefer fields when a reader should not need to remember a position.

## Indexed access

Use `.[index]` for ordered data.

```musi
let ports := [3000, 8080, 8081];
let defaultPort := ports.[0];
let appPort := ports.[1];
```

Indexes are best when the order is the point of the data. If index `1` means "application port", a record field named `appPort` may be clearer.
