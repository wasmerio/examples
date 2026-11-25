---
layout: ../../layouts/post.astro
title: Running a Personal Fediverse Instance on a Shoestring Budget
description: How I deployed a lightweight Pleroma instance using free cloud tiers, leaving only domain renewal costs.
dateFormatted: Nov 27, 2023
---

I started looking into the Fediverse early this year and realized it is pretty much what I always wanted from social media: independent, self-contained nodes federating and talking across an open network.

> If you are new to the Fediverse, these posts are great primers:
>
> - [Introduction to the Fediverse](https://zerovip.vercel.app/zh/59563/)
> - [Fediverse: The Federated Universe](https://wzyboy.im/post/1486.html)
> - [What is the Fediverse and Can It Decentralize the Internet?](https://fermi.ink/posts/2022/11/22/01/)
> - [What is Mastodon and How to Use It](https://limboy.me/posts/mastodon/)
> - [Fediverse Guide for Twitter Users](https://wzyboy.im/post/1513.html)

As a self-hosting enthusiast, I naturally wanted to spin up my own instance. I asked around on Mastodon about server costs, and the minimum ballpark came out to around $15/year for a cheap VPS plus domain fees. In the spirit of keeping costs down, I initially ran an instance inside my homelab instead of buying a VPS. It hummed along for six months, but had a few downtime spells (home power cuts, broadband hiccups, and mostly self-inflicted issues from my own network tinkering). Because Fediverse servers drop federated messages when down, I decided to migrate off my local machine and onto the cloud.

Mastodon is feature-packed but notoriously heavy on memory. I went with [Pleroma](https://pleroma.social/) instead—it is lightweight, easy on resources, and covers everything I need. By piecing together free tiers from different cloud providers, I got hosting costs down to $0, leaving only the annual domain registration fee. It has been running reliably for a full quarter now.

![chi@miantiao.me](https://static.miantiao.me/share/nNbzS2/miantiao.me_chi.jpg)

Here is the setup:

- **Compute**:
  1. [Koyeb](https://app.koyeb.com/)
  2. [Northflank](https://northflank.com/)
  3. [Zeabur](https://s.mt.ci/WrK7Dc) (Originally had a free tier; now requires a paid plan for persistent deploys)

- **Database**:
  1. [Aiven](https://s.mt.ci/dgQGhM)
  2. [Neon](https://neon.tech/)

- **Media Storage**:
  1. [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)
  2. [Backblaze B2](https://www.backblaze.com/)

- **CDN & Edge**:
  1. [Cloudflare](https://www.cloudflare.com/)

Deployment guide and configuration templates:

[![ccbikai/pleroma-on-cloud - GitHub](https://github.html.zone/ccbikai/pleroma-on-cloud)](https://github.com/ccbikai/pleroma-on-cloud)

A friendly reminder: "free" often ends up being the most expensive if things go wrong. Make sure you set up automated, off-site backups for both your PostgreSQL database and your media buckets.

Feel free to follow me across the Fediverse at [@chi@miantiao.me](https://miantiao.me/@chi).
