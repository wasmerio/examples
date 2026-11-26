---
title: "Optional and fallible types"
description: "Show missing values and errors in the type."
group: "Types"
section: "Types"
order: 3
slug: "optional-and-fallible-types"
summary: "Optional and fallible types keep missing values and errors visible."
examples: "chapter-option-and-result"
---

# Optional and fallible types

Optional values and fallible values are normal types. They make absence and failure part of the function contract.

{{snippet:chapter-option-and-result}}

## Optional type shape

```musi
let option := import "@std/option";
let Option := option.Option;

let findPort () : Option[Int] := option.someOf[Int](8080);
```

A caller can see from the result type that the value may be missing.

## Fallible type shape

```musi
let result := import "@std/result";
let Result := result.Result;

let parsePort () : Result[Int, String] := result.ok[Int, String](8080);
```

A caller can see both the success type and the error type.

## Use helpers for simple paths

```musi
let configured := findPort();
let parsed := parsePort();

configured.unwrapOr[Int](3000);
parsed.unwrapOr[Int, String](3000);
```

Use `match` when missing and error cases need different policy.
