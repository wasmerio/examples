---
title: Tools that stay out of the way
description: Why we stopped adding features to our internal tools, and what happened to the ones we removed.
date: 2026-01-20
glyph: grid
---

Every tool we build for ourselves starts the same way. Someone is doing something
by hand for the third time, they get annoyed, and a week later there is a script.
That script is usually the best version of the tool it will ever be.

What follows is the interesting part. The script gets a flag. Then an interactive
mode. Then a config file, because there are now too many flags to remember. By the
time it has a config file, nobody can say what it does without opening it.

## The rule we settled on

A tool earns a new option when the alternative is a fork. Nothing else counts.
Convenience is not a reason, and neither is symmetry: two commands that each take
five flags are not improved by a sixth that they share.

We removed eleven options from our internal build tool last autumn. Nine of them
had never been passed by anyone. One was passed by a cron job that had been
failing silently for four months. The eleventh was genuinely useful, and it is now
the default.

## What we kept

- A way to see what the tool is about to do, before it does it.
- An exit code a script can branch on.
- Output that is a table for a person and JSON for a program, decided by whether
  anyone is watching.

That last one is worth more than any feature we cut. The same command works in a
terminal and in a pipeline, and nobody has to remember a flag to make it so.

## What we would do differently

We should have written down why each option existed at the moment we added it. A
year later, the only honest way to find out was to remove it and see who
complained. That worked, but it is a slow way to learn something we knew once.
