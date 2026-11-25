---
title: Designing the ugly states
description: Loading, error, partial and overflowing. A practical checklist for the screens that never make it into a case study but define how a product feels.
pubDate: 2026-03-17
category: Product
readingTime: 7 min read
author: Robin Vale
tags: ['interface design', 'edge cases', 'specification']
image:
  src: /images/project-site.webp
  alt: A laptop and open notebook on a wooden desk, photographed from above
  width: 800
  height: 550
---

Ask a designer for their work and you get the happy path. Ask a support team what users
complain about and you get everything else.

Here is the checklist I run every screen through before calling it done.

## Empty

There is nothing here yet. Say what will appear, why it matters, and what single action
produces the first one. Resist the urge to fill the space with an illustration instead of
an explanation.

## Loading

Something is coming. The question is whether the user can tell the difference between
"working" and "broken". A skeleton that matches the eventual layout beats a spinner,
because it also prevents the content jumping when it arrives.

Decide what happens after ten seconds. Most loading states have no opinion about this, and
a spinner that has been going for half a minute reads as a hang.

## Partial

Half the data arrived. This is the state most often skipped and most often encountered on
a bad connection. Show what you have, mark what you do not, and never let a missing
section silently render as zero.

## Error

Three things, in this order: what went wrong, in plain language; whether the user caused
it; and what to do next. Phrase it as an instruction, not a complaint. "Enter a date after
today" beats "Invalid date".

Associate the message with its field programmatically, and announce it. An error only a
sighted user can perceive is not an error state, it is a decoration.

## Overflowing

Four hundred rows. A name of sixty characters. A number with nine digits. Every container
in your design has an implicit assumption about how much fits, and the assumption is
usually "about as much as the placeholder text".

Test with the longest realistic content you can find, not the prettiest.

## Offline and stale

If the product is usable offline, say which parts. If data may be stale, timestamp it. A
number with no age is a number people will argue about.

## Why this belongs in the specification

These states are where design and engineering most often diverge, because they are the
ones nobody drew. An engineer who has to invent the error copy will invent it, and it will
sound like an engineer wrote it.

Writing them down is not bureaucracy. It is the difference between a product that feels
considered and one that feels like a demo.
