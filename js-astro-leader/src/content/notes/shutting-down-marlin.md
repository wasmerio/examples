---
title: 'What shutting down Marlin taught me about deleting code'
category: 'infra'
pubDate: 2026-04-15
description: 'Four years of a queue worker, replaced in an afternoon by nine lines of cron.'
work: marlin
---

Marlin ran for four and a half years, from September 2021 until last week, and I replaced it with a cron job and a database table in an afternoon. That ratio, four and a half years down to one afternoon, is not a story about Marlin being badly built. It is a story about how much of a system's size is really the size of the problem it no longer has.

When I wrote Marlin in 2021, I needed delayed jobs, retries with backoff, a dead-letter queue, and a small dashboard to see what was stuck. The queue library I had at the time supported none of that, so I built all of it. By this spring, after tracing the retry cost problem I wrote about last month, I actually counted what Marlin was doing day to day: about 400 jobs, most of them the same three job types, none of them needing to run within less than five minutes of being scheduled.

## The afternoon

Nine lines of cron, running every five minutes, reading a `pending_jobs` table and doing the work inline. No queue, no worker pool, no dashboard, because a `SELECT * FROM pending_jobs WHERE status = 'pending'` is its own dashboard if you already have a database client open. I moved the three job types over one at a time, checked the counts matched for two days, and then turned Marlin's worker process off.

## What made this hard, and it was hard

Not technically. The hard part was admitting that a system I had maintained for four and a half years, that I had genuinely been proud of at one point, was no longer earning its size. I kept finding reasons to delay: what if volume grows back, what if there's a job type I forgot about, what if the dashboard turns out to matter more than I think. All reasonable-sounding, all things I could check in under a day, and I let them sit unchecked for months because deleting a system I had built felt bigger than it actually was.

## The actual lesson

Code does not get more expensive to delete the longer you run it. It gets more expensive to decide to delete, because the sunk cost sits in your head, not in the codebase. The technical work of retiring Marlin took an afternoon. The decision to start that afternoon took most of a year. Next time I notice myself defending a system's existence with "well, it works," I want to ask the harder question first: does it still need to be this big to do what I actually need from it now.

I archived the repository rather than deleting it outright. If the job volume ever grows past what cron and a table can handle cleanly, the design is still there to look at. I do not expect to need it.
