---
title: "Design Tokens That Survive Product Growth"
excerpt: "Tokens work when they describe decisions, not when they become a colorful spreadsheet of every value the interface has ever used."
category: "Design Systems"
date: 2026-07-05
author:
  name: "Leah Morgan"
  role: "Design systems and craft"
cover:
  src: "./cover.jpg"
  alt: "Blue and pink abstract light gradient"
  creditName: "Credits to Codioful via Unsplash"
  creditUrl: "https://unsplash.com/photos/blue-and-pink-light-illustration-LeG68PrXA6Y"
featured: true
---

Design tokens often begin as a tidy promise: put color, spacing, radius, and type values in one place. Then the product grows, teams add exceptions, and the token file becomes a museum of unresolved decisions.

The problem is rarely tokens themselves. It is naming values before naming intent.

## Separate primitives from roles

Primitive tokens store raw values: color scales, spacing steps, font sizes. Role tokens explain how the product uses them: surface, border, text-muted, action-primary, danger-background.

Components should mostly consume role tokens. That gives the system room to change a palette without rewriting every component.

## Keep aliases boring

Aliases should make usage clearer, not more mysterious. A name like `interactive-critical-hover` may be precise, but it can also become a place where no one wants to make a decision. Use enough structure to prevent chaos, then stop.

If a token name needs a long explanation in every pull request, the system is asking too much of its users.

## Retire tokens deliberately

Unused tokens are not harmless. They create false options and make new contributors wonder which value is preferred. Add deprecation notes, keep a removal window, and track token usage in components and docs.

A mature token system is not the one with the most names. It is the one where teams can make consistent decisions quickly.
