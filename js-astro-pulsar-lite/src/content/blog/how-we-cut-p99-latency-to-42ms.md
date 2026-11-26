---
title: 'How we cut p99 latency to 42ms with edge caching'
description: 'A deep-dive into the cache layer behind Vega 2.0: stale-while-revalidate at all 24 regions, single-flight revalidation, and the tag-based invalidation model that made it safe to turn on.'
pubDate: 2026-05-14
author: 'Mara Chen'
authorRole: 'Infrastructure Engineer'
tags: ['engineering', 'performance']
---

Six months ago, every request to a Vega API traveled to the region where your origin handler ran. If your data lived in `us-east-1` and your user sat in Sydney, that round trip cost 210ms before your code executed a single line. Our fleet-wide p99 was 380ms. Today it is 42ms. This post explains the three design decisions that got us there.

## Where the time actually went

We started by instrumenting 2.1 billion production requests with the same tracing pipeline we ship to customers. The breakdown surprised us:

| Segment                  | p50  | p99   |
| ------------------------ | ---- | ----- |
| Edge to origin region    | 86ms | 247ms |
| Handler execution        | 9ms  | 61ms  |
| Database and upstreams   | 14ms | 118ms |

Handler code was rarely the problem. The dominant cost was geography — moving the request to the data, then moving the response back. The fix had to be architectural: stop making the trip.

## Decision one: SWR semantics, not TTLs

Our first prototype was a plain TTL cache at each of our 24 regions. It worked until it didn't. A 60-second TTL means that once a minute, some unlucky user eats the full origin round trip, and your p99 never improves — it just gets rarer.

Stale-while-revalidate fixes the shape of the distribution, not just the average. Every request is served from the regional cache immediately, and if the entry is past its freshness window, the region revalidates in the background:

```ts
api.get('/products/:id', async ({ params, cache }) => {
  const product = await cache.swr(`product:${params.id}`, () => db.products.find(params.id), {
    ttl: 60, // serve fresh for 60s
    stale: 600, // then serve stale up to 10m while revalidating
  });
  return Response.json(product);
});
```

With SWR, the origin trip moves off the request path entirely. The user-facing cost of a stale entry is zero milliseconds; the cost of revalidation is paid by a background task in the same region.

## Decision two: single-flight revalidation

The naive SWR implementation has a thundering-herd problem. When a popular key goes stale, every concurrent request triggers its own revalidation. During a beta load test, one stale key for a high-traffic feed produced 14,000 simultaneous origin fetches.

The fix is single-flight: per region, per key, at most one revalidation is in flight at a time. Concurrent requests subscribe to the result instead of duplicating the work.

```ts
const inflight = new Map<string, Promise<Entry>>();

async function revalidate(key: string, fetcher: Fetcher) {
  const existing = inflight.get(key);
  if (existing) return existing;

  const task = fetcher().finally(() => inflight.delete(key));
  inflight.set(key, task);
  return task;
}
```

After shipping single-flight, origin load during cache expiry events dropped by 99.2%, and our origin fleet shrank by a third.

## Decision three: tags, not key gymnastics

Caching is easy; invalidation is the part that pages you at 2am. Key-based purging falls apart the moment one database row appears in five responses — the product page, the search index, the category listing, the sitemap, the recommendations feed.

We made tags first-class instead. Any cached entry can declare the entities it depends on, and a purge takes out everything that touched them:

```ts
const product = await cache.swr(key, fetcher, {
  ttl: 60,
  tags: [`product:${id}`, `org:${orgId}`],
});

// later, in your update handler
await cache.purge({ tags: [`product:${id}`] });
```

Purges propagate to all 24 regions over our gossip mesh with a p99 of 280ms. That number matters: it is the upper bound on how stale a "purged" response can be, and it is what let teams cache write-heavy endpoints they would never have trusted to a TTL.

## The results

We rolled the cache out region by region over five weeks, watching the same dashboards we give customers. Across Vega's own fleet, for cacheable routes:

- p50 latency: 71ms → 11ms
- p99 latency: 380ms → 42ms
- Origin request volume: down 71%
- Cache hit ratio at steady state: 94.6%

The remaining p99 budget is almost entirely TLS handshake and last-mile network — things we can shave but not eliminate.

## What we'd tell you to steal

If you are building something similar: measure where the time goes before you build anything, choose SWR over TTLs because it fixes the tail rather than the median, treat single-flight as table stakes, and design invalidation around your data model instead of your URL structure. The caching itself was three weeks of work. Making it safe to turn on took the other five months — and was worth every week.
