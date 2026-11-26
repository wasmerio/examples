---
title: shipline
description: One deploy pipeline for every service. Build, test, canary, promote, with a gate that compares the new version against the old one.
repo: https://github.com/alexrivera/shipline
updated: 2026-11-02
---

![A shipline run: four stage cards, an error-rate chart comparing v42 with v41, the canary log and recent runs](/images/demo/projects/shipline.webp "A run in progress, holding at the canary stage.")

Shipline is the deploy pipeline behind every service at Northwind Labs, extracted into an open-source tool. It runs four stages, in order, for every merge to `main`:

1. **Build** a container image, tagged with the commit.
2. **Test** it: unit tests, then a smoke test against the built image.
3. **Canary** it: route 5% of traffic to the new version, then 25% and 50%, checking error rate and p95 latency against the stable version between steps.
4. **Promote** it to 100% and keep the previous version warm for a fast rollback.

## Why it exists

Before Shipline, Northwind had three deploy paths and a median of two days from merge to production. Now there is one path and the median is 12 minutes. The story is in [One pipeline, forty services](/blog/one-pipeline-forty-services).

## Try it

```sh
npx shipline init --service my-service
```

That writes a `shipline.yaml` with the defaults and a GitHub Actions workflow that runs it:

```yaml title="shipline.yaml"
service: my-service
canary:
  steps: [5, 25, 50, 100]
  hold: 10m
  gate:
    error_rate: +0.5pt
    p95: +20%
freeze:
  - fri 16:00 - mon 08:00
```

## What it is not

Shipline does not manage clusters and has no service mesh. It needs a Kubernetes cluster, an NGINX ingress controller with canary annotations, and Prometheus. [Canary deploys without a service mesh](/blog/canary-deploys-without-a-mesh) explains why.
