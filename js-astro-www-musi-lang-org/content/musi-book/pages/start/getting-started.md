---
title: "Getting started"
description: "Install tools and check one file."
group: "Start"
section: "Start"
order: 1
slug: "getting-started"
summary: "Musi source files end in `.ms`. Start with one small file and run one command."
examples: "first-file"
---

# Getting started

A Musi file ends in `.ms`. Start with one file and one check command. This keeps the first step small.

{{snippet:first-file}}

This example gives a name to one value. The word after `let` is the name. The text after `:=` is the value the name holds.

You can think of `let total := 42;` like writing a label on a jar. The label is `total`. The thing inside is `42`.

Run a check command after you write a file. A check is like asking, "Does this note make sense?" It catches missing names, wrong types, and syntax that Musi cannot read.

## File shape

A small Musi file can be only names and expressions.

```musi
let host := "localhost";
let port := 8080;
port;
```

Each `let` gives a name to a value. The last expression is the value the file leaves for the checker or caller.

## First checks

Start with one file and one command. Fix syntax errors before adding more code. Fix type errors before adding more files.

When an error names a line, read that line first, then read the line above it. Missing `;`, `)`, `]`, or `}` often makes the next line look wrong.
