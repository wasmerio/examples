---
title: 'Vega 2.0: edge caching is GA'
description: 'After six months in beta and 41 billion requests served, edge caching is generally available on every Vega plan. What shipped, what changed since the beta, and how to turn it on.'
pubDate: 2026-06-02
author: 'Priya Raghavan'
authorRole: 'Co-founder & CTO'
tags: ['launch', 'edge caching']
---

Edge caching is generally available today for every Vega account, on every plan, in all 28 regions. It is the headline feature of Vega 2.0 and the largest change to the platform since we launched global deploys.

The short version: declare cache behavior next to your handler, and Vega serves responses from the region closest to your user with stale-while-revalidate semantics. During the beta, origin traffic dropped by a median of 64% across all beta teams, with p99 latency of 42ms on cached routes.

## What's in the GA release

The API surface is small on purpose. One method covers most routes:

```ts
api.get('/feed', async ({ cache }) => {
  const items = await cache.swr('feed:global', loadFeed, {
    ttl: 30,
    stale: 300,
    tags: ['feed'],
  });
  return Response.json(items);
});
```

Beyond `cache.swr`, GA ships with:

- **Tag-based invalidation.** Purge by entity (`cache.purge({ tags: ['product:42'] })`) instead of enumerating keys. Purges reach all 28 regions with a p99 of 280ms.
- **Cache analytics.** Hit ratio, stale-serve rate, and origin offload per route, live in the dashboard and queryable through the API.
- **Per-route diagnostics.** Every response carries a `vega-cache` header (`hit`, `stale`, `miss`, `bypass`) so you can verify behavior with nothing but `curl`.
- **Vary control.** Key responses by header, cookie, or query parameter with an explicit allowlist, so an unexpected `utm_source` never fragments your cache.

If you want the engineering detail — single-flight revalidation, the gossip mesh that carries purges, why we rejected TTL-only design — we wrote up the [full deep-dive](/blog/how-we-cut-p99-latency-to-42ms/) last month.

## What changed since the beta

41 billion requests from 1,900 beta teams found the sharp edges so you don't have to. The notable changes:

- **Tag limits raised.** Entries can now carry up to 64 tags, up from 8. Several teams modeled multi-tenant invalidation as one tag per tenant and hit the old ceiling within a week.
- **Purge propagation is 4x faster.** Beta purges took around 1.2s to reach every region; the rewritten gossip layer brings p99 to 280ms.
- **The beta header is gone.** `x-vega-cache-status` is now `vega-cache`. The old header keeps working until September 1, then disappears. This is the only breaking change.
- **Stale caps.** `stale` is now bounded at 24 hours. A handful of beta configs set it to weeks, which technically worked and practically meant serving February's prices in March.

## Pricing

Edge caching is included on every plan, Free included. Cached responses count toward your request quota at one tenth the rate of origin requests — caching should lower your bill, not move it around. There is no separate line item, no per-purge fee, and no bandwidth surcharge.

On the Free plan, caching runs in your 3 regions. Pro and Scale accounts cache in all 28.

## Turning it on

Caching is opt-in per route, so GA changes nothing until you ask it to. Upgrade and deploy:

```sh
npm install @vega/sdk@2
vega deploy
```

Add `cache.swr` to one hot, read-heavy route — your feed, your product page, your config endpoint — and watch the route's origin traffic in the dashboard. Most teams see the offload curve flatten within minutes. Start with an explicit vary allowlist and one tag per tenant — the key-design patterns that held up best across 1,900 beta teams.

## Thank you, beta testers

Nineteen hundred teams ran beta software in production and filed 312 issues, including the report that became the single-flight revalidation work and the multi-tenant tag request that reshaped the limits. The GA release is measurably better because of them.

This is also a foundation, not a finish line. Next on the roadmap: request coalescing across regions, programmatic cache warming, and per-tag analytics. If caching has been the reason you kept a CDN bolted in front of your API, 2.0 is the release where you can take it out.
