---
title: "Observability Without a Dashboard Tax"
excerpt: "Dashboards help when they answer real questions. They become tax when every team must maintain panels nobody uses during an incident."
category: "Reliability"
date: 2026-07-01
author:
  name: "Evan Brooks"
  role: "Security and reliability"
cover:
  src: "./cover.jpg"
  alt: "Blue and orange abstract background with wavy shapes"
  creditName: "Credits to Martin Martz via Unsplash"
  creditUrl: "https://unsplash.com/photos/a-blue-and-orange-background-with-wavy-shapes-W0NRebXbsjM"
featured: true
---

The easiest observability artifact to create is a dashboard. The hardest is a shared understanding of what question the dashboard answers. Without that question, teams inherit panels, alerts, and rituals that look responsible but do not help under pressure.

Dashboard tax is the maintenance cost of visibility nobody uses.

## Start with decisions

For each panel, ask what decision it supports. Roll back, scale up, pause a queue, disable a feature, contact a provider, page another team. If a chart does not support a decision, it may belong in exploration tooling rather than the primary incident view.

This keeps the main dashboard small enough to trust.

## Put symptoms first

Internal metrics are useful, but user-facing symptoms belong at the top: error rate, latency, task completion, queue delay, successful payments, search freshness. Implementation metrics explain why symptoms changed.

During an incident, the first question is not "which service is interesting?" It is "what are users experiencing?"

## Delete panels with ceremony

Removing a panel can feel risky because no one wants to lose a signal. Add a review habit: if a panel has not been used in recent incidents or capacity reviews, archive it. Keep the query somewhere discoverable, but remove it from the default view.

Observability should make systems easier to reason about. More charts are not the same thing as more clarity.
