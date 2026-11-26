---
title: "First program"
description: "Write one value, one function, and one final expression."
group: "Start"
section: "Start"
order: 2
slug: "first-program"
summary: "A Musi file reads from top to bottom. The last expression can be the result for direct file checks."
examples: "chapter-first-program"
---

# First program

A small program can have one value, one function, and one final expression.

{{snippet:chapter-first-program}}

Read it from top to bottom. First Musi learns the name. Then it learns the function. Then the final line uses the names above it.

A function is still a value with a name. The parameter list says what the function needs. The result type says what it gives back.

This is close to a kitchen order. First the ticket says the table. Then a rule says how to add tax or a fee. Then the last line asks for the final amount.

## Read the program

```musi
let base := 40;
let total := base + 2;
total;  -- 42
```

Line one binds `base`. Line two reads `base`, adds `2`, and binds `total`. Line three evaluates `total`.

The program does not need a `main` function for a small first file. A file can be a sequence of expressions while you learn.

## Add one rule

Add a comparison when the value needs a check.

```musi
let total := 42;
let expected := total = 42;
expected;  -- .True
```

`=` compares. It does not bind. The result is a Boolean.
