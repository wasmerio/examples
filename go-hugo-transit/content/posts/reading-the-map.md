---
title: "Reading the Map"
date: 2019-09-02
description: "How the home page map is drawn from your tags and dates."
tags: ["transit", "design", "configuration"]
---


The map on the home page is drawn from your content each time Hugo builds the site. Nothing is configured by hand.

## Lines

Each of your busiest tags becomes a **line**. Lines are sorted by how many posts use the tag, so the topic you write about most sits at the top. Set `params.transit.maxLines` to draw more or fewer.

## Stations

Each post is a **station**. Its position from left to right is its date, so the map doubles as a timeline. A post with several tags appears on several lines, joined by a thick bar: an interchange.

## Labels

Only the newest stations are named, so the map stays readable as your archive grows. Hover any station to see its name and date, or set `params.transit.labels`.

