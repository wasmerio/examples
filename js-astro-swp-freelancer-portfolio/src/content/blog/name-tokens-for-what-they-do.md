---
title: Name your tokens for what they do
description: Call it brand-primary and you will be renaming four hundred references next year. A naming scheme that has survived three identity changes intact.
pubDate: 2026-06-09
category: Systems
readingTime: 9 min read
author: Robin Vale
tags: ['design systems', 'design tokens', 'naming']
featured: true
image:
  src: /images/journal-02.webp
  alt: A laptop, notebook and espresso cup on a wooden table seen from above
  width: 800
  height: 550
---

There is a moment in every design system's life when the brand changes and somebody has
to find out how many places reference `--brand-blue`. The answer is always more than
anyone guessed, and roughly a third of them are not blue any more.

The problem is not the rebrand. It is that the token was named after its value.

## Three ways to name a token

**By value.** `--blue-500`, `--grey-200`. Honest and useless. It tells you what the colour
is and nothing about when to use it, so every developer makes their own judgement and the
judgements diverge.

**By brand.** `--brand-primary`, `--brand-accent`. Better, until the brand has two
accents, or until "primary" turns out to mean something different in the marketing site
than in the product.

**By role.** `--surface-raised`, `--text-quiet`, `--border-subtle`, `--accent-action`.
This is the one that survives. The name describes the job, and the job does not change
when the palette does.

## A scheme that has held up

The shape that has worked across several projects is `category-role-state`:

```
--surface-base
--surface-raised
--surface-sunken

--text-loud
--text-default
--text-quiet
--text-inverse

--border-subtle
--border-default
--border-strong

--accent-action
--accent-action-hover
--accent-critical
```

Three observations about this list.

**There is no `primary`.** "Primary" is a ranking, not a role, and rankings shift. An
action colour is still an action colour after a rebrand.

**States are suffixes, not separate scales.** `--accent-action-hover` sits next to its
base in the file and in your head. A parallel `--hover-*` scale drifts within a month.

**It is short.** Fourteen colour tokens covers most products. If you are writing the
fortieth, the system is probably encoding decisions that should be made in components.

## The two-layer version

On larger projects, two layers earn their keep: a private palette and a public set of
role tokens that reference it.

```css
:root {
  /* Layer 1 — the palette. Nothing outside this file may use these. */
  --palette-lime-400: #c8f14d;
  --palette-ink-900:  #101110;

  /* Layer 2 — roles. This is the only layer components may touch. */
  --accent-action: var(--palette-lime-400);
  --text-loud:     var(--palette-ink-900);
}
```

A rebrand now touches layer one. Components, which only ever reference layer two, do not
change at all. This is worth the extra indirection once you are past roughly twenty
components — below that it is ceremony.

## Rules that keep it honest

- **A component may never reference the palette directly.** If a component needs a colour
  the role tokens do not offer, that is a signal to add a role, not to reach past the
  layer.
- **Do not encode light and dark in the name.** `--surface-base` should change value by
  theme, not gain a sibling called `--surface-base-dark`.
- **Write down what each role is for.** One line per token, next to the definition. This
  is the whole documentation burden, and skipping it is why systems decay.

## What it buys you

The last three identity changes I worked through touched between four and eleven values
each. None of them touched a component. That is the entire argument.
