---
layout: ../../layouts/post.astro
title: Extracting GitHub OpenGraph Images for Rich Card Previews
description: A simple proxy to fetch official GitHub OpenGraph preview cards for repositories, issues, pull requests, discussions, and commits.
dateFormatted: Dec 19, 2023
---

Whenever I embedded GitHub repositories in blog posts, I used [GitHub Repository Card](https://gh-card.dev/). But it handled non-Latin text poorly and had issues with text overflowing without line breaks:

[![ccbikai/cloudflare-worker-image - GitHub](https://gh-card.dev/repos/ccbikai/cloudflare-worker-image.svg?fullname=)](https://github.com/ccbikai/cloudflare-worker-image)

I initially planned to roll my own card generator using [@vercel/og](https://vercel.com/docs/functions/edge-functions/og-image-generation). Then I noticed that GitHub's native OpenGraph preview cards already look clean, well-formatted, and informative. So I wrote a small proxy worker to extract and serve them for blog embeds.

## How It Looks

![nasa/fprime - GitHub](https://github.html.zone/nasa/fprime)

![A framework for building Open Graph images](https://static.miantiao.me/share/9ZxTs8/RZHfnD.png)

Beyond repositories, GitHub also renders rich OpenGraph previews for issues, pull requests, discussions, and individual commits.

## How to Use

**Replace `.com` with `.html.zone` in any GitHub URL.**

For example:
`https://github.com/vercel/next.js` => `https://github.html.zone/vercel/next.js`

### Previews Across GitHub Entities

#### Repository

![Repo](https://github.html.zone/vercel/next.js)

#### Issue

![Issue](https://github.html.zone/vuejs/core/issues/9862)

#### Pull Request

![Pull Request](https://github.html.zone/lobehub/lobe-chat/pull/529)

#### Discussion

![Discussion](https://github.html.zone/lobehub/lobe-chat/discussions/551)

#### Commit

![Commit](https://github.html.zone/vercel/next.js/commit/a65fb162989fd00ca21534947538b8dbb6bf7f86)

## Source Code

The code is open source on GitHub:

[![ccbikai/github-og-image - GitHub](https://github.html.zone/ccbikai/github-og-image)](https://github.com/ccbikai/github-og-image)
