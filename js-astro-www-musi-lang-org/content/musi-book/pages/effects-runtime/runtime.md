---
title: "Runtime modules"
description: "Use modules that talk to the running program."
group: "Effects and runtime"
section: "Effects and runtime"
order: 4
slug: "runtime"
summary: "Runtime modules help code read values from the running environment."
examples: "chapter-runtime"
---

# Runtime modules

Runtime modules help code talk to the running program and its environment.

{{snippet:chapter-runtime}}

Use them for values such as environment keys, process settings, or host-provided data.

This is outside work. Keep it near the edge of your program when you can. Pass plain values inward after you read them.

That shape makes the middle of the program easier to test.

## Runtime edge

Runtime work touches the host: files, environment values, process settings, clocks, and native calls.

Keep that work near the outside of the program.

```musi
export let configFromEnv () : Int := 8080;
```

After runtime code reads host state, pass plain data inward. The core of the program should receive values, not reach out for them.

## Testable middle

Prefer this shape:

```musi
let choosePort (configured : Int) : Int := configured;
```

The function is easy to test because the caller supplies the value.
