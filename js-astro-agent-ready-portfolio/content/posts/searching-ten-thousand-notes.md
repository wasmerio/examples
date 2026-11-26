---
title: Searching ten thousand notes in 27 ms
description: How a weekend tool for my own notes became notegrep, and what an inverted index buys you over grep.
published: 2025-08-19
tags: [cli, search, performance]
projects: [notegrep]
cover: /images/demo/blog/searching-ten-thousand-notes.jpg
---

I have kept notes in plain Markdown files since 2016. There are 10,412 of them now: meeting notes, snippets, half-finished posts. For years I searched them with grep. Then the folder got big enough that grep took two seconds, and two seconds is long enough to lose your train of thought.

This post is about the tool I wrote to fix that, and the one data structure that makes it fast.

## Why grep is slow here

Grep reads every byte of every file on every search. Ripgrep is much smarter about it: it skips ignored files, uses SIMD and runs in parallel. On my notes it takes 410 ms, which is impressive. But it still reads everything, every time.

The trick search engines use is to read everything once and remember where each word is.

## The inverted index

An inverted index maps each word to the notes that contain it:

```txt
postgres  → 112, 431, 2048, 7730, …
vacuum    → 431, 7730, 9120
autovac   → 7730
```

To find notes with "postgres vacuum", look up both lists and take the notes that appear in both. You never touch a file that does not contain the words. With sorted lists, the intersection is a single walk through each.

## Ranking

Matching is only half of it. When 30 notes match, the best one should be first. notegrep uses BM25, the usual ranking formula. It scores a note higher when a query word appears often in that note and rarely in other notes, and it scales the score down for long notes so they do not win just by being long.

Two small additions made the ranking feel right for notes:

- **Titles count three times.** A note called "Postgres vacuum" is almost always the one you want.
- **Recent notes get a small boost.** A note from last month beats an identical one from 2017.

![Terminal running notegrep "postgres vacuum": four ranked hits with highlighted matches, then index stats](/images/demo/projects/notegrep.webp "Four ranked results in 27 ms, then the index stats.")

## Keeping the index fresh

An index is only useful if it is current. notegrep stores the size and modified time of each file, and on every search it checks whether anything changed. Changed files are re-read and their entries replaced. With a few edits a day, this takes a couple of milliseconds, so there is no daemon and no watch process.

## The numbers

![Horizontal bar chart: grep 1,940 ms, ripgrep 410 ms, notegrep with a cold index 160 ms, notegrep 27 ms](/images/demo/blog/search-benchmark.webp "One query over 10,412 notes, median of 50 runs.")

The whole index is 9 MB on disk and builds from scratch in 4 seconds. A cold search, where the index is read from disk for the first time, takes 160 ms. After that it takes 27 ms.

```sh
npx notegrep "postgres vacuum" --top 4
```

27 ms is fast enough that search feels like it is not there. That was the whole goal.
