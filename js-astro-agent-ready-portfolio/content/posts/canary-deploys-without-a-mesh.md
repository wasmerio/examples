---
title: Canary deploys without a service mesh
description: Weighted routing at the load balancer, two metrics and a ten-minute timer. A canary setup small enough to explain on a whiteboard.
published: 2026-06-09
tags: [deploys, kubernetes, reliability]
projects: [shipline]
cover: /images/demo/blog/canary-deploys-without-a-mesh.jpg
---

Every canary guide I read started with "first, install a service mesh". We have forty services and a small platform team, and a mesh would have been the most complicated thing we run. So we built the canary from parts we already had: the load balancer, Prometheus, and a timer.

## Two deployments, one weight

A canary is two versions of a service running at the same time, with a small share of traffic on the new one. On Kubernetes that is two Deployments behind one Service. The share comes from the ingress controller, which supports weighted backends:

```yaml title="canary-ingress.yaml"
metadata:
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "5"
```

Shipline creates the canary Deployment with the new image, points this second ingress at it, and changes the weight in steps. It needs no sidecars, no new control plane, and no new on-call rotation.

## The gate

Between steps, the pipeline asks two questions about the canary, compared with the stable version over the same ten minutes:

1. Is the error rate more than 0.5 points higher?
2. Is p95 latency more than 20% higher?

If either answer is yes, the weight goes to zero and the run fails. If both are no, the weight moves to the next step: 5%, 25%, 50%, 100%.

![Step chart of traffic on the new version: 5% for ten minutes, then 25%, 50% and 100%, with a passed gate before each step](/images/demo/blog/canary-steps.webp "Each step holds for ten minutes. A gate between steps compares the canary with the stable version.")

We tried more metrics, but every extra one added false alarms without catching anything the first two missed. A CPU spike on a new version is usually a warm cache, not a bug.

> [!WARNING] Low traffic breaks the math
> At 5% of a service that gets ten requests a minute, the canary sees five requests in ten minutes. One error is a 20% error rate. For services under about 50 requests a minute, Shipline skips the 5% step and gates on synthetic checks instead.

## Comparing against now, not last week

The first version compared the canary with a fixed threshold. It failed every deploy during a partner outage, because the stable version was failing too. Comparing the canary with the stable version over the same window fixed that: if both are bad, the deploy is not the problem.

## What it has caught

In five months the gate has stopped 23 deploys. Most were dull: a missing environment variable, a migration that ran before the code that needed it, a dependency bump that changed a timeout. One was a memory leak that only showed under real traffic, which no test would have found.

The total cost is about 300 lines of TypeScript in the pipeline and one extra ingress per service. When someone asks how our canaries work, the answer fits on a whiteboard, and that turned out to be the main feature.
