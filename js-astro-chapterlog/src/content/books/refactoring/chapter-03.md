---
sections:
  - "3.1 Mysterious Name"
  - "3.2 Duplicated Code"
  - "3.3 Long Function"
  - "3.4 Feature Envy"
---

## Mysterious Name

If you can't tell what a function, variable, or class does from its name, that's a smell. **Good names are the most important tool for clear code.** Renaming is one of the most common and most valuable refactorings. If you struggle to name something, it's often a sign the design is unclear.

## Duplicated Code

The same code structure in more than one place. Extract the duplication into a single function. If the duplication is in sibling classes, pull it up into the parent. Duplication means **every change needs to happen in multiple places** — and you will forget one.

## Long Function

The longer a function, the harder it is to understand. Small functions with good names are self-documenting. The key isn't a line count — it's whether you need a comment to explain a block. If yes, **extract that block into a function** and name it after the comment.

Conditionals and loops are prime extraction candidates. A function should do one thing at one level of abstraction.

## Feature Envy

A function that spends more time interacting with another class's data than with its own. If `calculateTotal` mostly accesses fields on `Order`, it probably **belongs on `Order`**. Move it. The goal is to keep data and the behavior that uses it together.

Related smells: **data clumps** (groups of data that always appear together should be their own object), **long parameter lists** (often a sign that a function is reaching into too many concerns), **shotgun surgery** (one change requires edits across many classes).
