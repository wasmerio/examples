---
title: "Reading at the Speed of Paper"
description: "Screens taught us to skim. A few old typographic constraints — measure, leading, contrast, and a serif that was drawn for text — can hand the page back its pace."
pubDate: 2026-06-11
tags: ["typography", "design"]
---

Printed pages have a pace. You can feel it in a well-set novel: the eye moves in even sweeps, the paragraphs arrive at intervals, and an hour disappears without your having decided to concentrate.

Web pages rarely have this. They have a scroll position.

Some of that difference is the medium and cannot be recovered. Quite a lot of it, though, is a handful of typographic decisions that print settled two centuries ago and the web keeps relitigating.

## Measure before everything

The single most consequential number on a reading page is the length of the line.

The eye reads in saccades — short jumps of roughly seven to nine characters — and at the end of the line it performs a return sweep back to the left margin. That sweep is ballistic. It aims at a position it has estimated, not one it has looked at. Past about 80 characters, the estimate starts failing, the eye lands on the wrong line, and the reader loses the thread without noticing why. Below about 45, the sweep happens so often that the rhythm breaks.

Everything else — column widths, sidebars, image sizes — should be arranged around that constraint rather than the constraint being adjusted to fit the layout.

## Leading is coupled to measure

Line height is not an independent setting. The longer the line, the more leading it needs, because the return sweep needs a larger target.

A rough guide:

| Measure | Line height |
| ------- | ----------- |
| 45–55ch | 1.45–1.55   |
| 55–70ch | 1.55–1.65   |
| 70–80ch | 1.65–1.75   |

Set a 75-character line at 1.4 and it will read as dense no matter how generous the margins are.

## Contrast is a range, not a maximum

Pure black on pure white is not the most readable combination; it is the most extreme one. On a bright screen it produces a halation effect where the white bleeds visually into the letterforms, especially at small sizes and light weights.

Print never did this. Book paper is off-white and ink is not truly black. The resulting contrast ratio sits somewhere around 12:1 rather than 21:1 — comfortably past every accessibility threshold, and easier to read for an hour.

This theme uses a warm paper tone and a soft ink for exactly that reason. In dark mode the same logic applies in reverse: near-black rather than black, and a bone-coloured text rather than white, because pure white text on pure black causes the letters to smear for anyone with astigmatism.

## Use a text face for text

Typefaces are drawn for a size range. A face designed for headlines has tight spacing, fine hairlines, and sharp joins — all of which fall apart at 16 pixels. A text face has open counters, sturdier strokes, and generous sidebearings, and looks slightly clumsy when set large.

Optical sizing puts this back in your hands. A variable font with an `opsz` axis carries several drawings and interpolates between them, so the same family can set both a 96-pixel title and a 17-pixel paragraph without either compromising.

## The rhythm is the point

Set the measure. Match the leading to it. Back off the contrast. Choose a face drawn for the size you are using it at.

None of this is novel; most of it predates the web by a long way. What it buys is the thing screens took: a page that can be read continuously rather than scanned, and a reader who gets to the end without having decided to try.
