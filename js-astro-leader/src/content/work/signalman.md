---
title: 'Signalman'
category: 'infra'
summary: 'Uptime checks that wake you once, not eleven times.'
status: 'building'
started: 2026-09-01
draft: true
---

Signalman is an uptime checker with one job: send exactly one alert per incident, not one per failed check. Every uptime tool I have used pages me every five minutes until the thing comes back up, which means the worst night of an outage is also the night I get the least sleep over the same root cause.

The rule is simple to state and was not simple to get right: on the first failed check, alert. On every check after that, while the incident is still open, stay quiet unless the failure mode changes, for example if a timeout turns into a 500. When it recovers, send one more message and close the incident.

## Where it stands

I have the check runner and the incident state machine working against my own three services. What is missing is the notification layer beyond a basic webhook, and I have not decided yet whether to build SMS in myself or sit behind an existing provider for that part. Given how small the rest of Signalman is, adding a whole telephony integration for one feature is exactly the kind of thing I want to think about twice before doing.

Not open for anyone else to run yet. This page exists mostly so I have somewhere to point people who ask what I am building next.
