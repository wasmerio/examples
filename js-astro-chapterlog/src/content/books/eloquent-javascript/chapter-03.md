---
sections:
  - "3.1 Defining a Function"
  - "3.2 Closure"
  - "3.3 Recursion"
  - "3.4 Growing Functions"
---

## Defining a Function

Three ways to create functions. **Function declarations** are hoisted — usable before they appear in code. **Function expressions** are assigned to bindings and are not hoisted. **Arrow functions** (`=>`) provide a shorter syntax and don't bind their own `this`.

Parameters that aren't passed default to `undefined`. Extra arguments are silently ignored.

## Closure

A function can reference variables from its enclosing scope, even after that scope has finished executing. This is **closure** — the function "closes over" its environment.

Closures enable powerful patterns: factory functions, data privacy, and callbacks that remember their context. Understanding closure is essential for understanding JavaScript.

## Recursion

A function that calls itself. Every recursive function needs a **base case** to stop. Each call adds a frame to the call stack — too many calls without returning causes a **stack overflow**.

Recursion is elegant for tree-like problems but often slower than loops. Some problems (like traversing nested structures) are naturally recursive.

## Growing Functions

Two natural ways to introduce a function: you spot repeated code, or you need a specific capability. **Functions should do one thing.** If you find yourself adding "and" to describe what a function does, it probably should be two functions.

Good naming matters more than good comments. A function called `printZeroPaddedWithLabel` is telling you it does too much.
