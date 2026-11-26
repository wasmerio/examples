---
title: How much of a small site's traffic is actually robots
description: A six-week log of one personal site, split by user agent and screen size. The short answer is more than you think.
date: 2026-10-28
type: Teardown
tags: [analytics, traffic]
---

This is example research content. Replace it with your own write-up.

Every analytics tool counts page views. Almost none of them tell you how many belong to a real person. Over six weeks I logged user agent, screen size, language and referrer for every hit on this site, then sorted them by hand.

## Method

- One site, static HTML, no client-side router.
- Analytics events kept raw for six weeks, then exported as CSV.
- A session counted as automated when it had a headless browser fingerprint: fixed viewport, one page per session, no referrer, no pointer movement.

## What came out

Roughly two thirds of the raw page views were not people. The bulk came from preview crawlers and screenshot services, all reporting a normal desktop Chrome user agent, all with square viewports like 1280×1200.

Once those were removed, the remaining traffic was boring and believable: search referrals, a handful of newsletter clicks, and direct visits that mostly landed on the one page people bookmark.

## What I changed

Nothing on the site. The fix belongs in reporting, not in the browser: filter at query time, keep the raw data, and never build a dashboard on top of an unfiltered count.
