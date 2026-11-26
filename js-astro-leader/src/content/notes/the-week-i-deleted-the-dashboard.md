---
title: 'The week I deleted the dashboard'
category: 'data'
pubDate: 2026-01-30
description: 'A client asked for charts and got a Friday email instead.'
work: quartile
---

A client asked me for a sales dashboard in the spring of 2022, and what I eventually built and kept running for four years was an email. This is the story of how the request for charts turned into a weekly message with five numbers in it, and why that turned out to be the right call even though it is not what anyone asked for.

The original brief was standard enough: charts for revenue, units, top products, week over week, something the client could check whenever they wanted. I built it, a reasonably nice one, with filters and a date range picker and a little bar chart that animated in. I sent the link over, they said it looked great, and then I watched the analytics on that dashboard for the next six weeks. Total visits: four. Three of those were me, checking whether it was working.

## The actual conversation

I asked the client directly why they were not using it, expecting some UI complaint I could fix. Instead they told me, almost apologetically, that they never remembered to check it, and that by the time something reminded them to look, the moment when the number would have been useful had usually passed. They did not need a place to go look. They needed the number to come to them, on a schedule they were already keeping.

So I deleted the dashboard, in the literal sense of taking the page down, and replaced it with a script that ran every Monday morning and emailed five lines: units sold, revenue, the four best-selling products, and a one-line comparison to the previous week. That became Quartile. The whole product was one message, and it looked like this:

| Week of  | Units | Revenue | Best seller     | vs. prior week |
| -------- | ----- | ------- | --------------- | -------------- |
| 14 March | 312   | £4,180  | Oat flour, 1kg  | +6%            |
| 7 March  | 294   | £3,940  | Rye starter kit | −2%            |

No login, nothing to click, nothing to remember. It arrived in an inbox they were already opening on Monday morning.

## What surprised me

They read every single one, for four years, by their own account. I have no analytics to confirm that the way I had analytics for the dashboard, and I think that absence is part of the point. An email does not need a "have you checked this lately" metric, because checking it is not optional, it just arrives. The dashboard's problem was never the charts. It was that it asked the client to remember to go somewhere, and remembering was the one thing that was never going to happen reliably on a Monday morning in the middle of running a shop.

Quartile shut down this year when the client's shop closed, and I have thought since about how many "dashboard" requests are actually, underneath the ask, a request for something to just show up. I try to ask that question earlier now, before I build the version with the charts.
