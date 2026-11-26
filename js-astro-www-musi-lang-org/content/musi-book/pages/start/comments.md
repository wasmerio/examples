---
title: "Comments"
description: "Write notes for readers without changing program behavior."
group: "Start"
section: "Start"
order: 4
slug: "comments"
summary: "Use comments for why, doc comments for public names, and names or types for what."
examples: "chapter-comments"
---

# Comments

Comments are ignored by the program. They are for the next reader.

{{snippet:chapter-comments}}

Use comments for intent, constraints, and warnings that the code cannot show by itself. Do not use a comment to excuse a bad name or unclear shape.

## Line comments

Use `--` for a normal line comment.

```musi
-- Keep this default aligned with the local dev server.
let port : Int := 8080;
```

Put the comment near the line it explains. If the code already says the same thing, remove the comment.

## Block comments

Use `/-` and `-/` for a block comment. Block comments can span more than one line.

```musi
/-
  This note covers a small group of values.
  Keep it short enough to read in place.
-/
let host := "localhost";
let port : Int := 8080;
```

Block comments can nest, so a temporary note can contain another block comment.

```musi
/-
  Outer note.
  /- Inner note. -/
-/
let retries := 3;
```

## Doc comments

Use doc comments when the next value or module is part of the public surface.

```musi
--! Network defaults for local examples.

--- Default port used by local examples.
export let defaultPort : Int := 8080;
```

Use `---` for the next item. Use `--!` for the module. Block forms are also valid: `/-- ... -/` for an item and `/-! ... -/` for a module.

## What not to write

Musi does not use C-style comments. `//` and `/* ... */` are operators or ordinary tokens, not comments.

Prefer this:

```musi
--- Default port used by local examples.
export let defaultPort : Int := 8080;
```

Avoid this:

```text
// not a Musi comment
/* not a Musi comment */
```

## Good comment habits

Write a comment when it explains why a rule exists, why an edge case matters, or what an exported name promises.

Do not repeat the code. `let port : Int := 8080;` already says the name, type, and value.

Rename first. If a comment only explains what a name means, the name is probably too weak.
