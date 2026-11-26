---
title: Ship the static site first
description: Before the database, the dashboard and the login screen, find out whether plain files will do.
date: 2026-11-10
tags: [Plain HTML, Process]
---

A client once came to me with a plan for a bakery website. The plan had a content management system, a customer login, an ordering flow and a database. What the bakery needed, it turned out, was its opening hours, a menu, a map and a way for people to ask about wedding cakes.

We shipped five HTML pages in a week. Two years later it is still five pages, and it has never been down.

## What static buys you

A static site is a folder of files. There is nothing to patch at midnight, nothing to log in to, and nothing that slows down when the local paper links to you. Hosting costs little or nothing. Moving to another host means copying the folder.

It is also fast in the way that matters, which is fast on a mid-range phone with two bars of signal outside the shop.

## The usual objection

"But I need a form." This is the point where many small projects reach for a server, and then for everything a server drags in behind it. You do not need one. A form can post to a service that receives the submission, filters the spam and emails it to you. The page stays a file.

The same goes for most things that look like they need a back end: search, comments, payments, bookings. Somebody runs each of those as a service you can link to or embed. Borrow theirs until you have a real reason to build your own.

## When to stop

Static is a starting point, not a creed. When you find yourself editing the same fact in nine files, add a build step. When customers truly need accounts, add a server. You will know the moment, because the pain will be specific.

Until then, ship the folder.
