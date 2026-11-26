---
title: "Requirements"
description: "Show which effects a value needs."
group: "Effects and runtime"
section: "Effects and runtime"
order: 2
slug: "requirements"
summary: "A requirement makes needed ability visible near the function."
examples: "chapter-requirements"
---

# Requirements

A requirement lists the effects a function may ask for.

{{snippet:chapter-requirements}}

## Write required effects in the signature

```musi
let nextTick () : Int require { Clock } := ask Clock.tick();
```

The signature tells callers that `Clock` must be available.

## Requirements help testing

A test can provide a small fake answer instead of using the real clock, file system, or network.

Keep requirements narrow. Do not require a broad runtime when one small effect is enough.

## Read requirement order

Read the signature left to right:

```musi
let nextTick () : Int require { Clock } := ask Clock.tick();
```

The empty parameter list says the function takes no arguments. `: Int` says it returns an integer. `require { Clock }` says the function needs a `Clock` effect provider.

## Why not hide it

Without the requirement, the call site would not show that outside work may happen. A visible requirement keeps effectful code honest.
