---
sections:
  - "4.1 Arrays"
  - "4.2 Objects"
  - "4.3 Mutability"
  - "4.4 Array Methods"
---

## Arrays

Arrays are ordered collections of values, accessed by index starting at zero. They're the workhorse data structure for lists, queues, and stacks. **`length`** is a property, not a method — no parentheses needed.

Arrays can hold mixed types, though in practice you rarely want that. Use `push` and `pop` for stack-like behavior, `shift` and `unshift` for queue-like behavior.

## Objects

Objects store named properties — key-value pairs where keys are strings (or Symbols). Access properties with dot notation (`obj.key`) or bracket notation (`obj["key"]`). Brackets let you use dynamic keys.

`delete` removes a property. `in` checks if a property exists. `Object.keys()` returns an array of property names.

## Mutability

Numbers, strings, and booleans are **immutable** — you can't change them, only create new values. Objects and arrays are **mutable** — they hold references, not copies. Two variables can point to the same object, so changing one changes the other.

Comparing objects with `==` checks identity (same reference), not structural equality. This is a common source of bugs.

## Array Methods

**`map`** transforms each element. **`filter`** selects elements matching a condition. **`reduce`** accumulates a single value from left to right. These three methods replace the vast majority of manual loops.

Destructuring extracts values into bindings: `let [a, b] = [1, 2]`. Rest parameters (`...rest`) collect remaining arguments. Spread (`...arr`) expands an array into individual elements. JSON serializes objects to strings and back with `JSON.stringify` and `JSON.parse`.
