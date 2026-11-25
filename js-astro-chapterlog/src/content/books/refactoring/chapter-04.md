---
sections:
  - "4.1 The Value of Self-Testing Code"
  - "4.2 A First Test"
  - "4.3 Probing the Boundaries"
---

## The Value of Self-Testing Code

Refactoring requires confidence that behavior hasn't changed. That confidence comes from tests. **Self-testing code** means you can run a command and know within seconds if anything is broken.

The real value isn't catching bugs during development — it's the freedom to change code without fear. Developers without tests are afraid to refactor, so the code rots. Developers with tests refactor constantly, so the code stays clean.

## A First Test

Start simple. Set up the object, exercise it, and verify the result. The **setup-exercise-verify** pattern (also called arrange-act-assert) structures every test the same way.

Write the assertion first — it clarifies what you're actually testing. Then work backward to set up the conditions. Run the test and watch it fail before making it pass. A test that can't fail is worthless.

## Probing the Boundaries

Don't just test the happy path. What happens with **zero items**? An empty string? A negative number? Null? The boundaries and edge cases are where bugs hide.

Test the conditions that should raise exceptions — verify that the code fails correctly. Focus testing effort on the areas you're most worried about. You can't test everything, so test the things that are most likely to break or most damaging if they do.
