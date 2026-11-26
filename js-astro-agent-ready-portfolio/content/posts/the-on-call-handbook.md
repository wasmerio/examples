---
title: The on-call handbook we actually read
description: A twelve-page handbook, an alert review every Friday, and how platform pages went from 31 a week to 9.
published: 2026-01-27
tags: [on-call, teams, writing]
cover: /images/demo/blog/the-on-call-handbook.jpg
---

Last spring the platform on-call rotation was paged 31 times in a typical week, several of them at night. People traded shifts to avoid it. Twelve weeks later it was 9 a week, and nights were quiet most weeks. No new tools were involved. We wrote a short handbook and started deleting alerts.

![Bar chart of pages per week over twelve weeks, falling from 31 to 9 after the handbook and alert review started in week 5](/images/demo/blog/pages-per-week.webp "Pages per week. The handbook and the Friday alert review started in week 5.")

## The old runbooks

We had runbooks. They were in a wiki, written by whoever set up each alert, and most of them said "check the dashboard and escalate if needed". At 3am that tells you nothing.

The problem was not missing documentation. It was documentation written for the person who already knew the answer.

## One page per alert

The handbook has a page for every alert that can page someone, and every page has the same four parts:

1. **What it means.** One sentence, in words a new hire understands.
2. **Is it urgent?** What users are seeing right now, if anything.
3. **First three steps.** Commands you can paste, in order.
4. **When to wake someone.** A name and a condition, not "if needed".

```md title="handbook/disk-pressure.md"
## Disk pressure on build nodes

**Means:** a build node is above 90% disk. New builds may fail.
**Urgent?** Only if the build queue is growing. Check the queue panel first.

1. `kubectl get nodes -l role=build` and find the node.
2. `shipline nodes drain <node> --prune-images`
3. Watch the queue for five minutes.

**Wake someone:** the build-infra lead, if two or more nodes are above 90% at once.
```

If we could not fill in all four parts, the alert should not page anyone. That rule did most of the work.

## The Friday review

Every Friday, the person coming off call spends thirty minutes going through every page from their week with one other engineer. Each alert gets one of three outcomes:

- **Keep.** It was real and the page helped.
- **Fix.** It was real, but the handbook page was wrong or missing. Fix it now.
- **Delete or downgrade.** Nobody needed to wake up. Make it a ticket, or remove it.

In the first four weeks we deleted 19 alerts and moved 11 to daytime tickets. Some people worried that deleting alerts would hide real problems. Nothing has slipped through so far, and the alerts that are left now get taken seriously.

## Why people read it

The handbook is twelve pages long and lives in the repo next to the code, so changing an alert and its page happens in the same pull request. The old wiki had over a hundred pages, and nobody had read them all, including the people who wrote them.

The best feedback came from a new engineer after their first shift: "I got paged twice and didn't have to ask anyone anything." That is the whole goal of a handbook.
