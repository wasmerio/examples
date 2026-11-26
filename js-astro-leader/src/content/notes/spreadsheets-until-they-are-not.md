---
title: 'A spreadsheet is a database until it is not'
category: 'data'
pubDate: 2026-03-21
work: ledgerline
---

Ledgerline began as a spreadsheet with 40 tabs, one per vendor, and it stayed a spreadsheet for about eight months before the tab count and the formula errors made the switch to a real database the obviously cheaper option. I want to write down where that line actually was, because I got the timing wrong in both directions on other projects before I got it right here.

A spreadsheet is a fine database for a while. It has a query language, sort of, in the form of filters and pivot tables. It has a schema, sort of, in the form of column headers everyone agrees to respect until someone doesn't. It is version-controlled, sort of, if you count "Copy of invoices (3) FINAL.xlsx" as version control. For a single person tracking a few dozen vendors, all of that is genuinely enough, and building a database for it on day one would have been the more expensive mistake.

## Where it broke

Two things happened around tab 30. First, a formula in one tab referenced a cell in another tab that had shifted position after someone, me, inserted a row above it, and it silently returned a stale number for three weeks before I noticed the total looked wrong. A spreadsheet's biggest weakness is that it fails quietly; a broken reference does not throw an error, it just returns whatever is sitting in the cell it now happens to point at.

Second, I wanted to ask a question the tab structure could not answer without a lot of manual copying: total spend on hosting, across every vendor, for the last two quarters. The version I wanted was four lines:

```sql
select vendor, sum(amount)
from invoices
where category = 'hosting' and issued >= '2023-01-01'
group by vendor;
```

That question is trivial in SQL and genuinely painful across 40 disconnected tabs, because the tab-per-vendor structure that made data entry easy made cross-vendor questions hard, and cross-vendor questions were exactly the ones I actually cared about answering.

## The line, as best I can state it

A friend who has run finance for larger companies than mine put it to me this way, and I have not found a better version since:

> The spreadsheet is not the problem. The problem is the day you start keeping a second spreadsheet to explain the first one.

Stay in a spreadsheet as long as your questions are about one row or one tab at a time. Move to a database the moment your questions start being about relationships between rows, or between tabs, because that is the exact thing spreadsheets are structurally bad at and databases exist to do. I crossed that line in the spring of 2023 and spent a weekend that June moving the data into SQLite, which became the first real version of Ledgerline.

I do not think the eight months in a spreadsheet were wasted. They told me exactly what schema I needed before I built one, which is a much better position than guessing at a schema up front and rebuilding it twice.
