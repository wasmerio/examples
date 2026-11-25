---
title: "Sign-in forms that behave when the network does not"
date: 2026-07-18
description: "Password toggles, live requirements, and the states everyone forgets."
categories: ["Components"]
tags: ["forms", "accessibility", "components"]
cover: "images/covers/auth.svg"
---


The happy path of a sign-in form is four elements. Everything else is the
interesting part.

## The states worth building

- **Pending** — the button is busy, not disabled-and-silent.
- **Rejected** — the message is next to the field, not in a toast that vanished.
- **Rate-limited** — say how long, not "try again later".
- **Offline** — the form should still hold what was typed.

## The password toggle

Make it a real `button` with `aria-pressed`, keep the field type in sync, and
never place it where it covers the text it reveals.

