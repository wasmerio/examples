---
title: "The case for boring infrastructure"
date: 2025-09-18
author: "Ruben Dias"
description: "Choosing technology your client can still hire for in five years is an engineering decision, not a conservative instinct."
summary: "Choosing technology a client can still hire for in five years is an engineering decision, not timidity."
image: images/blog-signals.jpg
imageAlt: "Network switch with status lights"
categories: ["Engineering"]
tags: ["architecture", "handover"]
---


We have taken over four platforms in the last three years where the original team
chose something novel. In each case the novelty was not the problem. The problem was
that nobody local could be hired to maintain it.

## The question we ask

Not "is this good technology?" but "can our client hire two people who know this in
eighteen months, in their city, at their salary band?" For PostgreSQL, Go,
TypeScript and Docker in most European markets, the answer is yes. For a great deal
of otherwise excellent software, it is no.

This is not an argument against new tools. It is an argument that the hiring market
is part of the architecture.

## What boring buys

Predictable upgrade paths. Documentation written by thousands of people rather than
four. Failure modes somebody has already written about. And the freedom to leave:
a client who can hire elsewhere is a client who stays with us by choice.

## Where we do take risk

At the edges, where a mistake is cheap to reverse. A build tool, an image pipeline,
a deployment target. Not in the data layer, not in authentication, and not in
anything that would require a rewrite to undo.

The core should be dull. That is where the client's money lives.

