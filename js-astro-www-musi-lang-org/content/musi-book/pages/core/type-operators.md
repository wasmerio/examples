---
title: "Type operators"
description: "Use type annotations, type tests, casts, and constraints deliberately."
group: "Core expressions"
section: "Core expressions"
order: 8
slug: "type-operators"
summary: "`:` annotates, `:?` tests a runtime type, and `:?>` casts."
---

# Type operators

Type operators make type intent visible in code.

## Annotation with `:`

Use `:` when a name, parameter, or return value needs an explicit type.

```musi
let port : Int := 8080;

let parsePort (text : String) : Int := 8080;
```

Annotations are useful at public boundaries and when inference would hide the intended shape.

## Type test with `:?`

Use `:?` when code needs a Boolean answer about a value type.

```musi
let value := 42;
let isInt := value :? Int;
```

`isInt` is a Boolean. Testing does not change the value.

## Cast with `:?>`

Use `:?>` when code must treat a value as a specific type.

```musi
let value := 42;
let number := value :?> Int;
```

A cast is stronger than a test. Prefer keeping values typed at the boundary so casts stay rare.

## Constraints with `where`

Use `where` when a generic function needs a capability or shape.

```musi
let requireSame[T, U] (value : T) : T where T ~= U := value;
```

Use constraints when a generic function needs a type relationship that callers must satisfy.
