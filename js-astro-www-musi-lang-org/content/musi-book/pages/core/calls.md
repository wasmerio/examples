---
title: "Calls"
description: "Call functions with positional or named arguments."
group: "Core expressions"
section: "Core expressions"
order: 13
slug: "calls"
summary: "A call evaluates a callable value and passes arguments to it."
examples: "chapter-calls"
---

# Calls

A call asks a function or callable value to do its work.

{{snippet:chapter-calls}}

## Read a call left to right

```musi
let greet (name : String) : String := name;
let message := greet("Musi");
```

`greet` is the callable value. `"Musi"` is the argument. `message` receives the result.

## Named arguments

Named arguments protect code that has several values with the same type.

```musi
let connect (host : String, port : Int, secure : Bool) : Int := port;
connect(host := "localhost", port := 8080, secure := 0 = 0);
```

Use named arguments when a reader might ask, "which number is this?"

## Generic calls

Generic calls put type arguments in square brackets before value arguments.

```musi
let identity[T] (value : T) : T := value;
identity[Int](42);
```
