---
title: Shipping a map app that works above treeline
date: 2026-08-30
updated: 2026-10-12
summary: Vector tiles, a 40 MB budget and a battery that has to last four days. What we cut, what we kept, and the one test we run on every release before it goes anywhere near a trail.
thumbnail: ../media/heather.webp
thumbnailAlt: Snowy mountains above a still lake under a clear sky
category: tools
tags: [maps, offline, performance]
series: building-ridgeline
---

Ridgeline's map has to fit in 40 MB for a whole ranger district, and the phone it runs on has to last four days on one charge and a small battery pack.

## The budget

We split the 40 MB three ways: tiles, fonts and everything else. Tiles got 32. Fonts got 3, which meant two weights of one family and no italics. Everything else, the app included, had to live in the last 5.

## What we cut

Hillshading went first. It looked lovely in the office and cost a third of the tile budget. Contour lines every 40 feet replaced it, and crews said they read the terrain better.

## The release test

Before every release, one of us carries a test phone on a full-day hike in airplane mode. If the battery is under 60 percent at the trailhead on the way out, the release waits.
