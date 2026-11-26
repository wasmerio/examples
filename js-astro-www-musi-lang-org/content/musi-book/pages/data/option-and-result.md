---
title: "Option and result"
description: "Model missing values and failed work."
group: "Data"
section: "Data"
order: 5
slug: "option-and-result"
summary: "Option means value or no value. Result means success or error."
examples: "chapter-option-and-result"
---

# Option and result

Some work may not have a value. Some work may fail. Musi makes both cases visible in the type.

{{snippet:chapter-option-and-result}}

## Option means present or missing

The standard library exports `Option[T]`, `someOf`, and `noneOf`.

```musi
let option := import "@std/option";

let configured := option.someOf[Int](8080);
let missing := option.noneOf[Int]();
let port := configured.unwrapOr[Int](3000);
```

Use `Option` for lookup results, optional configuration, and values that may honestly be absent.

## Result means success or error

`Result[T, E]` keeps a success value type and an error value type.

```musi
let result := import "@std/result";

let paid := result.ok[Int, String](1200);
let declined := result.err[Int, String]("card declined");
let amount := paid.unwrapOr[Int, String](0);
```

Use `Result` when a caller needs to know why work failed.

## Match when policy matters

Fallback helpers are fine for simple defaults. Use `match` when each case needs clear behavior.

```musi
match configured (
| .Some(port) => port
| .None => 3000
);
```

## Do not hide the missing case

Do not hide missing values in magic numbers like `-1`. Give the missing case a real shape.
