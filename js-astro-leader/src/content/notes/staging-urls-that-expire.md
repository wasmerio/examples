---
title: 'Staging URLs that expire'
category: 'tooling'
pubDate: 2026-01-09
description: 'Twenty-six forgotten preview deployments, and the cleanup that finally stuck.'
work: cusp
---

I counted them on a Tuesday afternoon last year: 26 preview deployments still running across four repositories, most of them from branches that had been merged or abandoned months earlier. A few were still connected to a shared staging database, quietly holding onto rows I needed for something else. None of it was expensive on its own. Added up, it was a small, steady bill for infrastructure nobody was looking at.

I had tried to clean this up before with a monthly reminder on my calendar: go look at what's running, delete what's stale. It worked exactly twice. The problem was not that the task was hard, it was that "go look" requires remembering to look, and remembering is the thing that fails first when you are busy with the actual work.

## What actually stuck

Cusp does not ask me to remember anything. A preview deploys on push, and if nobody visits its URL for three days, it tears itself down automatically. Visiting the link resets the clock, so an active review keeps its preview alive without me doing anything, and an abandoned one disappears on a schedule I never have to think about.

The first month running it, it deleted nine previews I had genuinely forgotten existed. I have not manually cleaned up a stale preview since, because there is nothing left to accumulate. The fix was not a better reminder. It was removing the need for one.
