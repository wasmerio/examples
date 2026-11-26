---
title: "Assignment and equality"
description: "Use `:=` to bind or assign, and use `=` or `/=` to compare."
group: "Core expressions"
section: "Core expressions"
order: 4
slug: "assignment-and-equality"
summary: "`:=` stores a value. `=` checks equal values. `/=` checks different values."
---

# Assignment and equality

`:=` and `=` do different jobs. `:=` writes a value somewhere. `=` compares two values and produces a Boolean.

## Bind a name

Use `let total := 42;` when you introduce a name.

```musi
let port := 8080;
let host := "localhost";
```

The name on the left receives the value on the right. This is not a comparison.

## Assign a mutable place

Use `mut` when the place must change later. Use `:=` again to write the new value.

```musi
let port := mut 8080;
port := port + 1;
```

The second line reads the old `port`, adds one, and writes the result back into `port`.

## Compare values

Use `=` to ask whether two values match. Use `/=` to ask whether they differ.

```musi
let actual := 8081;
let isDefault := actual = 8080;
let changed := actual /= 8080;
```

`isDefault` is `.False`. `changed` is `.True`.

## Common mistake

Do not use `=` when a name needs a value.

```diff
- let port = 8080;
+ let port := 8080;
```

Use `=` only when the result should be a `Bool` value.
