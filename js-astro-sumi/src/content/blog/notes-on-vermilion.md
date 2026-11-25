---
title: "Notes on Vermilion"
description: "One accent colour, used sparingly, does more work than a palette. A short history of the red that shows up on gates, seals, and — here — about four elements per page."
pubDate: 2026-05-08
tags: ["colour", "design"]
---

The red on this site appears perhaps four times per page: the eyebrow above a heading, the underline on the current nav item, a link on hover, and the rule beside a pull quote. That is the entire colour budget.

It is roughly `#c73e3a` — a vermilion, or _shu_ (朱).

## Where it comes from

Natural vermilion is ground cinnabar, mercury sulfide, and it has been mined for pigment for something like eight thousand years. It was expensive, brilliantly opaque, and mildly poisonous, which is a combination that tends to reserve a colour for things that matter.

In Japan it became the colour of _torii_ gates, of lacquerware, and of the _inkan_ seal that signs a document. The pairing with black ink is not decorative. A seal in red against a column of black characters is doing a specific job: it marks the one element on the page that is not text, and it does so in the only hue present.

## Why one accent beats five

A palette with several accent colours has to answer a question every time it is used: which one, and why. Usually there is no principled answer, so the choice gets made by whatever looked best in that one component, and the meaning of each colour dissolves.

With a single accent the question disappears. Red means "this is the active or interactive element." Everything else is ink on paper. A reader picks the rule up in about two seconds without being told, and after that the page is navigable at a glance.

The constraint also forces the hierarchy to be carried by the things that carry it better anyway — size, weight, position, and space. Colour is a poor primary signal. Roughly one in twelve men has some form of colour vision deficiency, and any colour cue that is not backed by a second signal simply does not exist for them.

## Making it behave in both themes

A saturated red that sits nicely on warm paper is too loud on near-black. The eye's sensitivity shifts in dark surroundings, and the same hue reads as more intense and slightly more orange.

So the dark theme uses a marginally lighter, less saturated version — `#c85a52` against `#0b0c0e`. Perceptually it is the same colour doing the same job; numerically it is not the same colour at all. Anyone shipping a single accent value for both themes is shipping one that is wrong in one of them.

Both variants are checked against the text they sit on. The vermilion on paper clears 4.5:1; on ink it clears it comfortably. An accent that fails contrast is not an accent, it is a decoration that some readers cannot see.

## Restraint is the feature

The temptation with an accent colour is to use it whenever something needs emphasis. That is exactly backwards. Its power is entirely a function of scarcity — the fourth red element on a page is worth less than the first, and the tenth is worth nothing at all.

Spend it on the thing you most want found. Leave the rest in ink.
