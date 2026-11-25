---
layout: ../../layouts/post.astro
title: "hink: A URL Shortener in Under 10 Lines of Code"
description: A minimalist URL shortener built with Git commits and serverless edge functions in under 10 lines of code.
dateFormatted: Aug 31, 2025
---

I wanted to share a tiny tool I built recently: [**hink**](https://github.com/miantiao-me/hink), a URL shortener implemented in under 10 lines of code.

It combines Git with serverless edge functions to handle short link redirection and visitor analytics without touching a database.

## The Core Trick: Hijacking Git Commit Hashes

The idea is simple: use an empty Git commit hash as the short slug, and stick the destination URL right into the commit message.

When someone hits the short URL, the edge function fetches the commit's `.patch` file from GitHub, parses out the target URL from the subject line, and redirects the visitor. Pair that with the edge platform's WAF analytics dashboard, and you get traffic stats for free.

I have tested this setup on:

- Cloudflare Workers / Snippets + Cloudflare WAF (Pro)
- Tencent Cloud EdgeOne (Free)
- Alibaba Cloud ESA (Free)

## Code: Minimal Implementations

The core logic is literally just a few lines. Here is how it looks across different runtimes:

### Cloudflare Workers / Alibaba Cloud ESA

```js
const GIT_REPO = "https://github.com/miantiao-me/hink"
export default {
  async fetch(request) {
    const { pathname } = new URL(request.url)
    const gitPatch = `${GIT_REPO}/commit${pathname}.patch`
    const patch = await fetch(gitPatch, { cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 86400 } }}).then(res => res.text())
    const url = pathname === '/' ? GIT_REPO : patch.match(/^Subject:\s*\[PATCH\](.*)$/m)?.[1]?.trim()
    return Response.redirect(url || GIT_REPO)
  }
}
```

### Tencent Cloud EdgeOne

```js
const GIT_REPO = "https://github.com/miantiao-me/hink"
addEventListener("fetch", async (event) => {
  const { pathname } = new URL(event.request.url)
  const gitPatch = `${GIT_REPO}/commit${pathname}.patch`
  const patch = await fetch(gitPatch).then(res => res.text())
  const url = pathname === '/' ? GIT_REPO : patch.match(/^Subject:\s*\[PATCH\](.*)$/m)?.[1]?.trim()
  event.respondWith(new Response(null, { status: 302, headers: { Location: url || GIT_REPO } }))
});
```

Deploy this to your preferred edge runtime, bind a custom domain, and your personal shortener is ready to roll.

## Why Build This?

There is certainly no shortage of URL shorteners out there. But hink was an experiment in doing things with as little moving parts as possible. Using Git commit hashes gets rid of database maintenance, GitHub handles storage and patch delivery, and edge WAF features give you basic analytics out of the box. It was just a fun hack to solve a real task with the absolute minimum amount of code.

## Live Stats Across Three Platforms

Here are screenshots of hink running on Cloudflare Workers, Alibaba Cloud ESA, and Tencent Cloud EdgeOne, checking traffic stats directly through their WAF dashboards:

### Cloudflare Workers

![Cloudflare](https://static.miantiao.me/share/2025/ePMX6q/Zsb50p.png)

### Alibaba Cloud ESA

![Alibaba](https://static.miantiao.me/share/2025/JiOSmY/6oDC36.png)

### Tencent Cloud EdgeOne

![Tencent](https://static.miantiao.me/share/2025/dyzFzs/efOSKl.png)

## Repository

[![miantiao-me/hink - GitHub](https://github.html.zone/miantiao-me/hink)](https://github.com/miantiao-me/hink)
