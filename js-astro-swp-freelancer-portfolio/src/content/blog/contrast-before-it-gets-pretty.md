---
title: Check contrast before it gets pretty
description: Colour accessibility fails late because it gets checked late. Moving the check to the start costs nothing and saves the palette.
pubDate: 2025-12-09
category: Systems
readingTime: 5 min read
author: Robin Vale
tags: ['accessibility', 'colour', 'design systems']
image:
  src: /images/project-print.webp
  alt: An open printed brochure lying on a wooden surface beside a notebook
  width: 800
  height: 550
---

The usual sequence is: choose a palette, fall in love with it, build the interface, run an
accessibility audit, discover the accent fails against white, and then spend a week
arguing about whether the audit is too strict.

The palette almost always wins that argument, and the product ships with text nobody over
forty can comfortably read.

## Move the check to the front

Contrast checking takes seconds. Doing it while the palette is still three swatches in a
file — before anyone has seen it applied to a beautiful mockup — changes the outcome
entirely, because nothing is invested yet.

The rule I use: a colour does not enter the palette until its ratios are written down
next to it.

```css
--accent-action: #c8f14d;
/*  on --surface-base (#ffffff) ....... 1.5:1  — never for text
    on --surface-ink  (#101110) ...... 14.4:1  — body text OK
    as a large-text colour on ink ..... passes AAA            */
```

Three lines of comment, written once, and the question "can I put label text on the lime"
never has to be re-litigated.

## What the numbers mean in practice

- **4.5:1** — body text. The default requirement.
- **3:1** — large text (roughly 24px, or 19px bold) and the visual boundary of interactive
  components.
- **3:1** — also the requirement for a focus indicator against its background, which is the
  one most often missed.

## The traps

**Placeholder text.** Almost universally too light. It is text, and it is subject to the
same 4.5:1 requirement as any other text.

**Disabled states.** Genuinely exempt from the contrast requirement — but if your disabled
state is the only signal that a control exists, you have a different problem.

**Text over photographs.** The ratio changes per pixel. A scrim is not optional, and
"it looked fine on the hero image we chose" is not a test.

**Brand colours used as text.** This is the one that breaks palettes. A bright accent is
almost never a text colour on white. Decide that early and design around it, and the
accent stays bright.

## Accessible palettes are not duller

This is the fear behind the late check, and it is unfounded. Constraining where a colour
may be used is not the same as desaturating it. The lime in this theme is as bright as it
started — it is simply never asked to carry small text on white, because that was decided
in the first hour rather than the last week.
