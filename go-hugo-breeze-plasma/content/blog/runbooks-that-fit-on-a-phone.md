---
title: "On-call, part 2: runbooks that fit on a phone"
date: 2025-06-30
description: A runbook template with five sections, written for someone who has just been woken up.
tags: [reliability, on-call]
series: [On-call]
---


The [talk](/blog/sleeping-well-with-on-call/) promised a runbook template. Here it is.

## The five sections

1. **What this alert means**, in one sentence.
2. **How bad is it?** Who is affected, and how fast it gets worse.
3. **First three commands**, copy-pasteable.
4. **When to escalate**, and to whom.
5. **Links**: the dashboard, the service's repository, the last incident.

## Keep it short

If a runbook needs scrolling on a phone, split it. The person reading it at 3 a.m. will thank you.
