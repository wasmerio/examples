---
layout: ../../layouts/post.astro
title: "DNS.Surf: Checking Global DNS Resolution from the Edge"
description: How I built DNS.Surf to inspect domain DNS propagation across 120+ countries and 330+ edge locations using Vercel Edge and Cloudflare Workers.
dateFormatted: Nov 8, 2023
---

In October 2023, I grabbed the domain [DNS.Surf](https://dns.surf/) on a whim and left it parked for a while.

When Vercel Edge rolled out support for deploying individual functions to specific target regions, it clicked: why not use multi-region edge functions to query and compare DNS propagation globally? That became the first iteration of DNS.Surf.

## Vercel Edge Iteration

The initial build leveraged Vercel's edge network:

- Queried DNS resolution from **18 global data centers**
- Supported switching between **100+ public DNS resolvers**
- Ran 100% serverless on Vercel Edge Functions

## Expanding to Cloudflare

In late 2024, I came across [UptimeFlare](https://github.com/lyc8503/UptimeFlare), which demonstrated how to trigger checks from [specific edge locations](https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup) on Cloudflare.

After adapting that technique for DNS lookups, DNS.Surf expanded significantly:

- Now resolves domains across **120+ countries** and **330+ cities**
- Runs 100% on Cloudflare Workers and Pages

## Previews

Try it live: [https://dns.surf/?name=DNS.Surf&type=A&resolver=google](https://dns.surf/?name=DNS.Surf&type=A&resolver=google)

![DNS.Surf Main Interface](https://static.miantiao.me/share/Hd52aL/dns.surf_.png)

![Google DNS Resolver Results](https://static.miantiao.me/share/hZZA3z/google.png)

### Easter Egg

Check the authoritative NS records for DNS.Surf itself:

![DNS.Surf NS Records](https://static.miantiao.me/share/933tDc/NS_DNS.surf.png)

## Open Source

The source code is available on GitHub:

[![DNS.Surf on GitHub](https://github.html.zone/miantiao-me/DNS.Surf)](https://github.com/miantiao-me/DNS.Surf)
