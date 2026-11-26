---
title: 'Pennant'
category: 'tooling'
summary: 'A status page that fits in one browser tab.'
status: 'live'
started: 2024-03-11
url: 'https://pennant.example.com'
repo: 'https://git.example.com/ada/pennant'
order: 1
---

I built Pennant because the status page I was using before it needed four clicks to tell me which of my three services was down. It is a single page: a list of checks, a color, a timestamp. That is the whole product.

It exists because I kept opening incident dashboards during outages and reading past the thing I needed. The list up top, the history below, a way to write a one-line update without leaving the page. Nothing else gets in front of that.

## What it does

Pennant polls an endpoint you give it, on an interval you set, and renders the last 90 days as a strip of squares. You can post a manual incident note from the same page. There is a JSON feed at `/status.json` if you want to build your own widget out of it.

## What it does not do

No paging, no on-call rotation, no Slack bot. I run three of my own services on it and none of them need someone woken up at 3am over a slow response time. If you need PagerDuty-style escalation, Pennant is not that tool, and I have no plans to make it one.

It has stayed a static-ish page with a small worker behind it since the first commit. I have resisted adding a settings panel for almost everything.
