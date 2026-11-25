---
sections:
  - "2.1 Defining Refactoring"
  - "2.2 The Two Hats"
  - "2.3 When Should We Refactor?"
---

## Defining Refactoring

As a noun: a change to the internal structure of software to make it easier to understand and cheaper to modify, **without changing its observable behavior**. As a verb: applying a series of such changes. The key constraint is behavior preservation — the code does the same thing before and after.

This distinction matters. If you're fixing bugs or adding features while restructuring, you're not refactoring. You're doing multiple things at once, which makes mistakes harder to track down.

## The Two Hats

Kent Beck's metaphor: you wear **two hats**, but only one at a time. When adding functionality, you don't change existing code structure — you just add new capabilities and tests. When refactoring, you don't add functionality — you only restructure.

Swap hats frequently, but always know which hat you're wearing. Mixing the two leads to messy commits and hard-to-diagnose problems.

## When Should We Refactor?

Refactoring isn't a scheduled activity — it's part of the flow. **Preparatory refactoring**: restructure to make an upcoming feature easier. **Comprehension refactoring**: clean up code as you read it so the next person has it easier. **Litter-pickup refactoring**: fix small messes as you encounter them.

The Boy Scout Rule applies: leave the code better than you found it. Planned refactoring should be rare — if you refactor opportunistically, the code stays healthy on its own.
