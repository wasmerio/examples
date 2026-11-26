---
title: "Human-in-the-Loop AI: Where Supervision Matters"
description: Not every step needs a reviewer. The skill is knowing which decisions carry real risk — and designing the review so people actually do it well.
pubDate: 2026-08-06
category: Supervision
author: Ivan Kovač
authorRole: Head of evaluation
image: /images/blog-human-in-the-loop.webp
imageAlt: Two colleagues reviewing work together on a laptop in a bright office
tags: [Human in the loop, Supervision, Risk]
---

"Human in the loop" is often treated as a safety blanket: put a person somewhere in the process and the risk goes away. In reality, a poorly placed review step does two kinds of damage. It slows down work that never needed checking, and it trains reviewers to click "approve" without reading.

Good supervision is targeted. Here is how we decide where people belong.

## Sort decisions by consequence, not by difficulty

Ask two questions about every decision the agent makes:

1. **If this is wrong, how expensive is it?** Consider money, customer trust and regulatory exposure.
2. **If this is wrong, how quickly would we notice?** Some errors surface in minutes; others hide for months.

Decisions that are cheap and quickly noticed can usually run unattended with sampling. Decisions that are expensive *or* slow to surface deserve a human checkpoint — even when the model is usually right.

## Design the review, not just the checkpoint

A review step is a small product in itself. If a reviewer has to open four systems to verify one claim, they will eventually stop verifying. We aim for a review screen that shows:

- the input the agent saw,
- the action it proposes,
- the evidence it used, with links to the source,
- and a clear note on *why* it is asking — low confidence, policy edge, unusual amount.

With that in place, a careful review takes seconds rather than minutes, and reviewers stay engaged.

## Use confidence thresholds honestly

Most agents can report how sure they are. That score is only useful if it is **calibrated** against your own labelled data. We plot the agent's confidence against its measured accuracy on the test set, then pick the threshold where the error rate falls below what the business is willing to accept. Anything below the line goes to a person.

> A threshold you have not measured is just a number you hope is right.

## Watch for automation bias

When an agent is right 98% of the time, reviewers learn to trust it — which is exactly when the 2% slip through. A few practical counter-measures help:

- Occasionally insert known-wrong cases and track whether they are caught.
- Rotate reviewers so nobody approves the same pattern all day.
- Report reviewer agreement rates alongside agent accuracy.

## Reduce supervision deliberately

Supervision should shrink over time, but only on evidence. When a category has run for several weeks with a very low correction rate, move it from "review every case" to "review a sample". Write the decision down, with the numbers behind it. If quality slips, you know exactly which change to reverse.
