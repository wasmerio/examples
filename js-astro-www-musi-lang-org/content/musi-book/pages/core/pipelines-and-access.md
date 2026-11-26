---
title: "Pipelines and access"
description: "Use `|>` for left-to-right flow, `.` for fields, and `.[index]` for indexed values."
group: "Core expressions"
section: "Core expressions"
order: 7
slug: "pipelines-and-access"
summary: "`|>` passes a value forward. `.` reads fields. `.[index]` reads an ordered item."
---

# Pipelines and access

Pipelines and access operators help long expressions read in the same order that data moves.

## Pipeline

`left |> step` sends the value on the left into the call on the right.

```musi
let option := import "@std/option";

let port := option.someOf[Int](8080)
         |> option.unwrapOr[Int](3000);
```

Read it as: start with `option.someOf[Int](8080)`, then unwrap it with a fallback. Use a pipeline when each step transforms the same value.

## Field access

Use `.` to read a named field.

```musi
let point := { x := 10, y := 20 };
let right := point.x;
```

Fields are named. A field access should read like a noun phrase: `point.x`, `user.name`, `config.port`.

## Indexed access

Use `.[index]` to read by position.

```musi
let ports := [8080, 8081, 8082];
let first := ports.[0];
```

Indexes are zero-based in examples: `0` means the first item. Use named fields instead of indexes when the position is not obvious.

## Dot-calls

Receiver-style calls also use a dot. The value before the dot is the receiver.

```musi
let present := option.someOf[Int](8080).isSome[Int]();
```

Use field access for data. Use dot-calls for behavior attached to a receiver value.
