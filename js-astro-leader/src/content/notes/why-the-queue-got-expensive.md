---
title: 'Why the queue got expensive'
category: 'data'
pubDate: 2026-08-14
description: 'A retry policy I wrote in ten minutes cost me four months of database bill before I read the graph properly.'
work: marlin
---

In late 2021, a few months after Marlin went live, I wrote its retry policy in about ten minutes. A job fails, wait one second, try again. Fails again, wait two seconds. Cap it at five attempts and drop it into a dead-letter table. It looked reasonable, it passed the tests I wrote for it, and I did not think about it again for four years.

The problem showed up slowly enough that I did not notice it as a problem. One of the downstream APIs Marlin called, a shipping rate lookup for a client project, started getting slower over the course of 2025. Not down, just slow: a call that used to take 200ms started taking two or three seconds under load. Nothing alerted on that, because nothing was failing outright.

## What the retry policy actually did

Here is the part I missed. A slow API does not just mean slow jobs. It means jobs pile up in the queue while they wait. More jobs in the queue means more concurrent workers picking them up. More concurrent workers hitting the same slow endpoint makes it slower still. And every job that timed out under that load went straight into my nice, sensible five-attempt retry policy, which multiplied the load again.

The arithmetic is short. If a fraction $p$ of attempts time out and a job gets up to five, the requests per job come to

$$
1 + p + p^2 + p^3 + p^4 = \frac{1 - p^5}{1 - p}
$$

At $p = 0.75$ that is about three requests for every job, and the extra requests push $p$ higher still.

### The graph I was not looking at

I did not see this because I was watching job success rate, which stayed fine. Jobs were still completing, just later and with more retries per job than they used to need. What I was not watching was total requests to that downstream API per hour, which by early 2026 had grown to roughly four times what the actual unique job volume justified. The retries were the majority of the traffic.

## Reading the graph properly

I found this by accident, going through the database bill in March 2026 and noticing the connection pool metrics for the queue's Postgres instance had crept up steadily for months. Not a spike, just a slow climb that a threshold alert would never have caught, because there was no single day where it jumped.

Once I graphed retry attempts as their own series, separate from job completions, the shape was obvious. It should have been the first graph I built, not the last. Job success rate tells you whether the system is working. It tells you almost nothing about whether the system is working efficiently, and a queue with a bad retry policy can hide a lot of waste behind a green dashboard.

## What I changed

I replaced the fixed backoff with one that respects a `Retry-After`-style hint when the API gives one, and added a circuit breaker that stops retrying a specific job type entirely once its failure rate crosses a threshold within a short window, instead of retrying each job individually forever. The whole of the new policy is about this long:

```ts
const delay = (attempt: number, retryAfter?: number) =>
  retryAfter ?? Math.min(2 ** attempt * 1000 + Math.random() * 400, 60_000);

// A breaker is per job type, not per job: one bad endpoint should stop
// the whole queue hammering it, not politely wait its turn job by job.
if (breaker.for(job.type).isOpen) return park(job);
```

The jitter in the first line matters more than the cap does.[^jitter] That one change cut request volume to that endpoint by about 70 percent within a week, with no measurable change in how many jobs eventually succeeded.

This is also part of why I ended up retiring Marlin a month later. Fixing the retry policy made me actually read through the rest of the system for the first time in years, and I realized most of what was left did not need a dedicated queue at all. The bill was the symptom. The real finding was that I had stopped looking at a system I trusted, and trust is not the same thing as it working correctly.[^bill]

[^jitter]: Without it, every worker that backed off at the same moment comes back at the same moment. The cap keeps a single job from waiting an hour; the jitter keeps four hundred of them from arriving together.

[^bill]: Roughly £340 a month at its worst, which is not a number that makes anyone open a dashboard. That is the trap: the waste was expensive enough to matter over four months and too cheap to notice in any single one.
