---
title: 'Ranking rewrite: working notes'
description: 'Early notes on a ranking change in progress: what is wrong with the current approach, and what we are trying instead.'
pubDate: 2026-09-16
tags: ['engineering', 'ranking']
author: 'Ada Example'
draft: true
---

These are working notes on a change to Quarry's ranking that has not shipped yet, written while it is still in progress. Nothing here is final, and none of it is available in a release. Treat it as a look at the reasoning rather than an announcement.

## The current problem

Quarry's ranking weighs term frequency, field position, such as a match in a filename versus a match in the body, and recency of the matched file. That has worked reasonably well, but it has a known weak spot: a short file where the query term is nearly the whole content ranks below a long file where the term appears many times, even when the short file is the better answer. Frequency alone rewards length in a way that does not match what people are actually looking for.

## What we are trying

The change under test normalizes term frequency against document length before it factors into the score, so a term making up a large share of a short document counts for more than the same raw frequency spread across a long one. This is a well-known idea in text ranking generally; the work here is tuning the normalization so it behaves well specifically on the kind of files Quarry tends to index, notes and code, which have different length distributions than, say, web pages.

## Where it stands

Early testing against a fixed set of query and expected-result pairs shows an improvement on short-file cases without a clear regression on long-file cases, which is the result we were hoping for going in. What is not yet settled is the exact normalization constant. Too aggressive, and long files with genuinely strong matches start losing to short files with weak ones. Too conservative, and the original problem barely moves.

We are also watching for a side effect on code search specifically, since source files are often short by nature, a function in its own file, for example, and we do not want every small file to jump the queue purely for being small. The normalization needs to account for typical length by content type, not apply one constant everywhere.

## Why write this down now

None of this is finished, so it might seem early to post about it. We are doing it anyway because ranking changes are the kind of thing people notice without being told why, and we would rather explain the reasoning while it is still being worked out than present a finished change with no context. If the normalization approach does not pan out in wider testing, that will get a follow-up post too, since a negative result here is still useful for anyone thinking about the same tradeoff in their own ranking work.

## What is next

The next step is running this against a wider set of real indexes, not just the fixed test set, and checking whether the ranking people actually notice matches the ranking the test set predicts. If that holds up, this becomes a candidate for a future release, noted in the release notes like any other ranking change, with the usual explanation of what changed and why.
