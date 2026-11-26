---
title: What shipping in four languages taught us
description: Six months, four locales, and the three mistakes that cost us the most time.
date: 2026-05-12
glyph: stack
---

We shipped our first properly multilingual product last spring: four languages,
one build, one repository. Here is what went wrong, in the order it hurt.

## Links inside a translated page

This is the defect nothing catches. The page renders, the link works, and it is
simply in the wrong language. A French reader clicks a link mid-sentence and lands
on an English page, at the top, having lost their place.

The fix belongs in the build rather than in the content: when a link points at a
page that exists in this language, rewrite it; when it does not, leave it alone.
Rewriting the files themselves would have to be redone after every translation.

## Layout assumes English

German is longer. Not occasionally: reliably, by something like a third. Every
button we had sized to its English label broke, and the breakage looked like a
design problem rather than a translation one, so it was reported by the wrong
people to the wrong channel for a week.

Now the rule is that nothing is sized to its content. It costs nothing in English
and saves a day per language.

## Page titles are measured in characters

A search result truncates at roughly sixty-seven characters. A translated title
that reads perfectly at ninety characters is a title nobody sees the end of. We
had to say this explicitly in the instructions we give the translator, because
faithfulness and fitting are different goals and only one of them is visible in
the file.

## What went right

One decision saved more time than the three mistakes above cost: every language
answers for every page, whether or not it has been translated. Nobody ever meets a
404 because a translation is a week behind, and no URL we published has ever had
to move.
