---
title: "Lambdas"
description: "Write anonymous functions with backslash."
group: "Core expressions"
section: "Core expressions"
order: 12
slug: "lambdas"
summary: "A lambda starts with `\\`. This keeps it separate from tuples and grouped expressions."
examples: "chapter-lambdas"
---

# Lambdas

A lambda is a function without a public name. Use it when a small rule is needed in one place.

{{snippet:chapter-lambdas}}

## Lambda shape

```musi
let twice := \(x : Int) : Int => x + x;
twice(21);
```

The parameter list is on the left. The result expression is on the right of `=>`.

## Use lambdas for small local behavior

Lambdas are good for `map`, `filter`, `fold`, and small callbacks.

```musi
let option := import "@std/option";

option.someOf[Int](41)
|> option.map[Int, Int](\(value : Int) : Int => value + 1);
```

If the lambda grows beyond one idea, give it a name with `let`.

## Named function versus lambda

Use a named function when the rule is reused.

```musi
let twice (x : Int) : Int := x + x;
twice(21);
```

Use a lambda when the rule belongs to one call site.

```musi
\(value : Int) : Int => value + 1;
```

Both forms have parameters and a result expression. The lambda has no public name.
