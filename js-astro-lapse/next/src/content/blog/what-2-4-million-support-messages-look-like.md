---
title: "What 2.4 million support messages look like once you sort them"
category: Data
date: 2026-09-12
readTime: "5 min read"
excerpt: "Six topics cover 71% of everything customers write. The seventh is the one nobody ever documented, and it is almost always the same one."
featured: true
cover: /assets/blog/what-2-4-million-support-messages-look-like.webp
coverAlt: "Fine ridges fanning out from a bright point, like light raking across a pleated surface"
author:
  name: "Anika Bose"
  role: "Data science, Lapse"
  avatar: /assets/blog/avatar-anika-bose.webp
  avatarAlt: "Portrait of Anika Bose"
---
Over twelve months we read 2.4 million inbound customer messages across 180 support inboxes. Not a survey, not a sample of what people say they get asked. The actual contents of the queue.

We expected the distribution to vary by industry. It does not.

A homeware retailer and a B2B software company differ by less than four points on their largest topic, and the order of the top six is identical in 163 of the 180 inboxes.

> **What we counted**
>
> Every inbound message, deduplicated to one per conversation. Automated bounces, spam and internal notes excluded. Topics were assigned by each team’s own taxonomy and then mapped onto a common set of thirty-four. No customer content left its tenant at any point — we aggregated counts and nothing else.

## The six that cover seven messages in ten

Between them, six topics account for just over seven messages in ten. None of them is difficult. All of them are answerable from a help centre article that most companies already have.

<figure class="figure">
<figcaption>
<p class="figure-title">Share of all inbound messages, by topic</p>
<p class="figure-subtitle">180 inboxes · 2,412,000 messages · Sep 2025 – Aug 2026</p>
</figcaption>
<div class="figure-rows">
<div class="figure-row" style="--bar: 100%"><p>Order status and tracking</p><p>24%</p><p>579k</p></div>
<div class="figure-row" style="--bar: 58.33%"><p>Returns and refunds</p><p>14%</p><p>338k</p></div>
<div class="figure-row" style="--bar: 45.83%"><p>Sizing, fit and specification</p><p>11%</p><p>265k</p></div>
<div class="figure-row" style="--bar: 37.5%"><p>Billing and invoices</p><p>9%</p><p>217k</p></div>
<div class="figure-row" style="--bar: 29.17%"><p>Delivery changes</p><p>7%</p><p>169k</p></div>
<div class="figure-row" style="--bar: 25%"><p>Damaged on arrival</p><p>6%</p><p>145k</p></div>
<div class="figure-row is-outline" style="--bar: 25%"><p>Pausing or changing something already bought</p><p>6%</p><p>145k</p></div>
</div>
<div class="figure-axis"><p>0%</p><p>12%</p><p>24%</p></div>
<p class="figure-caption">The first six are documented in almost every help centre we read. The seventh, drawn as an outline, is documented in 21 of 180.</p>
</figure>

Nothing in that list is a surprise to anyone who has worked a queue. That is the point worth sitting with: support volume is not unpredictable. It is the same six questions in a slightly different order, arriving at a rate you could forecast a quarter ahead.

We went looking for the seventeen inboxes that break the pattern, expecting to find an industry we had not accounted for. Every one of them turned out to have a structural reason instead: a product recall running through the period, a billing migration, a marketplace where buyers and sellers write to the same address. Take those months out and the order snaps back to the same six.

## The seventh, and why it is always missing

The remaining 29% is not exotic either. Nearly a quarter of it — six percent of all messages, one in every seventeen — is a single topic: changing or stopping something that is already in motion. Pausing a subscription mid-cycle. Changing a delivery address after dispatch. Downgrading before renewal. Cancelling one item out of an order of four.

Of the 180 help centres we read, 21 had an article about it.

This is not an oversight by careless companies. It is structural. Help centres get written at launch, by the people who built the product, and they describe how to begin: how to sign up, how to order, how to get started. Nobody is ever assigned the article about stopping. It is written later, if at all, and usually by whoever is annoyed enough to write it after answering the same message forty times.

You can watch it happen in the timestamps. Articles covering sign-up and first order are published in the opening fortnight of a help centre’s life, usually within days of each other. The article about cancelling, where it exists at all, arrives a median of fourteen months later — and in eleven cases we could line it up with a spike in contacts about exactly that, three weeks earlier. The documentation follows the complaint rather than anticipating it.

## What we did not find

We went in expecting seasonality to dominate, and it does not. Volume moves — November is not March — but the composition barely shifts. The share of order-status questions in an inbox varies by under two points between its busiest and quietest month. You get more of the same thing, not different things, which is the difference between a staffing problem and a design problem.

We also could not find the customer base that is genuinely unlike the others. Every team we have shown this to has offered a version of “ours are different”, and in the aggregate that claim survives in one place only: tone. The questions are the same questions. What changes is how much patience is attached to them, and that turns out to correlate with how long the last answer took rather than with anything about the industry.

If there is a finding here, it is that support volume is a great deal more legible than it feels at 9am on a Monday. It is not chaos arriving at random. It is six questions, a seventh nobody documented, and a tail made largely of conversations that were not finished properly the first time.

## The long tail is shorter than it looks

The last 23% is where teams assume the difficulty lives, and it is where the case for more headcount usually gets made. It is real work. It is not 23% of the effort.

Close to half of it is made up of messages that have already been answered once: a customer replying to confirm, to say thank you, or to ask the clarifying question the first reply should have pre-empted. Those are not new problems. They are the cost of an answer that was almost complete.

What is left after that — somewhere between eleven and fourteen percent of the queue depending on the inbox — is the part that genuinely needs a person. A judgement about an exception. A complaint that is really about something else. A decision with money or goodwill attached. That is the work worth protecting, and it is roughly one message in eight.

## What this means for a queue

An agent can only answer what has been written down. So the practical consequence is small and dull and effective:

1. Pull your last twelve months and count. Not what you think you get asked — what arrived.
2. Check the top six against your help centre. They are probably covered, and probably out of date.
3. Write the article about stopping. Pausing, cancelling, changing after the fact. One article, five hundred words.
4. Look at what is left. That is the part that actually needs a person, and it is a much smaller job than it looked on Monday morning.

Teams that do only step three see their automatic resolution rate move by six to nine points within a fortnight. It is the cheapest change available to a support team, and it has nothing to do with software.

None of this requires you to decide anything about automation. Counting what arrives, and writing down the answer to the question you keep being asked, is the work either way. It just happens to be the work that makes everything after it possible.
