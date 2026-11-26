---
title: One pipeline, forty services
description: What it took to move every team at Northwind onto one deploy path, and why the first deploy mattered more than any feature.
published: 2026-10-21
tags: [platform, devtools]
projects: [shipline]
cover: /images/demo/blog/one-pipeline-forty-services.jpg
---

At the start of 2025, Northwind had three ways to ship code. A bash script that only two people understood, a Jenkins job with forty parameters, and "ask Priya". By the end of the year, 42 services deployed through one pipeline: build, test, canary, promote. Nobody was told to move. This is what I think made the difference.

> [!TLDR]
> Make the first deploy take ten minutes. Copy the old scripts' good ideas. Publish the numbers every week, and let teams move when they are ready.

## Start with the boring path

The first version did less than any of the scripts it replaced. It built a container, ran the test suite, rolled it out to 5% of traffic, waited, and promoted. No custom steps, no plugins, no YAML anchors. One team, the search team, used it for a month while we fixed what they hit.

That month mattered more than any feature. Every rough edge they found was one the next forty teams did not. By the time a second team asked, the answer to "how do I start?" was a single command:

```sh
npx shipline init --service billing-events
```

It writes a `shipline.yaml` with the defaults, opens a pull request, and the first deploy runs when it merges.

## Steal from the scripts you replace

The old scripts were ugly, but each one encoded a lesson. The bash script refused to deploy on Friday after 4pm. The Jenkins job posted to the team channel with the diff. "Ask Priya" checked the error budget before rolling out.

All three made it into the pipeline as defaults. Teams that moved over did not lose anything they relied on, so the argument for staying shrank to "we are used to it". Habit is a real reason, so we did not fight it. We waited.

![A shipline run: four stages, the canary comparing v42 against v41](/images/demo/projects/shipline.webp "A run in progress. The canary stage compares the new version's error rate with the old one before promoting.")

## Make the numbers public

Every Monday a bot posted three numbers for every team: deploys last week, median time from merge to production, and rollbacks. Teams on the pipeline sat at about 12 minutes. Teams on the old scripts sat at hours or days.

We never wrote a mandate. The chart did the persuading.

![Bar chart of services on the shared pipeline by month in 2025, rising from 1 in January to 42 in December](/images/demo/blog/pipeline-adoption.webp "Adoption by month in 2025. The service template in June made moving a single pull request.")

The jump in the middle of the year is the service template. Before it, moving meant editing your Dockerfile, your health checks and your alerts. After it, a new service started on the pipeline, and an old one moved in one pull request.

## What I would do differently

- **Ship rollbacks before canaries.** We had the canary first, and the first bad deploy it caught still took eight minutes to roll back by hand.
- **Write the migration guide for the ugliest service first.** The easy services moved on their own. The guide only mattered for the hard ones.
- **Count the people, not the services.** Forty services is a nice number. The number I watch now is how many engineers deployed something this month without asking anyone.

## Where it is now

The pipeline runs a few hundred deploys a week. An earlier post covers the part people ask about most: [how the canary works without a service mesh](/blog/canary-deploys-without-a-mesh).
