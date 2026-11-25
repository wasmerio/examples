---
title: Petrichor reporting
client: Petrichor
year: '2024'
category: Product
excerpt: Four spreadsheets folded down into one screen
description: A reporting interface that replaced the weekly spreadsheet ritual with a single screen people trusted.
artwork: dashboard
services: ['Interface design', 'Data visualisation', 'Specification']
technologies: ['Figma', 'Chart specs', 'Accessible colour']
results:
  - value: '4 → 1'
    label: Spreadsheets replaced by one screen
  - value: '3.5 hrs'
    label: Saved per person, per week
  - value: 'AA'
    label: Contrast on every chart series
featured: true
order: 4
---

## The ritual

Every Monday, four people exported four spreadsheets, pasted them into a fifth, and
argued for an hour about which numbers were current. The company did not need a
dashboard. It needed the argument to stop.

## Designing for disagreement

The interesting work was not the charts. It was answering, on screen, the three questions
that caused the Monday argument: where did this number come from, when was it last
refreshed, and who changed the filter.

- **Provenance on every figure.** Hover or focus any number and it names its source and
  its timestamp.
- **Filters that are visible and shareable.** The current filter state lives in the URL,
  so "which view are you looking at" is answerable by pasting a link.
- **One primary series per chart.** Everything else is context, drawn in grey. Colour is
  reserved for the thing the chart is actually about.

## Accessible by construction

Charts are where colour accessibility usually collapses. Every series pair in the spec is
documented with its contrast ratio, and no chart relies on hue alone — each series
carries a distinct shape or position as well.

## What shipped

A single screen, a written chart specification covering axes, empty states and loading
behaviour, and a colour set the team could extend without breaking contrast.
