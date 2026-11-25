---
title: The empty screen is the one that decides
description: Most teams design the full dashboard and bolt on a shrug for day one. Here is how to invert that order without slowing the build.
pubDate: 2026-07-22
category: Product
readingTime: 6 min read
author: Robin Vale
tags: ['empty states', 'onboarding', 'product design']
featured: true
image:
  src: /images/journal-01.webp
  alt: An open notebook with blank ruled pages beside a cup of coffee
  width: 800
  height: 550
---

Every product demo shows the dashboard full. Forty rows, three charts, a healthy green
number in the corner. It is the screen the team is proudest of, and it is the screen
almost nobody sees first.

The screen people actually meet is empty. No rows, no charts, no green number — just an
interface that was designed for a state it is not currently in, apologising with a line
of grey text.

## Why it gets designed last

Empty states get designed last because they feel like an edge case, and edge cases get
scheduled after the main thing. But "no data yet" is not an edge case. It is the
universal first experience of your product. Every single user passes through it, and a
good proportion of them decide there and then whether to continue.

## Invert the order

Design the empty state first. Not as an exercise in humility — as a forcing function. A
few useful things happen when you do.

**You find out what the product is for.** An empty dashboard has to explain, in a
sentence, what will appear here and why the user should care. If you cannot write that
sentence, the feature may not be ready to build.

**You discover the real first action.** The empty state has to point somewhere. Deciding
where is deciding what the product's primary action is, which is a decision worth making
deliberately rather than by default.

**You stop designing for a data shape you do not have.** Teams routinely design charts
around a dataset that only exists for mature accounts. Starting empty keeps you honest
about what a week-old account looks like.

## What a good empty state contains

- **A plain statement of what goes here.** One sentence, no marketing voice.
- **One action, not four.** The empty state is not a menu. Pick the single next step.
- **A worked example where it is cheap to provide one.** Sample data the user can clone
  and then break safely beats a blank canvas almost every time.
- **No illustration doing the job of a sentence.** A friendly drawing is fine. A friendly
  drawing instead of an explanation is not.

## Does this slow the build down?

It does not, because you are not adding work — you are reordering it. The empty state was
always going to be built. Building it first means the questions it raises get answered
while they are still cheap, rather than in the last week when the answer has to fit around
everything already made.

The dashboard full of data is the screen you will put in your portfolio. The empty one is
the screen that decides whether anyone ever fills it.
