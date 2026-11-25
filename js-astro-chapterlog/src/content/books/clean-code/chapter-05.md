---
sections:
  - "5.1 Vertical Formatting"
  - "5.2 Horizontal Formatting"
  - "5.3 Team Rules"
---

## Vertical Formatting

Think of a source file like a **newspaper article**: the name should be simple and explanatory, the top-level concepts come first, and details increase as you move down. Key vertical principles:

- **Vertical openness** — blank lines separate distinct concepts (package declaration, imports, each function).
- **Vertical density** — lines that are tightly related should appear close together. Don't separate them with pointless comments.
- **Vertical distance** — concepts that are closely related should be kept vertically close. Variables should be declared as close to their usage as possible. Instance variables at the top of the class. Dependent functions should be close, with the caller above the callee.

Martin studied several open-source projects and found most files were under 200 lines, rarely exceeding 500. Small files are easier to understand.

## Horizontal Formatting

Lines should be short — Martin suggests a soft limit around 120 characters. Use **horizontal whitespace** to associate related things and dissociate weakly related ones (spaces around assignment operators, no space between function name and parentheses). **Horizontal alignment** of variable declarations and assignments is unnecessary and misleading — it draws your eye to the wrong thing and hides the real structure.

## Team Rules

Individual formatting preferences don't matter. What matters is that the **team agrees on one set of rules and everyone follows them**. A codebase should look like it was written by one person, not a patchwork of individual styles. Set the rules, configure your IDE, and move on.
