---
sections:
  - "5.1 Extract Function"
  - "5.2 Inline Function"
  - "5.3 Extract Variable"
  - "5.4 Change Function Declaration"
---

## Extract Function

The most common refactoring. When you see a block of code that needs a comment to explain, **extract it into a function named after the comment**. The threshold for extraction is low — even a single line is worth extracting if the name adds clarity.

The old argument about function call overhead is dead. Modern compilers inline aggressively. Optimize for readability, not for imaginary performance problems.

## Inline Function

The reverse of Extract Function. When a function's body is just as clear as its name, **inline it**. Unnecessary indirection makes code harder to follow. If you have a chain of functions that just delegate to each other, inline them until the structure makes sense.

Also useful as a preparatory step before re-extracting in a different shape.

## Extract Variable

Give a name to a complex expression. **`let basePrice = quantity * itemPrice;`** is clearer than repeating the multiplication everywhere. Extracted variables act as documentation — the name explains the intent.

If the variable is useful across an entire class, consider making it a method instead. But for local clarity, a simple `let` binding does the job.

## Change Function Declaration

Renaming is the most important refactoring tool. A good name tells you what the function does **without reading the body**. If you can't think of a good name, it often means the function does too much.

Also covers changing parameter lists. Add a parameter when a function needs new context. Remove one when it's no longer used. Reorder them for consistency. Small changes, but they keep the API clean.
