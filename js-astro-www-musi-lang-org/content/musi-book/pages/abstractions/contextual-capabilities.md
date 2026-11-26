---
title: "Contextual capabilities"
description: "Pass needed ability through the context."
group: "Abstractions"
section: "Abstractions"
order: 4
slug: "contextual-capabilities"
summary: "A contextual capability lets code ask for behavior without passing it by hand each time."
examples: "chapter-requirements"
---

# Contextual capabilities

A contextual capability is an ability that code can use because the context provides it.

{{snippet:chapter-requirements}}

This is useful when many small functions need the same ability. You avoid passing the same helper through every call by hand.

Think of it like a building key. You do not write the key number on every door. The person has the key while they are in that context.

Keep contextual needs small and clear. Hidden needs make code harder to test.

## Requirement shape

A requirement appears on the function signature.

```musi
let nextTick () : Int require { Clock } := ask Clock.tick();
```

Read the signature as: `nextTick` returns an `Int`, and it needs `Clock` in the context.

## Keep requirements near the reason

Use a contextual capability when the function directly asks for that ability. Do not add broad requirements to every helper in a module. Small requirements make the call chain easier to inspect.
