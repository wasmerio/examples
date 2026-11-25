---
title: A handover that outlives you
description: The test of a design engagement is not the launch. It is whether the team can build the eleventh screen six months later without calling you.
pubDate: 2026-02-04
category: Practice
readingTime: 6 min read
author: Robin Vale
tags: ['handover', 'documentation', 'design systems']
image:
  src: /images/reel-poster.webp
  alt: Two people reviewing notes and sketches at a studio table
  width: 800
  height: 550
---

A launch is a poor test of design work. Everything is fresh, the designer is still
reachable, and the team is working from memory of conversations that happened last week.

The real test comes six months later, when someone who was not in those conversations has
to build the eleventh screen.

## What breaks first

In my experience, in this order:

1. **Spacing.** Nobody wrote down the scale, so the new screen uses whatever looked right.
2. **Empty and error states.** They were designed for the original ten screens and
   reinvented for the eleventh.
3. **Copy voice.** The specification covered appearance and behaviour but not tone, so the
   new microcopy sounds like a different product.
4. **Component boundaries.** Somebody needed a slightly different card and made a second
   one rather than extending the first.

All four are documentation failures, not design failures.

## Documentation that stays current

The single most effective change I have made to how I hand over: put the documentation in
the repository, next to the code, in the same pull request as the component.

Documentation in a separate tool decays because updating it is a second task that nobody
is assigned. Documentation in the repository decays more slowly because changing the
component and not the note beside it looks wrong in review.

## The four things worth writing

**A token sheet with roles.** Not a colour swatch — a list of what each token is for.

**Every state, drawn.** Empty, loading, partial, error, overflowing, for every component
that can have them.

**Tone notes.** Three or four lines on how the product talks. Do we apologise? Do we use
contractions? Is the user "you"?

**A contribution path.** What to do when the system does not have what you need. Without
this, the answer defaults to "make a second one".

## The walkthrough matters more than the document

Book ninety minutes with the people who will maintain it. Not a presentation — open the
repository, build something small together, and let them find the gaps while you are still
there to fill them.

Every handover I have done this way has produced at least three corrections to the
documentation in the first hour. Those three corrections are worth more than the rest of
the document.

## A month of questions

I include a month of questions answered at no charge after every engagement, and I have
never regretted it. Partly because it is the right thing to offer. Mostly because the
questions people ask in that month tell me exactly what my documentation failed to
explain, which is the only reliable way I have found to get better at this.
