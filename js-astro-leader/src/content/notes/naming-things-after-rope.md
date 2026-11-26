---
title: 'Naming things after rope'
category: 'build-log'
pubDate: 2026-05-09
description: 'How I pick product names, and why the list is mostly sailing terms.'
---

Pennant, Tideline, Ledgerline, Cusp, Marlin, Quartile. Five of those six names are either sailing terms or close enough to one that people assume I sail, which I do not. I have been on a boat twice in my life. I use the list because it solves a real problem: naming a piece of software well, fast, without accidentally picking a word that means something embarrassing in another product's category.

## The actual rule

I keep a spreadsheet of nautical terms, about 200 of them, tagged by the shape of word they are: short and hard (Cusp, Marlin), soft and long (Tideline), or slightly technical-sounding (Ledgerline, which is not actually a sailing term, it slipped in from sheet music and nobody has noticed). When I need a name, I filter by the shape that fits the product's personality and pick the first one that is not already taken as a package name, domain, or trademark I can find in five minutes of searching.

Five minutes matters. I have spent entire afternoons in the past trying to find the perfect name and shipped nothing that day. A decent name chosen quickly beats a perfect name that costs me an afternoon, every time, because the name matters far less than people assume once the product actually exists and people start referring to it by what it does.

## What I'm naming this week

I'm about to start building a small tool that writes deploy notes automatically, pulling from the commits that shipped in a release. Working name: Halyard, the line that raises a sail. It fit the "short, slightly technical" bucket, it was not taken anywhere I checked, and it took me about four minutes to land on. I'll know in a month whether the name still fits once the thing has actual users, but that has been true of every name on the list, and so far none of them has needed to change.

The one rule I never break: no product ships with a placeholder name past its first week. A tool called "project3" for six months picks up a kind of inertia that is hard to undo later, and I would rather spend the four minutes up front.
