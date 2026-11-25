---
title: "What a wrong answer costs over ninety days, not the apology"
category: Data
date: 2026-06-27
readTime: "4 min read"
excerpt: "The apology is the cheap part. Ninety days on you are still paying for it in repeat contacts nobody traces back to that Tuesday."
featured: false
cover: /assets/blog/what-a-wrong-answer-costs.webp
coverAlt: "A diagonal ridge of tightly stacked fine lines, lit along its edge against black"
author:
  name: "Tobi Adeyemi"
  role: "Evaluation, Lapse"
  avatar: /assets/blog/avatar-tobi-adeyemi.webp
  avatarAlt: "Portrait of Tobi Adeyemi"
---
A wrong answer feels like a single event. You spot it, you apologise, you correct it, you move on. Quality review records one defect and the week continues.

The cost of it is not in that Tuesday.

## What we measured

We followed conversations containing a confirmed wrong answer for ninety days, and compared them with conversations resolved correctly first time in the same inboxes over the same period.

The conversations with a wrong answer in them generated an average of 2.4 further contacts from the same customer. The clean ones generated 0.3. That gap is not the correction itself — the correction is usually inside the original thread and we counted it there. It is everything the customer did afterwards.

> **How the sample was built**
>
> Wrong answers were identified by the teams themselves during ordinary quality review, not by us, and only where the reviewer marked the reply as factually incorrect rather than merely unhelpful. Follow-up contacts were matched by customer across every channel the team runs, including the ones the original conversation did not use.

Roughly a third of those follow-ups never mention the original mistake at all. They read as ordinary new questions — a customer checking something they could have checked themselves, asking for confirmation of a thing they have already been told, or writing in about a step they would previously have completed alone.

## The part that does not show up in a review

That third is the expensive part, and it is invisible to every measurement most teams have. The ticket was closed. The apology was accepted. CSAT on the corrected conversation often recovers completely. The behaviour changes anyway.

What you are paying for is a customer who has stopped extending the benefit of the doubt. They verify. They ask twice. They escalate earlier. Each of those is a small, reasonable act, and in aggregate they are indistinguishable from a busier month — which is exactly how they get budgeted for.

We have watched teams respond to that pattern by hiring, which is a rational response to the numbers they can see and the wrong response to the numbers they cannot.

## It is not evenly distributed

The 2.4 figure is an average, and averages are doing a lot of work here. The distribution has two clear humps.

Most wrong answers cost almost nothing: the customer notices immediately, replies in the same thread, and the correction lands before anything has been acted on. Those conversations look barely different from clean ones at ninety days, and they make up around two thirds of the sample.

The remainder are the ones where the customer acted on the answer before finding out it was wrong. Returned an item they did not need to return. Waited for a delivery that was never coming. Chose not to cancel because they were told they could do it later. Those conversations average above six further contacts, and a noticeable share of them end up somewhere that costs real money — a chargeback, a public review, a churn event the retention team logs under an unrelated reason.

Which suggests the useful question is not how often the agent is wrong. It is how long a wrong answer can survive before somebody notices.

## Why traceability changes the arithmetic

The single biggest difference between inboxes in this data is not accuracy. It is whether a wrong answer can be traced to a source.

When every reply carries the article it was written from, a wrong answer is a documentation bug. You open the article, you find the sentence, you fix it, and every future reply drawn from it is fixed at the same time. The investigation takes minutes and it ends with a change.

When it cannot be traced, the same wrong answer becomes a meeting. People argue about whether it was the model, the prompt, the agent who signed it or a policy nobody had circulated. Nothing gets fixed, because nothing specific has been identified, and the same answer goes out again the following week.

## Refusal is cheaper than accuracy

The other difference is what happens when the source does not exist.

An agent that answers anyway will be right most of the time, and the times it is not are drawn disproportionately from the topics your documentation is thinnest on — which are also the topics where customers are least able to catch the error themselves. That is the worst possible distribution of mistakes.

An agent that declines, hands over and says why produces a slower answer and no ninety-day tail. Measured over a quarter, the slower answer wins comfortably. It is not a close call, and it is the reason we would rather ship a lower automatic resolution rate than a higher one bought on guesses.

## What to do with this

1. Pick twenty wrong answers from your last quarter. Twenty is enough; this does not need to be a project.
2. Count every contact from those customers in the ninety days after, across all channels, whether or not it mentions the mistake.
3. Ask, for each one, whether you could name the source the answer came from. Write down the proportion where you could not.
4. Fix that proportion before you touch anything else. It is the number that decides what every future mistake costs you.

The apology is the cheap part, and teams are good at it. Ninety days on you are still paying for the answer itself, in repeat contacts that nobody traces back to that Tuesday, and in a customer who now reads everything you send with one eye half-closed.
