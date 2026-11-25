---
layout: ../../layouts/post.astro
title: "Sink: A Cloudflare-Native URL Shortener with Analytics"
description: An open-source, serverless link shortener built on Cloudflare Workers Analytics Engine supporting up to 3M monthly analytics events.
dateFormatted: Jun 4th, 2024
---

Whenever I share links on Twitter, I like using short URLs to see what people actually find interesting. Dub has always had the best user experience for this, but its free tier cuts off analytics once you hit 1,000 monthly clicks.

While browsing the web over the Qingming holiday, I noticed that the [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) supports both writing event streams and querying them via an API. I whipped up a quick MVP that supports tracking up to 3,000,000 requests per month. Under the hood, Cloudflare uses ClickHouse, so ingest performance is practically a non-issue.

Over the May Day holiday, I polished up the frontend UI. After dogfooding it for a couple of weeks, it felt solid enough to open-source.

## Features

- Short URL generation
- Built-in analytics (handles up to 3,000,000 monthly events on the free tier)
- 100% serverless deployment on Cloudflare
- Custom slugs
- AI-generated slug suggestions
- Expiration dates for temporary links

## Live Demo

- Dashboard: [https://sink.cool/dashboard](https://sink.cool/dashboard)
- Demo Site Token: `SinkCool`

### Site-Wide Analytics

![Site-wide Analysis](https://static.miantiao.me/share/CBuVes/sink.cool_dashboard.png)

### Link Management

![Link Management](https://static.miantiao.me/share/uQVX7Q/sink.cool_dashboard_links.png)

### Per-Link Analytics

![Individual Link Analysis](https://static.miantiao.me/share/WfyCXT/sink.cool_dashboard_link_slug=0.png)

## Open Source

[![ccbikai/sink - GitHub](https://github.html.zone/ccbikai/sink)](https://github.com/ccbikai/sink)

## Roadmap (WIP)

- Browser extension
- Raycast extension
- Apple Shortcuts action
- D1-backed link store for advanced search
- Filterable analytics dashboard
- Infinite scrolling for the link list
- Multi-cloud deployment targets

---

Feel free to follow me on [Twitter](https://x.com/0xKaiBi) for project updates and web dev notes.
