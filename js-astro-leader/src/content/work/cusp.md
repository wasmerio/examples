---
title: 'Cusp'
category: 'tooling'
summary: 'Staging URLs that expire on their own.'
status: 'live'
started: 2025-02-14
url: 'https://cusp.example.com'
repo: 'https://git.example.com/ada/cusp'
order: 4
---

Cusp creates a preview deployment for a branch and deletes it after a set number of days of inactivity. I built it after finding 26 forgotten preview URLs still running against a database on a project I had not touched since March, quietly costing money and quietly out of date.

The idea is small: a webhook fires on push, Cusp builds and deploys the branch, and posts a link back to the pull request. If nobody visits that link for the number of days you configured (three, by default), it tears the deployment down. Visiting it resets the clock.

## What it handles

Static sites and anything that ships as a single container image. It does not manage databases, so a preview that needs its own data has to seed itself on boot, which is more work up front but means I never have fifteen environments sharing one staging database and stepping on each other's test data.

## What it does not do

No custom domains per branch, no built-in password protection, though you can put it behind an access proxy if you need that. I thought about adding review-app style commenting directly on the preview page and decided against it. That is what the pull request is for.
