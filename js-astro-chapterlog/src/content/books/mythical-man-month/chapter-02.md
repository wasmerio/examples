---
sections:
  - "2.1 Optimism"
  - "2.2 Brooks's Law"
  - "2.3 The Mythical Man-Month"
---

## Optimism

All programmers are optimists. **"This time it will surely run."** We chronically underestimate how long things will take because we assume each task will go smoothly. But bugs, integration problems, and unexpected complexity always appear.

Estimating in ideal days ignores the reality of interruptions, meetings, debugging, and communication overhead. The gap between estimated and actual time is one of software's most persistent problems.

## Brooks's Law

> Adding manpower to a late software project makes it later.

New people need to be trained. They slow down the people who train them. And the communication overhead grows **quadratically** — with *n* people, there are *n(n-1)/2* communication channels. Doubling the team doesn't halve the schedule; it makes things worse.

The only exception: tasks that are truly partitionable with no inter-dependencies. These are rare in software.

## The Mythical Man-Month

The **man-month** as a unit of measurement implies that people and time are interchangeable. They aren't. A task that takes one person twelve months does not take twelve people one month. Sequential constraints, communication costs, and ramp-up time make the math fall apart.

Managers who treat man-months as fungible units end up in a death spiral: the project is late, so they add people, which makes it later, so they add more people.
