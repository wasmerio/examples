---
title: "Standard library"
description: "Use common modules for common jobs."
group: "Organization"
section: "Organization"
order: 4
slug: "standard-library"
summary: "Standard library modules hold common data and helper functions."
examples: "chapter-stdlib"
---

# Standard library

The standard library holds common tools. Use it before writing the same helper again.

{{snippet:chapter-stdlib}}

Option helpers, result helpers, text helpers, collection helpers, and test helpers keep code shorter and more familiar.

A standard library module is like a shared toolbox. You still choose the right tool, but you do not forge every tool yourself.

Import only what the file uses. A short import list keeps the file easy to scan.

## Common imports

Use standard modules for common shapes.

```musi
let option := import "@std/option";
let result := import "@std/result";
```

`option` models missing values. `result` models success or failure. Text, collection, file, environment, and test helpers belong in standard modules instead of private copies.

## Module handles

Keep module handles lowercase and boring.

```musi
let port := option.someOf[Int](8080);
let parsed := result.ok[Int, String](8080);
```

This keeps the type name (`Option`, `Result`) visually separate from the module handle (`option`, `result`).
