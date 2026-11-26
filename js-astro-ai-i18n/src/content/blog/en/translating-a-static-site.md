---
title: Translating a static site without a CMS
description: A translation is a file next to the original. Everything else follows from that one decision.
date: 2026-03-04
glyph: arc
---

The first multilingual site we built used a translation platform. Copy lived in a
web interface, the site pulled it at build time, and every question about what had
changed required someone to log in and look.

The second one used files. `en/pricing.md` and `fr/pricing.md`, side by side in
the repository, and nothing else. It has been easier in every way that matters,
and the reasons are not the ones we expected.

## Diffs

A translation stored in a database has no history you can read. A translation
stored in a file has the same history as the code: who changed it, when, and what
the sentence said before. Reviewing a translation becomes reviewing a pull
request, which is a thing the team already knows how to do.

## The path is the key

`fr/pricing.md` is the French `pricing.md` because the paths match, and for no
other reason. There is no mapping table.

That rule is worth defending, because the temptation to break it is real. A
localized slug reads better and does marginally better in search. The cost is that
"which page is this a translation of" stops being a string operation and becomes a
table, which the language picker, the freshness check and the sitemap all read.
Every one of them is then one stale row away from being wrong.

## Staleness is the whole problem

Translating a page once is easy. Knowing that the English changed three weeks ago
and the German did not is the part that needs a machine.

We store the hash of the English text each translation was made from. The
translation is out of date when the hash no longer matches. It is a small file and
a small idea, and it is the difference between a site that is multilingual and a
site that was multilingual once.
