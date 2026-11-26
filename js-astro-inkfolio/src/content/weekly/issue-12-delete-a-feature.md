---
title: The week I deleted a feature nobody used
description: It had tests, docs and a landing page section. It also had three sessions in ninety days.
date: 2026-11-09
issue: 12
tags: [shipping]
---

Example weekly issue. Replace with your own series.

Deleting a feature is the cheapest performance work you can do. This one had been live for three months, had nine tests, two paragraphs of documentation, and a section on the landing page that I had rewritten twice.

It also had three sessions in ninety days, all of them mine.

## What made me finally look

The analytics were flat and I assumed the feature was just young. Then I checked the number of people who had ever clicked the button, not the number of page views it collected. Three.

## What I removed

- The route and its tests.
- The marketing copy.
- The docs page, redirected to the parent section.
- The config flag, which nobody had ever turned on either.

## What it cost

One afternoon, mostly spent making sure the redirect was right. The build got smaller. Nothing else changed, which is the point.

## The rule I keep relearning

Usage is not traffic. A page that gets visits and no clicks is a page that is failing politely.
