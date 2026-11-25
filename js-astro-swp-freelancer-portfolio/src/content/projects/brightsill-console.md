---
title: Brightsill console
client: Brightsill
year: '2026'
category: Product
excerpt: Rebuilt first-run — setup completion up 44%
description: A first-run rebuild for a developer console, drawn from support tickets rather than a competitor teardown.
image:
  src: /images/project-console.webp
  alt: A desk with a desktop display, laptop and tablet all showing the same interface layout
  width: 900
  height: 675
services: ['Product discovery', 'Interface design', 'Design system']
technologies: ['Figma', 'Design tokens', 'Storybook']
results:
  - value: '+44%'
    label: Setup completion in the first session
  - value: '−6 min'
    label: Median time to first successful deploy
  - value: '38'
    label: Components documented at handover
featured: true
order: 1
---

## The problem nobody had written down

Brightsill had a console that worked and a first run that did not. People signed up,
reached the third screen, and left. The team assumed the product was too complex. The
support inbox said something else: the same four questions, asked hundreds of times, all
about what the product expected the user to have ready before they started.

## What we did

The first week produced no design files at all. It produced a document: every question
from six months of tickets, sorted by how early in the journey it was asked. Four of them
accounted for most of the drop-off, and three of the four were answerable with a sentence
of copy in the right place.

- **Told people what they needed first.** A single pre-flight screen listing the three
  things to have to hand, with a link out to each.
- **Made the empty state do work.** Instead of an empty dashboard with a shrug, a
  worked example the user could clone and then break safely.
- **Drew the ugly states.** Half-uploaded, wrong credentials, four hundred rows. Those
  screens were the ones people actually met.

## What shipped

A rebuilt onboarding flow, a component library with every state documented, and a written
spec the two engineers used without needing a single clarifying call. Setup completion in
the first session moved from 31% to 75%.

> The two screens that were costing us signups had been in front of us for a year. It
> took someone reading the inbox to see them.

## What I would do differently

The pre-flight screen should have been tested with people who had never seen the product.
We tested it with users who already had accounts, and they breezed through it in a way
that flattered the design more than it deserved.
