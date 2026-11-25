---
sections:
  - "1.1 Numbers"
  - "1.2 Strings"
  - "1.3 Boolean Values"
  - "1.4 Empty Values"
---

## Numbers

JavaScript uses 64 bits to store a single number value. This gives you about 18 quintillion integers, though precision gets tricky with very large numbers. **Fractional numbers** (like `9.81`) are approximations — don't rely on them for exact comparisons.

Special numbers: `Infinity`, `-Infinity`, and `NaN` (Not a Number). `NaN` is the only value in JavaScript that is not equal to itself.

## Strings

Strings can be quoted with backticks, single quotes, or double quotes. **Template literals** (backtick strings) can span multiple lines and embed expressions with `${}`. Strings are immutable and use Unicode under the hood.

The `+` operator concatenates strings when either operand is a string — a common source of bugs.

## Boolean Values

Two values: `true` and `false`. Comparison operators (`>`, `<`, `==`, `===`) produce booleans. **`===` avoids type coercion** and is almost always what you want.

Logical operators: `&&` (and), `||` (or), `!` (not). They use short-circuit evaluation — `||` returns the first truthy value, `&&` returns the first falsy value.

## Empty Values

`null` and `undefined` both represent "no value," but they're used differently. `undefined` means a value hasn't been assigned. `null` is typically used as an intentional "no value."

`typeof null` returns `"object"` — a famous JavaScript bug that will never be fixed for backward compatibility.
