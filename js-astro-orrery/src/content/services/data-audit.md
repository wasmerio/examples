---
title: Data audit
tags: inventory, cross-system joins, one clean customer table
summary: We list every source your reports depend on, test how well they agree, and fix the joins that break most often.
art: grid
order: 1
priceFrom: "$6,500"
duration: 3 weeks
deliverables:
  - A map of every data source, its owner and its refresh time
  - Row-level checks that run every night
  - One customer table that matches sales, billing and support
  - A written list of what we could not fix, and why
---

Most reporting problems start upstream. The CRM counts a customer once per contact, billing counts one per invoice address, and the two never agree on how many customers you have. We find those mismatches before anyone builds a forecast on top of them.

## What we check

- Duplicates and orphaned records
- Fields that changed meaning over time, like a "region" that was a state until 2021 and a sales territory after
- Gaps: days, stores or products with no rows at all
- Refresh times: which report is a day old and which is a week old

## What you keep

The checks are plain SQL that runs in your warehouse every night. When one fails, it emails the owner of that source, not us.
