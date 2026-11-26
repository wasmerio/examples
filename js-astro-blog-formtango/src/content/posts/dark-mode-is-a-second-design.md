---
title: Dark mode is a second design
description: Inverting the colors is where most dark themes start and where they should not end.
date: 2026-11-17
tags: [CSS, Design]
---

The quick way to make a dark theme is to swap the background and text colors and call it done. The result is usually readable and usually a little wrong: white text that glares, accent colors that vibrate, shadows that have nowhere to fall.

A dark theme is a second design that shares a skeleton with the first. It deserves an afternoon of its own.

## Start with variables

Name colors by the job they do, not by what they look like.

```css
:root {
  --paper: #f3eee3;
  --ink: #1e1a15;
  --accent: #b03a1b;
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper: #15130f;
    --ink: #ece5d6;
    --accent: #f08a60;
  }
}
```

Now every rule in the stylesheet asks for `--ink` and gets the right one.

## What to change by hand

**Soften the extremes.** Pure white on pure black is harsh at night. A warm off-white on a very dark brown or blue is easier to stay with.

**Lighten the accent.** A deep red that reads well on cream turns muddy on charcoal. Pick a lighter, slightly less saturated relative and check its contrast again. The target is still 4.5 to 1 for body text.

**Rethink depth.** Shadows barely show on dark surfaces. Raise a panel by making it a shade lighter than the page.

**Look at the weight.** Light text on a dark ground appears bolder than the reverse. If your font allows it, drop the weight a touch.

## Let people choose

Follow the system setting by default, because the visitor already told their device what they prefer. Then offer a switch anyway, and remember the answer. Some people like a dark phone and a light page to read on.

Two themes means twice the checking. It is worth it the first time somebody opens your site in bed.
