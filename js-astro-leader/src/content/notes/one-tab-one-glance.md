---
title: 'One tab, one glance'
category: 'tooling'
pubDate: 2026-02-26
description: 'The only design constraint I kept from the first week.'
---

When I started Pennant back in 2024, I wrote one sentence at the top of the design doc and never deleted it: it has to fit in one browser tab, no scrolling, on a laptop screen, during an outage. Everything else in that doc has been rewritten at least once. That sentence is still there, unchanged.

I did not appreciate at the time how much that one constraint would end up deciding for me. It ruled out a sidebar, because a sidebar eats width you need for the status list. It ruled out a settings page on the same screen, because settings are not what you look at during an incident. It even ruled out a second color for "degraded" versus "down," because two shades of a similar color read the same at a glance under stress, and a glance is all the constraint allows for.

## Why one tab

The idea came from a bad night in 2023, on a different project, watching three status pages in three tabs while trying to figure out which one was actually relevant to the outage I was dealing with. Tab-switching during an incident costs more attention than it looks like it should. Every switch is a small context reset, and a reset at the wrong moment is how you miss the one line that mattered.

One tab means one glance has to be enough. If it is not enough, the answer is to remove something from the page, never to add a second screen to check. I have applied the same rule, loosely, to Cusp's preview list, which is also a single scrollable page with nothing behind a tab or a modal.

It is a small rule. It has outlived every other decision I made that first week, and I think that is because it was never really about the interface. It was about what a person can actually hold in their head at 2am, and that number does not change no matter how good the design gets.
