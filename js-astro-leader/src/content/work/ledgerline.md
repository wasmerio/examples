---
title: 'Ledgerline'
category: 'data'
summary: 'Turns a folder of invoices into something you can actually query.'
status: 'live'
started: 2023-06-02
url: 'https://ledgerline.example.com'
order: 3
---

Ledgerline started as a script that read PDF invoices out of a Dropbox folder and dumped the totals into a spreadsheet. I wrote it for my own bookkeeping in an afternoon, then kept extending it until it needed a real database instead of a sheet with 40 tabs.

It exists because every invoicing tool I tried wanted to be the place you send invoices from, and I did not want that. I wanted the opposite: a place that watches a folder, extracts vendor, date, amount, and line items, and lets me ask questions like "how much did I spend on hosting in Q2" without opening twelve PDFs.

## How it works

Point it at a folder, and it parses what it can with a set of vendor-specific templates, falling back to a rougher generic parser for anything it does not recognize. You get a searchable table and a CSV export. There is no OCR for scanned paper invoices yet, only text-layer PDFs.

## What it does not do

It does not send invoices, chase late payments, or talk to your bank. I use a separate tool for actual accounting and Ledgerline just answers questions about spend. I turned down a request last year to add payment processing, because that is a different, much more regulated product, and not one I want to run.
