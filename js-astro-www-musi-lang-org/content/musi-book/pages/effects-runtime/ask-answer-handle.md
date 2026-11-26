---
title: "Ask, answer, handle"
description: "Run an effect and decide how it resumes."
group: "Effects and runtime"
section: "Effects and runtime"
order: 3
slug: "ask-answer-handle"
summary: "`ask` performs an effect operation. A handler can answer and resume."
examples: "chapter-handlers"
---

# Ask, answer, handle

`ask` requests an effect. `answer` defines how to respond. `handle` runs code with that answer.

{{snippet:chapter-handlers}}

## Ask

```musi
ask Clock.tick();
```

The ask is the point where pure code reaches an effect boundary.

## Answer

```musi
let clockAnswer := answer Clock {
  tick(k) => resume 1;
};
```

An answer receives the continuation and resumes it with a value.

## Handle

```musi
handle Clock.tick() answer clockAnswer;
```

A handler keeps policy at the edge. Code inside can ask for the effect without knowing whether the answer is real, fake, cached, or logged.

## Continuation

The parameter `k` is the continuation for the ask. `resume 1` sends a value back to the waiting code.

Keep answers short. If answering needs policy, parse config, or logging, move that work into named helpers and keep the handler readable.
