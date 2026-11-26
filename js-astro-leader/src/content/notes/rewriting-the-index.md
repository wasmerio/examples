---
title: 'Rewriting the index'
category: 'build-log'
pubDate: 2026-09-18
description: 'Work in progress.'
draft: true
---

Third attempt at the search index for Ledgerline and I'm still not happy with it. First version was a naive LIKE query against the vendor and line-item text, which was fine for a few hundred invoices and fell over somewhere past ten thousand. Second version pulled in a full-text search extension and got fast again, but the ranking was wrong in a way I couldn't quite name for two weeks.

I think the ranking problem is that invoice text doesn't behave like the prose these tools are tuned for. A vendor name shows up once, an amount shows up once, and the query terms people actually type are short and numeric, which full-text ranking treats as noise.

Notes so far, mostly for myself:

- exact matches on vendor name should outrank everything else, always
- dates need their own path, not the text index
- amounts probably need one too

Not ready to write more than that. Coming back to this once I've tried the vendor-name shortcut and seen whether it actually fixes what I think it fixes.
