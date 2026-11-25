---
sections:
  - "1.1 The Starting Point"
  - "1.2 The First Step"
  - "1.3 Decomposing the Statement Function"
---

## The Starting Point

The example begins with working code that calculates charges for a video rental store. It works, but it's a single long function that's hard to read, hard to change, and impossible to reuse. **Working code isn't necessarily good code.**

When you need to add a feature and the code structure doesn't support it, first refactor the code to make the change easy, then make the change.

## The First Step

Before refactoring anything, **make sure you have solid tests**. Refactoring changes structure without changing behavior — but you need tests to prove the behavior actually didn't change. Run them after every small step.

Without tests, you're not refactoring. You're just changing code and hoping for the best.

## Decomposing the Statement Function

The first move is **Extract Function** — pull a chunk of logic into its own named function. Then **Inline Variable** to simplify temporary variables that only exist to hold a single expression. Then **Change Function Declaration** to give things better names.

The rhythm is always the same: small change, run tests, small change, run tests. Each step is trivially simple. The cumulative effect is dramatic. The function that started as 30 tangled lines becomes a set of small, focused, well-named functions.
