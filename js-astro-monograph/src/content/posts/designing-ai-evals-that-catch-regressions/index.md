---
title: "Designing AI Evals That Catch Regressions"
excerpt: "Small, human-readable eval sets can catch product regressions earlier than giant scoreboards that nobody trusts."
category: "AI"
date: 2026-07-13
author:
  name: "Iris Novak"
  role: "Cloud and platform"
cover:
  src: "./cover.jpg"
  alt: "Abstract purple, white, and orange gradient light"
  creditName: "Credits to Starbelt via Unsplash"
  creditUrl: "https://unsplash.com/photos/abstract-gradient-of-purple-white-and-orange-light-eV7wU-DweVE"
featured: false
---

The first eval mistake is trying to make it impressive. Teams gather thousands of examples, calculate a broad score, and then struggle to explain why the score moved. A better starting point is a small suite that every product engineer can read in a few minutes.

An eval should answer a release question: did this change make a behavior we care about worse?

## Start with product promises

Write down the promises the feature makes. Maybe the assistant should cite sources, refuse unsupported medical claims, preserve tone, or never expose internal configuration. Each promise becomes a category with concrete examples.

The examples should look like real user inputs, including messy phrasing. Clean prompts create clean dashboards and weak confidence.

## Prefer failure labels over mystery scores

Numeric scores are useful after you know what they mean. Before that, label failures directly: missing citation, fabricated constraint, unsafe escalation, wrong format, tool call not needed, tool call missing.

These labels make regressions debuggable. A release that drops two points is vague. A release that doubles "wrong format" failures tells the team exactly where to look.

## Keep a golden set and a hunting set

The golden set should be stable and reviewed carefully. It protects promises that must not drift. The hunting set should change often. Add fresh examples from support tickets, bug reports, and red-team sessions.

Stability and curiosity are different jobs. Let each set do one job well.

## Review outputs like product copy

Model output is user interface. Read it aloud. Check whether it is useful, clear, and appropriately cautious. A technically correct answer can still be a product failure if it sounds evasive or buries the important action.

Good evals are not only tests. They are a shared language for what quality means.
