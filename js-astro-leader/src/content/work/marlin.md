---
title: 'Marlin'
category: 'infra'
summary: 'A queue worker I ran for four years and finally handed over to a cron job.'
status: 'archived'
started: 2021-09-08
repo: 'https://git.example.com/ada/marlin'
---

Marlin was a job queue with retries, dead-letter handling, and a small dashboard, built because the queue library I was using at the time did not support delayed jobs and I needed one feature badly enough to write an entire system around it.

It ran in production for four years, underneath Ledgerline's PDF parsing and a couple of client projects that are no longer live. It processed a few million jobs total, and for most of that time it did its job well enough that I stopped thinking about it, which is the best thing a queue can do.

## Why it stopped

The retry policy I wrote in the first month turned out to be expensive in a way I did not notice until 2026, when a slow downstream API turned a small failure rate into a very large one. By the time I traced it, the fix was simple, but the incident made me look hard at whether I still needed a standalone queue at all. I did not. The actual job volume by then fit comfortably in a cron task running every five minutes.

## What replaced it

Nine lines of cron and a database table. I shut Marlin down in April 2026 and kept the code archived rather than deleted, in case the volume ever grows back into needing it. So far it has not.
