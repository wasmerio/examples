---
sections:
  - "2.1 Expressions and Statements"
  - "2.2 Bindings"
  - "2.3 Control Flow"
---

## Expressions and Statements

An **expression** is any fragment of code that produces a value: `1 + 2`, `"hello"`, `myFunc()`. A **statement** is a complete instruction — it does something but doesn't necessarily produce a value. `let x = 5;` is a statement that contains the expression `5`.

Expressions can be nested inside other expressions. Statements are executed sequentially, top to bottom.

## Bindings

Bindings (variables) give you a way to hold on to values. **`let`** creates a block-scoped binding that can be reassigned. **`const`** creates a block-scoped binding that can't be reassigned. **`var`** is function-scoped and hoisted — mostly a legacy feature now.

Binding names can include letters, digits, `$`, and `_`, but can't start with a digit. A well-chosen name is worth more than a comment.

## Control Flow

Programs aren't just straight lines. **`if/else`** branches execution based on conditions. **`while`** and **`do`** loops repeat blocks. **`for`** loops provide a compact pattern for counter-based iteration.

`break` exits a loop immediately. `continue` skips to the next iteration. Indent consistently — the computer doesn't care, but your future self will.
