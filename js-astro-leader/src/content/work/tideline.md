---
title: 'Tideline'
category: 'infra'
summary: 'Scheduled backups for people who never check whether they ran.'
status: 'building'
started: 2026-01-20
repo: 'https://git.example.com/ada/tideline'
order: 2
---

Tideline runs a backup job on a schedule and, more importantly, tells you when it did not run. That second part is the whole reason it exists. I have lost data twice in my life to a cron job that silently stopped firing after a server migration, and both times I found out months later, when I needed the backup.

The design is small on purpose: a job definition, a destination (S3-compatible storage, so far), and a check-in. If the check-in does not happen inside the expected window, you get an email. If a restore has never been tested, the dashboard says so in plain text instead of a green checkmark.

## Where it is now

I am running it against my own projects — Pennant's config store and Ledgerline's SQLite file — but I have not shipped a UI for adding a new backup target yet. Right now that happens in a YAML file, by hand, over SSH, which is fine for me and not fine for anyone else yet.

## What it is not

Not a general-purpose backup tool for laptops or phones. Not encrypted at rest by default, though the storage backends I use are. I am building this to solve my own problem first: knowing, without checking, that last night's backup actually happened.
