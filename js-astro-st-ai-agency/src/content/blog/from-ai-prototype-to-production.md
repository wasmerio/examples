---
title: From AI Prototype to Production
description: The prototype proves something is possible. Production proves it is dependable. Here is the path between the two, week by week.
pubDate: 2026-04-30
category: Delivery
author: Amara Boateng
authorRole: Founder, principal engineer
image: /images/blog-prototype-to-production.webp
imageAlt: Hands sketching interface layouts on paper next to a smartphone
tags: [Delivery, Production, Project planning]
---

Most AI projects have a moment where the prototype works and everyone is excited. Then weeks pass, the edge cases pile up, and the launch date drifts. The problem is rarely effort. It is that a prototype and a production system answer different questions.

A prototype asks: *can this be done?* Production asks: *can this be done every time, safely, at a known cost?*

## Weeks 1–2: replace anecdotes with a test set

The prototype was probably judged on a handful of hand-picked examples. The first job is to collect a few hundred real cases and agree on the correct outcome for each. This is slow and unglamorous, and it is the single most valuable thing you will do.

Expect the prototype's score to drop when it meets real data. That is not failure — it is the first honest measurement.

## Weeks 3–4: close the biggest gaps

Sort the failures into groups and fix the largest groups first. Typical fixes include:

- tightening instructions for a confusing category,
- adding a tool so the agent can look something up instead of guessing,
- adding a refusal rule for requests it should never handle.

Re-run the full test set after every change. Improvements in one area often cause regressions in another.

## Week 5: build the harness

This is where the system around the agent takes shape:

1. permissions limited to what the workflow needs,
2. a spend cap per task,
3. a replayable record of every run,
4. an escalation path into a real human queue,
5. dashboards for volume, escalations, corrections and cost.

## Week 6: launch small

Go live on a slice of traffic — one region, one category, one channel. Watch the numbers daily with the operations team. Widen the slice only when the agreed criteria are met.

## After launch: keep measuring

Inputs change. Customers find new ways to phrase things, suppliers redesign their documents, policies are updated. Keep adding real cases to the test set, run it nightly, and alert when the score moves.

## The common traps

- **Scaling the prototype directly.** Prototype code is optimised for speed of learning, not for safety. Rebuild the parts that matter.
- **Launching without an owner.** Someone in the business must own the outcome, not just the IT ticket.
- **Measuring only accuracy.** Cost, latency and escalation quality matter just as much in production.

The path from prototype to production is not glamorous, but it is predictable. Teams that plan for it ship on time far more often than teams that hope the prototype will simply grow up.
