---
sections:
  - "4.1 Design by Contract"
  - "4.2 Dead Programs Tell No Lies"
  - "4.3 Assertive Programming"
---

## Design by Contract

Every function has an implicit contract: **preconditions** (what must be true before it runs), **postconditions** (what it guarantees when it finishes), and **class invariants** (what stays true throughout the object's life).

Make these contracts explicit. Document them, or better yet, enforce them in code. If a caller violates a precondition, that's the caller's bug. If the function violates a postcondition, that's the function's bug. Clear contracts make blame obvious.

## Dead Programs Tell No Lies

When something impossible happens, **crash early**. A dead program does far less damage than a crippled one running in a corrupt state. Don't catch exceptions just to log them and continue — if you can't handle the error meaningfully, let it propagate.

Defensive programming taken too far leads to silent failures and data corruption. It's better to fail loudly than to limp along producing wrong results that nobody notices until it's too late.

## Assertive Programming

Use assertions to check things that **can't happen**. If you write a case statement that covers all possibilities, add an assertion to the default case. If a value should never be negative, assert it.

Assertions are documentation that gets checked at runtime. Don't use them for normal error handling — they're for programmer errors, not user errors. And never put side effects inside assertions, because they may be disabled in production.
