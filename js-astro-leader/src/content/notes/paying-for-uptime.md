---
title: 'Paying for uptime, a guest note'
category: 'infra'
pubDate: 2025-12-12
description: 'A guest note on what an on-call rotation costs before anyone pages you.'
author: 'Ruth Okwuosa'
---

Ada asked me to write something for this site after I complained to her, at some length, about on-call scheduling software. I run infrastructure for a team of about thirty engineers, which is a different shape of problem than the one-person shops she usually writes about here, but the underlying math turns out to be the same: uptime has a cost, and most of that cost gets paid before a single page ever fires.

We run a six-person rotation, one week on at a time. The visible cost is easy to name: the person on call carries a phone that can go off at 3am. The cost nobody puts on a slide is what that carrying does the other six days a week, to the other five people, who are not on call and know it, and who make different decisions because of it. Fewer risky deploys on a Friday. More Slack messages that start with "just flagging" instead of just fixing it. A quiet tax on judgment that never shows up in an incident report because it prevented the incident in the first place.

## What we actually measured

Last quarter I tracked two things I had never bothered tracking before: pages per on-call week, and, separately, how many of those pages needed a human at all versus resolving themselves or waiting until morning without harm. Out of 94 pages across the quarter, 31 fell into the second category. Almost a third of the cost of carrying that phone was paying for alerts that did not need a person awake to receive them.

That number changed how I think about alerting thresholds. I had been treating "did we get paged too much" as a training problem, something to fix by teaching people to write better runbooks. It was mostly a thresholds problem. A third of our pages existed because a check was more sensitive than the thing it was checking actually required.

## The two changes that mattered

We widened the failure window before a check pages a human, from one failed check to three consecutive ones, five minutes apart. That alone cut the false-urgency pages by more than half, because transient blips that resolved on their own stopped waking anyone up to watch them resolve. And we split alerts into two tiers explicitly: page-now and can-wait-until-morning, instead of letting severity be an implicit judgment call made at 3am by whoever is least equipped to make it at that hour.

Neither change reduced our actual incident count. What it reduced was the number of times a person got pulled out of sleep for something that did not need a person pulled out of sleep. I think that distinction, between preventing incidents and preventing unnecessary pages, gets collapsed together more often than it should, and the second one is usually the cheaper problem to fix.

## Why I'm writing this here

Ada's tools are built for a team of one, where the calculus is different, there is no rotation to spread the cost across. But the question underneath is the same one I'd ask any team of any size: how much of what pages you actually needed a human, and how much of it was a threshold that was set once, early, and never revisited. For us it was a third. I would guess most teams have not measured their own number, and I would gently suggest that measuring it is cheaper than it sounds.
