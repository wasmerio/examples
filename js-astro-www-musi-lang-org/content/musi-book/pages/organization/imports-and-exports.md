---
title: "Imports and exports"
description: "Move names across files."
group: "Organization"
section: "Organization"
order: 3
slug: "imports-and-exports"
summary: "`export` shares a name. `import` brings shared names into a file."
examples: "chapter-imports-and-exports"
---

# Imports and exports

`export` makes a name available outside the file. `import` brings names in.

{{snippet:chapter-imports-and-exports}}

Use exports like a shop window. Only put the names outside readers should use. Keep small helper names inside the file.

Imports should show where a name comes from. This helps the next reader trace a value without guessing.

If a file imports too many unrelated modules, split the work.

## Import modules

Use `import` to name a module.

```musi
let option := import "@std/option";
let result := import "@std/result";
```

The lowercase local name is the module handle. Use it at the call site so readers can see where helpers come from.

```musi
let port := option.someOf[Int](8080);
let parsed := result.ok[Int, String](8080);
```

## Export public names

Use `export let` when another file should depend on that name.

```musi
export let defaultPort : Int := 8080;
```

Do not export test helpers, temporary conversions, or local constants unless they are part of the module contract.
