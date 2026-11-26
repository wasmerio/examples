---
title: 'Halyard'
category: 'tooling'
summary: 'Deploy notes, written by the deploy.'
status: 'live'
started: 2026-05-30
url: 'https://halyard.example.com'
---

Halyard writes the changelog entry for you, at deploy time, out of the commits that actually shipped. I got tired of writing release notes from memory an hour after the deploy, when I had already forgotten which of the six commits fixed the thing a user complained about.

It hooks into your deploy step, reads the commits between the last deployed ref and this one, groups them by the conventional-commit prefix if you use one, and posts a plain entry to a page and, if you want, to a webhook. No AI summarization, no rewriting your commit messages into marketing copy. It shows what happened, in the words you already wrote when you committed it.

## Why it is this small

I tried a version that used a model to rewrite commit messages into friendlier prose and deleted it after a week. It smoothed over the exact detail I needed, like which environment variable changed, and the entries all started to sound the same. A raw list ordered by time and grouped by prefix does the job better.

## Not included

No rollback button, no deploy orchestration. Halyard only writes down what a deploy already did elsewhere. If your deploy step fails before it runs, there is simply no entry for that day, and that has been the correct behavior every time it has happened to me.
