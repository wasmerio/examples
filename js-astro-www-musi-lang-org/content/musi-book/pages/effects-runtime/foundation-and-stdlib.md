---
title: "Foundation and standard library"
description: "Use core modules and app-level library modules."
group: "Effects and runtime"
section: "Effects and runtime"
order: 5
slug: "foundation-and-stdlib"
summary: "Some modules provide core names. Standard library modules provide common app tools."
examples: "chapter-foundation"
---

# Foundation and standard library

Musi has core modules for basic names and standard library modules for common app work.

{{snippet:chapter-foundation}}

Core modules are close to the language. Most app code spends more time with standard library modules.

{{snippet:chapter-stdlib}}

Use standard library modules for everyday jobs such as options, results, text, collections, files, environment values, and tests.

If you can use a library helper, prefer that before writing a private copy.

## Foundation names

Foundation code is the small set of names the compiler and standard library agree on. Most app code should not define those names itself.

Use foundation shapes through normal modules:

```musi
let option := import "@std/option";

let configured := option.someOf[Int](8080);
let fallback := option.noneOf[Int]();
```

## Standard library policy

Reach for the standard library when the problem is common:

- optional data
- success or error
- text conversion
- collection helpers
- test helpers

Write project code when the rule belongs to your domain.
