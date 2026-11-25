---
layout: ../../layouts/post.astro
title: "TempMail.Best: Disposable Temporary Email on Cloudflare Workers"
description: A fast and privacy-friendly disposable email service running 100% on Cloudflare Email Workers and Nuxt.
dateFormatted: Jun 6th, 2024
---

I came across [Cloudflare Email Workers](https://developers.cloudflare.com/email-routing/email-workers/) and thought the concept of programmable email routing at the edge was really neat. Since the domain [TempMail.Best](https://tempmail.best/) was sitting idle in my account, I built a disposable temporary email service around it.

TempMail.Best runs 100% inside Cloudflare's network, built with **Cloudflare Workers** and **Nuxt**. It supports multiple inbound domain aliases and requires zero registration.

## Live Site

Try it here: [https://tempmail.best/](https://tempmail.best/)

![TempMail.Best Preview](https://static.miantiao.me/share/nqflWr/tempmail.best.png)

## Why Use a Disposable Inbox?

- **Spam protection**: Keep your primary email clean when signing up for one-off trials or newsletters.
- **Quick testing**: Great for testing signup flows and email verification triggers without creating dummy inboxes.
- **Zero sign-up**: Generate an address instantly without entering any personal info.
