---
title: A form is a conversation
description: Labels, errors and the thank-you message are all lines of dialogue. Write them like you mean it.
date: 2026-11-03
tags: [Forms, Accessibility]
---

A form is the one place on a website where the visitor does the talking. Everything else is you holding forth. So it is odd how often the form is the least considered part of a page: three gray boxes, a button that says Submit, and no sign afterwards that anyone was listening.

Treat it as a conversation and the right decisions mostly make themselves.

## Ask clearly

Every field gets a visible label, tied to its input with `for` and `id`. Placeholder text is not a label. It vanishes the moment someone starts typing, which is exactly when they want to check what was asked.

```html
<label for="email">Email address</label>
<input id="email" name="email" type="email" autocomplete="email" required>
```

The `type` and `autocomplete` attributes are small courtesies. They bring up the right keyboard on a phone and let the browser fill in what it already knows.

## Ask for less

Each extra field is a reason to give up. A contact form needs a name, a way to reply and a message. If you would not ask the question in person within the first minute of meeting someone, leave it off the form.

## Answer

When the form is sent, say so in plain words, right where the person is looking. When something fails, say what happened and keep everything they typed. Losing a carefully written message to a vague error is the web at its rudest.

## Make it work without scripts

A plain HTML form with an `action` and a `method` will post its contents with no JavaScript at all. Start there. Then add a small script that sends the same data in the background and shows the reply in place. If the script never loads, the form still does its job, and nobody has to know which path they took.

A form that listens well is the cheapest good impression a site can make.
