---
title: Undergrove app
client: Undergrove
year: '2023'
category: Web
excerpt: Checkout cut from eleven taps down to five
description: A mobile checkout redesign that removed six steps by deleting decisions rather than restyling them.
artwork: app-screens
services: ['Flow design', 'Interface design', 'Accessibility audit']
technologies: ['Figma', 'Prototype testing', 'WCAG 2.2 AA']
results:
  - value: '11 → 5'
    label: Taps to complete a purchase
  - value: '+27%'
    label: Checkout completion on mobile
  - value: 'AA'
    label: WCAG 2.2 audit passed at handover
featured: true
order: 6
---

## Eleven taps

Undergrove's checkout had grown one screen at a time, each addition reasonable on its own.
Together they asked the customer for a delivery preference before the address, a gift
option before the basket was confirmed, and an account before anything at all.

## Deleting decisions

Every step in the old flow was defended by somebody. So instead of arguing about styling,
we costed each step: how many people it lost, and what the business gained from asking.
Six steps could not justify themselves.

- **Guest checkout first.** The account prompt moved to after the purchase, where it
  converts better anyway.
- **Address before preferences.** Delivery options depend on the address, so asking first
  meant showing options that did not apply.
- **One confirmation, not three.** The basket, the address and the payment method are
  confirmable on a single reviewable screen.

## Accessibility was part of the redesign, not an audit after it

Focus order follows the visual order on every screen. Every interactive target is at
least 44×44px. Errors are announced, associated with their field, and phrased as
instructions rather than complaints. The independent WCAG 2.2 AA audit passed without
remediation.

## What shipped

Five screens, a written flow specification including every error and empty state, and a
prototype the team used for their own testing after handover.
