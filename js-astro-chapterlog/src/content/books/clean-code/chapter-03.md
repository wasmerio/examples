---
sections:
  - "3.1 Small!"
  - "3.2 Do One Thing"
  - "3.3 One Level of Abstraction per Function"
  - "3.4 Function Arguments"
---

## Small!

Functions should be small. Then they should be **smaller than that**. Martin's rule: functions should hardly ever be 20 lines long. The "extract till you drop" approach — keep extracting subfunctions until every function does exactly one obvious thing. If a function has blocks within `if`, `else`, or `while` statements, those blocks should be one-line function calls.

## Do One Thing

A function should do one thing, do it well, and do it only. The test: if you can extract another function from it with a name that isn't just a restatement of its implementation, it's doing more than one thing. Sections within a function are a sign it's doing too many things.

## One Level of Abstraction per Function

Mixing levels of abstraction within a function is confusing. High-level concepts like `getHtml()` shouldn't sit next to low-level details like `.append("\n")`. The **Stepdown Rule** says code should read top-down like a narrative — each function leading to the next at a lower abstraction level.

## Function Arguments

The ideal number of arguments is zero (niladic), then one (monadic), then two (dyadic). Three or more (triadic) should be avoided. **Flag arguments are ugly** — passing a boolean into a function loudly declares it does two things. When a function needs multiple arguments, consider wrapping them in an object. Output arguments are confusing and should be avoided; if your function must change state, have it change the state of its owning object. Also important: **command-query separation** — a function should either do something or answer something, never both.
