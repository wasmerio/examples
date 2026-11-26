---
title: "Testing and running"
description: "Check files and run package tests."
group: "Advanced forms"
section: "Advanced forms"
order: 5
slug: "testing-and-running"
summary: "Use commands to check one file, check a package, and run tests."
examples: "chapter-testing"
---

# Testing and running

Tests turn examples into promises. A small test says what should keep working.

{{snippet:chapter-testing}}

Run checks often while learning. A check gives fast feedback before a mistake spreads through many files.

{{snippet:chapter-running-and-tooling}}

Use one-file checks for small experiments. Use package checks and tests when code has imports, exports, or test files.

A good test is like a receipt. It records what you expected, so you can compare it later.

## Check before run

Use checks to catch syntax and type problems before runtime behavior matters.

```musi
let total := 42;
total;
```

A check should prove that names resolve, types line up, and expressions have the expected shape.

## Test behavior

Write small checks around public functions and rules.

```musi
let choosePort (configured : Int) : Int := configured;

let keepsConfiguredPort := choosePort(8080) = 8080;
```

Keep checks small. One check should explain one behavior.
