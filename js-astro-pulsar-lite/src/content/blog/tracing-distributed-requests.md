---
title: 'Tracing distributed requests without the grief'
description: 'Most tracing rollouts die in the collector config. Vega traces every request end-to-end by default — no agents, no sampling YAML, no separate backend to keep alive at 2am.'
pubDate: 2026-04-22
author: 'Tomás Rivera'
authorRole: 'Product Engineer'
tags: ['observability', 'engineering']
---

Ask a team why they don't have distributed tracing and you will rarely hear "we don't want it." You will hear a story about a three-sprint rollout that produced a collector nobody owns, a sampling config nobody understands, and a storage bill somebody definitely noticed. Tracing is the most useful signal in a distributed system and the most operationally expensive one to acquire.

We think that cost is an artifact of architecture, not an inherent property of tracing. Here is how it works on Vega, and the decisions behind it.

## The grief, itemized

A conventional tracing setup asks you to run four systems before you see your first waterfall: instrumentation libraries in every service, context propagation across every hop (the part that silently breaks), a collector fleet to receive spans, and a storage backend with its own retention and indexing problems. Each layer has its own failure modes, and the failure mode of all of them is the same — gaps in the exact trace you needed.

Then comes sampling. Head-based sampling at 1% keeps the bill manageable and guarantees that the one request your customer is emailing you about was, statistically, not sampled.

## What the runtime gives you for free

Vega's position in the stack changes the economics. The runtime already owns the full request lifecycle — it accepts the request at the edge, runs your handler, and brokers every outbound call. That means tracing can be a property of the platform rather than a library you wire in:

- **Every request is traced.** No agent, no sidecar, no init code. Deploy with `vega deploy` and traces exist.
- **Propagation is automatic.** `fetch` calls from a handler carry trace context to the next hop, including across regions and through cached responses. There is no middleware to forget.
- **The trace ID is on the response.** Every response carries a `vega-trace-id` header. Log it in your frontend, and a support ticket becomes a one-click lookup instead of an archaeology project.

The waterfall in the dashboard shows the edge hop, cache behavior (hit, stale, or miss — and if stale, when revalidation fired), handler execution, and every upstream call with timing, status, and the region it ran in.

## Annotating the parts we can't see

Automatic instrumentation covers the boundaries; your business logic is a black box unless you say otherwise. Custom spans are one function:

```ts
import { trace } from '@vega/sdk';

api.post('/checkout', async ({ body }) => {
  const order = await trace.span('pricing.calculate', () => calculatePricing(body));

  const charge = await trace.span('billing.charge', { attrs: { provider: 'stripe' } }, () =>
    stripe.charges.create(order.total),
  );

  return Response.json({ orderId: order.id, chargeId: charge.id });
});
```

Spans nest, attach to the active trace automatically, and accept typed attributes you can filter on later — `provider:stripe and duration > 500ms` is a one-line query, not a log-grepping session.

## No sampling, within reason

Sampling exists to protect storage budgets, so we attacked the storage cost instead. Spans are columnar-encoded at the edge and shipped in compressed batches; the result is cheap enough that we retain **every trace for 30 days on Pro and 90 days on Scale** — no head-based sampling, no tail-based heuristics deciding which requests were interesting.

That window maps to how traces are actually used: recent ones for debugging, older ones for postmortems and regression hunts. Scale's 90 days keeps a full quarter on hand for the audits that ask about it.

One honest caveat: at very high volume — north of a billion spans a day — we will talk to you about strategic sampling. For the other 99% of teams, the answer to "was that request traced?" is simply yes.

## What it costs you

Tracing is included on Pro ($20 per seat) and Scale plans, on by default, with nothing to deploy and nothing to maintain. The marginal overhead is around 180 microseconds per request, paid inside infrastructure you were already paying for.

The pattern we keep seeing in onboarding calls: teams instrument nothing for years, not because tracing is unhelpful but because the setup tax never fits in a sprint. Make the tax zero and the first thing every team does is pull up the waterfall for their slowest endpoint. The second thing they do is fix it.
