---
title: 'Why we built our own deploy pipeline'
description: 'Conventional CI treats a deploy as an event. Ours had to be a keystroke. The reasoning behind the 1.2-second build, the tradeoffs we accepted, and what we would do differently.'
pubDate: 2026-03-19
author: 'Sam Okafor'
authorRole: 'Platform Engineer'
tags: ['engineering', 'culture']
---

"Don't build your own CI" is good advice, and we repeat it to customers weekly. So this post owes you an explanation, because `vega deploy` — the command that builds your API and ships it to 24 regions — runs on a pipeline we wrote from scratch.

The decision came down to one principle that has shaped Vega more than any other:

> A deploy you fear is a deploy you delay. A deploy you delay is a release that ships stale.

If deploying feels like an event — queue, wait, watch, pray — teams batch changes, batches grow risky, and risk breeds process. If deploying feels like saving a file, teams ship forty times a day and every change is small enough to reason about. We wanted the second culture, for ourselves and for every team on the platform. That meant the deploy path was not infrastructure behind the product. It *was* the product.

## Where general-purpose CI fought us

We spent six weeks in 2024 trying to assemble the deploy path from existing CI before writing anything. Three problems would not budge:

**Queue time dominated build time.** Our builds took seconds; waiting for a runner took 40 to 90. No amount of optimization on our side could fix latency we didn't control, and "fast deploys, eventually" is not a product.

**Caching was a black box.** General-purpose CI caches at the level of directories and lockfiles. We needed function-level precision — knowing that a change to one route's handler invalidates exactly that route's bundle and nothing else. Bolting that onto cache keys designed for `node_modules` produced cache logic nobody trusted.

**Multi-region rollout was an afterthought.** CI systems end at "the artifact is built." Our hard part starts there: promoting one artifact through 24 regions with health gates, and rolling back in under 10 seconds when a gate fails. Modeling that as a 24-job matrix with shell-scripted orchestration was where we stopped pretending.

## What we built instead

The pipeline rests on two properties, and everything else falls out of them.

**Deterministic builds.** The bundler produces byte-identical output for identical input — pinned toolchain, sorted everything, zero timestamps. Determinism is what makes caching honest: if the input hash matches, the artifact *is* the same, not probably the same.

**Content-addressed artifacts.** Every build output is stored by the hash of its content. A "build" is mostly a lookup; we compile only the modules whose hashes changed. Fleet-wide, 92% of deploys rebuild fewer than ten modules. That is the unexciting secret behind the 1.2-second build — we rarely build much.

Rollout follows from the same idea. A region serves whatever artifact its pointer references, so promotion is a pointer write, gated on health checks as it walks the regions:

```text
$ vega deploy
Compiling api/index.ts…
✓ Built in 1.2s          (3 modules compiled, 214 from cache)
✓ Canary passed in fra   (200 OK, p99 38ms)
✓ Deployed to 24 regions
→ https://api.vega.dev   (rollback: vega rollback dpl_7m4k92)
```

A failed health gate swings the pointer back automatically. Rollback is the same pointer write in reverse — no rebuild, no redeploy, under 10 seconds globally. We have not had a "roll forward because rolling back is too slow" incident since the system shipped, and we used to have them quarterly.

## The bill we agreed to pay

Building it ourselves cost real things, and pretending otherwise would be revisionist. Two engineers own the pipeline permanently. There is no plugin marketplace; every integration is ours to write. And determinism is a tax on every toolchain upgrade — new compiler versions get bisected for output drift before they land.

We also deliberately did *not* rebuild the parts that general-purpose CI does well. Tests, linting, and preview environments live in your existing CI; `vega deploy` slots in as the final step, or runs from a laptop with the same guarantees.

## Would we do it again

Yes — narrowly. The rule we extract from the experience: build the pipeline only if deployment is your product's core loop, and buy it the moment it is merely how code gets out. For us the loop was the product. The 1.2-second build is not a vanity metric; it is the reason teams on Vega deploy a median of 11 times a day, and the reason we trust our own Friday afternoon deploys.
