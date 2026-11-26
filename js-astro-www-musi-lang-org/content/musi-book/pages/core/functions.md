---
title: "Functions"
description: "Define callable values with `let`."
group: "Core expressions"
section: "Core expressions"
order: 11
slug: "functions"
summary: "Functions are named values. Parameters and result types stay near the name."
examples: "chapter-functions"
---

# Functions

A function is a value you can call. It takes input values and gives one result.

{{snippet:chapter-functions}}

## Define a named function

A function is still a `let` binding. Parameters live beside the name. The result type appears before `:=`.

```musi
let addTax (subtotal : Int, tax : Int) : Int := subtotal + tax;
```

Use a result type when the public shape matters. It helps readers and catches wrong return values.

## Positional and named calls

Call with positional arguments when the order is obvious. Use named arguments when a pair of values could be confused.

```musi
let portFor (base : Int, secure : Bool) : Int := base;
let a := portFor(8000, 0 = 0);
let b := portFor(secure := 0 = 1, base := 8000);
```

Named calls let the code state which argument is which.

## Functions as values

A function can be passed around like any other value. Callable types use `->`.

```musi
let inc (x : Int) : Int := x + 1;
let mapper : Int -> Int := inc;
mapper(41);
```
