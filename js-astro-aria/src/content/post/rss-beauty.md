---
layout: ../../layouts/post.astro
title: "RSS.Beauty: Making Raw Feeds Pleasant to Read"
description: An XSLT-based stylesheet for RSS and Atom feeds that renders raw XML as clean, responsive web pages directly in the browser.
dateFormatted: Dec 31, 2024
---

> A side project I had been procrastinating on for nearly six months is finally shipped.

When people click an RSS link in a browser, they usually get hit with an intimidating wall of raw XML. [RSS.Beauty](https://rss.beauty/) attaches an XSLT stylesheet to RSS 2.0 and Atom 1.0 feeds, turning that raw data into a clean, mobile-friendly reading interface right in the browser.

![RSS.Beauty](https://rss.beauty/banner.png)

## Features

- Clean, typography-focused reading interface
- Full compatibility with RSS 2.0 and Atom 1.0
- Responsive layout for mobile devices
- One-click subscription links for popular feed readers
- Self-hostable via static hosting or Docker

## Quick Start

Head over to [https://rss.beauty](https://rss.beauty) and paste in any feed URL.

Or test a live feed directly: [Sample Feed Output](https://rss.beauty/rss?url=https%3A%2F%2Fgithub.com%2Fccbikai%2FRSS.Beauty%2Freleases.atom)

## Tech Stack

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [XSLT](https://www.w3.org/TR/xslt/)

## Deployment

### Serverless

Deployable as static assets to Cloudflare Pages, Vercel, or Netlify. Fork the repository and connect your Git provider.

### Docker

```bash
docker pull ghcr.io/ccbikai/rss.beauty:main
docker run -d --name rss-beauty -p 4321:4321 ghcr.io/ccbikai/rss.beauty:main
```

## Credits

- [Tailus UI](https://html.tailus.io/)

## Support

- [Follow me on X](https://404.li/kai)
- [Sponsor on GitHub](https://github.com/sponsors/ccbikai)
